import { describe, expect, it } from 'vitest'

import {
  BOUDHA_BASE_FOOTPRINT_X_METERS,
  BOUDHA_BASE_FOOTPRINT_Z_METERS,
  BOUDHA_DOME_BASE_Y_METERS,
  BOUDHA_DOME_CROWN_RADIUS_METERS,
  BOUDHA_DOME_DIAMETER_METERS,
  BOUDHA_DOME_RADIUS_METERS,
  BOUDHA_DOME_TRUNCATED_SPHERE_TOP_Y,
  BOUDHA_DRUM_HEIGHT_METERS,
  BOUDHA_HARMIKA_WIDTH_METERS,
  BOUDHA_PLINTH_HEIGHTS_METERS,
  BOUDHA_REFERENCE_DOME_PROFILE,
  BOUDHA_SOURCE_BASE_HEIGHT_FRACTION,
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
  })

  it('places the dome above the cited plinth and drum heights', () => {
    expect(BOUDHA_PLINTH_HEIGHTS_METERS).toEqual([
      7 * 0.3048,
      6 * 0.3048,
      6 * 0.3048,
    ])
    expect(BOUDHA_DRUM_HEIGHT_METERS).toBeCloseTo(
      4 * 0.3048,
      6,
    )
    expect(BOUDHA_DOME_BASE_Y_METERS).toBeCloseTo(7.0104, 4)
    expect(BOUDHA_SOURCE_BASE_HEIGHT_FRACTION).toBeGreaterThan(
      0.17,
    )
    expect(BOUDHA_SOURCE_BASE_HEIGHT_FRACTION).toBeLessThan(
      0.18,
    )
  })

  it('uses a smooth truncated-hemisphere dome instead of hand-tuned belly anchors', () => {
    expect(BOUDHA_DOME_TRUNCATED_SPHERE_TOP_Y).toBeGreaterThan(
      0.95,
    )
    expect(referenceDomeRadiusMeters(0)).toBeCloseTo(
      BOUDHA_DOME_RADIUS_METERS,
      6,
    )
    expect(referenceDomeRadiusMeters(0.5)).toBeCloseTo(
      16.06637,
      4,
    )
    expect(referenceDomeRadiusMeters(1)).toBeCloseTo(
      BOUDHA_DOME_CROWN_RADIUS_METERS,
      6,
    )

    for (
      let index = 1;
      index < BOUDHA_REFERENCE_DOME_PROFILE.length;
      index += 1
    ) {
      expect(
        BOUDHA_REFERENCE_DOME_PROFILE[index][1],
      ).toBeLessThanOrEqual(
        BOUDHA_REFERENCE_DOME_PROFILE[index - 1][1],
      )
    }
  })

  it('matches the dome crown to the harmika footprint', () => {
    expect(referenceDomeRadiusMeters(1) * 2).toBeCloseTo(
      BOUDHA_HARMIKA_WIDTH_METERS,
      6,
    )
  })
})
