import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

type OrbitCameraControlsProps = {
  reducedMotion: boolean
  target?: [number, number, number]
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
}

export function OrbitCameraControls({
  reducedMotion,
  target = [0, 1.15, 0],
  minDistance = 4.2,
  maxDistance = 11,
  minPolarAngle = 0.35,
  maxPolarAngle = Math.PI * 0.48,
}: OrbitCameraControlsProps) {
  const { camera, gl } = useThree()
  const [targetX, targetY, targetZ] = target

  const controls = useMemo(
    () => new OrbitControls(camera, gl.domElement),
    [camera, gl.domElement],
  )

  useEffect(() => {
    controls.enablePan = false
    controls.dampingFactor = 0.065
    controls.minDistance = minDistance
    controls.maxDistance = maxDistance
    controls.minPolarAngle = minPolarAngle
    controls.maxPolarAngle = maxPolarAngle
    controls.target.set(targetX, targetY, targetZ)
    controls.update()

    return () => controls.dispose()
  }, [
    controls,
    maxDistance,
    maxPolarAngle,
    minDistance,
    minPolarAngle,
    targetX,
    targetY,
    targetZ,
  ])

  useEffect(() => {
    controls.enableDamping = !reducedMotion
    controls.update()
  }, [controls, reducedMotion])

  useFrame(() => {
    if (controls.enableDamping) {
      controls.update()
    }
  })

  return null
}
