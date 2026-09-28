export const POINT_CLOUD_SOURCE = {
  title: 'BOUDHANATH STUPA - POINTCLOUD',
  author: 'Enea Le Fons',
  sketchfabHandle: '@enealefons',
  modelUid: 'ba7da7bbf6cc4ce9ab17ce66bc9597a1',
  sourceUrl:
    'https://sketchfab.com/3d-models/boudhanath-stupa-pointcloud-ba7da7bbf6cc4ce9ab17ce66bc9597a1',
  repositoryPath: 'boudhanath_stupa_-_pointcloud.glb',
  repositoryBytes: 4_002_328,
  licenseLabel: 'Creative Commons Attribution',
  noAi: true,
} as const

export const POINT_CLOUD_ASSET_URL = new URL(
  '../../boudhanath_stupa_-_pointcloud.glb',
  import.meta.url,
).href
