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
  RingGeometry,
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

  context.fillStyle = '#eee7da'
  context.fillRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < 4800; i += 1) {
    const value = 214 + Math.floor(Math.random() * 34)
    const alpha = 0.02 + Math.random() * 0.06
    context.fillStyle = `rgba(${value}, ${Math.max(198, value - 10)}, ${Math.max(182, value - 23)}, ${alpha})`
    const size = 0.5 + Math.random() * 2
    context.fillRect(
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      size,
      size,
    )
  }

  for (let i = 0; i < 26; i += 1) {
    const x = Math.random() * canvas.width
    context.strokeStyle = `rgba(165, 121, 65, ${0.06 + Math.random() * 0.09})`
    context.lineWidth = 2 + Math.random() * 7
    context.beginPath()
    context.moveTo(x, 0)
    context.bezierCurveTo(
      x - 20 + Math.random() * 40,
      160,
      x - 18 + Math.random() * 36,
      350,
      x + 12 - Math.random() * 24,
      512,
    )
    context.stroke()
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

  context.fillStyle = '#b8aa94'
  context.fillRect(0, 0, 512, 512)

  const cell = 64
  for (let y = 0; y < 512; y += cell) {
    for (let x = 0; x < 512; x += cell) {
      const lightness = 158 + ((x / cell + y / cell) % 3) * 7
      context.fillStyle = `rgb(${lightness + 22}, ${lightness + 12}, ${lightness})`
      context.fillRect(x + 2, y + 2, cell - 4, cell - 4)
      context.strokeStyle = 'rgba(70, 56, 43, 0.22)'
      context.lineWidth = 2
      context.strokeRect(x + 1, y + 1, cell - 2, cell - 2)
    }
  }

  for (let i = 0; i < 1300; i += 1) {
    context.fillStyle = `rgba(65, 55, 45, ${0.02 + Math.random() * 0.04})`
    context.fillRect(
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
    color: '#34251b',
    emissive: '#7c4e27',
    emissiveIntensity: 0.3,
    roughness: 0.72,
  })
  const frameMaterial = new MeshStandardMaterial({
    color: '#4f3524',
    roughness: 0.84,
  })
  const roofMaterial = new MeshStandardMaterial({
    color: '#5f4637',
    roughness: 0.94,
  })
  const awningMaterials = [
    new MeshStandardMaterial({ color: '#7e2c26', roughness: 0.86 }),
    new MeshStandardMaterial({ color: '#b48938', roughness: 0.86 }),
    new MeshStandardMaterial({ color: '#315747', roughness: 0.86 }),
  ]

  const strips: Array<{
    origin: Vector3
    axis: 'x' | 'z'
    rotation: number
  }> = [
    { origin: new Vector3(-34, 0, -57), axis: 'x', rotation: 0 },
    { origin: new Vector3(-57, 0, -34), axis: 'z', rotation: Math.PI / 2 },
    { origin: new Vector3(57, 0, -34), axis: 'z', rotation: -Math.PI / 2 },
  ]

  const placeOnFacade = (
    object: Mesh,
    strip: (typeof strips)[number],
    building: Mesh,
    localX: number,
    y: number,
    depthOffset: number,
  ) => {
    if (strip.axis === 'x') {
      object.position.set(
        building.position.x + localX,
        y,
        strip.origin.z + depthOffset,
      )
    } else {
      object.position.set(
        strip.origin.x - Math.sign(strip.origin.x) * depthOffset,
        y,
        building.position.z + localX,
      )
      object.rotation.y = strip.origin.x > 0 ? -Math.PI / 2 : Math.PI / 2
    }
  }

  for (const strip of strips) {
    for (let i = 0; i < 9; i += 1) {
      const width = 6.8 + (i % 3) * 0.55
      const height = 11.5 + ((i * 7) % 5) * 1.15
      const depth = 7.5 + (i % 2) * 0.65
      const facadeMaterial = new MeshStandardMaterial({
        color: facadePalette[i % facadePalette.length],
        roughness: 0.91,
      })

      const building = new Mesh(
        new BoxGeometry(width, height, depth),
        facadeMaterial,
      )

      if (strip.axis === 'x') {
        building.position.set(
          strip.origin.x + i * 8.15,
          height / 2,
          strip.origin.z,
        )
      } else {
        building.position.set(
          strip.origin.x,
          height / 2,
          strip.origin.z + i * 8.15,
        )
      }

      building.rotation.y = strip.rotation
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)

      const roof = new Mesh(
        new BoxGeometry(width + 0.35, 0.48, depth + 0.35),
        roofMaterial,
      )
      roof.position.copy(building.position)
      roof.position.y = height + 0.24
      roof.rotation.y = strip.rotation
      roof.castShadow = true
      scene.add(roof)

      for (let floor = 0; floor < 3; floor += 1) {
        for (const column of [-1, 1]) {
          const localX = column * width * 0.23
          const frame = new Mesh(
            new BoxGeometry(1.52, 1.92, 0.11),
            frameMaterial,
          )
          const window = new Mesh(
            new PlaneGeometry(1.15, 1.55),
            windowMaterial,
          )
          const floorY = 4.0 + floor * 2.7

          placeOnFacade(frame, strip, building, localX, floorY, depth / 2 + 0.045)
          placeOnFacade(window, strip, building, localX, floorY, depth / 2 + 0.115)
          scene.add(frame)
          scene.add(window)
        }
      }

      const awning = new Mesh(
        new BoxGeometry(width * 0.78, 0.18, 1.05),
        awningMaterials[i % awningMaterials.length],
      )
      placeOnFacade(
        awning,
        strip,
        building,
        0,
        2.5,
        depth / 2 + 0.48,
      )
      awning.castShadow = true
      scene.add(awning)

      const shopfront = new Mesh(
        new PlaneGeometry(width * 0.68, 1.85),
        windowMaterial,
      )
      placeOnFacade(
        shopfront,
        strip,
        building,
        0,
        1.28,
        depth / 2 + 0.075,
      )
      scene.add(shopfront)

      for (const bandY of [3.0, 6.9]) {
        const band = new Mesh(
          new BoxGeometry(width + 0.06, 0.14, depth + 0.06),
          frameMaterial,
        )
        band.position.copy(building.position)
        band.position.y = bandY
        band.rotation.y = strip.rotation
        scene.add(band)
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
    color: '#d2a044',
    roughness: 0.38,
    metalness: 0.52,
    clearcoat: 0.18,
  })
  const darkGold = new MeshPhysicalMaterial({
    color: '#a97727',
    roughness: 0.46,
    metalness: 0.46,
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

  const nicheGeometry = new BoxGeometry(0.72, 0.68, 0.62)
  for (let index = 0; index < 64; index += 1) {
    const angle = (index / 64) * Math.PI * 2
    const niche = new Mesh(nicheGeometry, warmWhite)
    niche.position.set(
      Math.cos(angle) * 19.1,
      5.75,
      Math.sin(angle) * 19.1,
    )
    niche.rotation.y = -angle
    niche.castShadow = true
    stupa.add(niche)
  }

  const harmika = new Mesh(new BoxGeometry(7.2, 5.2, 7.2), gold)
  harmika.position.y = 26.0
  harmika.castShadow = true
  stupa.add(harmika)

  for (let seam = -2; seam <= 2; seam += 1) {
    const seamY = 24.2 + seam * 0.82
    const frontSeam = new Mesh(
      new BoxGeometry(7.28, 0.055, 0.06),
      darkGold,
    )
    frontSeam.position.set(0, seamY, 3.64)
    stupa.add(frontSeam)

    const sideSeam = new Mesh(
      new BoxGeometry(0.06, 0.055, 7.28),
      darkGold,
    )
    sideSeam.position.set(3.64, seamY, 0)
    stupa.add(sideSeam)
  }

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
      new BoxGeometry(width, 0.54, width),
      i % 4 === 0 ? darkGold : gold,
    )
    tier.position.y = tierY
    tier.castShadow = true
    stupa.add(tier)
    tierY += 0.6
  }

  const umbrellaBlue = new Mesh(
    new CylinderGeometry(2.55, 2.72, 0.32, 64),
    blue,
  )
  umbrellaBlue.position.y = 37.5
  stupa.add(umbrellaBlue)

  const umbrellaRed = new Mesh(
    new CylinderGeometry(2.68, 2.9, 0.28, 64),
    red,
  )
  umbrellaRed.position.y = 37.8
  stupa.add(umbrellaRed)

  const umbrellaYellow = new Mesh(
    new CylinderGeometry(2.85, 3.08, 0.52, 64),
    yellow,
  )
  umbrellaYellow.position.y = 38.18
  stupa.add(umbrellaYellow)

  const canopy = new Mesh(
    new CylinderGeometry(3.15, 2.75, 0.48, 64),
    gold,
  )
  canopy.position.y = 38.7
  canopy.castShadow = true
  stupa.add(canopy)

  const crown = new Mesh(
    new CylinderGeometry(2.0, 2.45, 1.35, 64),
    gold,
  )
  crown.position.y = 39.65
  crown.castShadow = true
  stupa.add(crown)

  const pinnacle = new Mesh(
    new ConeGeometry(0.92, 2.55, 32),
    gold,
  )
  pinnacle.position.y = 41.5
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
      topColor: { value: new Color('#78a7ca') },
      horizonColor: { value: new Color('#efc58d') },
      bottomColor: { value: new Color('#c99b67') },
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
    scene.fog = new FogExp2('#c8ad86', 0.0034)
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

    const hemisphere = new HemisphereLight('#dff0ff', '#785339', 1.85)
    scene.add(hemisphere)

    const sun = new DirectionalLight('#ffdda8', 4.6)
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

    const fillLight = new DirectionalLight('#9fc5df', 1.05)
    fillLight.position.set(-45, 38, -52)
    scene.add(fillLight)

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
      new RingGeometry(24.5, 45.5, 128),
      new MeshStandardMaterial({
        color: '#9c7559',
        roughness: 0.94,
        side: DoubleSide,
      }),
    )
    koraPath.rotation.x = -Math.PI / 2
    koraPath.position.y = 0.035
    koraPath.receiveShadow = true
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
