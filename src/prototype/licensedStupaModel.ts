import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  Vector3,
} from 'three'

export const BOUDHA_TARGET_HEIGHT_METERS = 43.25
export const BOUDHA_TARGET_FOOTPRINT_METERS = 82.2
const QUANTIZATION_MAX = 65_535
const DEFAULT_MODEL_HEIGHT_FRACTION = 0.55

export type LicensedStupaModelOptions = {
  heightFraction?: number
}

const MODEL_PART_URLS = [
  'models/boudha/mbv2-0.b64',
  'models/boudha/mbv2-1.b64',
  'models/boudha/mbv2-2.b64',
  'models/boudha/mbv2-3.b64',
].map((path) => `${import.meta.env.BASE_URL}${path}`)

type Cursor = {
  offset: number
}

type PackedModel = {
  geometry: BufferGeometry
  vertexCount: number
  triangleCount: number
  sourceSize: Vector3
}

function decodeBase64(source: string) {
  const binary = atob(source)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

async function gunzip(bytes: Uint8Array) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('This browser cannot decompress the packed Boudhanath model.')
  }

  const stream = new Blob([new Uint8Array(bytes)])
    .stream()
    .pipeThrough(new DecompressionStream('gzip'))

  return new Uint8Array(await new Response(stream).arrayBuffer())
}

function readVarint(bytes: Uint8Array, cursor: Cursor) {
  let value = 0
  let shift = 0

  while (cursor.offset < bytes.length) {
    const byte = bytes[cursor.offset]
    cursor.offset += 1
    value |= (byte & 0x7f) << shift

    if ((byte & 0x80) === 0) {
      return value >>> 0
    }

    shift += 7
    if (shift > 28) {
      throw new Error('Packed Boudhanath model contains an invalid varint.')
    }
  }

  throw new Error('Packed Boudhanath model ended unexpectedly.')
}

function zigZagDecode(value: number) {
  return (value >>> 1) ^ -(value & 1)
}

function plasterColor(
  normalizedHeight: number,
  x: number,
  y: number,
  z: number,
) {
  const broad =
    Math.sin(x * 0.083 + z * 0.061) * 0.065 +
    Math.sin(x * 0.19 - z * 0.137 + y * 0.051) * 0.038
  const fine =
    Math.sin(x * 0.71 + z * 0.53 + y * 0.27) * 0.022

  const lowerStain =
    Math.max(0, 0.46 - normalizedHeight) *
    (0.24 + 0.11 * Math.sin(x * 0.11 + z * 0.17))

  const warmStreak =
    Math.max(
      0,
      Math.sin(x * 0.15 + z * 0.04) * 0.5 +
        Math.sin(z * 0.09 - y * 0.06) * 0.5,
    ) *
    0.035

  const base = new Color('#e3ddd2')
  const shade = 1 + broad + fine - lowerStain

  base.r *= shade
  base.g *= shade - warmStreak * 0.42
  base.b *= shade - warmStreak

  return base
}

function parsePackedModel(
  bytes: Uint8Array,
  heightFraction: number,
): PackedModel {
  if (
    bytes.length < 36 ||
    String.fromCharCode(...bytes.subarray(0, 4)) !== 'MBV2'
  ) {
    throw new Error('Packed Boudhanath model has an invalid MBV2 header.')
  }

  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength,
  )

  const vertexCount = view.getUint32(4, true)
  const triangleCount = view.getUint32(8, true)
  const bounds = [
    view.getFloat32(12, true),
    view.getFloat32(16, true),
    view.getFloat32(20, true),
    view.getFloat32(24, true),
    view.getFloat32(28, true),
    view.getFloat32(32, true),
  ] as const

  if (
    vertexCount <= 0 ||
    triangleCount <= 0 ||
    vertexCount > 65_535
  ) {
    throw new Error('Packed Boudhanath model has invalid mesh counts.')
  }

  const mins = [bounds[0], bounds[1], bounds[2]] as const
  const spans = [
    bounds[3] - bounds[0],
    bounds[4] - bounds[1],
    bounds[5] - bounds[2],
  ] as const

  if (spans.some((span) => !Number.isFinite(span) || span <= 0)) {
    throw new Error('Packed Boudhanath model has invalid bounds.')
  }

  const cursor: Cursor = { offset: 36 }
  const quantized = [0, 0, 0]
  const positions = new Float32Array(vertexCount * 3)
  const colors = new Float32Array(vertexCount * 3)

  for (let vertex = 0; vertex < vertexCount; vertex += 1) {
    for (let axis = 0; axis < 3; axis += 1) {
      quantized[axis] += zigZagDecode(readVarint(bytes, cursor))

      if (
        quantized[axis] < 0 ||
        quantized[axis] > QUANTIZATION_MAX
      ) {
        throw new Error('Packed Boudhanath model position is out of range.')
      }

      positions[vertex * 3 + axis] =
        mins[axis] +
        (quantized[axis] / QUANTIZATION_MAX) * spans[axis]
    }

    const x = positions[vertex * 3]
    const y = positions[vertex * 3 + 1]
    const z = positions[vertex * 3 + 2]
    const normalizedHeight =
      (y - mins[1]) / spans[1]
    const color = plasterColor(normalizedHeight, x, y, z)

    colors[vertex * 3] = color.r
    colors[vertex * 3 + 1] = color.g
    colors[vertex * 3 + 2] = color.b
  }

  const indices = new Uint16Array(triangleCount * 3)
  let previousIndex = 0

  for (let index = 0; index < indices.length; index += 1) {
    previousIndex += zigZagDecode(readVarint(bytes, cursor))

    if (previousIndex < 0 || previousIndex >= vertexCount) {
      throw new Error('Packed Boudhanath model index is out of range.')
    }

    indices[index] = previousIndex
  }

  if (cursor.offset !== bytes.length) {
    throw new Error(
      `Packed Boudhanath model has ${bytes.length - cursor.offset} unread bytes.`,
    )
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(positions, 3),
  )
  geometry.setAttribute(
    'color',
    new Float32BufferAttribute(colors, 3),
  )
  geometry.setIndex(new BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()

  const sourceBounds = geometry.boundingBox

  if (!sourceBounds) {
    geometry.dispose()
    throw new Error('Packed Boudhanath model has no bounding box.')
  }

  const sourceSize = sourceBounds.getSize(new Vector3())
  const center = sourceBounds.getCenter(new Vector3())

  geometry.translate(-center.x, -sourceBounds.min.y, -center.z)

  const translatedPositions = geometry.getAttribute('position') as BufferAttribute
  const translatedIndex = geometry.getIndex()
  const lowerIndices: number[] = []
  const cutoffY = sourceSize.y * heightFraction

  if (!translatedIndex) {
    geometry.dispose()
    throw new Error('Packed Boudhanath model has no triangle index.')
  }

  for (let offset = 0; offset < translatedIndex.count; offset += 3) {
    const a = translatedIndex.getX(offset)
    const b = translatedIndex.getX(offset + 1)
    const c = translatedIndex.getX(offset + 2)
    const averageY =
      (translatedPositions.getY(a) +
        translatedPositions.getY(b) +
        translatedPositions.getY(c)) /
      3

    if (averageY <= cutoffY) {
      lowerIndices.push(a, b, c)
    }
  }

  if (lowerIndices.length === 0) {
    geometry.dispose()
    throw new Error('Packed Boudhanath lower-structure crop is empty.')
  }

  geometry.setIndex(
    new BufferAttribute(new Uint16Array(lowerIndices), 1),
  )
  geometry.computeVertexNormals()

  return {
    geometry,
    vertexCount,
    triangleCount,
    sourceSize,
  }
}

async function fetchPackedModel(heightFraction: number) {
  const parts = await Promise.all(
    MODEL_PART_URLS.map(async (url) => {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(
          `Unable to load Boudhanath model part ${url}: HTTP ${response.status}`,
        )
      }

      return (await response.text()).trim()
    }),
  )

  const compressed = decodeBase64(parts.join(''))
  return parsePackedModel(await gunzip(compressed), heightFraction)
}

export async function loadLicensedStupaModel(
  options: LicensedStupaModelOptions = {},
) {
  const heightFraction =
    options.heightFraction ?? DEFAULT_MODEL_HEIGHT_FRACTION

  if (
    !Number.isFinite(heightFraction) ||
    heightFraction <= 0 ||
    heightFraction > 1
  ) {
    throw new Error('Licensed Boudhanath model height fraction must be within (0, 1].')
  }

  const {
    geometry,
    vertexCount,
    triangleCount,
    sourceSize,
  } = await fetchPackedModel(heightFraction)

  const material = new MeshPhysicalMaterial({
    color: '#e9e2d7',
    vertexColors: true,
    roughness: 0.97,
    metalness: 0,
    clearcoat: 0.008,
    clearcoatRoughness: 0.94,
  })

  const mesh = new Mesh(geometry, material)
  mesh.name = 'miniworld3d-boudhanath-mesh'
  mesh.castShadow = true
  mesh.receiveShadow = true

  // The downloaded STL is a printable interpretation (~108 × 54.4 × 108).
  // Its broad footprint-to-height proportion is much closer to Boudhanath's
  // documented mandala mass than the previous 43.5 m horizontal compression.
  // Keep the published 43.25 m height and use an ~82.2 m visual footprint,
  // approximately the square-equivalent width of the published 6,756 m²
  // stupa area. This remains visual calibration, not survey-grade geometry.
  mesh.scale.set(
    BOUDHA_TARGET_FOOTPRINT_METERS / sourceSize.x,
    BOUDHA_TARGET_HEIGHT_METERS / sourceSize.y,
    BOUDHA_TARGET_FOOTPRINT_METERS / sourceSize.z,
  )

  const group = new Group()
  group.name = 'licensed-boudhanath-stupa'
  group.add(mesh)

  const scaledBounds = new Box3().setFromObject(group)
  const renderedTriangleCount =
    (geometry.getIndex()?.count ?? 0) / 3

  return {
    group,
    metadata: {
      vertexCount,
      triangleCount,
      renderedTriangleCount,
      heightFraction,
      heightMeters: scaledBounds.getSize(new Vector3()).y,
      footprintMeters: {
        x: scaledBounds.getSize(new Vector3()).x,
        z: scaledBounds.getSize(new Vector3()).z,
      },
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
