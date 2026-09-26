import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import {
  SparkRenderer as SparkRendererImpl,
  SplatMesh as SplatMeshImpl,
  type SplatMesh as SparkSplatMesh,
} from '@sparkjsdev/spark'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

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

const SparkRenderer = extend(SparkRendererImpl)
const SplatMesh = extend(SplatMeshImpl)

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

type SparkSceneContentProps = {
  onProgress: (progress: ProgressSnapshot) => void
  onLoaded: (loadMs: number, numSplats: number) => void
}

function SparkSceneContent({
  onProgress,
  onLoaded,
}: SparkSceneContentProps) {
  const renderer = useThree((state) => state.gl)
  const startedAt = useRef(performance.now())

  const sparkRendererArgs = useMemo(
    () => ({ renderer }),
    [renderer],
  )

  const splatMeshArgs = useMemo(
    () => ({
      url: TEST_ASSET.url,
      editable: false,
      raycastable: false,
      onProgress: (event: ProgressEvent) => {
        onProgress(progressSnapshot(event))
      },
      onLoad: (mesh: SparkSplatMesh) => {
        onLoaded(performance.now() - startedAt.current, mesh.numSplats)
      },
    }),
    [onLoaded, onProgress],
  )

  return (
    <SparkRenderer args={[sparkRendererArgs]}>
      <group
        position={[-1.5, 0.05, 0]}
        rotation={[Math.PI, Math.PI / 2, 0]}
        scale={0.7}
      >
        <SplatMesh args={[splatMeshArgs]} />
      </group>
    </SparkRenderer>
  )
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

  const handleFps = useCallback((fps: number) => {
    setMetrics((current) => ({ ...current, fps }))
  }, [])

  useEffect(() => {
    setMetrics(INITIAL_METRICS)
  }, [attempt])

  const retry = () => {
    setAttempt((current) => current + 1)
  }

  if (metrics.phase === 'error') {
    return (
      <ViewerFallback
        title="The Gaussian Splat spike could not load."
        description={metrics.error ?? 'Unknown Spark runtime error.'}
        actionLabel="Retry spike"
        onAction={retry}
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
          powerPreference: 'high-performance',
        }}
        fallback={
          <ViewerFallback
            title="3D rendering is unavailable."
            description="The browser could not create the WebGL renderer required for the Gaussian Splat spike."
          />
        }
      >
        <color attach="background" args={['#090b0a']} />

        <SparkSceneContent
          onProgress={handleProgress}
          onLoaded={handleLoaded}
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
