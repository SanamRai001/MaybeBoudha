export const SPARK_VERSION = '2.2.0'

export const TEST_ASSET = {
  label: 'Niantic horned lizard',
  format: 'SPZ',
  bytes: 18_143_098,
  sourceRepository: 'nianticlabs/spz',
  sourceCommit: 'affd0ecea7fbb4c265ee119475af7ee5b2997482',
  url: 'https://cdn.jsdelivr.net/gh/nianticlabs/spz@affd0ecea7fbb4c265ee119475af7ee5b2997482/samples/hornedlizard.spz',
} as const

export type ProgressSnapshot = {
  loadedBytes: number
  totalBytes: number | null
  percent: number | null
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  )
  const value = bytes / 1024 ** unitIndex
  const precision = unitIndex >= 2 ? 1 : 0

  return `${value.toFixed(precision)} ${units[unitIndex]}`
}

export function progressSnapshot(event: ProgressEvent): ProgressSnapshot {
  const loadedBytes = Math.max(0, event.loaded)
  const totalBytes =
    event.lengthComputable && event.total > 0 ? event.total : null

  return {
    loadedBytes,
    totalBytes,
    percent:
      totalBytes === null
        ? null
        : Math.min(100, Math.max(0, (loadedBytes / totalBytes) * 100)),
  }
}
