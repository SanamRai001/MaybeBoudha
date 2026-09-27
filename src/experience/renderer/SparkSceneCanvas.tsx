import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  SparkRenderer as SparkRendererImpl,
  SplatMesh as SplatMeshImpl,
} from '@sparkjsdev/spark'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Object3D } from 'three'

import type { SceneRendererProps } from '../ExperienceViewport'
import { OrbitCameraControls } from '../camera/OrbitCameraControls'
import { ViewerFallback } from '../ui/ViewerFallback'
import {
  formatBytes,
  progressSnapshot,
  SPARK_VERSION,
  TEST_ASSET,
  type ProgressSnapshot,
} from './sparkSpike'

type RuntimeMetrics = {
  phase: 'asset' | 'ready' | 'error'
  progress: ProgressSnapshot | null
  loadMs: number | null
  numSplats: number | null
  fps: number | null
  error: string | null
}

const INITIAL_METRICS: RuntimeMetrics = {
  phase: 'asset',
  progress: null,
  loadMs: null,
  numSplats: null,
  fps: null,
  error: null,
}

const CAMERA_TARGET: [number, number, number] = [-1.5, 1.05, 0]
const CAMERA_POSITION: [number, number, number] = [0.6, 1.75, 3.4]

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

type SparkSceneContentProps = {
  onProgress: (progress: ProgressSnapshot) => void
  onLoaded: (loadMs: number, numSplats: number) => void
  onError: (message: string) => void
}

function SparkSceneContent({
  onProgress,
  onLoaded,
  onError,
}: SparkSceneContentProps) {
  const { gl, scene } = useThree()

  useEffect(() => {
    let disposed = false
    const startedAt = performance.now()

    const sparkRenderer = new SparkRendererImpl({ renderer: gl })
    const splat = new SplatMeshImpl({
      url: TEST_ASSET.url,
      editable: false,
      raycastable: false,
      onProgress: (event) => {
        if (!disposed) {
          onProgress(progressSnapshot(event))
        }
      },
    })

    splat.position.set(-1.5, 0.05, 0)
    splat.rotation.set(Math.PI, Math.PI / 2, 0)
    splat.scale.setScalar(0.7)

    scene.add(sparkRenderer as unknown as Object3D)
    scene.add(splat as unknown as Object3D)

    void splat.initialized
      .then((mesh) => {
        if (!disposed) {
          onLoaded(performance.now() - startedAt, mesh.numSplats)
        }
      })
      .catch((error: unknown) => {
        if (!disposed) {
          console.error('Spark splat initialization failed', error)
          onError(toErrorMessage(error))
        }
      })

    return () => {
      disposed = true
      scene.remove(splat as unknown as Object3D)
      scene.remove(sparkRenderer as unknown as Object3D)
      splat.dispose()
      sparkRenderer.dispose()
    }
  }, [gl, onError, onLoaded, onProgress, scene])

  return null
}

type FrameSamplerProps = {
  onSample: (fps: number) => void
}

function FrameSampler({ onSample }: FrameSamplerProps) {
  const sample = useRef({
    frames: 0,
    startedAt: performance.now(),
  })

  useFrame(() => {
    const now = performance.now()
    sample.current.frames += 1

    const elapsed = now - sample.current.startedAt
    if (elapsed < 1000) {
      return
    }

    onSample((sample.current.frames * 1000) / elapsed)
    sample.current = {
      frames: 0,
      startedAt: now,
    }
  })

  return null
}

function SparkMetrics({ metrics }: { metrics: RuntimeMetrics }) {
  const progressText =
    metrics.phase === 'ready'
      ? 'Ready'
      : metrics.progress?.percent !== null && metrics.progress
        ? `${metrics.progress.percent.toFixed(0)}%`
        : 'Loading asset'

  return (
    <aside className="splat-metrics" aria-label="Renderer spike metrics">
      <div>
        <span>Renderer</span>
        <strong>Spark {SPARK_VERSION}</strong>
      </div>
      <div>
        <span>Asset</span>
        <strong>
          {TEST_ASSET.format} · {formatBytes(TEST_ASSET.bytes)}
        </strong>
      </div>
      <div>
        <span>Status</span>
        <strong>{progressText}</strong>
      </div>
      <div>
        <span>Load</span>
        <strong>
          {metrics.loadMs === null ? '—' : `${(metrics.loadMs / 1000).toFixed(2)} s`}
        </strong>
      </div>
      <div>
        <span>Splats</span>
        <strong>
          {metrics.numSplats === null
            ? '—'
            : new Intl.NumberFormat('en-US').format(metrics.numSplats)}
        </strong>
      </div>
      <div>
        <span>FPS</span>
        <strong>{metrics.fps === null ? '—' : metrics.fps.toFixed(0)}</strong>
      </div>
    </aside>
  )
}

export function SparkSceneCanvas({ reducedMotion }: SceneRendererProps) {
  const [attempt, setAttempt] = useState(0)
  const [metrics, setMetrics] = useState<RuntimeMetrics>(INITIAL_METRICS)

  const handleProgress = useCallback((progress: ProgressSnapshot) => {
    setMetrics((current) => ({ ...current, progress }))
  }, [])

  const handleLoaded = useCallback((loadMs: number, numSplats: number) => {
    setMetrics((current) => ({
      ...current,
      phase: 'ready',
      loadMs,
      numSplats,
      error: null,
    }))
  }, [])

  const handleError = useCallback((error: string) => {
    setMetrics((current) => ({
      ...current,
      phase: 'error',
      error,
    }))
  }, [])

  const handleFps = useCallback((fps: number) => {
    setMetrics((current) => ({ ...current, fps }))
  }, [])

  useEffect(() => {
    setMetrics(INITIAL_METRICS)
  }, [attempt])

  if (metrics.phase === 'error') {
    return (
      <ViewerFallback
        title="The Spark comparison could not load."
        description={metrics.error ?? 'Unknown Spark runtime error.'}
        actionLabel="Retry comparison"
        onAction={() => setAttempt((current) => current + 1)}
      />
    )
  }

  return (
    <div className="splat-runtime" data-splat-state={metrics.phase}>
      <Canvas
        key={attempt}
        camera={{
          position: CAMERA_POSITION,
          fov: 42,
          near: 0.01,
          far: 100,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: false,
        }}
        fallback={
          <ViewerFallback
            title="3D rendering is unavailable."
            description="The browser could not create the Three.js renderer required for the Spark spike."
          />
        }
      >
        <color attach="background" args={['#090b0a']} />

        <SparkSceneContent
          onProgress={handleProgress}
          onLoaded={handleLoaded}
          onError={handleError}
        />
        <OrbitCameraControls
          reducedMotion={reducedMotion}
          target={CAMERA_TARGET}
          minDistance={1.5}
          maxDistance={12}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI * 0.82}
        />
        <FrameSampler onSample={handleFps} />
      </Canvas>

      <SparkMetrics metrics={metrics} />
    </div>
  )
}
