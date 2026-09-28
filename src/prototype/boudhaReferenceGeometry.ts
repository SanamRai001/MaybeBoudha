export const BOUDHA_TOTAL_HEIGHT_METERS = 43.25
export const BOUDHA_DOME_DIAMETER_METERS = 120 * 0.3048
export const BOUDHA_DOME_RADIUS_METERS =
  BOUDHA_DOME_DIAMETER_METERS / 2

// Gutschow's architectural dimensions are quoted by Tevonian (2024):
// lowest plinth 270.20 ft × 272.40 ft. Keep the two axes independently rather
// than turning the published area into an invented square dimension.
export const BOUDHA_BASE_FOOTPRINT_X_METERS = 270.2 * 0.3048
export const BOUDHA_BASE_FOOTPRINT_Z_METERS = 272.4 * 0.3048
export const BOUDHA_BASE_FOOTPRINT_MAX_METERS = Math.max(
  BOUDHA_BASE_FOOTPRINT_X_METERS,
  BOUDHA_BASE_FOOTPRINT_Z_METERS,
)

// Dowman-derived descriptions cited by later architectural studies give the
// three plinths as ~7 ft, 6 ft, 6 ft and the drum as ~4 ft. Their cumulative
// height is the reference-backed spring line for the dome.
export const BOUDHA_PLINTH_HEIGHTS_METERS = [
  7 * 0.3048,
  6 * 0.3048,
  6 * 0.3048,
] as const
export const BOUDHA_DRUM_HEIGHT_METERS = 4 * 0.3048
export const BOUDHA_DOME_BASE_Y_METERS =
  BOUDHA_PLINTH_HEIGHTS_METERS.reduce(
    (sum, height) => sum + height,
    0,
  ) + BOUDHA_DRUM_HEIGHT_METERS

// Keep the existing harmika bottom alignment so this focused phase changes the
// dome/body and lower transition without moving the full upper monument.
export const BOUDHA_DOME_TOP_Y_METERS = 23.2

// The photo references consistently show the harmika at roughly 30% of the
// dome diameter, much broader than the old 7.2 m synthetic cube.
export const BOUDHA_HARMIKA_WIDTH_METERS = 10.8
export const BOUDHA_EYE_PANEL_WIDTH_METERS = 10.0

export const BOUDHA_DOME_CROWN_RADIUS_METERS =
  BOUDHA_HARMIKA_WIDTH_METERS / 2
export const BOUDHA_DOME_CROWN_RADIUS_RATIO =
  BOUDHA_DOME_CROWN_RADIUS_METERS / BOUDHA_DOME_RADIUS_METERS

// Boudhanath is repeatedly described architecturally as a hemispherical dome.
// We therefore use a smooth truncated-hemisphere profile instead of manually
// guessing several independent radius anchors. The sphere is truncated where
// its radius matches the harmika footprint.
export const BOUDHA_DOME_TRUNCATED_SPHERE_TOP_Y =
  Math.sqrt(1 - BOUDHA_DOME_CROWN_RADIUS_RATIO ** 2)

export function referenceDomeRadiusMeters(
  normalizedHeight: number,
) {
  const height = Math.max(0, Math.min(1, normalizedHeight))
  const sphereY =
    height * BOUDHA_DOME_TRUNCATED_SPHERE_TOP_Y

  return (
    BOUDHA_DOME_RADIUS_METERS *
    Math.sqrt(Math.max(0, 1 - sphereY ** 2))
  )
}

export const BOUDHA_REFERENCE_DOME_PROFILE = Array.from(
  { length: 17 },
  (_, index) => {
    const normalizedHeight = index / 16

    return [
      normalizedHeight,
      referenceDomeRadiusMeters(normalizedHeight) /
        BOUDHA_DOME_RADIUS_METERS,
    ] as const
  },
)

export function referenceDomeYMetres(
  normalizedHeight: number,
) {
  const height = Math.max(0, Math.min(1, normalizedHeight))

  return (
    BOUDHA_DOME_BASE_Y_METERS +
    (BOUDHA_DOME_TOP_Y_METERS - BOUDHA_DOME_BASE_Y_METERS) *
      height
  )
}

export const BOUDHA_SOURCE_BASE_OVERLAP_METERS = 0.45
export const BOUDHA_SOURCE_BASE_HEIGHT_FRACTION =
  (BOUDHA_DOME_BASE_Y_METERS + BOUDHA_SOURCE_BASE_OVERLAP_METERS) /
  BOUDHA_TOTAL_HEIGHT_METERS
