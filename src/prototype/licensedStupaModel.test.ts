import { describe, expect, it } from 'vitest'

import {
  BOUDHA_TARGET_FOOTPRINT_METERS,
  BOUDHA_TARGET_HEIGHT_METERS,
  boudhaMiddleProfileScale,
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


describe('boudhaMiddleProfileScale', () => {
  it('keeps the terraces stable while giving the dome a fuller belly', () => {
    expect(boudhaMiddleProfileScale(0.05)).toBeCloseTo(1, 3)
    expect(boudhaMiddleProfileScale(0.2)).toBeGreaterThan(1.04)
    expect(boudhaMiddleProfileScale(0.4)).toBeGreaterThan(1.3)
    expect(boudhaMiddleProfileScale(0.55)).toBeGreaterThan(1.18)
    expect(boudhaMiddleProfileScale(0.7)).toBeCloseTo(1, 3)
  })

  it('clamps out-of-range normalized heights safely', () => {
    expect(boudhaMiddleProfileScale(-1)).toBeCloseTo(1, 3)
    expect(boudhaMiddleProfileScale(2)).toBeCloseTo(1, 3)
  })
})
