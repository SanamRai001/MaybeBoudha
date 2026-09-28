import {
  BufferAttribute,
  BufferGeometry,
} from 'three'
import { describe, expect, it } from 'vitest'

import { prepareSurfaceGeometryForWebGL } from './surfaceGeometry'

describe('prepareSurfaceGeometryForWebGL', () => {
  it('converts Float64 PLY positions into GPU-safe Float32 attributes', () => {
    const geometry = new BufferGeometry()

    geometry.setAttribute(
      'position',
      new BufferAttribute(
        new Float64Array([
          0, 0, 0,
          1, 0, 0,
          0, 1, 0,
        ]),
        3,
      ),
    )
    geometry.setAttribute(
      'normal',
      new BufferAttribute(
        new Float64Array([
          0, 0, 1,
          0, 0, 1,
          0, 0, 1,
        ]),
        3,
      ),
    )

    prepareSurfaceGeometryForWebGL(geometry)

    expect(geometry.getAttribute('position').array).toBeInstanceOf(Float32Array)
    expect(geometry.getAttribute('normal').array).toBeInstanceOf(Float32Array)
    expect(Array.from(geometry.getAttribute('position').array)).toEqual([
      0, 0, 0,
      1, 0, 0,
      0, 1, 0,
    ])
  })
})
