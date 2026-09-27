import { useEffect, useRef } from 'react'
import {
  ACESFilmicToneMapping,
  BackSide,
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FogExp2,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type BoudhaPrototypeCanvasProps = {
  reducedMotion: boolean
  onReady: () => void
}

type AnimatedFlag = {
  mesh: Mesh
  baseRotation: number
  phase: number
}

const DOME_RADIUS = 18.3
const MONUMENT_HEIGHT = 43.25

function makePlasterTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  ctx.fillStyle = '#eee7da'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 4800; i += 1) {
    const value = 214 + Math.floor(Math.random() * 34)
    const alpha = 0.02 + Math.random() * 0.06
    ctx.fillStyle = `rgba(${value}, ${Math.max(198, value - 10)}, ${Math.max(182, value - 23)}, ${alpha})`
    const size = 0.5 + Math.random() * 2
    ctx.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      size,
      size,
    )
  }

  for (let i = 0; i < 26; i += 1) {
    const x = Math.random() * canvas.width
    ctx.strokeStyle = `rgba(177, 145, 99, ${0.025 + Math.random() * 0.04})`
    ctx.lineWidth = 2 + Math.random() * 5
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.bezierCurveTo(
      x - 20 + Math.random() * 40,
      160,
      x - 18 + Math.random() * 36,
      350,
      x + 12 - Math.random() * 24,
      512,
    )
    ctx.stroke()
  }

  const texture = new CanvasTexture(canvas)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(3, 2)
  texture.colorSpace = SRGBColorSpace

  return texture
}

function makeCourtyardTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  ctx.fillStyle = '#b8aa94'
  ctx.fillRect(0, 0, 512, 512)

  const cell = 64
  for (let y = 0; y < 512; y += cell) {
    for (let x = 0; x < 512; x += cell) {
      const lightness = 158 + ((x / cell + y / cell) % 3) * 7
      ctx.fillStyle = `rgb(${lightness + 22}, ${lightness + 12}, ${lightness})`
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4)
      ctx.strokeStyle = 'rgba(70, 56, 43, 0.22)'
      ctx.lineWidth = 2
      ctx.strokeRect(x + 1, y + 1, cell - 2, cell - 2)
    }
  }

  for (let i = 0; i < 1300; i += 1) {
    ctx.fillStyle = `rgba(65, 55, 45, ${0.02 + Math.random() * 0.04})`
    ctx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      1 + Math.random() * 2,
      1 + Math.random() * 2,
    )
  }

  const texture = new CanvasTexture(canvas)
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  texture.repeat.set(12, 12)
  texture.colorSpace = SRGBColorSpace

  return texture
}

function makeEyeTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const context = canvas.getContext('2d')

  if (!context) {
    return null
  }

  const ctx = context
  const gradient = ctx.createLinearGradient(0, 0, 0, 512)
  gradient.addColorStop(0, '#bd8a3b')
  gradient.addColorStop(0.55, '#d8ad59')
  gradient.addColorStop(1, '#b77b31')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 1024, 512)

  ctx.strokeStyle = 'rgba(93, 55, 20, 0.18)'
  ctx.lineWidth = 2
  for (let x = 0; x < 1024; x += 128) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }
  for (let y = 0; y < 512; y += 96) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(1024, y)
    ctx.stroke()
  }

  function drawEye(cx: number) {
    ctx.fillStyle = '#efe9d8'
    ctx.strokeStyle = '#351d18'
    ctx.lineWidth = 18
    ctx.beginPath()
    ctx.moveTo(cx - 180, 265)
    ctx.quadraticCurveTo(cx, 130, cx + 180, 265)
    ctx.quadraticCurveTo(cx, 390, cx - 180, 265)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    ctx.fillStyle = '#4d85a7'
    ctx.beginPath()
    ctx.arc(cx, 268, 78, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#d5a84a'
    ctx.beginPath()
    ctx.arc(cx, 268, 49, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#171716'
    ctx.beginPath()
    ctx.arc(cx, 268, 27, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#2d1714'
    ctx.lineWidth = 22
    ctx.beginPath()
    ctx.moveTo(cx - 188, 180)
    ctx.quadraticCurveTo(cx, 110, cx + 188, 178)
    ctx.stroke()
  }

  drawEye(270)
  drawEye(754)

  ctx.strokeStyle = '#8d2b24'
  ctx.lineWidth = 14
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(512, 320)
  ctx.bezierCurveTo(560, 320, 574, 358, 540, 382)
  ctx.bezierCurveTo(496, 412, 468, 375, 493, 351)
  ctx.bezierCurveTo(512, 335, 530, 350, 520, 363)
  ctx.stroke()

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace

  return texture
}

function addEyePanels(group: Group, eyeTexture: CanvasTexture | null) {
  const geometry = new PlaneGeometry(6.65, 3.35)
  const material = new MeshStandardMaterial({
    map: eyeTexture,
    color: eyeTexture ? '#ffffff' : '#c99a4a',
    roughness: 0.72,
    metalness: 0.08,
  })

  const y = 26.25
  const offset = 3.66

  const front = new Mesh(geometry, material)
  front.position.set(0, y, offset)
  group.add(front)

  const back = new Mesh(geometry, material)
  back.position.set(0, y, -offset)
  back.rotation.y = Math.PI
  group.add(back)

  const right = new Mesh(geometry, material)
  right.position.set(offset, y, 0)
  right.rotation.y = Math.PI / 2
  group.add(right)

  const left = new Mesh(geometry, material)
  left.position.set(-offset, y, 0)
  left.rotation.y = -Math.PI / 2
  group.add(left)
}

function addPrayerFlags(
  scene: Scene,
  animatedFlags: AnimatedFlag[],
  top: Vector3,
) {
  const flagColors = ['#2e6ca4', '#e8e1d0', '#ba3c36', '#34724d', '#d5a631']

  for (let ray = 0; ray < 10; ray += 1) {
    const angle = (ray / 10) * Math.PI * 2 + 0.12
    const anchor = new Vector3(
      Math.cos(angle) * 47,
      7.5 + (ray % 3) * 1.2,
      Math.sin(angle) * 47,
    )
    const midpoint = new Vector3(
      Math.cos(angle) * 25,
      23 - (ray % 2) * 1.4,
      Math.sin(angle) * 25,
    )

    const curve = new CatmullRomCurve3([top.clone(), midpoint, anchor])
    const ropeGeometry = new BufferGeometry().setFromPoints(curve.getPoints(44))
    const ropeMaterial = new LineBasicMaterial({
      color: '#5b3b2a',
      transparent: true,
      opacity: 0.55,
    })
    scene.add(new Line(ropeGeometry, ropeMaterial))

    for (let index = 2; index < 18; index += 1) {
      const t = index / 20
      const point = curve.getPoint(t)
      const flagGeometry = new BufferGeometry()
      flagGeometry.setAttribute(
        'position',
        new Float32BufferAttribute(
          [
            -0.44, 0.18, 0,
            0.44, 0.18, 0,
            -0.35, -0.28, 0,
            0.44, 0.18, 0,
            0.33, -0.22, 0,
            -0.35, -0.28, 0,
          ],
          3,
        ),
      )
      flagGeometry.computeVertexNormals()

      const material = new MeshStandardMaterial({
        color: flagColors[(index + ray) % flagColors.length],
        roughness: 0.92,
        side: DoubleSide,
      })

      const flag = new Mesh(flagGeometry, material)
      flag.position.copy(point)
      flag.rotation.y = -angle + Math.PI / 2
      flag.rotation.z = 0.1 * Math.sin(index * 0.7)
      flag.castShadow = false
      scene.add(flag)

      animatedFlags.push({
        mesh: flag,
        baseRotation: flag.rotation.z,
        phase: ray * 0.7 + index * 0.43,
      })
    }
  }
}

function addPrayerWheelRing(scene: Scene) {
  const whiteMaterial = new MeshStandardMaterial({
    color: '#e7dfd1',
    roughness: 0.92,
  })
  const goldMaterial = new MeshPhysicalMaterial({
    color: '#b9852f',
    roughness: 0.38,
    metalness: 0.72,
  })

  const wall = new Mesh(
    new CylinderGeometry(21.7, 21.7, 1.35, 96, 1, true),
    whiteMaterial,
  )
  wall.position.y = 4.15
  wall.receiveShadow = true
  scene.add(wall)

  const wheelGeometry = new CylinderGeometry(0.26, 0.26, 0.78, 16)
  for (let i = 0; i < 72; i += 1) {
    const angle = (i / 72) * Math.PI * 2
    const wheel = new Mesh(wheelGeometry, goldMaterial)
    wheel.position.set(
      Math.cos(angle) * 21.9,
      4.2,
      Math.sin(angle) * 21.9,
    )
    wheel.castShadow = true
    scene.add(wheel)
  }
}

function addSurroundingBuildings(scene: Scene) {
  const facadePalette = ['#8d6b53', '#a17a57', '#705849', '#b08b63', '#7c6655']
  const windowMaterial = new MeshStandardMaterial({
    color: '#493626',
    emissive: '#6d421f',
    emissiveIntensity: 0.32,
    roughness: 0.7,
  })

  const strips: Array<{
    origin: Vector3
    axis: 'x' | 'z'
    rotation: number
  }> = [
    { origin: new Vector3(-33, 0, -56), axis: 'x', rotation: 0 },
    { origin: new Vector3(-56, 0, -33), axis: 'z', rotation: Math.PI / 2 },
    { origin: new Vector3(56, 0, -33), axis: 'z', rotation: -Math.PI / 2 },
  ]

  for (const strip of strips) {
    for (let i = 0; i < 9; i += 1) {
      const width = 7.2
      const height = 11 + ((i * 7) % 5) * 1.25
      const depth = 8
      const facadeMaterial = new MeshStandardMaterial({
        color: facadePalette[i % facadePalette.length],
        roughness: 0.9,
      })

      const building = new Mesh(
        new BoxGeometry(width, height, depth),
        facadeMaterial,
      )

      if (strip.axis === 'x') {
        building.position.set(
          strip.origin.x + i * 8.2,
          height / 2,
          strip.origin.z,
        )
      } else {
        building.position.set(
          strip.origin.x,
          height / 2,
          strip.origin.z + i * 8.2,
        )
      }

      building.rotation.y = strip.rotation
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)

      for (let floor = 0; floor < 3; floor += 1) {
        const window = new Mesh(
          new PlaneGeometry(1.25, 1.65),
          windowMaterial,
        )

        if (strip.axis === 'x') {
          window.position.set(
            building.position.x,
            3.1 + floor * 2.65,
            strip.origin.z + 4.02,
          )
        } else {
          window.position.set(
            strip.origin.x - Math.sign(strip.origin.x) * 4.02,
            3.1 + floor * 2.65,
            building.position.z,
          )
          window.rotation.y = strip.origin.x > 0 ? -Math.PI / 2 : Math.PI / 2
        }
        scene.add(window)
      }
    }
  }
}

function createStupa(scene: Scene) {
  const stupa = new Group()
  const plasterTexture = makePlasterTexture()
  const eyeTexture = makeEyeTexture()

  const plaster = new MeshPhysicalMaterial({
    color: '#eee8db',
    map: plasterTexture,
    roughness: 0.82,
    metalness: 0,
    clearcoat: 0.04,
  })
  const warmWhite = new MeshStandardMaterial({
    color: '#e7ded0',
    roughness: 0.86,
  })
  const gold = new MeshPhysicalMaterial({
    color: '#c28a2b',
    roughness: 0.3,
    metalness: 0.78,
    clearcoat: 0.22,
  })
  const darkGold = new MeshPhysicalMaterial({
    color: '#8f5f1f',
    roughness: 0.42,
    metalness: 0.68,
  })
  const red = new MeshStandardMaterial({ color: '#8f241e', roughness: 0.76 })
  const blue = new MeshStandardMaterial({ color: '#264c6e', roughness: 0.76 })
  const yellow = new MeshStandardMaterial({ color: '#d39d34', roughness: 0.76 })

  const platforms = [
    { size: 43.5, height: 1.2, y: 0.6 },
    { size: 40.5, height: 1.05, y: 1.72 },
    { size: 37.5, height: 0.95, y: 2.72 },
  ]

  for (const platform of platforms) {
    const mesh = new Mesh(
      new BoxGeometry(platform.size, platform.height, platform.size),
      warmWhite,
    )
    mesh.position.y = platform.y
    mesh.receiveShadow = true
    mesh.castShadow = true
    stupa.add(mesh)
  }

  const drum = new Mesh(
    new CylinderGeometry(18.85, 19.25, 2.0, 96),
    plaster,
  )
  drum.position.y = 4.2
  drum.receiveShadow = true
  drum.castShadow = true
  stupa.add(drum)

  const dome = new Mesh(
    new SphereGeometry(DOME_RADIUS, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2),
    plaster,
  )
  dome.position.y = 5.15
  dome.castShadow = true
  dome.receiveShadow = true
  stupa.add(dome)

  const domeBand = new Mesh(
    new CylinderGeometry(18.95, 18.95, 0.58, 96),
    warmWhite,
  )
  domeBand.position.y = 5.12
  stupa.add(domeBand)

  const harmika = new Mesh(new BoxGeometry(7.2, 5.2, 7.2), gold)
  harmika.position.y = 26.0
  harmika.castShadow = true
  stupa.add(harmika)
  addEyePanels(stupa, eyeTexture)

  const redBand = new Mesh(new BoxGeometry(7.6, 0.58, 7.6), red)
  redBand.position.y = 28.75
  stupa.add(redBand)

  const blueBand = new Mesh(new BoxGeometry(7.42, 0.24, 7.42), blue)
  blueBand.position.y = 29.05
  stupa.add(blueBand)

  let tierY = 29.55
  for (let i = 0; i < 13; i += 1) {
    const progress = i / 12
    const width = MathUtils.lerp(6.7, 1.75, progress)
    const tier = new Mesh(
      new BoxGeometry(width, 0.58, width),
      i % 3 === 0 ? darkGold : gold,
    )
    tier.position.y = tierY
    tier.castShadow = true
    stupa.add(tier)
    tierY += 0.58
  }

  const umbrellaBlue = new Mesh(
    new CylinderGeometry(2.35, 2.5, 0.38, 64),
    blue,
  )
  umbrellaBlue.position.y = 37.35
  stupa.add(umbrellaBlue)

  const umbrellaYellow = new Mesh(
    new CylinderGeometry(2.5, 2.72, 0.55, 64),
    yellow,
  )
  umbrellaYellow.position.y = 37.82
  stupa.add(umbrellaYellow)

  const crown = new Mesh(
    new CylinderGeometry(2.25, 2.55, 1.75, 64),
    gold,
  )
  crown.position.y = 39.0
  crown.castShadow = true
  stupa.add(crown)

  const pinnacle = new Mesh(
    new ConeGeometry(1.05, 3.0, 32),
    gold,
  )
  pinnacle.position.y = 41.35
  pinnacle.castShadow = true
  stupa.add(pinnacle)

  const jewel = new Mesh(
    new SphereGeometry(0.58, 24, 16),
    gold,
  )
  jewel.position.y = MONUMENT_HEIGHT
  stupa.add(jewel)

  scene.add(stupa)

  return {
    stupa,
    flagTop: new Vector3(0, 39.65, 0),
  }
}

function addSky(scene: Scene) {
  const material = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    uniforms: {
      topColor: { value: new Color('#7ea8c4') },
      horizonColor: { value: new Color('#e7d1b2') },
      bottomColor: { value: new Color('#c4a989') },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition).y;
        vec3 lower = mix(bottomColor, horizonColor, smoothstep(-0.12, 0.16, h));
        vec3 color = mix(lower, topColor, smoothstep(0.05, 0.72, h));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  })

  scene.add(new Mesh(new SphereGeometry(240, 48, 32), material))
}

function disposeScene(scene: Scene) {
  const geometries = new Set<BufferGeometry>()
  const materials = new Set<MeshStandardMaterial | MeshPhysicalMaterial | ShaderMaterial | LineBasicMaterial>()
  const textures = new Set<CanvasTexture>()

  scene.traverse((object) => {
    const renderable = object as Mesh

    if (renderable.geometry instanceof BufferGeometry) {
      geometries.add(renderable.geometry)
    }

    const rawMaterial = renderable.material
    const materialList = Array.isArray(rawMaterial)
      ? rawMaterial
      : rawMaterial
        ? [rawMaterial]
        : []

    for (const material of materialList) {
      if (
        material instanceof MeshStandardMaterial ||
        material instanceof MeshPhysicalMaterial ||
        material instanceof ShaderMaterial ||
        material instanceof LineBasicMaterial
      ) {
        materials.add(material)

        if (
          'map' in material &&
          material.map instanceof CanvasTexture
        ) {
          textures.add(material.map)
        }
      }
    }
  })

  for (const texture of textures) {
    texture.dispose()
  }
  for (const geometry of geometries) {
    geometry.dispose()
  }
  for (const material of materials) {
    material.dispose()
  }
}

export function BoudhaPrototypeCanvas({
  reducedMotion,
  onReady,
}: BoudhaPrototypeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    let disposed = false
    const scene = new Scene()
    scene.fog = new FogExp2('#baa98e', 0.0044)
    addSky(scene)

    const renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    })
    renderer.outputColorSpace = SRGBColorSpace
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.08
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))

    const camera = new PerspectiveCamera(40, 1, 0.1, 420)
    const finalCamera = new Vector3(60, 31, 67)
    const startCamera = reducedMotion
      ? finalCamera.clone()
      : new Vector3(88, 52, 102)

    camera.position.copy(startCamera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.enablePan = false
    controls.minDistance = 37
    controls.maxDistance = 125
    controls.minPolarAngle = 0.48
    controls.maxPolarAngle = Math.PI * 0.47
    controls.target.set(0, 19, 0)
    controls.enabled = reducedMotion
    controls.update()

    const hemisphere = new HemisphereLight('#d8ecff', '#7c5333', 1.45)
    scene.add(hemisphere)

    const sun = new DirectionalLight('#ffd7a0', 4.2)
    sun.position.set(54, 74, 34)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -70
    sun.shadow.camera.right = 70
    sun.shadow.camera.top = 70
    sun.shadow.camera.bottom = -70
    sun.shadow.camera.near = 1
    sun.shadow.camera.far = 180
    sun.shadow.bias = -0.00025
    scene.add(sun)

    const courtyardTexture = makeCourtyardTexture()
    const courtyard = new Mesh(
      new PlaneGeometry(150, 150),
      new MeshStandardMaterial({
        color: '#b8aa94',
        map: courtyardTexture,
        roughness: 0.94,
      }),
    )
    courtyard.rotation.x = -Math.PI / 2
    courtyard.receiveShadow = true
    scene.add(courtyard)

    const koraPath = new Mesh(
      new CylinderGeometry(41, 41, 0.08, 128),
      new MeshStandardMaterial({
        color: '#96725b',
        roughness: 0.94,
      }),
    )
    koraPath.scale.y = 0.04
    koraPath.position.y = 0.03
    scene.add(koraPath)

    const { flagTop } = createStupa(scene)
    addPrayerWheelRing(scene)
    addSurroundingBuildings(scene)

    const animatedFlags: AnimatedFlag[] = []
    addPrayerFlags(scene, animatedFlags, flagTop)

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

    const startedAt = performance.now()
    let readyAnnounced = false

    renderer.setAnimationLoop((time) => {
      if (disposed) {
        return
      }

      if (!reducedMotion && !controls.enabled) {
        const elapsed = (performance.now() - startedAt) / 1000
        const progress = Math.min(1, elapsed / 4.8)
        const eased = 1 - Math.pow(1 - progress, 3)

        camera.position.lerpVectors(startCamera, finalCamera, eased)
        camera.lookAt(controls.target)

        if (progress >= 1) {
          controls.enabled = true
        }
      }

      controls.update()

      for (const flag of animatedFlags) {
        flag.mesh.rotation.z =
          flag.baseRotation +
          Math.sin(time * 0.0022 + flag.phase) * 0.065
      }

      renderer.render(scene, camera)

      if (!readyAnnounced) {
        readyAnnounced = true
        onReady()
      }
    })

    return () => {
      disposed = true
      resizeObserver.disconnect()
      renderer.setAnimationLoop(null)
      controls.dispose()
      courtyardTexture?.dispose()
      disposeScene(scene)
      renderer.dispose()
    }
  }, [onReady, reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      className="prototype-canvas"
      aria-label="Synthetic interactive Boudhanath architectural study"
    />
  )
}
