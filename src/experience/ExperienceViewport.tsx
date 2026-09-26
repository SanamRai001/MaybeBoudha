import { useEffect, useState } from 'react'

import { LoadingState } from './ui/LoadingState'
import { ViewerFallback } from './ui/ViewerFallback'
import { RendererErrorBoundary } from './renderer/RendererErrorBoundary'
import { ThreeSceneCanvas } from './renderer/ThreeSceneCanvas'
import {
  isAbortError,
  preparePlaceholderScene,
  type ScenePreparer,
} from './scene/prepareScene'

type ExperienceStatus =
  | { state: 'loading' }
  | { state: 'ready' }
  | { state: 'error'; error: Error }

type ExperienceViewportProps = {
  reducedMotion: boolean
  prepareScene?: ScenePreparer
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error('Unknown scene loading error')
}

export function ExperienceViewport({
  reducedMotion,
  prepareScene = preparePlaceholderScene,
}: ExperienceViewportProps) {
  const [attempt, setAttempt] = useState(0)
  const [status, setStatus] = useState<ExperienceStatus>({ state: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    setStatus({ state: 'loading' })

    void prepareScene(controller.signal)
      .then(() => {
        if (!controller.signal.aborted) {
          setStatus({ state: 'ready' })
        }
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !isAbortError(error)) {
          setStatus({ state: 'error', error: toError(error) })
        }
      })

    return () => controller.abort()
  }, [attempt, prepareScene])

  if (status.state === 'loading') {
    return <LoadingState />
  }

  if (status.state === 'error') {
    return (
      <ViewerFallback
        title="The 3D scene could not load."
        description={status.error.message}
        actionLabel="Try again"
        onAction={() => setAttempt((currentAttempt) => currentAttempt + 1)}
      />
    )
  }

  return (
    <RendererErrorBoundary
      key={attempt}
      fallback={(error) => (
        <ViewerFallback
          title="The renderer stopped unexpectedly."
          description={error.message}
          actionLabel="Restart viewer"
          onAction={() => setAttempt((currentAttempt) => currentAttempt + 1)}
        />
      )}
    >
      <ThreeSceneCanvas reducedMotion={reducedMotion} />
    </RendererErrorBoundary>
  )
}
