import { describe, expect, it } from 'vitest'

import { resolvePrototypeQuality } from './prototypeQuality'

describe('resolvePrototypeQuality', () => {
  it('uses a restrained mobile profile on narrow viewports', () => {
    expect(
      resolvePrototypeQuality({
        viewportWidth: 390,
        devicePixelRatio: 3,
        hardwareConcurrency: 8,
        deviceMemoryGb: 8,
      }),
    ).toEqual({
      tier: 'mobile',
      maxPixelRatio: 1.15,
      shadowMapSize: 1024,
      maxAnisotropy: 4,
      flagMotionScale: 0.72,
    })
  })

  it('uses the mobile profile for low-memory devices even on wider screens', () => {
    expect(
      resolvePrototypeQuality({
        viewportWidth: 1024,
        devicePixelRatio: 2,
        hardwareConcurrency: 8,
        deviceMemoryGb: 4,
      }).tier,
    ).toBe('mobile')
  })

  it('uses the high profile on capable desktop hardware', () => {
    expect(
      resolvePrototypeQuality({
        viewportWidth: 1440,
        devicePixelRatio: 2,
        hardwareConcurrency: 12,
        deviceMemoryGb: 16,
      }),
    ).toEqual({
      tier: 'high',
      maxPixelRatio: 1.6,
      shadowMapSize: 2048,
      maxAnisotropy: 8,
      flagMotionScale: 1,
    })
  })

  it('uses a balanced middle tier without oversampling the device DPR', () => {
    expect(
      resolvePrototypeQuality({
        viewportWidth: 980,
        devicePixelRatio: 1.25,
        hardwareConcurrency: 6,
        deviceMemoryGb: 8,
      }),
    ).toEqual({
      tier: 'balanced',
      maxPixelRatio: 1.25,
      shadowMapSize: 1536,
      maxAnisotropy: 6,
      flagMotionScale: 0.86,
    })
  })
})
