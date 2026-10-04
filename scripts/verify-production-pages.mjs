const [baseArg] = process.argv.slice(2)

if (!baseArg) {
  console.error('Usage: node scripts/verify-production-pages.mjs <base-url>')
  process.exit(2)
}

const baseUrl = new URL(baseArg)

if (!baseUrl.pathname.endsWith('/')) {
  throw new Error(`Production base URL must end with "/": ${baseUrl.href}`)
}

const expectedCanonical = baseUrl.href
const expectedSocial = new URL('images/social-preview.png', baseUrl).href

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(url, options = {}, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  let lastError

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        cache: 'no-store',
        ...options,
      })

      if (response.ok) {
        return response
      }

      lastError = new Error(`HTTP ${response.status} for ${url}`)
    } catch (error) {
      lastError = error
    }

    await sleep(2_000)
  }

  throw lastError ?? new Error(`Timed out fetching ${url}`)
}

function requireFragment(source, fragment, label) {
  if (!source.includes(fragment)) {
    throw new Error(`Production HTML missing ${label}: ${fragment}`)
  }
}

function resolveAsset(value) {
  return new URL(value, baseUrl).href
}

async function fetchReleaseHtml(timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs
  let lastError

  while (Date.now() < deadline) {
    try {
      const response = await fetchWithRetry(baseUrl.href, {}, 10_000)
      const html = await response.text()

      requireFragment(
        html,
        `<link rel="canonical" href="${expectedCanonical}" />`,
        'canonical URL',
      )
      requireFragment(
        html,
        `<meta property="og:url" content="${expectedCanonical}" />`,
        'Open Graph URL',
      )
      requireFragment(
        html,
        `<meta property="og:image" content="${expectedSocial}" />`,
        'Open Graph image',
      )
      requireFragment(
        html,
        `<meta name="twitter:image" content="${expectedSocial}" />`,
        'Twitter image',
      )

      return { response, html }
    } catch (error) {
      lastError = error
      await sleep(2_000)
    }
  }

  throw lastError ?? new Error('Timed out waiting for release metadata.')
}

const { response: rootResponse, html } = await fetchReleaseHtml()

const manifestResponse = await fetchWithRetry(new URL('site.webmanifest', baseUrl))
const manifest = await manifestResponse.json()

if (manifest.start_url !== '.' || manifest.scope !== '.') {
  throw new Error('Production web manifest must keep relative start_url and scope.')
}

const assetMatches = [
  ...html.matchAll(/(?:src|href)="([^"]+(?:\.js|\.css))"/g),
].map((match) => match[1])

if (assetMatches.length === 0) {
  throw new Error('No production JS/CSS assets were discovered in the deployed HTML.')
}

const assetUrls = [...new Set(assetMatches.map(resolveAsset))]
const expectedAssetPrefix = `${baseUrl.origin}${baseUrl.pathname}`

for (const url of assetUrls) {
  if (!url.startsWith(expectedAssetPrefix)) {
    throw new Error(`Production asset escaped the project path: ${url}`)
  }
}

const checkedAssets = []

for (const url of assetUrls) {
  const response = await fetchWithRetry(url)
  const body = await response.arrayBuffer()
  const contentType = response.headers.get('content-type') ?? ''
  const expectedType = new URL(url).pathname.endsWith('.js')
    ? /(?:javascript|ecmascript)/i
    : /text\/css/i

  if (!expectedType.test(contentType)) {
    throw new Error(`Production asset has incorrect MIME type (${contentType}): ${url}`)
  }

  if (body.byteLength <= 0) {
    throw new Error(`Production asset was empty: ${url}`)
  }

  checkedAssets.push({
    url,
    bytes: body.byteLength,
    contentType,
    cacheControl: response.headers.get('cache-control'),
    etag: response.headers.get('etag'),
    lastModified: response.headers.get('last-modified'),
  })
}

const socialResponse = await fetchWithRetry(expectedSocial)
const socialBytes = await socialResponse.arrayBuffer()

if (socialBytes.byteLength <= 0) {
  throw new Error('Production social-preview image was empty.')
}

const panoramaResponse = await fetchWithRetry(
  new URL('images/boudha-surroundings.jpg', baseUrl),
)
const panoramaBytes = await panoramaResponse.arrayBuffer()

if (panoramaBytes.byteLength <= 0) {
  throw new Error('Production panorama image was empty.')
}

console.log(
  JSON.stringify(
    {
      status: 'production-pages-valid',
      baseUrl: baseUrl.href,
      root: {
        contentType: rootResponse.headers.get('content-type'),
        cacheControl: rootResponse.headers.get('cache-control'),
        etag: rootResponse.headers.get('etag'),
        lastModified: rootResponse.headers.get('last-modified'),
      },
      manifest: {
        startUrl: manifest.start_url,
        scope: manifest.scope,
        contentType: manifestResponse.headers.get('content-type'),
        cacheControl: manifestResponse.headers.get('cache-control'),
      },
      socialPreview: {
        url: expectedSocial,
        bytes: socialBytes.byteLength,
        contentType: socialResponse.headers.get('content-type'),
        cacheControl: socialResponse.headers.get('cache-control'),
      },
      panorama: {
        bytes: panoramaBytes.byteLength,
        contentType: panoramaResponse.headers.get('content-type'),
        cacheControl: panoramaResponse.headers.get('cache-control'),
      },
      assets: checkedAssets,
    },
    null,
    2,
  ),
)
