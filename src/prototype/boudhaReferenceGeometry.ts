export const BOUDHA_TOTAL_HEIGHT_METERS = 43.25
export const BOUDHA_DOME_DIAMETER_METERS = 120 * 0.3048
export const BOUDHA_DOME_RADIUS_METERS = BOUDHA_DOME_DIAMETER_METERS / 2

// Gutschow's architectural dimensions are quoted by Tevonian (2024):
// lowest plinth 270.20 ft × 272.40 ft. Keep the two axes independently rather
// than turning the published area into an invented square dimension.
export const BOUDHA_BASE_FOOTPRINT_X_METERS = 270.2 * 0.3048
export const BOUDHA_BASE_FOOTPRINT_Z_METERS = 272.4 * 0.3048
export const BOUDHA_BASE_FOOTPRINT_MAX_METERS = Math.max(
  BOUDHA_BASE_FOOTPRINT_X_METERS,
  BOUDHA_BASE_FOOTPRINT_Z_METERS,
)

export const BOUDHA_DOME_BASE_Y_METERS = 5.15
export const BOUDHA_DOME_TOP_Y_METERS = 23.2

// The photo references consistently show the harmika at roughly 30% of the
// dome diameter, much broader than the old 7.2 m synthetic cube.
export const BOUDHA_HARMIKA_WIDTH_METERS = 10.8
export const BOUDHA_EYE_PANEL_WIDTH_METERS = 10.0

export const BOUDHA_REFERENCE_DOME_PROFILE = [
  [0.0, 1.0],
  [0.08, 0.995],
  [0.18, 0.98],
  [0.3, 0.94],
  [0.42, 0.88],
  [0.54, 0.79],
  [0.66, 0.68],
  [0.78, 0.55],
  [0.88, 0.44],
  [0.96, 0.34],
  [1.0, 0.3],
] as const

export function referenceDomeRadiusMeters(normalizedHeight: number) {
  const height = Math.max(0, Math.min(1, normalizedHeight))

  for (
    let index = 1;
    index < BOUDHA_REFERENCE_DOME_PROFILE.length;
    index += 1
  ) {
    const [nextHeight, nextRadius] = BOUDHA_REFERENCE_DOME_PROFILE[index]
    const [previousHeight, previousRadius] =
      BOUDHA_REFERENCE_DOME_PROFILE[index - 1]

    if (height <= nextHeight) {
      const span = nextHeight - previousHeight
      const progress =
        span <= 0 ? 0 : (height - previousHeight) / span

      return (
        (previousRadius +
          (nextRadius - previousRadius) * progress) *
        BOUDHA_DOME_RADIUS_METERS
      )
    }
  }

  return (
    BOUDHA_REFERENCE_DOME_PROFILE[
      BOUDHA_REFERENCE_DOME_PROFILE.length - 1
    ][1] * BOUDHA_DOME_RADIUS_METERS
  )
}

export function referenceDomeYMetres(normalizedHeight: number) {
  const height = Math.max(0, Math.min(1, normalizedHeight))

  return (
    BOUDHA_DOME_BASE_Y_METERS +
    (BOUDHA_DOME_TOP_Y_METERS - BOUDHA_DOME_BASE_Y_METERS) * height
  )
}
