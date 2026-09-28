import { spawn } from 'node:child_process'
import { writeFile } from 'node:fs/promises'

const [renderer, outputPath] = process.argv.slice(2)

if (!['spark', 'playcanvas', 'rad', 'prototype', 'prototype-mobile', 'prototype-reduced', 'licensed', 'pointcloud', 'surface', 'selective'].includes(renderer) || !outputPath) {
  console.error('Usage: node scripts/runtime-smoke.mjs <spark|playcanvas|rad|prototype|prototype-mobile|prototype-reduced|licensed|pointcloud|surface|selective> <output.png>')
  process.exit(2)
}

const chrome = process.env.CHROME
if (!chrome) {
  console.error('CHROME environment variable is required.')
  process.exit(2)
}

const port =
  renderer === 'spark' ? 9222 :
  renderer === 'playcanvas' ? 9223 :
  renderer === 'rad' ? 9224 :
  renderer === 'prototype' ? 9225 :
  renderer === 'licensed' ? 9226 :
  renderer === 'pointcloud' ? 9227 :
  renderer === 'surface' ? 9228 :
  renderer === 'selective' ? 9229 :
  renderer === 'prototype-mobile' ? 9230 :
  9231
const targetUrl = ['prototype', 'prototype-mobile', 'prototype-reduced'].includes(renderer)
  ? 'http://127.0.0.1:4173/'
  : renderer === 'licensed'
    ? 'http://127.0.0.1:4173/?model=licensed'
    : renderer === 'pointcloud'
      ? 'http://127.0.0.1:4173/?pointcloud=1'
      : renderer === 'surface'
        ? 'http://127.0.0.1:4173/?surface=1'
        : renderer === 'selective'
          ? 'http://127.0.0.1:4173/?selective=1'
          : `http://127.0.0.1:4173/?renderer=${renderer}`
const headful = process.env.MAYBEBOUDHA_HEADFUL === '1'
const browserArgs = [
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--ignore-gpu-blocklist',
  '--enable-webgl',
  '--window-size=1440,1000',
  `--remote-debugging-port=${port}`,
  'about:blank',
]

if (headful) {
  browserArgs.unshift('--use-gl=desktop')
} else {
  // Let Chromium select its normal headless GL implementation. Forcing a
  // specific ANGLE/SwiftShader backend exposed raw WebGL2 but made
  // THREE.WebGLRenderer fail to bind that context.
  browserArgs.unshift(
    '--headless=new',
    '--enable-unsafe-swiftshader',
  )
}

const browser = spawn(
  chrome,
  browserArgs,
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
        const prototype = document.querySelector('[data-prototype-state]')?.getAttribute('data-prototype-state')
        const pointcloud = document.querySelector('[data-pointcloud-state]')?.getAttribute('data-pointcloud-state')
        const surface = document.querySelector('[data-surface-state]')?.getAttribute('data-surface-state')
        const error = document.querySelector('.viewer-state-error')?.innerText ?? null
        return {
          state: spark ?? playcanvas ?? prototype ?? pointcloud ?? surface ?? null,
          error,
          mode: document.querySelector('[data-splat-mode]')?.getAttribute('data-splat-mode') ?? null,
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


async function waitForPrototypeHome(client, timeoutMs = 8_000) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const state = await evaluate(
      client,
      `(() => ({
        cameraState: document.querySelector('.prototype-canvas')?.getAttribute('data-camera-state') ?? null,
        resetToken: Number(document.querySelector('.prototype-page')?.getAttribute('data-reset-view-token') ?? -1),
      }))()`,
    )

    if (state?.cameraState === 'home') {
      return state
    }

    await sleep(100)
  }

  throw new Error('Prototype camera did not return to the home view.')
}

async function pressKey(client, key, code, virtualKeyCode) {
  const event = {
    key,
    code,
    windowsVirtualKeyCode: virtualKeyCode,
    nativeVirtualKeyCode: virtualKeyCode,
  }

  await client.send('Input.dispatchKeyEvent', {
    type: 'keyDown',
    ...event,
  })
  await client.send('Input.dispatchKeyEvent', {
    type: 'keyUp',
    ...event,
  })
}

async function verifyPrototypeControls(client) {
  const before = await evaluate(
    client,
    `(() => ({
      focusPressed: document.querySelector('.prototype-focus-toggle')?.getAttribute('aria-pressed'),
      resetToken: Number(document.querySelector('.prototype-page')?.getAttribute('data-reset-view-token') ?? -1),
      resetDisabled: document.querySelector('.prototype-reset-view')?.disabled ?? true,
    }))()`,
  )

  if (!before || before.resetDisabled || before.focusPressed !== 'false') {
    throw new Error(`Prototype controls were not ready: ${JSON.stringify(before)}`)
  }

  await evaluate(
    client,
    `document.querySelector('.prototype-focus-toggle')?.focus()`,
  )
  await pressKey(client, 'Enter', 'Enter', 13)
  await sleep(80)

  const focusOn = await evaluate(
    client,
    `(() => ({
      active: document.querySelector('.prototype-page')?.classList.contains('is-focus-mode') ?? false,
      pressed: document.querySelector('.prototype-focus-toggle')?.getAttribute('aria-pressed'),
    }))()`,
  )

  if (!focusOn?.active || focusOn.pressed !== 'true') {
    throw new Error(`Focus mode did not activate: ${JSON.stringify(focusOn)}`)
  }

  await pressKey(client, 'Enter', 'Enter', 13)
  await sleep(80)

  const focusOff = await evaluate(
    client,
    `(() => ({
      active: document.querySelector('.prototype-page')?.classList.contains('is-focus-mode') ?? true,
      pressed: document.querySelector('.prototype-focus-toggle')?.getAttribute('aria-pressed'),
    }))()`,
  )

  if (focusOff?.active || focusOff?.pressed !== 'false') {
    throw new Error(`Focus mode did not restore story view: ${JSON.stringify(focusOff)}`)
  }

  await evaluate(
    client,
    `document.querySelector('.prototype-reset-view')?.focus()`,
  )
  await pressKey(client, 'Enter', 'Enter', 13)
  await sleep(80)

  const afterClick = await evaluate(
    client,
    `Number(document.querySelector('.prototype-page')?.getAttribute('data-reset-view-token') ?? -1)`,
  )

  if (afterClick !== before.resetToken + 1) {
    throw new Error(
      `Reset view token did not advance: before=${before.resetToken} after=${afterClick}`,
    )
  }

  const home = await waitForPrototypeHome(client)
  console.log('[prototype] interaction proof:', JSON.stringify({ focusOn, focusOff, home }))
}

async function verifyMobileLayout(client) {
  const layout = await evaluate(
    client,
    `(() => {
      const root = document.documentElement
      const focus = document.querySelector('.prototype-focus-toggle')?.getBoundingClientRect()
      const reset = document.querySelector('.prototype-reset-view')?.getBoundingClientRect()
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        scrollWidth: root.scrollWidth,
        scrollHeight: root.scrollHeight,
        focusVisible: Boolean(focus && focus.width > 0 && focus.right <= window.innerWidth + 1),
        resetVisible: Boolean(reset && reset.width > 0 && reset.right <= window.innerWidth + 1),
      }
    })()`,
  )

  if (
    !layout ||
    layout.scrollWidth > layout.innerWidth + 1 ||
    !layout.focusVisible ||
    !layout.resetVisible
  ) {
    throw new Error(`Mobile layout overflow/control failure: ${JSON.stringify(layout)}`)
  }

  console.log('[prototype-mobile] layout proof:', JSON.stringify(layout))
}

async function verifyMobileTouchInteraction(client) {
  const point = await evaluate(
    client,
    `(() => {
      const rect = document.querySelector('.prototype-canvas')?.getBoundingClientRect()
      if (!rect) return null
      return {
        x: rect.left + rect.width * 0.55,
        y: rect.top + rect.height * 0.48,
      }
    })()`,
  )

  if (!point) {
    throw new Error('Prototype canvas was unavailable for touch proof.')
  }

  const touch = (x, y) => ({
    x,
    y,
    radiusX: 2,
    radiusY: 2,
    force: 1,
    id: 1,
  })

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [touch(point.x, point.y)],
  })
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchMove',
    touchPoints: [touch(point.x - 42, point.y + 18)],
  })
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  })
  await sleep(160)

  const cameraState = await evaluate(
    client,
    `document.querySelector('.prototype-canvas')?.getAttribute('data-camera-state') ?? null`,
  )

  if (cameraState !== 'explore') {
    throw new Error(`Touch orbit did not enter explore state: ${cameraState}`)
  }

  await evaluate(
    client,
    `document.querySelector('.prototype-reset-view')?.focus()`,
  )
  await pressKey(client, 'Enter', 'Enter', 13)
  const home = await waitForPrototypeHome(client)

  console.log(
    '[prototype-mobile] touch proof:',
    JSON.stringify({ cameraState, home }),
  )
}

async function verifyReducedMotion(client) {
  const state = await evaluate(
    client,
    `(() => ({
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      cameraState: document.querySelector('.prototype-canvas')?.getAttribute('data-camera-state') ?? null,
      footer: document.querySelector('.prototype-controls')?.textContent ?? '',
    }))()`,
  )

  if (
    !state?.prefersReducedMotion ||
    state.cameraState !== 'home' ||
    !state.footer.includes('Reduced motion')
  ) {
    throw new Error(`Reduced-motion proof failed: ${JSON.stringify(state)}`)
  }

  console.log('[prototype-reduced] motion proof:', JSON.stringify(state))
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

  if (renderer === 'prototype-mobile') {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      screenWidth: 390,
      screenHeight: 844,
    })
    await client.send('Emulation.setTouchEmulationEnabled', {
      enabled: true,
      maxTouchPoints: 5,
    })
    await client.send('Page.reload', { ignoreCache: true })
  }

  if (renderer === 'prototype-reduced') {
    await client.send('Emulation.setEmulatedMedia', {
      features: [
        {
          name: 'prefers-reduced-motion',
          value: 'reduce',
        },
      ],
    })
    await client.send('Page.reload', { ignoreCache: true })
  }

  const capabilities = await evaluate(
    client,
    `(() => {
      const webglCanvas = document.createElement('canvas')
      const webgl2Canvas = document.createElement('canvas')
      return {
        webgl: Boolean(webglCanvas.getContext('webgl')),
        webgl2: Boolean(webgl2Canvas.getContext('webgl2')),
        userAgent: navigator.userAgent,
      }
    })()`,
  )
  console.log(`[${renderer}] graphics capabilities:`, JSON.stringify(capabilities))

  const state = await waitForRenderer(client)
  console.log(`[${renderer}] renderer state:`, JSON.stringify(state))

  if (['prototype', 'prototype-mobile', 'prototype-reduced'].includes(renderer)) {
    await verifyPrototypeControls(client)
  }

  if (renderer === 'prototype-mobile') {
    await verifyMobileLayout(client)
    await verifyMobileTouchInteraction(client)
  }

  if (renderer === 'prototype-reduced') {
    await verifyReducedMotion(client)
  }

  await sleep(1_000)

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
