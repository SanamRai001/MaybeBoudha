export type ScenePreparer = (signal: AbortSignal) => Promise<void>

const PLACEHOLDER_PREPARE_DELAY_MS = 120

export function shouldForceSceneFailure(search: string) {
  return new URLSearchParams(search).get('scene') === 'fail'
}

function waitForPlaceholderPreparation(signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Scene preparation was aborted.', 'AbortError'))
      return
    }

    const handleAbort = () => {
      window.clearTimeout(timeoutId)
      reject(new DOMException('Scene preparation was aborted.', 'AbortError'))
    }

    const timeoutId = window.setTimeout(() => {
      signal.removeEventListener('abort', handleAbort)
      resolve()
    }, PLACEHOLDER_PREPARE_DELAY_MS)

    signal.addEventListener('abort', handleAbort, { once: true })
  })
}

export const preparePlaceholderScene: ScenePreparer = async (signal) => {
  await waitForPlaceholderPreparation(signal)

  if (shouldForceSceneFailure(window.location.search)) {
    throw new Error('The scene was intentionally failed to verify the recovery experience.')
  }
}

export function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}
