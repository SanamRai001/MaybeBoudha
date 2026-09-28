export type ExperienceMode = 'prototype' | 'technical' | 'pointcloud'

export function experienceModeFromSearch(search: string): ExperienceMode {
  const params = new URLSearchParams(search)

  if (params.get('pointcloud') === '1') {
    return 'pointcloud'
  }

  return params.has('renderer') ? 'technical' : 'prototype'
}
