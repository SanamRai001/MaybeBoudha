import { describe, expect, it } from 'vitest'

import { experienceModeFromSearch } from './experienceMode'

describe('experienceModeFromSearch', () => {
  it('uses the visual prototype by default', () => {
    expect(experienceModeFromSearch('')).toBe('prototype')
  })

  it('keeps renderer query modes available for engineering verification', () => {
    expect(experienceModeFromSearch('?renderer=spark')).toBe('technical')
    expect(experienceModeFromSearch('?renderer=rad')).toBe('technical')
    expect(experienceModeFromSearch('?renderer=playcanvas')).toBe('technical')
  })
})
