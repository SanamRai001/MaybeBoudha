import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const [inputPath = 'boudhanath_stupa_-_pointcloud.glb', outputPath] =
  process.argv.slice(2)

const bytes = await readFile(inputPath)

function fail(message) {
  throw new Error(message)
}

if (bytes.length < 20) {
  fail('GLB is too small.')
}

if (bytes.toString('utf8', 0, 4) !== 'glTF') {
  fail('GLB magic header is missing.')
}

const version = bytes.readUInt32LE(4)
const declaredLength = bytes.readUInt32LE(8)

if (version !== 2) {
  fail(`Expected glTF 2, received version ${version}.`)
}

if (declaredLength !== bytes.length) {
  fail(
    `GLB declared length ${declaredLength} does not match file size ${bytes.length}.`,
  )
}

let offset = 12
let document = null
const chunks = []

while (offset + 8 <= bytes.length) {
  const byteLength = bytes.readUInt32LE(offset)
  const chunkType = bytes.readUInt32LE(offset + 4)
  const start = offset + 8
  const end = start + byteLength

  if (end > bytes.length) {
    fail('GLB chunk exceeds the file boundary.')
  }

  chunks.push({
    type:
      chunkType === 0x4e4f534a
        ? 'JSON'
        : chunkType === 0x004e4942
          ? 'BIN'
          : `0x${chunkType.toString(16)}`,
    byteLength,
  })

  if (chunkType === 0x4e4f534a) {
    document = JSON.parse(
      bytes
        .toString('utf8', start, end)
        .replace(/\0+$/u, '')
        .trim(),
    )
  }

  offset = end
}

if (!document) {
  fail('GLB JSON chunk was not found.')
}

const modeNames = new Map([
  [0, 'POINTS'],
  [1, 'LINES'],
  [2, 'LINE_LOOP'],
  [3, 'LINE_STRIP'],
  [4, 'TRIANGLES'],
  [5, 'TRIANGLE_STRIP'],
  [6, 'TRIANGLE_FAN'],
])

const accessors = document.accessors ?? []
let totalPointVertices = 0
let pointPrimitiveCount = 0

const meshes = (document.meshes ?? []).map((mesh, meshIndex) => ({
  index: meshIndex,
  name: mesh.name ?? null,
  primitives: (mesh.primitives ?? []).map((primitive, primitiveIndex) => {
    const mode = primitive.mode ?? 4
    const positionAccessorIndex = primitive.attributes?.POSITION
    const colorAccessorIndex = primitive.attributes?.COLOR_0
    const normalAccessorIndex = primitive.attributes?.NORMAL
    const positionAccessor =
      Number.isInteger(positionAccessorIndex)
        ? accessors[positionAccessorIndex]
        : null
    const colorAccessor =
      Number.isInteger(colorAccessorIndex)
        ? accessors[colorAccessorIndex]
        : null
    const normalAccessor =
      Number.isInteger(normalAccessorIndex)
        ? accessors[normalAccessorIndex]
        : null

    if (mode === 0 && positionAccessor) {
      pointPrimitiveCount += 1
      totalPointVertices += positionAccessor.count ?? 0
    }

    return {
      index: primitiveIndex,
      mode,
      modeName: modeNames.get(mode) ?? 'UNKNOWN',
      attributes: primitive.attributes ?? {},
      position: positionAccessor
        ? {
            count: positionAccessor.count,
            type: positionAccessor.type,
            componentType: positionAccessor.componentType,
            min: positionAccessor.min ?? null,
            max: positionAccessor.max ?? null,
          }
        : null,
      color: colorAccessor
        ? {
            count: colorAccessor.count,
            type: colorAccessor.type,
            componentType: colorAccessor.componentType,
            normalized: colorAccessor.normalized ?? false,
            min: colorAccessor.min ?? null,
            max: colorAccessor.max ?? null,
          }
        : null,
      normal: normalAccessor
        ? {
            count: normalAccessor.count,
            type: normalAccessor.type,
            componentType: normalAccessor.componentType,
          }
        : null,
    }
  }),
}))

const report = {
  schemaVersion: 1,
  file: {
    path: inputPath,
    bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  },
  gltf: {
    version,
    generator: document.asset?.generator ?? null,
    copyright: document.asset?.copyright ?? null,
    scene: document.scene ?? null,
    sceneCount: document.scenes?.length ?? 0,
    nodeCount: document.nodes?.length ?? 0,
    meshCount: document.meshes?.length ?? 0,
    accessorCount: accessors.length,
    bufferViewCount: document.bufferViews?.length ?? 0,
    extensionsUsed: document.extensionsUsed ?? [],
    extensionsRequired: document.extensionsRequired ?? [],
  },
  chunks,
  pointCloud: {
    primitiveCount: pointPrimitiveCount,
    pointCount: totalPointVertices,
  },
  meshes,
  nodes: (document.nodes ?? []).map((node, index) => ({
    index,
    name: node.name ?? null,
    mesh: node.mesh ?? null,
    translation: node.translation ?? null,
    rotation: node.rotation ?? null,
    scale: node.scale ?? null,
    matrix: node.matrix ?? null,
    children: node.children ?? [],
  })),
}

const json = `${JSON.stringify(report, null, 2)}\n`
process.stdout.write(json)

if (outputPath) {
  await writeFile(outputPath, json)
}
