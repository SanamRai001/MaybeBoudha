import { describe, expect, it } from 'vitest'

import { experienceModeFromSearch } from './experienceMode'

describe('experienceModeFromSearch', () => {
  it('uses the visual prototype by default', () => {
    expect(experienceModeFromSearch('')).toBe('prototype')
  })

  it('selects the licensed point-cloud spike explicitly', () => {
    expect(experienceModeFromSearch('?pointcloud=1')).toBe('pointcloud')
  })

  it('keeps renderer query modes available for engineering verification', () => {
    expect(experienceModeFromSearch('?renderer=spark')).toBe('technical')
    expect(experienceModeFromSearch('?renderer=rad')).toBe('technical')
    expect(experienceModeFromSearch('?renderer=playcanvas')).toBe('technical')
  })
})
