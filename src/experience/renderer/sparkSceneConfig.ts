import { TEST_ASSET } from './sparkSpike'

export type SparkSceneConfig = {
  mode: 'fixture' | 'rad'
  label: string
  format: string
  url: string
  paged: boolean
  bytes: number | null
}

export const DEFAULT_RAD_SCENE_URL = '/rad/biker.compressed-lod.rad'

export function sparkSceneConfigFromSearch(search: string): SparkSceneConfig {
  const params = new URLSearchParams(search)

  if (params.get('renderer') === 'rad') {
    return {
      mode: 'rad',
      label: params.get('label') || 'Generated Spark LOD fixture',
      format: 'paged RAD',
      url: params.get('scene') || DEFAULT_RAD_SCENE_URL,
      paged: true,
      bytes: null,
    }
  }

  return {
    mode: 'fixture',
    label: TEST_ASSET.label,
    format: TEST_ASSET.format,
    url: TEST_ASSET.url,
    paged: false,
    bytes: TEST_ASSET.bytes,
  }
}
