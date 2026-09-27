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
  MeshBasicMaterial,
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
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { loadLicensedStupaModel } from './licensedStupaModel'
import { licensedModelRequested } from './prototypeModelMode'

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
const BOUDHA_REFERENCE_TEXTURE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Boudha_eyes.jpg/960px-Boudha_eyes.jpg'

const BOUDHA_SURROUNDINGS_PANORAMA_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/P37275-Kathmandu-Boudhanath.jpg/2560px-P37275-Kathmandu-Boudhanath.jpg'

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

  const y = 26.05
  const offset = 3.66

  const front = new Mesh(geometry, material)
  front.name = 'boudha-eye-panel'
  front.position.set(0, y, offset)
  group.add(front)

  const back = new Mesh(geometry, material)
  back.name = 'boudha-eye-panel'
  back.position.set(0, y, -offset)
  back.rotation.y = Math.PI
  group.add(back)

  const right = new Mesh(geometry, material)
  right.name = 'boudha-eye-panel'
  right.position.set(offset, y, 0)
  right.rotation.y = Math.PI / 2
  group.add(right)

  const left = new Mesh(geometry, material)
  left.name = 'boudha-eye-panel'
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
            -0.58, 0.24, 0,
            0.58, 0.24, 0,
            -0.46, -0.34, 0,
            0.58, 0.24, 0,
            0.43, -0.29, 0,
            -0.46, -0.34, 0,
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

function addSurroundingBuildings(scene: Group) {
  const facadePalette = ['#88624d', '#9a704f', '#6d5143', '#ad815b', '#765c4d']
  const trimMaterial = new MeshStandardMaterial({
    color: '#402d24',
    roughness: 0.82,
  })
  const windowMaterial = new MeshStandardMaterial({
    color: '#271f1c',
    emissive: '#6a3e1c',
    emissiveIntensity: 0.28,
    roughness: 0.66,
  })
  const balconyMaterial = new MeshStandardMaterial({
    color: '#4b352a',
    roughness: 0.9,
  })

  const strips: Array<{
    origin: Vector3
    axis: 'x' | 'z'
    rotation: number
  }> = [
    { origin: new Vector3(-34, 0, -57), axis: 'x', rotation: 0 },
    { origin: new Vector3(-57, 0, -34), axis: 'z', rotation: Math.PI / 2 },
    { origin: new Vector3(57, 0, -34), axis: 'z', rotation: -Math.PI / 2 },
  ]

  for (const strip of strips) {
    for (let i = 0; i < 9; i += 1) {
      const width = 7.1 + (i % 3) * 0.45
      const height = 11.5 + ((i * 7) % 5) * 1.35
      const depth = 8.2
      const facadeMaterial = new MeshStandardMaterial({
        color: facadePalette[i % facadePalette.length],
        roughness: 0.93,
      })

      const building = new Mesh(
        new BoxGeometry(width, height, depth),
        facadeMaterial,
      )

      if (strip.axis === 'x') {
        building.position.set(
          strip.origin.x + i * 8.25,
          height / 2,
          strip.origin.z,
        )
      } else {
        building.position.set(
          strip.origin.x,
          height / 2,
          strip.origin.z + i * 8.25,
        )
      }

      building.rotation.y = strip.rotation
      building.castShadow = true
      building.receiveShadow = true
      scene.add(building)

      const roof = new Mesh(
        new BoxGeometry(width + 0.7, 0.32, depth + 0.7),
        trimMaterial,
      )
      roof.position.copy(building.position)
      roof.position.y = height + 0.16
      roof.rotation.y = strip.rotation
      roof.castShadow = true
      scene.add(roof)

      for (let floor = 0; floor < 3; floor += 1) {
        for (let bay = -1; bay <= 1; bay += 1) {
          const window = new Mesh(
            new PlaneGeometry(0.9, 1.38),
            windowMaterial,
          )
          const bayOffset = bay * 1.65

          if (strip.axis === 'x') {
            window.position.set(
              building.position.x + bayOffset,
              3.0 + floor * 2.55,
              strip.origin.z + 4.12,
            )
          } else {
            window.position.set(
              strip.origin.x - Math.sign(strip.origin.x) * 4.12,
              3.0 + floor * 2.55,
              building.position.z + bayOffset,
            )
            window.rotation.y = strip.origin.x > 0 ? -Math.PI / 2 : Math.PI / 2
          }
          scene.add(window)
        }

        if (floor > 0) {
          const balcony = new Mesh(
            new BoxGeometry(strip.axis === 'x' ? width * 0.74 : 0.32, 0.24, strip.axis === 'x' ? 0.55 : width * 0.74),
            balconyMaterial,
          )

          if (strip.axis === 'x') {
            balcony.position.set(
              building.position.x,
              2.45 + floor * 2.55,
              strip.origin.z + 4.34,
            )
          } else {
            balcony.position.set(
              strip.origin.x - Math.sign(strip.origin.x) * 4.34,
              2.45 + floor * 2.55,
              building.position.z,
            )
          }
          balcony.castShadow = true
          scene.add(balcony)
        }
      }
    }
  }
}

function addScaleFigures(scene: Scene) {
  const bodyGeometry = new CylinderGeometry(0.16, 0.22, 1.25, 10)
  const headGeometry = new SphereGeometry(0.16, 10, 8)
  const colors = ['#5d302a', '#3e4851', '#6c4b35', '#7e2f29', '#2e4241']

  for (let i = 0; i < 24; i += 1) {
    const angle = (i / 24) * Math.PI * 2 + (i % 2) * 0.08
    const radius = 28 + (i % 3) * 2.25
    const material = new MeshStandardMaterial({
      color: colors[i % colors.length],
      roughness: 0.92,
    })
    const skin = new MeshStandardMaterial({
      color: '#9b7359',
      roughness: 0.92,
    })

    const body = new Mesh(bodyGeometry, material)
    body.position.set(
      Math.cos(angle) * radius,
      0.65,
      Math.sin(angle) * radius,
    )
    body.castShadow = true
    scene.add(body)

    const head = new Mesh(headGeometry, skin)
    head.position.set(body.position.x, 1.45, body.position.z)
    head.castShadow = true
    scene.add(head)
  }
}

function createStupa(scene: Scene) {
  const stupa = new Group()
  const lower = new Group()
  const upper = new Group()
  stupa.add(lower)
  stupa.add(upper)

  const plasterTexture = makePlasterTexture()
  const eyeTexture = makeEyeTexture()

  const plaster = new MeshPhysicalMaterial({
    color: '#eee8dc',
    map: plasterTexture,
    bumpMap: plasterTexture,
    bumpScale: 0.08,
    roughness: 0.9,
    metalness: 0,
    clearcoat: 0.02,
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
    lower.add(mesh)
  }

  const drum = new Mesh(
    new CylinderGeometry(18.85, 19.25, 2.0, 96),
    plaster,
  )
  drum.position.y = 4.2
  drum.receiveShadow = true
  drum.castShadow = true
  lower.add(drum)

  const dome = new Mesh(
    new SphereGeometry(DOME_RADIUS, 128, 64, 0, Math.PI * 2, 0, Math.PI / 2),
    plaster,
  )
  dome.position.y = 5.15
  dome.castShadow = true
  dome.receiveShadow = true
  lower.add(dome)

  const domeBand = new Mesh(
    new CylinderGeometry(18.95, 18.95, 0.58, 96),
    warmWhite,
  )
  domeBand.position.y = 5.12
  lower.add(domeBand)

  const nicheMaterial = new MeshStandardMaterial({
    color: '#b38858',
    roughness: 0.72,
    metalness: 0.04,
  })
  const nicheGeometry = new BoxGeometry(0.34, 0.7, 0.25)
  for (let i = 0; i < 108; i += 1) {
    const angle = (i / 108) * Math.PI * 2
    const niche = new Mesh(nicheGeometry, nicheMaterial)
    niche.position.set(
      Math.cos(angle) * 19.28,
      5.7,
      Math.sin(angle) * 19.28,
    )
    niche.rotation.y = -angle + Math.PI / 2
    niche.castShadow = true
    lower.add(niche)
  }

  const harmika = new Mesh(new BoxGeometry(7.2, 5.2, 7.2), gold)
  harmika.position.y = 25.8
  harmika.castShadow = true
  upper.add(harmika)

  for (let seam = -2; seam <= 2; seam += 1) {
    const seamY = 24.2 + seam * 0.82
    const frontSeam = new Mesh(
      new BoxGeometry(7.28, 0.055, 0.06),
      darkGold,
    )
    frontSeam.position.set(0, seamY, 3.64)
    upper.add(frontSeam)

    const sideSeam = new Mesh(
      new BoxGeometry(0.06, 0.055, 7.28),
      darkGold,
    )
    sideSeam.position.set(3.64, seamY, 0)
    upper.add(sideSeam)
  }

  addEyePanels(upper, eyeTexture)

  const green = new MeshStandardMaterial({
    color: '#285b3d',
    roughness: 0.9,
  })
  const greenSkirt = new Mesh(new BoxGeometry(7.72, 0.74, 7.72), green)
  greenSkirt.position.y = 28.45
  greenSkirt.castShadow = true
  upper.add(greenSkirt)

  const redBand = new Mesh(new BoxGeometry(7.78, 0.28, 7.78), red)
  redBand.position.y = 28.9
  upper.add(redBand)

  const blueBand = new Mesh(new BoxGeometry(7.42, 0.24, 7.42), blue)
  blueBand.position.y = 29.05
  upper.add(blueBand)

  let tierY = 29.55
  for (let i = 0; i < 13; i += 1) {
    const progress = i / 12
    const width = MathUtils.lerp(6.7, 1.75, progress)
    const tier = new Mesh(
      new BoxGeometry(width, 0.54, width),
      i % 4 === 0 ? darkGold : gold,
    )
    tier.name = 'boudha-spire-tier'
    tier.position.y = tierY
    tier.castShadow = true
    upper.add(tier)
    tierY += 0.6
  }

  const umbrellaBlue = new Mesh(
    new CylinderGeometry(2.55, 2.72, 0.32, 64),
    blue,
  )
  umbrellaBlue.position.y = 37.5
  upper.add(umbrellaBlue)

  const umbrellaRed = new Mesh(
    new CylinderGeometry(2.68, 2.9, 0.28, 64),
    red,
  )
  umbrellaRed.position.y = 37.8
  upper.add(umbrellaRed)

  const umbrellaYellow = new Mesh(
    new CylinderGeometry(2.85, 3.08, 0.52, 64),
    yellow,
  )
  umbrellaYellow.position.y = 38.18
  upper.add(umbrellaYellow)

  const canopy = new Mesh(
    new CylinderGeometry(3.15, 2.75, 0.48, 64),
    gold,
  )
  canopy.position.y = 38.7
  canopy.castShadow = true
  upper.add(canopy)

  const crown = new Mesh(
    new CylinderGeometry(2.0, 2.45, 1.35, 64),
    gold,
  )
  crown.position.y = 39.65
  crown.castShadow = true
  upper.add(crown)

  const pinnacle = new Mesh(
    new ConeGeometry(0.92, 2.55, 32),
    gold,
  )
  pinnacle.position.y = 41.5
  pinnacle.castShadow = true
  upper.add(pinnacle)

  const jewel = new Mesh(
    new SphereGeometry(0.58, 24, 16),
    gold,
  )
  jewel.position.y = MONUMENT_HEIGHT
  upper.add(jewel)

  const pigeonMaterial = new MeshStandardMaterial({
    color: '#292826',
    roughness: 0.95,
  })
  const pigeonGeometry = new ConeGeometry(0.065, 0.2, 6)
  for (let i = 0; i < 42; i += 1) {
    const angle = (i * 2.399963229728653) % (Math.PI * 2)
    const normalized = 0.24 + ((i * 37) % 61) / 100
    const polar = normalized * 1.05
    const radius = DOME_RADIUS + 0.08
    const pigeon = new Mesh(pigeonGeometry, pigeonMaterial)
    pigeon.position.set(
      Math.sin(polar) * Math.cos(angle) * radius,
      5.15 + Math.cos(polar) * radius,
      Math.sin(polar) * Math.sin(angle) * radius,
    )
    pigeon.rotation.z = Math.PI
    pigeon.rotation.y = angle
    pigeon.castShadow = true
    lower.add(pigeon)
  }

  scene.add(stupa)

  return {
    stupa,
    lower,
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
    let licensedModelDispose: (() => void) | null = null
    const useLicensedModel = licensedModelRequested(window.location.search)
    let licensedModelReady = !useLicensedModel
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
    renderer.toneMappingExposure = 1.0
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = PCFSoftShadowMap
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7))

    const camera = new PerspectiveCamera(35, 1, 0.1, 420)
    const finalCamera = new Vector3(58, 11.5, 67)
    const startCamera = reducedMotion
      ? finalCamera.clone()
      : new Vector3(92, 22, 110)

    camera.position.copy(startCamera)

    const controls = new OrbitControls(camera, canvas)
    controls.enableDamping = true
    controls.dampingFactor = 0.055
    controls.enablePan = false
    controls.minDistance = 32
    controls.maxDistance = 125
    controls.minPolarAngle = 0.35
    controls.maxPolarAngle = Math.PI * 0.49
    controls.target.set(0, 15.5, 0)
    controls.enabled = reducedMotion
    controls.update()

    const hemisphere = new HemisphereLight('#dff0ff', '#785339', 1.85)
    scene.add(hemisphere)

    const sun = new DirectionalLight('#ffdda8', 4.6)
    sun.position.set(48, 62, 22)
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
        color: '#a89579',
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

    const { lower, flagTop } = createStupa(scene)

    if (useLicensedModel) {
      void loadLicensedStupaModel()
        .then(({ group, dispose, metadata }) => {
          if (disposed) {
            dispose()
            return
          }

          licensedModelDispose = dispose
          lower.visible = false
          scene.add(group)
          licensedModelReady = true

          console.info(
            'Licensed Boudhanath model ready',
            JSON.stringify(metadata),
          )
        })
        .catch((error: unknown) => {
          console.error(
            'Licensed Boudhanath model failed to load.',
            error,
          )
        })
    }

    addPrayerWheelRing(scene)

    const syntheticSurroundings = new Group()
    syntheticSurroundings.name = 'synthetic-surroundings-fallback'
    scene.add(syntheticSurroundings)
    addSurroundingBuildings(syntheticSurroundings)
    addScaleFigures(syntheticSurroundings)

    const photographicEnvironment = new Group()
    photographicEnvironment.name = 'photographic-boudhanath-environment'
    scene.add(photographicEnvironment)

    const panoramaGeometry = new CylinderGeometry(
      145,
      145,
      78,
      160,
      1,
      true,
    )
    const panoramaMaterial = new MeshBasicMaterial({
      color: '#ffffff',
      side: BackSide,
      transparent: true,
      opacity: 0,
      fog: false,
      toneMapped: false,
    })
    const panoramaMesh = new Mesh(panoramaGeometry, panoramaMaterial)
    panoramaMesh.position.y = 31
    panoramaMesh.rotation.y = Math.PI * 0.18
    photographicEnvironment.add(panoramaMesh)

    const referenceTextures: Texture[] = []
    const textureLoader = new TextureLoader()
    textureLoader.setCrossOrigin('anonymous')
    textureLoader.load(
      BOUDHA_SURROUNDINGS_PANORAMA_URL,
      (panoramaTexture) => {
        if (disposed) {
          panoramaTexture.dispose()
          return
        }

        panoramaTexture.colorSpace = SRGBColorSpace
        panoramaTexture.anisotropy = Math.min(
          8,
          renderer.capabilities.getMaxAnisotropy(),
        )
        panoramaTexture.wrapS = RepeatWrapping
        panoramaTexture.repeat.x = -1
        panoramaTexture.offset.x = 1
        panoramaTexture.needsUpdate = true
        referenceTextures.push(panoramaTexture)

        panoramaMaterial.map = panoramaTexture
        panoramaMaterial.opacity = 1
        panoramaMaterial.needsUpdate = true

        syntheticSurroundings.visible = false
        console.info('Photographic Boudhanath surroundings ready')
      },
      undefined,
      () => {
        console.warn(
          'Photographic surroundings unavailable; keeping synthetic fallback.',
        )
      },
    )

    textureLoader.load(
      BOUDHA_REFERENCE_TEXTURE_URL,
      (sourceTexture) => {
        if (disposed) {
          sourceTexture.dispose()
          return
        }

        sourceTexture.colorSpace = SRGBColorSpace
        sourceTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy())

        const eyeTexture = sourceTexture.clone()
        eyeTexture.colorSpace = SRGBColorSpace
        eyeTexture.repeat.set(0.73, 0.52)
        eyeTexture.offset.set(0.135, 0.18)
        eyeTexture.needsUpdate = true

        referenceTextures.push(sourceTexture, eyeTexture)

        scene.traverse((object) => {
          if (!(object instanceof Mesh)) {
            return
          }

          if (object.name === 'boudha-eye-panel') {
            const material = object.material as MeshStandardMaterial
            material.map = eyeTexture
            material.color.set('#ffffff')
            material.roughness = 0.68
            material.metalness = 0.04
            material.needsUpdate = true
          }

        })
      },
      undefined,
      () => {
        // The prototype keeps its procedural fallback if the optional licensed
        // reference texture is unavailable.
      },
    )

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

      if (!readyAnnounced && licensedModelReady) {
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
      for (const texture of referenceTextures) {
        texture.dispose()
      }
      licensedModelDispose?.()
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
