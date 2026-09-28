import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  Material,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
  type BufferAttribute,
  type InterleavedBufferAttribute,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { POINT_CLOUD_ASSET_URL } from './pointCloudConfig'

export type PointCloudColorMode = 'varied' | 'uniform' | 'missing'

export type PointCloudRuntimeMetadata = {
  pointCount: number
  pointObjectCount: number
  colorMode: PointCloudColorMode
  hasNormals: boolean
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

function attributeHasVariation(
  attribute: BufferAttribute | InterleavedBufferAttribute,
) {
  if (attribute.count <= 1) {
    return false
  }

  const first = [
    attribute.getX(0),
    attribute.itemSize > 1 ? attribute.getY(0) : 0,
    attribute.itemSize > 2 ? attribute.getZ(0) : 0,
  ]
  const stride = Math.max(1, Math.floor(attribute.count / 2048))

  for (let index = stride; index < attribute.count; index += stride) {
    if (
      Math.abs(attribute.getX(index) - first[0]) > 0.0001 ||
      (attribute.itemSize > 1 &&
        Math.abs(attribute.getY(index) - first[1]) > 0.0001) ||
      (attribute.itemSize > 2 &&
        Math.abs(attribute.getZ(index) - first[2]) > 0.0001)
    ) {
      return true
    }
  }

  return false
}

function createNormalInspectionMaterial() {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uPointScale: { value: 1.15 },
      uHeight: { value: TARGET_HEIGHT_METERS },
    },
    vertexShader: `
      uniform float uPointScale;
      uniform float uHeight;

      varying float vLight;
      varying float vHeight;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
        vec3 lightDirection = normalize(vec3(0.42, 0.86, 0.28));

        vLight = 0.52 + 0.48 * abs(dot(worldNormal, lightDirection));
        vHeight = clamp(worldPosition.y / uHeight, 0.0, 1.0);

        vec4 mvPosition = viewMatrix * worldPosition;
        gl_PointSize = clamp(
          uPointScale * (220.0 / max(1.0, -mvPosition.z)),
          1.35,
          4.6
        );
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vLight;
      varying float vHeight;

      void main() {
        float radius = length(gl_PointCoord - vec2(0.5));
        if (radius > 0.5) {
          discard;
        }

        vec3 stone = vec3(0.43, 0.40, 0.36);
        vec3 plaster = vec3(0.84, 0.82, 0.76);
        vec3 gold = vec3(0.72, 0.50, 0.17);

        float plasterMix = smoothstep(0.08, 0.2, vHeight);
        vec3 baseColor = mix(stone, plaster, plasterMix);
        float goldMix = smoothstep(0.57, 0.68, vHeight);
        baseColor = mix(baseColor, gold, goldMix);

        float edge = 1.0 - smoothstep(0.36, 0.5, radius);
        vec3 shaded = baseColor * vLight;

        gl_FragColor = vec4(shaded, edge);
      }
    `,
  })
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
    const pointMaterials: Material[] = []

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6))

    const scene = new Scene()
    scene.background = new Color('#090b0d')

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
        let sawColor = false
        let sawColorVariation = false
        let hasNormals = false

        root.traverse((object) => {
          if (!(object instanceof Points)) {
            return
          }

          pointObjectCount += 1
          const positions = object.geometry.getAttribute('position')
          const colors = object.geometry.getAttribute('color')
          const normals = object.geometry.getAttribute('normal')

          pointCount += positions?.count ?? 0
          sawColor ||= Boolean(colors)
          sawColorVariation ||=
            colors ? attributeHasVariation(colors) : false
          hasNormals ||= Boolean(normals)

          let material: Material

          if (colors && attributeHasVariation(colors)) {
            material = new PointsMaterial({
              size: 0.085,
              sizeAttenuation: true,
              vertexColors: true,
              color: '#ffffff',
              transparent: true,
              opacity: 0.98,
              depthWrite: true,
            })
          } else if (normals) {
            material = createNormalInspectionMaterial()
          } else {
            material = new PointsMaterial({
              size: 0.1,
              sizeAttenuation: true,
              color: '#d7c69e',
              transparent: true,
              opacity: 0.98,
              depthWrite: true,
            })
          }

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

        const colorMode: PointCloudColorMode = sawColorVariation
          ? 'varied'
          : sawColor
            ? 'uniform'
            : 'missing'

        const metadata: PointCloudRuntimeMetadata = {
          pointCount,
          pointObjectCount,
          colorMode,
          hasNormals,
          sourceBounds: {
            min: [sourceBounds.min.x, sourceBounds.min.y, sourceBounds.min.z],
            max: [sourceBounds.max.x, sourceBounds.max.y, sourceBounds.max.z],
            size: [sourceSize.x, sourceSize.y, sourceSize.z],
          },
          normalizedScale: scale,
        }

        console.log(
          'Boudhanath point cloud ready',
          JSON.stringify(metadata),
        )
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
