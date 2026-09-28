import { readFile, readdir, stat } from 'node:fs/promises'
import { join, resolve } from 'node:path'

const [distArg, baseArg] = process.argv.slice(2)
const dist = resolve(distArg || 'dist')
const base = baseArg || '/MaybeBoudha/'

if (!base.startsWith('/') || !base.endsWith('/')) {
  throw new Error(`Expected deployment base must start/end with "/": ${base}`)
}

const index = await readFile(join(dist, 'index.html'), 'utf8')

const requiredIndexFragments = [
  `href="${base}site.webmanifest"`,
  `src="${base}assets/`,
]

for (const fragment of requiredIndexFragments) {
  if (!index.includes(fragment)) {
    throw new Error(`Pages build is missing expected index fragment: ${fragment}`)
  }
}

for (const path of [
  'site.webmanifest',
  'robots.txt',
  'images/boudha-surroundings.jpg',
  'models/boudha/mbv2-0.b64',
  'models/boudha/mbv2-1.b64',
  'models/boudha/mbv2-2.b64',
  'models/boudha/mbv2-3.b64',
]) {
  const info = await stat(join(dist, path))
  if (!info.isFile() || info.size <= 0) {
    throw new Error(`Required Pages asset is missing or empty: ${path}`)
  }
}

const manifest = JSON.parse(
  await readFile(join(dist, 'site.webmanifest'), 'utf8'),
)

if (manifest.start_url !== '.' || manifest.scope !== '.') {
  throw new Error('Web manifest must keep relative start_url and scope for project Pages.')
}

async function collectJavaScript(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await collectJavaScript(path)))
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(path)
    }
  }

  return files
}

const suspicious = [
  '"/images/',
  "'/images/",
  '"/models/',
  "'/models/",
  '"/generated/',
  "'/generated/",
]

for (const path of await collectJavaScript(dist)) {
  const source = await readFile(path, 'utf8')

  for (const pattern of suspicious) {
    if (source.includes(pattern)) {
      throw new Error(
        `Pages build still contains root-absolute asset reference ${pattern} in ${path}`,
      )
    }
  }
}

console.log(
  JSON.stringify(
    {
      base,
      indexBytes: Buffer.byteLength(index),
      manifestStartUrl: manifest.start_url,
      manifestScope: manifest.scope,
      status: 'pages-build-valid',
    },
    null,
    2,
  ),
)
