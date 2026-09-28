import { describe, expect, it } from 'vitest'
import {
  BufferGeometry,
  Float32BufferAttribute,
} from 'three'

import {
  createSelectiveDomeGeometry,
  SELECTIVE_DOME_REGION,
} from './selectiveSurfaceHybrid'

function geometryWithTriangles() {
  const geometry = new BufferGeometry()

  geometry.setAttribute(
    'position',
    new Float32BufferAttribute(
      [
        // Broad ground triangle: must be rejected.
        -20, 0, -20,
        20, 0, -20,
        0, 0, 20,

        // Dome/body triangle after normalization: must survive.
        -3, 4, 0,
        3, 4, 0,
        0, 8, 1,

        // Upper structure triangle: must be rejected.
        -1, 19, 0,
        1, 19, 0,
        0, 20, 1,
      ],
      3,
    ),
  )

  return geometry
}

describe('createSelectiveDomeGeometry', () => {
  it('removes ground and upper-structure triangles while retaining the body', () => {
    const source = geometryWithTriangles()

    const { geometry, metadata } = createSelectiveDomeGeometry(source)

    expect(metadata.sourceTriangles).toBe(3)
    expect(metadata.selectedTriangles).toBe(1)
    expect(metadata.region).toEqual(SELECTIVE_DOME_REGION)
    expect(geometry.getAttribute('position').count).toBe(3)

    geometry.dispose()
    source.dispose()
  })

  it('produces GPU-safe float32 positions', () => {
    const source = geometryWithTriangles()

    const { geometry } = createSelectiveDomeGeometry(source)

    expect(geometry.getAttribute('position').array).toBeInstanceOf(Float32Array)

    geometry.dispose()
    source.dispose()
  })
})
