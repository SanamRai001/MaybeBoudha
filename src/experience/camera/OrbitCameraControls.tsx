import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type OrbitCameraControlsProps = {
  reducedMotion: boolean
}

export function OrbitCameraControls({ reducedMotion }: OrbitCameraControlsProps) {
  const { camera, gl } = useThree()

  const controls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    [camera, gl.domElement],
  )

  useEffect(() => {
    controls.enablePan = false
    controls.enableDamping = !reducedMotion
    controls.dampingFactor = 0.065
    controls.minDistance = 4.2
    controls.maxDistance = 11
    controls.minPolarAngle = 0.35
    controls.maxPolarAngle = Math.PI * 0.48
    controls.target.set(0, 1.15, 0)
    controls.update()

    return () => controls.dispose()
  }, [controls, reducedMotion])

  useFrame(() => {
    if (controls.enableDamping) {
      controls.update()
    }
  })

  return null
}
