import { describe, expect, it } from 'vitest'

import {
  ambientSoundLabel,
  ambientSoundPressed,
  type AmbientSoundState,
} from './useAmbientSound'

describe('ambient sound UI state', () => {
  const cases: Array<[AmbientSoundState, string, boolean]> = [
    ['off', 'Sound off', false],
    ['on', 'Sound on', true],
    ['paused', 'Sound paused', true],
    ['unavailable', 'Sound unavailable', false],
  ]

  for (const [state, label, pressed] of cases) {
    it(`maps ${state} to its accessible UI state`, () => {
      expect(ambientSoundLabel(state)).toBe(label)
      expect(ambientSoundPressed(state)).toBe(pressed)
    })
  }
})
