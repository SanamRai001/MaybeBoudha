import { describe, expect, it } from 'vitest'

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
