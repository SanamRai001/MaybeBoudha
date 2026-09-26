export const SPARK_VERSION = '2.2.0'

export const TEST_ASSET = {
  label: 'PlayCanvas biker',
  format: 'SPZ v4',
  bytes: 2_242_956,
  sourceRepository: 'playcanvas/engine',
  sourceCommit: 'b5b983982a9860d21e0c1dafb2f85f72e2c01afb',
  url: 'https://cdn.jsdelivr.net/gh/playcanvas/engine@b5b983982a9860d21e0c1dafb2f85f72e2c01afb/examples/assets/splats/biker.spz',
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
