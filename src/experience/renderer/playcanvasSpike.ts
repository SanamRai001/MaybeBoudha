export const PLAYCANVAS_VERSION = '2.22.4'

export const PLAYCANVAS_MODULE_URL =
  'https://cdn.jsdelivr.net/npm/playcanvas@2.22.4/+esm'

export type RendererCandidate = 'spark' | 'playcanvas'

export function rendererCandidateFromSearch(search: string): RendererCandidate {
  return new URLSearchParams(search).get('renderer') === 'playcanvas'
    ? 'playcanvas'
    : 'spark'
}
