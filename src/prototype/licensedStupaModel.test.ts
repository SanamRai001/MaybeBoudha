import { describe, expect, it } from 'vitest'

import { licensedModelRequested } from './prototypeModelMode'

describe('licensedModelRequested', () => {
  it('keeps the procedural monument as the default', () => {
    expect(licensedModelRequested('')).toBe(false)
  })

  it('allows an explicit licensed-model preview route', () => {
    expect(licensedModelRequested('?model=licensed')).toBe(true)
  })
})
