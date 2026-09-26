import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { ExperienceViewport, type SceneRendererProps } from './ExperienceViewport'
import { shouldForceSceneFailure } from './scene/prepareScene'

function TestRenderer({ reducedMotion }: SceneRendererProps) {
  return (
    <div data-testid="renderer-surface" data-reduced-motion={String(reducedMotion)}>
      renderer ready
    </div>
  )
}

describe('ExperienceViewport', () => {
  it('moves from the loading state into an injected renderer surface', async () => {
    const prepareScene = vi.fn(async () => undefined)

    render(
      <ExperienceViewport
        reducedMotion={false}
        prepareScene={prepareScene}
        renderer={TestRenderer}
      />,
    )

    expect(screen.getByRole('status').textContent).toContain('Preparing scene')
    expect(await screen.findByTestId('renderer-surface')).not.toBeNull()
    expect(prepareScene).toHaveBeenCalledTimes(1)
  })

  it('shows a recoverable fallback when scene preparation fails', async () => {
    const prepareScene = vi
      .fn()
      .mockRejectedValueOnce(new Error('forced scene failure'))
      .mockResolvedValueOnce(undefined)

    render(
      <ExperienceViewport
        reducedMotion={true}
        prepareScene={prepareScene}
        renderer={TestRenderer}
      />,
    )

    const fallback = await screen.findByRole('alert')
    expect(fallback.textContent).toContain('The 3D scene could not load.')
    expect(fallback.textContent).toContain('forced scene failure')

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }))

    const renderer = await screen.findByTestId('renderer-surface')
    expect(renderer.getAttribute('data-reduced-motion')).toBe('true')
    expect(prepareScene).toHaveBeenCalledTimes(2)
  })
})

describe('shouldForceSceneFailure', () => {
  it('recognizes the manual failure verification query parameter', () => {
    expect(shouldForceSceneFailure('?scene=fail')).toBe(true)
    expect(shouldForceSceneFailure('?scene=ready')).toBe(false)
    expect(shouldForceSceneFailure('')).toBe(false)
  })
})
