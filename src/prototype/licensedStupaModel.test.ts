import { describe, expect, it } from 'vitest'

import {
  BOUDHA_BASE_FOOTPRINT_X_METERS,
  BOUDHA_BASE_FOOTPRINT_Z_METERS,
  BOUDHA_DOME_DIAMETER_METERS,
  BOUDHA_DOME_RADIUS_METERS,
  BOUDHA_HARMIKA_WIDTH_METERS,
  BOUDHA_REFERENCE_DOME_PROFILE,
  BOUDHA_TOTAL_HEIGHT_METERS,
  referenceDomeRadiusMeters,
} from './boudhaReferenceGeometry'
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

describe('reference-grounded Boudhanath geometry', () => {
  it('uses the published total height and 120 ft dome diameter', () => {
    expect(BOUDHA_TOTAL_HEIGHT_METERS).toBe(43.25)
    expect(BOUDHA_DOME_DIAMETER_METERS).toBeCloseTo(36.576, 3)
    expect(BOUDHA_DOME_RADIUS_METERS).toBeCloseTo(18.288, 3)
  })

  it('uses the cited lower-plinth dimensions instead of deriving a square from area', () => {
    expect(BOUDHA_BASE_FOOTPRINT_X_METERS).toBeCloseTo(82.35696, 4)
    expect(BOUDHA_BASE_FOOTPRINT_Z_METERS).toBeCloseTo(83.02752, 4)
    expect(BOUDHA_BASE_FOOTPRINT_X_METERS).not.toBe(
      Math.sqrt(6756),
    )
    expect(
      BOUDHA_BASE_FOOTPRINT_X_METERS / BOUDHA_DOME_DIAMETER_METERS,
    ).toBeGreaterThan(2.2)
    expect(
      BOUDHA_BASE_FOOTPRINT_Z_METERS / BOUDHA_DOME_DIAMETER_METERS,
    ).toBeLessThan(2.3)
  })

  it('keeps the traced dome profile broad and monotonically narrowing', () => {
    for (
      let index = 1;
      index < BOUDHA_REFERENCE_DOME_PROFILE.length;
      index += 1
    ) {
      expect(
        BOUDHA_REFERENCE_DOME_PROFILE[index][0],
      ).toBeGreaterThan(
        BOUDHA_REFERENCE_DOME_PROFILE[index - 1][0],
      )
      expect(
        BOUDHA_REFERENCE_DOME_PROFILE[index][1],
      ).toBeLessThanOrEqual(
        BOUDHA_REFERENCE_DOME_PROFILE[index - 1][1],
      )
    }

    expect(referenceDomeRadiusMeters(0)).toBeCloseTo(
      BOUDHA_DOME_RADIUS_METERS,
      3,
    )
    expect(referenceDomeRadiusMeters(0.54)).toBeCloseTo(
      BOUDHA_DOME_RADIUS_METERS * 0.79,
      3,
    )
  })

  it('matches the traced dome crown to the broader harmika', () => {
    const crownDiameter = referenceDomeRadiusMeters(1) * 2

    expect(crownDiameter).toBeCloseTo(
      BOUDHA_HARMIKA_WIDTH_METERS,
      0,
    )
  })
})
