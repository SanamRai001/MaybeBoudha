export const PLAYCANVAS_VERSION = '2.22.4'

export const PLAYCANVAS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/playcanvas@2.22.4/+esm'

export type RendererCandidate = 'spark' | 'playcanvas' | 'rad'

export function rendererCandidateFromSearch(search: string): RendererCandidate {
  const renderer = new URLSearchParams(search).get('renderer')

  if (renderer === 'playcanvas') {
    return 'playcanvas'
  }

  if (renderer === 'rad') {
    return 'rad'
  }

  return 'spark'
}
