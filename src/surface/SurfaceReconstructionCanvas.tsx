import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Box3,
  Color,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'

import { SURFACE_ASSET_URL } from './surfaceConfig'

export type SurfaceRuntimeMetadata = {
  vertexCount: number
  triangleCount: number
  normalizedScale: number
  sourceBounds: {
    min: [number, number, number]
    max: [number, number, number]
    size: [number, number, number]
  }
}

type SurfaceReconstructionCanvasProps = {
  reducedMotion: boolean
  onReady: (metadata: SurfaceRuntimeMetadata) => void
  onError: (message: string) => void
}

const TARGET_HEIGHT_METERS = 43.25

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function SurfaceReconstructionCanvas({
  reducedMotion,
  onReady,
  onError,
}: SurfaceReconstructionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) {
      return
    }

    let disposed = false
    let mesh: Mesh | null = null

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.06
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))

    const scene = new Scene()
    scene.background = new Color('#0c0e10')

    const camera = new PerspectiveCamera(40, 1, 0.05, 500)
    camera.position.set(55, 28, 72)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.enablePan = false
    controls.target.set(0, TARGET_HEIGHT_METERS * 0.42, 0)

    const ambient = new AmbientLight('#c7d8e6', 1.5)
    scene.add(ambient)

    const key = new DirectionalLight('#ffe0ad', 4.2)
    key.position.set(45, 62, 32)
    scene.add(key)

    const fill = new DirectionalLight('#8ba8c0', 1.1)
    fill.position.set(-35, 24, -42)
    scene.add(fill)

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    })
    resizeObserver.observe(canvas)

    const width = Math.max(1, canvas.clientWidth)
    const height = Math.max(1, canvas.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()

    const loader = new PLYLoader()

    void loader
      .loadAsync(SURFACE_ASSET_URL)
      .then((geometry) => {
        if (disposed) {
          geometry.dispose()
          return
        }

        geometry.computeVertexNormals()

        geometry.computeBoundingBox()
        const sourceBounds = geometry.boundingBox

        if (!sourceBounds) {
          geometry.dispose()
          throw new Error('Reconstructed surface bounds are unavailable.')
        }

        const sourceSize = sourceBounds.getSize(new Vector3())

        if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0) {
          geometry.dispose()
          throw new Error('Reconstructed surface has an invalid Y-axis height.')
        }

        const material = new MeshBasicMaterial({
          color: '#d8c9ad',
          side: DoubleSide,
        })

        mesh = new Mesh(geometry, material)
        mesh.frustumCulled = false

        const scale = TARGET_HEIGHT_METERS / sourceSize.y
        mesh.scale.setScalar(scale)
        mesh.updateMatrixWorld(true)

        const normalized = new Box3().setFromObject(mesh)
        const center = normalized.getCenter(new Vector3())

        mesh.position.x -= center.x
        mesh.position.z -= center.z
        mesh.position.y -= normalized.min.y
        mesh.updateMatrixWorld(true)

        const finalBounds = new Box3().setFromObject(mesh)
        const finalSize = finalBounds.getSize(new Vector3())
        const radius = Math.max(finalSize.x, finalSize.y, finalSize.z) * 0.72

        controls.target.set(0, finalSize.y * 0.42, 0)
        controls.minDistance = Math.max(8, radius * 0.5)
        controls.maxDistance = Math.max(120, radius * 3.5)
        controls.update()

        camera.position.set(radius * 0.95, finalSize.y * 0.64, radius * 1.28)
        camera.lookAt(controls.target)
        camera.updateMatrixWorld(true)

        scene.add(mesh)
        mesh.updateMatrixWorld(true)

        // Headless Chromium may throttle requestAnimationFrame. Render one
        // deterministic frame before reporting ready so the smoke screenshot
        // proves actual surface visibility rather than only PLY parsing.
        renderer.render(scene, camera)

        const index = geometry.getIndex()
        const positionCount = geometry.getAttribute('position').count
        const metadata: SurfaceRuntimeMetadata = {
          vertexCount: positionCount,
          triangleCount: index
            ? Math.floor(index.count / 3)
            : Math.floor(positionCount / 3),
          normalizedScale: scale,
          sourceBounds: {
            min: [sourceBounds.min.x, sourceBounds.min.y, sourceBounds.min.z],
            max: [sourceBounds.max.x, sourceBounds.max.y, sourceBounds.max.z],
            size: [sourceSize.x, sourceSize.y, sourceSize.z],
          },
        }

        console.log('Boudhanath reconstructed surface ready', JSON.stringify(metadata))
        onReady(metadata)
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error('Boudhanath reconstructed surface failed', error)
          onError(toErrorMessage(error))
        }
      })

    renderer.setAnimationLoop((time) => {
      if (disposed) {
        return
      }

      if (!reducedMotion && mesh) {
        mesh.rotation.y = Math.sin(time * 0.00011) * 0.025
      }

      controls.update()
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      resizeObserver.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()

      if (mesh) {
        mesh.geometry.dispose()
        if (Array.isArray(mesh.material)) {
          for (const material of mesh.material) {
            material.dispose()
          }
        } else {
          mesh.material.dispose()
        }
        scene.remove(mesh)
      }

      renderer.dispose()
    }
  }, [onError, onReady, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointcloud-canvas"
      aria-label="Deterministically reconstructed Boudhanath surface"
    />
  )
}
