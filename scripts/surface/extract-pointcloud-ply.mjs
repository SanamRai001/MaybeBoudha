import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import {
  Matrix3,
  Matrix4,
  Quaternion,
  Vector3,
} from 'three'

const [inputPath, outputPath, reportPath] = process.argv.slice(2)

if (!inputPath || !outputPath || !reportPath) {
  console.error(
    'Usage: node scripts/surface/extract-pointcloud-ply.mjs <source.glb> <output.ply> <report.json>',
  )
  process.exit(2)
}

const COMPONENT_BYTES = new Map([
  [5120, 1],
  [5121, 1],
  [5122, 2],
  [5123, 2],
  [5125, 4],
  [5126, 4],
])

const TYPE_COMPONENTS = new Map([
  ['SCALAR', 1],
  ['VEC2', 2],
  ['VEC3', 3],
  ['VEC4', 4],
  ['MAT2', 4],
  ['MAT3', 9],
  ['MAT4', 16],
])

function fail(message) {
  throw new Error(message)
}

function parseGlb(bytes) {
  if (bytes.length < 20 || bytes.toString('utf8', 0, 4) !== 'glTF') {
    fail('Input is not a valid GLB.')
  }

  if (bytes.readUInt32LE(4) !== 2) {
    fail('Only glTF 2.0 GLB files are supported.')
  }

  if (bytes.readUInt32LE(8) !== bytes.length) {
    fail('GLB declared length does not match file size.')
  }

  let offset = 12
  let document = null
  let binary = null

  while (offset + 8 <= bytes.length) {
    const byteLength = bytes.readUInt32LE(offset)
    const type = bytes.readUInt32LE(offset + 4)
    const start = offset + 8
    const end = start + byteLength

    if (end > bytes.length) {
      fail('GLB chunk exceeds file bounds.')
    }

    if (type === 0x4e4f534a) {
      document = JSON.parse(
        bytes
          .toString('utf8', start, end)
          .replace(/\0+$/u, '')
          .trim(),
      )
    } else if (type === 0x004e4942) {
      binary = bytes.subarray(start, end)
    }

    offset = end
  }

  if (!document || !binary) {
    fail('GLB must contain JSON and BIN chunks.')
  }

  return { document, binary }
}

function readComponent(view, byteOffset, componentType) {
  switch (componentType) {
    case 5120:
      return view.getInt8(byteOffset)
    case 5121:
      return view.getUint8(byteOffset)
    case 5122:
      return view.getInt16(byteOffset, true)
    case 5123:
      return view.getUint16(byteOffset, true)
    case 5125:
      return view.getUint32(byteOffset, true)
    case 5126:
      return view.getFloat32(byteOffset, true)
    default:
      fail(`Unsupported glTF component type: ${componentType}`)
  }
}

function normalizeComponent(value, componentType) {
  switch (componentType) {
    case 5120:
      return Math.max(value / 127, -1)
    case 5121:
      return value / 255
    case 5122:
      return Math.max(value / 32767, -1)
    case 5123:
      return value / 65535
    case 5125:
      return value / 4294967295
    default:
      return value
  }
}

function createAccessorReader(document, binary, accessorIndex) {
  const accessor = document.accessors?.[accessorIndex]

  if (!accessor) {
    fail(`Accessor ${accessorIndex} does not exist.`)
  }

  if (accessor.sparse) {
    fail('Sparse glTF accessors are not supported by the Phase 3P.4 extractor.')
  }

  const bufferView = document.bufferViews?.[accessor.bufferView]

  if (!bufferView) {
    fail(`Accessor ${accessorIndex} has no valid bufferView.`)
  }

  if ((bufferView.buffer ?? 0) !== 0) {
    fail('Phase 3P.4 expects GLB accessors in the embedded buffer.')
  }

  const componentBytes = COMPONENT_BYTES.get(accessor.componentType)
  const componentCount = TYPE_COMPONENTS.get(accessor.type)

  if (!componentBytes || !componentCount) {
    fail(`Unsupported accessor layout for accessor ${accessorIndex}.`)
  }

  const packedStride = componentBytes * componentCount
  const stride = bufferView.byteStride ?? packedStride

  if (stride < packedStride) {
    fail(`Invalid byteStride on accessor ${accessorIndex}.`)
  }

  const baseOffset =
    (bufferView.byteOffset ?? 0) + (accessor.byteOffset ?? 0)
  const dataView = new DataView(
    binary.buffer,
    binary.byteOffset,
    binary.byteLength,
  )

  return {
    accessor,
    get(index, component) {
      if (index < 0 || index >= accessor.count) {
        fail(`Accessor ${accessorIndex} index is out of range.`)
      }

      const raw = readComponent(
        dataView,
        baseOffset + index * stride + component * componentBytes,
        accessor.componentType,
      )

      return accessor.normalized
        ? normalizeComponent(raw, accessor.componentType)
        : raw
    },
  }
}

function nodeLocalMatrix(node) {
  if (Array.isArray(node.matrix)) {
    if (node.matrix.length !== 16) {
      fail('glTF node matrix must contain 16 values.')
    }
    return new Matrix4().fromArray(node.matrix)
  }

  const translation = new Vector3().fromArray(
    node.translation ?? [0, 0, 0],
  )
  const rotation = new Quaternion().fromArray(
    node.rotation ?? [0, 0, 0, 1],
  )
  const scale = new Vector3().fromArray(
    node.scale ?? [1, 1, 1],
  )

  return new Matrix4().compose(translation, rotation, scale)
}

function collectWorldMatrices(document) {
  const nodes = document.nodes ?? []
  const sceneIndex = document.scene ?? 0
  const scene = document.scenes?.[sceneIndex]

  if (!scene) {
    fail(`Active glTF scene ${sceneIndex} does not exist.`)
  }

  const matrices = new Map()
  const visiting = new Set()

  function visit(nodeIndex, parentMatrix) {
    if (visiting.has(nodeIndex)) {
      fail('Cycle detected in glTF node hierarchy.')
    }

    const node = nodes[nodeIndex]

    if (!node) {
      fail(`Scene references missing node ${nodeIndex}.`)
    }

    visiting.add(nodeIndex)
    const world = parentMatrix
      .clone()
      .multiply(nodeLocalMatrix(node))
    matrices.set(nodeIndex, world)

    for (const child of node.children ?? []) {
      visit(child, world)
    }

    visiting.delete(nodeIndex)
  }

  for (const rootNode of scene.nodes ?? []) {
    visit(rootNode, new Matrix4())
  }

  return matrices
}

function writeBinaryPly(points, normals) {
  const header = Buffer.from(
    [
      'ply',
      'format binary_little_endian 1.0',
      'comment MaybeBoudha Phase 3P.4 deterministic extraction',
      `element vertex ${points.length / 3}`,
      'property float x',
      'property float y',
      'property float z',
      'property float nx',
      'property float ny',
      'property float nz',
      'end_header',
      '',
    ].join('\n'),
    'ascii',
  )

  const body = Buffer.allocUnsafe((points.length / 3) * 24)
  let offset = 0

  for (let index = 0; index < points.length; index += 3) {
    body.writeFloatLE(points[index], offset)
    body.writeFloatLE(points[index + 1], offset + 4)
    body.writeFloatLE(points[index + 2], offset + 8)
    body.writeFloatLE(normals[index], offset + 12)
    body.writeFloatLE(normals[index + 1], offset + 16)
    body.writeFloatLE(normals[index + 2], offset + 20)
    offset += 24
  }

  return Buffer.concat([header, body])
}

const sourceBytes = await readFile(inputPath)
const { document, binary } = parseGlb(sourceBytes)
const worldMatrices = collectWorldMatrices(document)
const nodes = document.nodes ?? []
const meshes = document.meshes ?? []

const positions = []
const normals = []
const primitiveReports = []

for (const [nodeIndex, worldMatrix] of worldMatrices) {
  const node = nodes[nodeIndex]

  if (!Number.isInteger(node.mesh)) {
    continue
  }

  const mesh = meshes[node.mesh]

  if (!mesh) {
    fail(`Node ${nodeIndex} references missing mesh ${node.mesh}.`)
  }

  const normalMatrix = new Matrix3().getNormalMatrix(worldMatrix)

  for (
    let primitiveIndex = 0;
    primitiveIndex < (mesh.primitives ?? []).length;
    primitiveIndex += 1
  ) {
    const primitive = mesh.primitives[primitiveIndex]
    const mode = primitive.mode ?? 4

    if (mode !== 0) {
      continue
    }

    const positionIndex = primitive.attributes?.POSITION
    const normalIndex = primitive.attributes?.NORMAL

    if (!Number.isInteger(positionIndex) || !Number.isInteger(normalIndex)) {
      fail(
        `Point primitive ${nodeIndex}/${primitiveIndex} must contain POSITION and NORMAL.`,
      )
    }

    const positionReader = createAccessorReader(
      document,
      binary,
      positionIndex,
    )
    const normalReader = createAccessorReader(
      document,
      binary,
      normalIndex,
    )

    if (
      positionReader.accessor.type !== 'VEC3' ||
      normalReader.accessor.type !== 'VEC3'
    ) {
      fail('Phase 3P.4 requires VEC3 point positions and normals.')
    }

    if (positionReader.accessor.count !== normalReader.accessor.count) {
      fail('Point position/normal counts do not match.')
    }

    const position = new Vector3()
    const normal = new Vector3()

    for (let index = 0; index < positionReader.accessor.count; index += 1) {
      position
        .set(
          positionReader.get(index, 0),
          positionReader.get(index, 1),
          positionReader.get(index, 2),
        )
        .applyMatrix4(worldMatrix)

      normal
        .set(
          normalReader.get(index, 0),
          normalReader.get(index, 1),
          normalReader.get(index, 2),
        )
        .applyMatrix3(normalMatrix)
        .normalize()

      positions.push(position.x, position.y, position.z)
      normals.push(normal.x, normal.y, normal.z)
    }

    primitiveReports.push({
      nodeIndex,
      nodeName: node.name ?? null,
      meshIndex: node.mesh,
      meshName: mesh.name ?? null,
      primitiveIndex,
      pointCount: positionReader.accessor.count,
    })
  }
}

if (positions.length === 0) {
  fail('No POINTS primitives were extracted.')
}

const ply = writeBinaryPly(positions, normals)
await writeFile(outputPath, ply)

const boundsMin = [Infinity, Infinity, Infinity]
const boundsMax = [-Infinity, -Infinity, -Infinity]

for (let index = 0; index < positions.length; index += 3) {
  for (let axis = 0; axis < 3; axis += 1) {
    const value = positions[index + axis]
    boundsMin[axis] = Math.min(boundsMin[axis], value)
    boundsMax[axis] = Math.max(boundsMax[axis], value)
  }
}

const report = {
  schemaVersion: 1,
  source: {
    path: inputPath,
    bytes: sourceBytes.length,
    sha256: createHash('sha256').update(sourceBytes).digest('hex'),
  },
  extraction: {
    pointCount: positions.length / 3,
    primitiveCount: primitiveReports.length,
    attributes: ['POSITION', 'NORMAL'],
    transformsApplied: true,
    normalTransform: 'inverse-transpose world matrix',
    bounds: {
      min: boundsMin,
      max: boundsMax,
      size: boundsMax.map((value, index) => value - boundsMin[index]),
    },
    primitives: primitiveReports,
  },
  output: {
    path: outputPath,
    format: 'binary_little_endian PLY',
    bytes: ply.length,
    sha256: createHash('sha256').update(ply).digest('hex'),
  },
}

await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`)
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
