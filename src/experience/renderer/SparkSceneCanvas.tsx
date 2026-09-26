import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Object3D } from 'three'

import type { SceneRendererProps } from '../ExperienceViewport'
import { OrbitCameraControls } from '../camera/OrbitCameraControls'
import { ViewerFallback } from '../ui/ViewerFallback'
import {
  formatBytes,
  loadSparkModule,
  progressSnapshot,
  SPARK_VERSION,
  TEST_ASSET,
  type ProgressSnapshot,
} from './sparkSpike'

type RuntimeMetrics = {
  phase: 'module' | 'asset' | 'ready' | 'error'
  progress: ProgressSnapshot | null
  loadMs: number | null
  numSplats: number | null
  fps: number | null
  error: string | null
}

const INITIAL_METRICS: RuntimeMetrics = {
  phase: 'module',
  progress: null,
  loadMs: null,
  numSplats: null,
  fps: null,
  error: null,
}

const CAMERA_TARGET: [number, number, number] = [0.1, 0.141, 0.206]

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown Spark runtime error.'
}

type SparkSceneContentProps = {
  onPhase: (phase: RuntimeMetrics['phase']) => void
  onProgress: (progress: ProgressSnapshot) => void
  onLoaded: (loadMs: number, numSplats: number) => void
  onError: (message: string) => void
}

function SparkSceneContent({
  onPhase,
  onProgress,
  onLoaded,
  onError,
}: SparkSceneContentProps) {
  const { gl, scene } = useThree()

  useEffect(() => {
    let disposed = false
    let sparkRenderer: { dispose: () => void } | null = null
    let splatMesh: { dispose: () => void } | null = null
    let sparkObject: Object3D | null = null
    let splatObject: Object3D | null = null
    const startedAt = performance.now()

    onPhase('module')

    void loadSparkModule()
      .then(({ SparkRenderer, SplatMesh }) => {
        if (disposed) {
          return
        }

        onPhase('asset')

        sparkRenderer = new SparkRenderer({ renderer: gl })
        sparkObject = sparkRenderer as unknown as Object3D
        scene.add(sparkObject)

        const splat = new SplatMesh({
          url: TEST_ASSET.url,
          editable: false,
          raycastable: false,
          onProgress: (event) => {
            if (!disposed) {
              onProgress(progressSnapshot(event))
            }
          },
          onLoad: (mesh) => {
            if (!disposed) {
              onLoaded(performance.now() - startedAt, mesh.numSplats)
            }
          },
        })

        splatMesh = splat
        splatObject = splat as unknown as Object3D
        scene.add(splatObject)
      })
      .catch((error: unknown) => {
        if (!disposed) {
          onError(toErrorMessage(error))
        }
      })

    return () => {
      disposed = true

      if (splatObject) {
        scene.remove(splatObject)
      }

      if (sparkObject) {
        scene.remove(sparkObject)
      }

      splatMesh?.dispose()
      sparkRenderer?.dispose()
    }
  }, [gl, onError, onLoaded, onPhase, onProgress, scene])

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
        : metrics.phase === 'module'
          ? 'Loading runtime'
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

  const handlePhase = useCallback((phase: RuntimeMetrics['phase']) => {
    setMetrics((current) => ({ ...current, phase }))
  }, [])

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

  const handleError = useCallback((error: string) => {
    setMetrics((current) => ({
      ...current,
      phase: 'error',
      error,
    }))
  }, [])

  const retry = () => {
    setMetrics(INITIAL_METRICS)
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
    <div className="splat-runtime">
      <Canvas
        key={attempt}
        camera={{
          position: [4, 1.2, 3.3],
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
          onPhase={handlePhase}
          onProgress={handleProgress}
          onLoaded={handleLoaded}
          onError={handleError}
        />
        <OrbitCameraControls
          reducedMotion={reducedMotion}
          target={CAMERA_TARGET}
          minDistance={1.2}
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
