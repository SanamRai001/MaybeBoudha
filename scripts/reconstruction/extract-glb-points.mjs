import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const [
  inputPath = 'boudhanath_stupa_-_pointcloud.glb',
  outputPath = '.phase3p4/boudha-points.ply',
  manifestPath = '.phase3p4/extraction-manifest.json',
] = process.argv.slice(2)

function fail(message) {
  throw new Error(message)
}

const bytes = await readFile(inputPath)

if (bytes.toString('utf8', 0, 4) !== 'glTF') {
  fail('Expected a binary glTF/GLB source.')
}

if (bytes.readUInt32LE(4) !== 2) {
  fail('Only glTF 2.0 GLB is supported.')
}

let offset = 12
let document = null
let binaryChunk = null

while (offset + 8 <= bytes.length) {
  const byteLength = bytes.readUInt32LE(offset)
  const chunkType = bytes.readUInt32LE(offset + 4)
  const start = offset + 8
  const end = start + byteLength

  if (end > bytes.length) {
    fail('GLB chunk exceeds file boundary.')
  }

  if (chunkType === 0x4e4f534a) {
    document = JSON.parse(
      bytes
        .toString('utf8', start, end)
        .replace(/\0+$/u, '')
        .trim(),
    )
  } else if (chunkType === 0x004e4942) {
    binaryChunk = bytes.subarray(start, end)
  }

  offset = end
}

if (!document || !binaryChunk) {
  fail('GLB must contain JSON and BIN chunks.')
}

const componentByteSize = new Map([
  [5120, 1],
  [5121, 1],
  [5122, 2],
  [5123, 2],
  [5125, 4],
  [5126, 4],
])

const componentCount = new Map([
  ['SCALAR', 1],
  ['VEC2', 2],
  ['VEC3', 3],
  ['VEC4', 4],
  ['MAT2', 4],
  ['MAT3', 9],
  ['MAT4', 16],
])

function readComponent(view, byteOffset, componentType, normalized) {
  let value

  switch (componentType) {
    case 5120:
      value = view.getInt8(byteOffset)
      return normalized ? Math.max(value / 127, -1) : value
    case 5121:
      value = view.getUint8(byteOffset)
      return normalized ? value / 255 : value
    case 5122:
      value = view.getInt16(byteOffset, true)
      return normalized ? Math.max(value / 32767, -1) : value
    case 5123:
      value = view.getUint16(byteOffset, true)
      return normalized ? value / 65535 : value
    case 5125:
      value = view.getUint32(byteOffset, true)
      return normalized ? value / 4294967295 : value
    case 5126:
      return view.getFloat32(byteOffset, true)
    default:
      fail(`Unsupported glTF component type: ${componentType}`)
  }
}

function readAccessor(accessorIndex) {
  const accessor = document.accessors?.[accessorIndex]

  if (!accessor) {
    fail(`Accessor ${accessorIndex} does not exist.`)
  }

  if (accessor.sparse) {
    fail('Sparse accessors are not supported by the deterministic extractor.')
  }

  const bufferView = document.bufferViews?.[accessor.bufferView]

  if (!bufferView) {
    fail(`Accessor ${accessorIndex} has no bufferView.`)
  }

  if ((bufferView.buffer ?? 0) !== 0) {
    fail('Only the GLB embedded buffer is supported.')
  }

  const bytesPerComponent = componentByteSize.get(accessor.componentType)
  const components = componentCount.get(accessor.type)

  if (!bytesPerComponent || !components) {
    fail(`Unsupported accessor layout for accessor ${accessorIndex}.`)
  }

  const packedStride = bytesPerComponent * components
  const stride = bufferView.byteStride ?? packedStride
  const baseOffset =
    (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
  const view = new DataView(
    binaryChunk.buffer,
    binaryChunk.byteOffset,
    binaryChunk.byteLength,
  )

  return {
    count: accessor.count,
    components,
    value(index, component) {
      return readComponent(
        view,
        baseOffset + index * stride + component * bytesPerComponent,
        accessor.componentType,
        accessor.normalized ?? false,
      )
    },
  }
}

function identityMatrix() {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
}

function multiplyMat4(a, b) {
  const result = new Array(16).fill(0)

  for (let column = 0; column < 4; column += 1) {
    for (let row = 0; row < 4; row += 1) {
      for (let k = 0; k < 4; k += 1) {
        result[column * 4 + row] +=
          a[k * 4 + row] * b[column * 4 + k]
      }
    }
  }

  return result
}

function composeMatrix(node) {
  if (node.matrix) {
    return [...node.matrix]
  }

  const [tx, ty, tz] = node.translation ?? [0, 0, 0]
  const [qx, qy, qz, qw] = node.rotation ?? [0, 0, 0, 1]
  const [sx, sy, sz] = node.scale ?? [1, 1, 1]

  const x2 = qx + qx
  const y2 = qy + qy
  const z2 = qz + qz
  const xx = qx * x2
  const xy = qx * y2
  const xz = qx * z2
  const yy = qy * y2
  const yz = qy * z2
  const zz = qz * z2
  const wx = qw * x2
  const wy = qw * y2
  const wz = qw * z2

  return [
    (1 - (yy + zz)) * sx,
    (xy + wz) * sx,
    (xz - wy) * sx,
    0,
    (xy - wz) * sy,
    (1 - (xx + zz)) * sy,
    (yz + wx) * sy,
    0,
    (xz + wy) * sz,
    (yz - wx) * sz,
    (1 - (xx + yy)) * sz,
    0,
    tx,
    ty,
    tz,
    1,
  ]
}

function transformPoint(matrix, x, y, z) {
  return [
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12],
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13],
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14],
  ]
}

function normalMatrixFromMat4(matrix) {
  const a00 = matrix[0]
  const a01 = matrix[4]
  const a02 = matrix[8]
  const a10 = matrix[1]
  const a11 = matrix[5]
  const a12 = matrix[9]
  const a20 = matrix[2]
  const a21 = matrix[6]
  const a22 = matrix[10]

  const b01 = a22 * a11 - a12 * a21
  const b11 = -a22 * a10 + a12 * a20
  const b21 = a21 * a10 - a11 * a20
  const determinant = a00 * b01 + a01 * b11 + a02 * b21

  if (Math.abs(determinant) < 1e-12) {
    fail('Node transform has a singular normal matrix.')
  }

  const invDet = 1 / determinant

  // Inverse-transpose, represented row-major for direct multiplication below.
  return [
    b01 * invDet,
    (-a22 * a01 + a02 * a21) * invDet,
    (a12 * a01 - a02 * a11) * invDet,
    b11 * invDet,
    (a22 * a00 - a02 * a20) * invDet,
    (-a12 * a00 + a02 * a10) * invDet,
    b21 * invDet,
    (-a21 * a00 + a01 * a20) * invDet,
    (a11 * a00 - a01 * a10) * invDet,
  ]
}

function transformNormal(normalMatrix, x, y, z) {
  const nx =
    normalMatrix[0] * x +
    normalMatrix[1] * y +
    normalMatrix[2] * z
  const ny =
    normalMatrix[3] * x +
    normalMatrix[4] * y +
    normalMatrix[5] * z
  const nz =
    normalMatrix[6] * x +
    normalMatrix[7] * y +
    normalMatrix[8] * z

  const length = Math.hypot(nx, ny, nz)

  if (length <= Number.EPSILON) {
    return [0, 1, 0]
  }

  return [nx / length, ny / length, nz / length]
}

const points = []
const boundsMin = [Infinity, Infinity, Infinity]
const boundsMax = [-Infinity, -Infinity, -Infinity]
let primitiveCount = 0

function visitNode(nodeIndex, parentWorld) {
  const node = document.nodes?.[nodeIndex]

  if (!node) {
    fail(`Node ${nodeIndex} does not exist.`)
  }

  const world = multiplyMat4(parentWorld, composeMatrix(node))

  if (Number.isInteger(node.mesh)) {
    const mesh = document.meshes?.[node.mesh]

    if (!mesh) {
      fail(`Mesh ${node.mesh} does not exist.`)
    }

    for (const primitive of mesh.primitives ?? []) {
      if ((primitive.mode ?? 4) !== 0) {
        continue
      }

      const positionIndex = primitive.attributes?.POSITION
      const normalIndex = primitive.attributes?.NORMAL

      if (!Number.isInteger(positionIndex) || !Number.isInteger(normalIndex)) {
        fail('Point primitive must contain POSITION and NORMAL.')
      }

      const position = readAccessor(positionIndex)
      const normal = readAccessor(normalIndex)

      if (
        position.components < 3 ||
        normal.components < 3 ||
        position.count !== normal.count
      ) {
        fail('POSITION/NORMAL accessors are incompatible.')
      }

      const normalMatrix = normalMatrixFromMat4(world)
      primitiveCount += 1

      for (let index = 0; index < position.count; index += 1) {
        const transformedPosition = transformPoint(
          world,
          position.value(index, 0),
          position.value(index, 1),
          position.value(index, 2),
        )
        const transformedNormal = transformNormal(
          normalMatrix,
          normal.value(index, 0),
          normal.value(index, 1),
          normal.value(index, 2),
        )

        for (let axis = 0; axis < 3; axis += 1) {
          boundsMin[axis] = Math.min(boundsMin[axis], transformedPosition[axis])
          boundsMax[axis] = Math.max(boundsMax[axis], transformedPosition[axis])
        }

        points.push([...transformedPosition, ...transformedNormal])
      }
    }
  }

  for (const child of node.children ?? []) {
    visitNode(child, world)
  }
}

const sceneIndex = document.scene ?? 0
const scene = document.scenes?.[sceneIndex]

if (!scene) {
  fail(`Scene ${sceneIndex} does not exist.`)
}

for (const nodeIndex of scene.nodes ?? []) {
  visitNode(nodeIndex, identityMatrix())
}

if (points.length === 0) {
  fail('No point primitives were extracted from the GLB.')
}

const header = Buffer.from(
  [
    'ply',
    'format binary_little_endian 1.0',
    `comment source ${inputPath}`,
    'comment positions and normals transformed through glTF node matrices',
    `element vertex ${points.length}`,
    'property float x',
    'property float y',
    'property float z',
    'property float nx',
    'property float ny',
    'property float nz',
    'end_header',
    '',
  ].join('\n'),
  'utf8',
)

const body = Buffer.allocUnsafe(points.length * 6 * 4)

for (let index = 0; index < points.length; index += 1) {
  for (let component = 0; component < 6; component += 1) {
    body.writeFloatLE(points[index][component], (index * 6 + component) * 4)
  }
}

const output = Buffer.concat([header, body])
await writeFile(outputPath, output)

const manifest = {
  schemaVersion: 1,
  source: {
    path: inputPath,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  },
  extraction: {
    primitiveCount,
    pointCount: points.length,
    attributes: ['POSITION', 'NORMAL'],
    nodeTransformsApplied: true,
    bounds: {
      min: boundsMin,
      max: boundsMax,
      size: boundsMax.map((value, axis) => value - boundsMin[axis]),
    },
  },
  output: {
    path: outputPath,
    bytes: output.length,
    sha256: createHash('sha256').update(output).digest('hex'),
    format: 'binary_little_endian PLY',
  },
}

const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`
await writeFile(manifestPath, manifestJson)
process.stdout.write(manifestJson)
