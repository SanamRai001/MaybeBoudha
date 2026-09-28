import {
  BufferAttribute,
  BufferGeometry,
  Float32BufferAttribute,
  Vector3,
} from 'three'

import { prepareSurfaceGeometryForWebGL } from '../surface/surfaceGeometry'

const TARGET_HEIGHT_METERS = 43.25

export const SELECTIVE_DOME_REGION = {
  minY: 7.1,
  maxY: 23.45,
  maxRadius: 19.7,
} as const

export type SelectiveSurfaceMetadata = {
  sourceTriangles: number
  selectedTriangles: number
  normalizedScale: number
  sourceSize: [number, number, number]
  region: typeof SELECTIVE_DOME_REGION
}

type Vertex = [number, number, number]

function normalizedVertex(
  positions: BufferAttribute,
  index: number,
  center: Vector3,
  minY: number,
  scale: number,
): Vertex {
  return [
    (positions.getX(index) - center.x) * scale,
    (positions.getY(index) - minY) * scale,
    (positions.getZ(index) - center.z) * scale,
  ]
}

function triangleIndices(
  geometry: BufferGeometry,
  triangle: number,
): [number, number, number] {
  const index = geometry.getIndex()

  if (index) {
    const offset = triangle * 3
    return [
      index.getX(offset),
      index.getX(offset + 1),
      index.getX(offset + 2),
    ]
  }

  const offset = triangle * 3
  return [offset, offset + 1, offset + 2]
}

function triangleInsideSelectiveRegion(
  a: Vertex,
  b: Vertex,
  c: Vertex,
) {
  const minY = Math.min(a[1], b[1], c[1])
  const maxY = Math.max(a[1], b[1], c[1])
  const maxRadius = Math.max(
    Math.hypot(a[0], a[2]),
    Math.hypot(b[0], b[2]),
    Math.hypot(c[0], c[2]),
  )

  return (
    minY >= SELECTIVE_DOME_REGION.minY &&
    maxY <= SELECTIVE_DOME_REGION.maxY &&
    maxRadius <= SELECTIVE_DOME_REGION.maxRadius
  )
}

export function createSelectiveDomeGeometry(
  source: BufferGeometry,
): {
  geometry: BufferGeometry
  metadata: SelectiveSurfaceMetadata
} {
  prepareSurfaceGeometryForWebGL(source)
  source.computeBoundingBox()

  const bounds = source.boundingBox

  if (!bounds) {
    throw new Error('Reconstructed surface bounds are unavailable.')
  }

  const size = bounds.getSize(new Vector3())

  if (!Number.isFinite(size.y) || size.y <= 0) {
    throw new Error('Reconstructed surface has an invalid height.')
  }

  const center = bounds.getCenter(new Vector3())
  const scale = TARGET_HEIGHT_METERS / size.y
  const positions = source.getAttribute('position') as BufferAttribute
  const index = source.getIndex()
  const sourceTriangleCount = index
    ? Math.floor(index.count / 3)
    : Math.floor(positions.count / 3)

  const selectedPositions: number[] = []

  for (let triangle = 0; triangle < sourceTriangleCount; triangle += 1) {
    const [ia, ib, ic] = triangleIndices(source, triangle)
    const a = normalizedVertex(positions, ia, center, bounds.min.y, scale)
    const b = normalizedVertex(positions, ib, center, bounds.min.y, scale)
    const c = normalizedVertex(positions, ic, center, bounds.min.y, scale)

    if (!triangleInsideSelectiveRegion(a, b, c)) {
      continue
    }

    selectedPositions.push(...a, ...b, ...c)
  }

  if (selectedPositions.length === 0) {
    throw new Error('Selective reconstructed dome crop is empty.')
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(selectedPositions, 3),
  )
  geometry.computeVertexNormals()
  geometry.computeBoundingBox()

  return {
    geometry,
    metadata: {
      sourceTriangles: sourceTriangleCount,
      selectedTriangles: selectedPositions.length / 9,
      normalizedScale: scale,
      sourceSize: [size.x, size.y, size.z],
      region: SELECTIVE_DOME_REGION,
    },
  }
}
