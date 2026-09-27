import { describe, expect, it } from 'vitest'

import {
  PLAYCANVAS_MODULE_URL,
  PLAYCANVAS_VERSION,
  rendererCandidateFromSearch,
} from './playcanvasSpike'

describe('PlayCanvas renderer spike configuration', () => {
  it('pins the PlayCanvas runtime version', () => {
    expect(PLAYCANVAS_VERSION).toBe('2.22.4')
    expect(PLAYCANVAS_MODULE_URL).toContain('playcanvas@2.22.4')
  })

  it('selects Spark by default and PlayCanvas only when requested', () => {
    expect(rendererCandidateFromSearch('')).toBe('spark')
    expect(rendererCandidateFromSearch('?renderer=spark')).toBe('spark')
    expect(rendererCandidateFromSearch('?renderer=playcanvas')).toBe('playcanvas')
    expect(rendererCandidateFromSearch('?renderer=unknown')).toBe('spark')
  })
})
