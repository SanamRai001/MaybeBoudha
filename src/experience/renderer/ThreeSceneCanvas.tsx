import { Canvas } from '@react-three/fiber'

import type { SceneRendererProps } from '../ExperienceViewport'
import { OrbitCameraControls } from '../camera/OrbitCameraControls'
import { PlaceholderScene } from '../scene/PlaceholderScene'
import { ViewerFallback } from '../ui/ViewerFallback'

export function ThreeSceneCanvas({ reducedMotion }: SceneRendererProps) {
  return (
    <Canvas
      camera={{
        position: [5.2, 3.2, 6.8],
        fov: 42,
        near: 0.1,
        far: 100,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      fallback={
        <ViewerFallback
          title="3D rendering is unavailable."
          description="The renderer could not start on this device. The final experience will provide a lightweight non-3D fallback."
        />
      }
    >
      <color attach="background" args={['#0d100f']} />
      <fog attach="fog" args={['#0d100f', 10, 22]} />

      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 7, 5]} intensity={2.5} />

      <PlaceholderScene />
      <OrbitCameraControls reducedMotion={reducedMotion} />
    </Canvas>
  )
}
