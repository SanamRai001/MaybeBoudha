export type ExperienceMode = 'prototype' | 'technical' | 'pointcloud' | 'surface'

export function experienceModeFromSearch(search: string): ExperienceMode {
  const params = new URLSearchParams(search)

  if (params.get('surface') === '1') {
    return 'surface'
  }

  if (params.get('pointcloud') === '1') {
    return 'pointcloud'
  }

  return params.has('renderer') ? 'technical' : 'prototype'
}
