import { createHash } from 'node:crypto'
import { readFile, readdir, stat, writeFile } from 'node:fs/promises'
import { basename, join, resolve } from 'node:path'

const [sourcePathArg, outputDirArg, manifestPathArg] = process.argv.slice(2)

if (!sourcePathArg || !outputDirArg || !manifestPathArg) {
  console.error(
    'Usage: node scripts/rad/create-manifest.mjs <source.ply> <output-dir> <manifest.json>',
  )
  process.exit(2)
}

const sourcePath = resolve(sourcePathArg)
const outputDir = resolve(outputDirArg)
const manifestPath = resolve(manifestPathArg)

async function sha256(path) {
  const bytes = await readFile(path)
  return createHash('sha256').update(bytes).digest('hex')
}

const outputNames = (await readdir(outputDir))
  .filter((name) => name.endsWith('.rad') || name.endsWith('.radc'))
  .sort()

if (!outputNames.some((name) => name.endsWith('.rad'))) {
  throw new Error('RAD build did not produce a .rad header file.')
}

const outputFiles = []
let totalOutputBytes = 0

for (const name of outputNames) {
  const path = join(outputDir, name)
  const info = await stat(path)
  totalOutputBytes += info.size

  outputFiles.push({
    name,
    bytes: info.size,
    sha256: await sha256(path),
  })
}

const sourceInfo = await stat(sourcePath)
const builderCommit =
  process.env.SPARK_BUILDER_COMMIT ||
  '4eb719afdb5b3655fe0bc290588e4728d9772405'

const manifest = {
  schemaVersion: 1,
  fixture: {
    sourceRepository: 'playcanvas/engine',
    sourceCommit: 'b5b983982a9860d21e0c1dafb2f85f72e2c01afb',
    sourceFile: basename(sourcePath),
    bytes: sourceInfo.size,
    sha256: await sha256(sourcePath),
  },
  builder: {
    repository: 'sparkjsdev/spark',
    commit: builderCommit,
    sparkVersion: '2.2.0',
    rustToolchain: process.env.RUST_TOOLCHAIN || '1.82.0',
    command:
      'cargo run --manifest-path rust/build-lod/Cargo.toml --release --no-default-features -- --quality --rad-chunked <source>',
    method: 'quality',
    output: 'rad-chunked',
    defaultFeatures: false,
  },
  output: {
    fileCount: outputFiles.length,
    chunkCount: outputFiles.filter((file) => file.name.endsWith('.radc')).length,
    totalBytes: totalOutputBytes,
    files: outputFiles,
  },
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(JSON.stringify(manifest, null, 2))
