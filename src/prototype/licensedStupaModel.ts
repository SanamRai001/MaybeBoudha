import {
  Box3,
  BufferAttribute,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

const TARGET_HEIGHT_METERS = 43.25

function colorForNormalizedHeight(value: number) {
  if (value >= 0.64) {
    return new Color('#c69237')
  }

  if (value >= 0.57) {
    return new Color('#bb8a38')
  }

  return new Color('#e9e2d7')
}

function addHeightColors(
  positions: BufferAttribute,
  minY: number,
  height: number,
) {
  const colors = new Float32Array(positions.count * 3)

  for (let index = 0; index < positions.count; index += 1) {
    const y = positions.getY(index)
    const normalized = (y - minY) / Math.max(height, Number.EPSILON)
    const color = colorForNormalizedHeight(normalized)

    colors[index * 3] = color.r
    colors[index * 3 + 1] = color.g
    colors[index * 3 + 2] = color.b
  }

  return new BufferAttribute(colors, 3)
}

export async function loadLicensedStupaModel(url: string) {
  const loader = new STLLoader()
  const geometry = await loader.loadAsync(url)

  geometry.computeVertexNormals()

  const sourceBounds = new Box3().setFromBufferAttribute(
    geometry.getAttribute('position') as BufferAttribute,
  )
  const sourceSize = sourceBounds.getSize(new Vector3())

  if (!Number.isFinite(sourceSize.y) || sourceSize.y <= 0) {
    geometry.dispose()
    throw new Error('Licensed Boudhanath STL has an invalid height.')
  }

  geometry.setAttribute(
    'color',
    addHeightColors(
      geometry.getAttribute('position') as BufferAttribute,
      sourceBounds.min.y,
      sourceSize.y,
    ),
  )

  const material = new MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.76,
    metalness: 0.08,
  })

  const mesh = new Mesh(geometry, material)
  mesh.castShadow = true
  mesh.receiveShadow = true

  const scale = TARGET_HEIGHT_METERS / sourceSize.y
  mesh.scale.setScalar(scale)

  const scaledBounds = new Box3().setFromObject(mesh)
  const center = scaledBounds.getCenter(new Vector3())

  mesh.position.x -= center.x
  mesh.position.z -= center.z
  mesh.position.y -= scaledBounds.min.y

  const group = new Group()
  group.name = 'licensed-boudhanath-stupa'
  group.add(mesh)

  return {
    group,
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
