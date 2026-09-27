export type ExperienceMode = 'prototype' | 'technical'

export function experienceModeFromSearch(search: string): ExperienceMode {
  const params = new URLSearchParams(search)
  return params.has('renderer') ? 'technical' : 'prototype'
}
