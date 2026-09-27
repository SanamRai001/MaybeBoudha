import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve, sep } from 'node:path'

const root = resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 4173)

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.rad', 'application/octet-stream'],
  ['.radc', 'application/octet-stream'],
])

function resolveRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0])
  const normalized = normalize(decoded).replace(/^[/\\]+/, '')
  const path = resolve(join(root, normalized || 'index.html'))

  if (path !== root && !path.startsWith(`${root}${sep}`)) {
    throw new Error('Path escapes static root.')
  }

  return path
}

async function serveFile(request, response, path) {
  const info = await stat(path)
  const range = request.headers.range
  const contentType = contentTypes.get(extname(path)) || 'application/octet-stream'

  response.setHeader('Accept-Ranges', 'bytes')
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Content-Type', contentType)

  if (!range) {
    response.statusCode = 200
    response.setHeader('Content-Length', info.size)
    createReadStream(path).pipe(response)
    return
  }

  const match = /^bytes=(\d+)-(\d*)$/.exec(range)

  if (!match) {
    response.statusCode = 416
    response.setHeader('Content-Range', `bytes */${info.size}`)
    response.end()
    return
  }

  const start = match[1] ? Number(match[1]) : 0
  const end = match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1

  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start ||
    start >= info.size
  ) {
    response.statusCode = 416
    response.setHeader('Content-Range', `bytes */${info.size}`)
    response.end()
    return
  }

  response.statusCode = 206
  response.setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`)
  response.setHeader('Content-Length', end - start + 1)
  createReadStream(path, { start, end }).pipe(response)
}

const server = createServer(async (request, response) => {
  if (!request.url || request.method !== 'GET') {
    response.statusCode = 405
    response.end()
    return
  }

  try {
    const requestPath = resolveRequestPath(request.url)

    try {
      await serveFile(request, response, requestPath)
    } catch {
      // Browser navigation belongs to the SPA, while scene/chunk requests must
      // fail honestly rather than being replaced by index.html.
      if (
        request.url.startsWith('/rad/') ||
        request.url.includes('.rad') ||
        request.url.includes('.radc')
      ) {
        response.statusCode = 404
        response.end('Not found')
        return
      }

      await serveFile(request, response, join(root, 'index.html'))
    }
  } catch (error) {
    response.statusCode = 400
    response.end(error instanceof Error ? error.message : 'Bad request')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`RAD fixture server listening on http://127.0.0.1:${port}`)
})
