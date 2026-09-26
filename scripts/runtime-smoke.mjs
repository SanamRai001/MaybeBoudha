import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

const [renderer, outputPath] = process.argv.slice(2)

if (!['spark', 'playcanvas'].includes(renderer) || !outputPath) {
  console.error('Usage: node scripts/runtime-smoke.mjs <spark|playcanvas> <output.png>')
  process.exit(2)
}

const chrome = process.env.CHROME
if (!chrome) {
  console.error('CHROME environment variable is required.')
  process.exit(2)
}

const port = renderer === 'spark' ? 9222 : 9223
const targetUrl = `http://127.0.0.1:4173/?renderer=${renderer}`
const browser = spawn(
  chrome,
  [
    '--headless=new',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--ignore-gpu-blocklist',
    '--disable-gpu-sandbox',
    '--enable-webgl',
    '--enable-unsafe-swiftshader',
    '--window-size=1440,1000',
    `--remote-debugging-port=${port}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)

browser.stdout.on('data', (chunk) => process.stdout.write(chunk))
browser.stderr.on('data', (chunk) => process.stderr.write(chunk))

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForJson(url, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs
  let lastError

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return await response.json()
      }
    } catch (error) {
      lastError = error
    }

    await sleep(200)
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`)
}

async function createPage() {
  const response = await fetch(
    `http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`,
    { method: 'PUT' },
  )

  if (!response.ok) {
    throw new Error(`Failed to create Chromium page: HTTP ${response.status}`)
  }

  return response.json()
}

function createCdpClient(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  const consoleLines = []

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)

    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id)
      pending.delete(message.id)

      if (message.error) {
        reject(new Error(message.error.message))
      } else {
        resolve(message.result)
      }
      return
    }

    if (message.method === 'Runtime.consoleAPICalled') {
      const args = message.params.args
        .map((arg) => arg.value ?? arg.description ?? '')
        .join(' ')
      consoleLines.push(`console.${message.params.type}: ${args}`)
    }

    if (message.method === 'Runtime.exceptionThrown') {
      consoleLines.push(
        `exception: ${message.params.exceptionDetails.text} ${message.params.exceptionDetails.exception?.description ?? ''}`,
      )
    }

    if (message.method === 'Log.entryAdded') {
      const entry = message.params.entry
      consoleLines.push(`log.${entry.level}: ${entry.text}`)
    }
  })

  function send(method, params = {}) {
    const requestId = ++id

    return new Promise((resolve, reject) => {
      pending.set(requestId, { resolve, reject })
      socket.send(JSON.stringify({ id: requestId, method, params }))
    })
  }

  return {
    opened,
    send,
    consoleLines,
    close: () => socket.close(),
  }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })

  return result.result?.value
}

async function waitForRenderer(client, timeoutMs = 45_000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const snapshot = await evaluate(
      client,
      `(() => {
        const spark = document.querySelector('[data-splat-state]')?.getAttribute('data-splat-state')
        const playcanvas = document.querySelector('[data-playcanvas-state]')?.getAttribute('data-playcanvas-state')
        const error = document.querySelector('.viewer-state-error')?.innerText ?? null
        return {
          state: spark ?? playcanvas ?? null,
          error,
          title: document.title,
        }
      })()`,
    )

    if (snapshot?.error) {
      throw new Error(`Renderer entered fallback state: ${snapshot.error}`)
    }

    if (snapshot?.state === 'ready') {
      return snapshot
    }

    await sleep(250)
  }

  throw new Error(`Renderer did not reach ready state within ${timeoutMs / 1000}s`)
}

async function withTimeout(promise, timeoutMs, label) {
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${timeoutMs / 1000}s`)),
      timeoutMs,
    )
  })

  try {
    return await Promise.race([promise, timeout])
  } finally {
    clearTimeout(timer)
  }
}

let client

try {
  await waitForJson(`http://127.0.0.1:${port}/json/version`)
  const page = await createPage()

  client = createCdpClient(page.webSocketDebuggerUrl)
  await client.opened

  await client.send('Runtime.enable')
  await client.send('Page.enable')
  await client.send('Log.enable')

  const state = await waitForRenderer(client)
  console.log(`[${renderer}] renderer state:`, JSON.stringify(state))

  await sleep(2_000)

  const capture = await withTimeout(
    client.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    }),
    15_000,
    'DevTools screenshot capture',
  )

  await writeFile(outputPath, Buffer.from(capture.data, 'base64'))
  console.log(`[${renderer}] screenshot written to ${outputPath}`)

  if (client.consoleLines.length > 0) {
    console.log(`[${renderer}] browser diagnostics:`)
    for (const line of client.consoleLines) {
      console.log(line)
    }
  }
} catch (error) {
  console.error(`[${renderer}] runtime smoke failed:`, error)

  if (client?.consoleLines.length) {
    console.error(`[${renderer}] browser diagnostics:`)
    for (const line of client.consoleLines) {
      console.error(line)
    }
  }

  process.exitCode = 1
} finally {
  client?.close()
  browser.kill('SIGTERM')

  await Promise.race([
    new Promise((resolve) => browser.once('exit', resolve)),
    sleep(2_000),
  ])

  if (browser.exitCode === null) {
    browser.kill('SIGKILL')
  }
}
