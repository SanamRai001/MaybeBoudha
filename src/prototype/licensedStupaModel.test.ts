import { describe, expect, it } from 'vitest'

import {
  BOUDHA_TARGET_FOOTPRINT_METERS,
  BOUDHA_TARGET_HEIGHT_METERS,
} from './licensedStupaModel'
import { licensedModelRequested } from './prototypeModelMode'

describe('licensedModelRequested', () => {
  it('uses the uploaded licensed Boudhanath geometry by default', () => {
    expect(licensedModelRequested('')).toBe(true)
  })

  it('keeps an explicit procedural comparison route', () => {
    expect(licensedModelRequested('?model=procedural')).toBe(false)
  })

  it('accepts the explicit licensed route used by CI', () => {
    expect(licensedModelRequested('?model=licensed')).toBe(true)
  })
})


describe('licensed Boudhanath visual scale target', () => {
  it('keeps the documented height while preserving a broad mandala footprint', () => {
    expect(BOUDHA_TARGET_HEIGHT_METERS).toBe(43.25)
    expect(BOUDHA_TARGET_FOOTPRINT_METERS).toBeCloseTo(
      Math.sqrt(6756),
      1,
    )
    expect(
      BOUDHA_TARGET_FOOTPRINT_METERS / BOUDHA_TARGET_HEIGHT_METERS,
    ).toBeGreaterThan(1.8)
  })
})
