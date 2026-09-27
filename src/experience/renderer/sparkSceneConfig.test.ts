import { describe, expect, it } from 'vitest'

import {
  DEFAULT_RAD_SCENE_URL,
  sparkSceneConfigFromSearch,
} from './sparkSceneConfig'
import { TEST_ASSET } from './sparkSpike'

describe('sparkSceneConfigFromSearch', () => {
  it('uses the pinned PLY fixture by default', () => {
    expect(sparkSceneConfigFromSearch('')).toEqual({
      mode: 'fixture',
      label: TEST_ASSET.label,
      format: TEST_ASSET.format,
      url: TEST_ASSET.url,
      paged: false,
      bytes: TEST_ASSET.bytes,
    })
  })

  it('selects paged RAD delivery for the Phase 3B runtime proof', () => {
    expect(sparkSceneConfigFromSearch('?renderer=rad')).toEqual({
      mode: 'rad',
      label: 'Generated Spark LOD fixture',
      format: 'paged RAD',
      url: DEFAULT_RAD_SCENE_URL,
      paged: true,
      bytes: null,
    })
  })

  it('allows an explicit generated RAD URL and label', () => {
    const config = sparkSceneConfigFromSearch(
      '?renderer=rad&scene=%2Frad%2Fscene.rad&label=CI+RAD',
    )

    expect(config.url).toBe('/rad/scene.rad')
    expect(config.label).toBe('CI RAD')
    expect(config.paged).toBe(true)
  })
})
