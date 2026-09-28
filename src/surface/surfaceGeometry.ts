import {
  BufferGeometry,
  Float32BufferAttribute,
} from 'three'

function coerceAttributeToFloat32(
  geometry: BufferGeometry,
  name: string,
) {
  const attribute = geometry.getAttribute(name)

  if (!attribute || attribute.array instanceof Float32Array) {
    return
  }

  geometry.setAttribute(
    name,
    new Float32BufferAttribute(
      Float32Array.from(attribute.array),
      attribute.itemSize,
      attribute.normalized,
    ),
  )
}

export function prepareSurfaceGeometryForWebGL(
  geometry: BufferGeometry,
) {
  coerceAttributeToFloat32(geometry, 'position')
  coerceAttributeToFloat32(geometry, 'normal')
  geometry.computeVertexNormals()

  return geometry
}
