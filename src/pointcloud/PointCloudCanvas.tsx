import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { POINT_CLOUD_ASSET_URL } from './pointCloudConfig'

export type PointCloudRuntimeMetadata = {
  pointCount: number
  pointObjectCount: number
  hasVertexColors: boolean
  sourceBounds: {
    min: [number, number, number]
    max: [number, number, number]
    size: [number, number, number]
  }
  normalizedScale: number
}

type PointCloudCanvasProps = {
  reducedMotion: boolean
  onReady: (metadata: PointCloudRuntimeMetadata) => void
  onError: (message: string) => void
}

const TARGET_HEIGHT_METERS = 43.25

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

export function PointCloudCanvas({
  reducedMotion,
  onReady,
  onError,
}: PointCloudCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    let disposed = false
    let loadedRoot: import('three').Group | null = null
    const pointMaterials: PointsMaterial[] = []

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))

    const scene = new Scene()
    scene.background = new Color('#080b0e')

    const camera = new PerspectiveCamera(42, 1, 0.05, 500)
    camera.position.set(55, 30, 72)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.enablePan = false
    controls.target.set(0, TARGET_HEIGHT_METERS * 0.42, 0)
    controls.minDistance = 18
    controls.maxDistance = 150
    controls.update()

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

    const loader = new GLTFLoader()

    void loader
      .loadAsync(POINT_CLOUD_ASSET_URL)
      .then((gltf) => {
        if (disposed) {
          return
        }

        const root = gltf.scene
        loadedRoot = root

        const sourceBounds = new Box3().setFromObject(root)
        const sourceSize = sourceBounds.getSize(new Vector3())

        if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0) {
          throw new Error('Point-cloud GLB has an invalid Y-axis height.')
        }

        let pointCount = 0
        let pointObjectCount = 0
        let hasVertexColors = false

        root.traverse((object) => {
          if (!(object instanceof Points)) {
            return
          }

          pointObjectCount += 1
          const positions = object.geometry.getAttribute('position')
          const colors = object.geometry.getAttribute('color')
          pointCount += positions?.count ?? 0
          hasVertexColors ||= Boolean(colors)

          const material = new PointsMaterial({
            size: 0.085,
            sizeAttenuation: true,
            vertexColors: Boolean(colors),
            color: colors ? '#ffffff' : '#d7c69e',
            transparent: true,
            opacity: 0.98,
            depthWrite: true,
          })

          pointMaterials.push(material)

          if (Array.isArray(object.material)) {
            for (const sourceMaterial of object.material) {
              sourceMaterial.dispose()
            }
          } else {
            object.material.dispose()
          }

          object.material = material
          object.frustumCulled = true
        })

        if (pointObjectCount === 0 || pointCount === 0) {
          throw new Error('GLB loaded, but no Three.js point primitives were found.')
        }

        const scale = TARGET_HEIGHT_METERS / sourceSize.y
        root.scale.multiplyScalar(scale)
        root.updateMatrixWorld(true)

        const normalizedBounds = new Box3().setFromObject(root)
        const center = normalizedBounds.getCenter(new Vector3())

        root.position.x -= center.x
        root.position.z -= center.z
        root.position.y -= normalizedBounds.min.y
        root.updateMatrixWorld(true)

        const finalBounds = new Box3().setFromObject(root)
        const finalSize = finalBounds.getSize(new Vector3())
        const radius = Math.max(finalSize.x, finalSize.z, finalSize.y) * 0.72

        controls.target.set(0, finalSize.y * 0.42, 0)
        controls.minDistance = Math.max(8, radius * 0.52)
        controls.maxDistance = Math.max(120, radius * 3.4)
        controls.update()

        camera.position.set(
          radius * 0.95,
          finalSize.y * 0.66,
          radius * 1.28,
        )
        camera.lookAt(controls.target)

        scene.add(root)

        const metadata: PointCloudRuntimeMetadata = {
          pointCount,
          pointObjectCount,
          hasVertexColors,
          sourceBounds: {
            min: [sourceBounds.min.x, sourceBounds.min.y, sourceBounds.min.z],
            max: [sourceBounds.max.x, sourceBounds.max.y, sourceBounds.max.z],
            size: [sourceSize.x, sourceSize.y, sourceSize.z],
          },
          normalizedScale: scale,
        }

        console.log('Boudhanath point cloud ready', metadata)
        onReady(metadata)
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error('Boudhanath point cloud failed', error)
          onError(toErrorMessage(error))
        }
      })

    renderer.setAnimationLoop((time) => {
      if (disposed) {
        return
      }

      if (!reducedMotion && loadedRoot) {
        loadedRoot.rotation.y = Math.sin(time * 0.00012) * 0.035
      }

      controls.update()
      renderer.render(scene, camera)
    })

    return () => {
      disposed = true
      resizeObserver.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()

      if (loadedRoot) {
        loadedRoot.traverse((object) => {
          if (object instanceof Points) {
            object.geometry.dispose()
          }
        })
        scene.remove(loadedRoot)
      }

      for (const material of pointMaterials) {
        material.dispose()
      }

      renderer.dispose()
    }
  }, [onError, onReady, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="pointcloud-canvas"
      aria-label="Licensed Boudhanath point-cloud comparison"
    />
  )
}
