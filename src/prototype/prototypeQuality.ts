export type PrototypeQualityTier = 'mobile' | 'balanced' | 'high'

export type PrototypeQualityInput = {
  viewportWidth: number
  devicePixelRatio: number
  hardwareConcurrency?: number
  deviceMemoryGb?: number
}

export type PrototypeQualityProfile = {
  tier: PrototypeQualityTier
  maxPixelRatio: number
  shadowMapSize: 1024 | 1536 | 2048
  maxAnisotropy: number
  flagMotionScale: number
}

function finitePositive(value: number | undefined) {
  return Number.isFinite(value) && (value ?? 0) > 0
}

export function resolvePrototypeQuality(
  input: PrototypeQualityInput,
): PrototypeQualityProfile {
  const width = Math.max(1, input.viewportWidth)
  const dpr = Math.max(1, input.devicePixelRatio)
  const cores = finitePositive(input.hardwareConcurrency)
    ? input.hardwareConcurrency!
    : 8
  const memory = finitePositive(input.deviceMemoryGb)
    ? input.deviceMemoryGb!
    : 8

  const constrained =
    width <= 720 ||
    cores <= 4 ||
    memory <= 4

  if (constrained) {
    return {
      tier: 'mobile',
      maxPixelRatio: Math.min(dpr, 1.15),
      shadowMapSize: 1024,
      maxAnisotropy: 4,
      flagMotionScale: 0.72,
    }
  }

  const highCapability =
    width >= 1180 &&
    cores >= 8 &&
    memory >= 8

  if (highCapability) {
    return {
      tier: 'high',
      maxPixelRatio: Math.min(dpr, 1.6),
      shadowMapSize: 2048,
      maxAnisotropy: 8,
      flagMotionScale: 1,
    }
  }

  return {
    tier: 'balanced',
    maxPixelRatio: Math.min(dpr, 1.35),
    shadowMapSize: 1536,
    maxAnisotropy: 6,
    flagMotionScale: 0.86,
  }
}

export function browserPrototypeQuality(): PrototypeQualityProfile {
  const nav = navigator as Navigator & {
    deviceMemory?: number
  }

  return resolvePrototypeQuality({
    viewportWidth: window.innerWidth,
    devicePixelRatio: window.devicePixelRatio || 1,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemoryGb: nav.deviceMemory,
  })
}
