import { describe, expect, it } from 'vitest'

import { formatBytes, progressSnapshot, TEST_ASSET } from './sparkSpike'

describe('renderer spike helpers', () => {
  it('keeps the shared upstream test asset pinned to a concrete commit', () => {
    expect(TEST_ASSET.sourceCommit).toMatch(/^[a-f0-9]{40}$/)
    expect(TEST_ASSET.url).toContain(TEST_ASSET.sourceCommit)
    expect(TEST_ASSET.sourceRepository).toBe('playcanvas/engine')
    expect(TEST_ASSET.format).toBe('compressed PLY')
    expect(TEST_ASSET.bytes).toBeGreaterThan(2_000_000)
  })

  it('formats the sample payload size for the metrics panel', () => {
    expect(formatBytes(TEST_ASSET.bytes)).toBe('2.4 MB')
    expect(formatBytes(0)).toBe('0 B')
  })

  it('normalizes computable and non-computable progress events', () => {
    const computable = progressSnapshot(
      new ProgressEvent('progress', {
        lengthComputable: true,
        loaded: 50,
        total: 200,
      }),
    )

    expect(computable).toEqual({
      loadedBytes: 50,
      totalBytes: 200,
      percent: 25,
    })

    const unknown = progressSnapshot(
      new ProgressEvent('progress', {
        lengthComputable: false,
        loaded: 50,
        total: 0,
      }),
    )

    expect(unknown).toEqual({
      loadedBytes: 50,
      totalBytes: null,
      percent: null,
    })
  })
})
