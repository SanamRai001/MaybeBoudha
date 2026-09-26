import { describe, expect, it } from 'vitest'

import {
  PLAYCANVAS_SPZ_PARSER_URL,
  PLAYCANVAS_TAG_COMMIT,
  PLAYCANVAS_ZSTD_WASM_URL,
  rendererCandidateFromSearch,
} from './playcanvasSpike'

describe('PlayCanvas renderer spike configuration', () => {
  it('pins parser and wasm support to the PlayCanvas release commit', () => {
    expect(PLAYCANVAS_TAG_COMMIT).toMatch(/^[a-f0-9]{40}$/)
    expect(PLAYCANVAS_SPZ_PARSER_URL).toContain(PLAYCANVAS_TAG_COMMIT)
    expect(PLAYCANVAS_ZSTD_WASM_URL).toContain(PLAYCANVAS_TAG_COMMIT)
  })

  it('selects Spark by default and PlayCanvas only when requested', () => {
    expect(rendererCandidateFromSearch('')).toBe('spark')
    expect(rendererCandidateFromSearch('?renderer=spark')).toBe('spark')
    expect(rendererCandidateFromSearch('?renderer=playcanvas')).toBe('playcanvas')
    expect(rendererCandidateFromSearch('?renderer=unknown')).toBe('spark')
  })
})
