import {
  SparkRenderer,
  SplatMesh,
} from '@sparkjsdev/spark'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Color,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { SceneRendererProps } from '../ExperienceViewport'
import { ViewerFallback } from '../ui/ViewerFallback'
import {
  formatBytes,
  progressSnapshot,
  SPARK_VERSION,
  type ProgressSnapshot,
} from './sparkSpike'
import {
  sparkSceneConfigFromSearch,
  type SparkSceneConfig,
} from './sparkSceneConfig'

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

async function waitForPagedScene(
  splat: SplatMesh,
  timeoutMs = 30_000,
): Promise<number> {
  if (!splat.paged) {
    throw new Error('Paged Spark scene did not create a PagedSplats source.')
  }

  const { meta } = await splat.paged.getRadMeta()
  const deadline = performance.now() + timeoutMs

  while (performance.now() < deadline) {
    if (splat.paged.getNumSplats() > 0) {
      return meta.count
    }

    await new Promise((resolve) => window.setTimeout(resolve, 50))
  }

  throw new Error(
    `RAD header decoded, but no splat page became visible within ${timeoutMs / 1000}s.`,
  )
}

function SparkMetrics({
  metrics,
  config,
}: {
  metrics: RuntimeMetrics
  config: SparkSceneConfig
}) {
  const progressText =
    metrics.phase === 'ready'
      ? 'Ready'
      : metrics.progress?.percent !== null && metrics.progress
        ? `${metrics.progress.percent.toFixed(0)}%`
        : config.paged
          ? 'Streaming scene'
          : 'Loading asset'

  const assetSize =
    config.bytes === null ? 'streamed' : formatBytes(config.bytes)

  return (
    <aside className="splat-metrics" aria-label="Renderer spike metrics">
      <div>
        <span>Renderer</span>
        <strong>Spark {SPARK_VERSION}</strong>
      </div>
      <div>
        <span>Asset</span>
        <strong>
          {config.format} · {assetSize}
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [metrics, setMetrics] = useState<RuntimeMetrics>(INITIAL_METRICS)
  const sceneConfig = useMemo(
    () => sparkSceneConfigFromSearch(window.location.search),
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    let disposed = false
    let renderer: WebGLRenderer | null = null
    let controls: OrbitControls | null = null
    let sparkRenderer: SparkRenderer | null = null
    let splat: SplatMesh | null = null
    let resizeObserver: ResizeObserver | null = null
    const startedAt = performance.now()

    setMetrics(INITIAL_METRICS)

    try {
      const context = canvas.getContext('webgl2', {
        alpha: false,
        antialias: false,
        depth: true,
        stencil: false,
      })

      if (!context) {
        throw new Error('Three.js could not create a WebGL2 context.')
      }

      renderer = new WebGLRenderer({
        canvas,
        context,
        antialias: false,
        alpha: false,
      })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
      renderer.setClearColor(new Color('#090b0a'), 1)

      const scene = new Scene()
      const camera = new PerspectiveCamera(42, 1, 0.01, 100)
      camera.position.set(...CAMERA_POSITION)

      controls = new OrbitControls(camera, canvas)
      controls.enablePan = false
      controls.enableDamping = !reducedMotion
      controls.dampingFactor = 0.065
      controls.minDistance = 1.5
      controls.maxDistance = 12
      controls.minPolarAngle = 0.15
      controls.maxPolarAngle = Math.PI * 0.82
      controls.target.set(...CAMERA_TARGET)
      controls.update()

      sparkRenderer = new SparkRenderer({ renderer })
      splat = new SplatMesh({
        url: sceneConfig.url,
        paged: sceneConfig.paged || undefined,
        editable: false,
        raycastable: false,
        onProgress: (event) => {
          if (!disposed) {
            setMetrics((current) => ({
              ...current,
              progress: progressSnapshot(event),
            }))
          }
        },
      })

      splat.position.set(-1.5, 0.05, 0)
      splat.rotation.set(Math.PI, Math.PI / 2, 0)
      splat.scale.setScalar(0.7)

      scene.add(sparkRenderer)
      scene.add(splat)

      resizeObserver = new ResizeObserver(() => {
        if (!renderer) {
          return
        }

        const width = Math.max(1, canvas.clientWidth)
        const height = Math.max(1, canvas.clientHeight)

        renderer.setSize(width, height, false)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
      })
      resizeObserver.observe(canvas)

      const width = Math.max(1, canvas.clientWidth)
      const height = Math.max(1, canvas.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      let frameCount = 0
      let sampledAt = performance.now()

      renderer.setAnimationLoop(() => {
        if (disposed || !renderer) {
          return
        }

        if (controls?.enableDamping) {
          controls.update()
        }

        renderer.render(scene, camera)

        const now = performance.now()
        frameCount += 1
        const elapsed = now - sampledAt

        if (elapsed >= 1000) {
          const fps = (frameCount * 1000) / elapsed
          setMetrics((current) => ({ ...current, fps }))
          frameCount = 0
          sampledAt = now
        }
      })

      void (async () => {
        await splat.initialized

        const numSplats = sceneConfig.paged
          ? await waitForPagedScene(splat)
          : splat.numSplats

        if (!disposed) {
          setMetrics((current) => ({
            ...current,
            phase: 'ready',
            loadMs: performance.now() - startedAt,
            numSplats,
            error: null,
          }))
        }
      })().catch((error: unknown) => {
        if (!disposed) {
          console.error('Spark scene initialization failed', error)
          setMetrics((current) => ({
            ...current,
            phase: 'error',
            error: toErrorMessage(error),
          }))
        }
      })
    } catch (error) {
      console.error('Spark Three.js renderer initialization failed', error)
      setMetrics((current) => ({
        ...current,
        phase: 'error',
        error: toErrorMessage(error),
      }))
    }

    return () => {
      disposed = true
      resizeObserver?.disconnect()
      renderer?.setAnimationLoop(null)
      controls?.dispose()
      splat?.dispose()
      sparkRenderer?.dispose()
      renderer?.dispose()
    }
  }, [attempt, reducedMotion, sceneConfig])

  if (metrics.phase === 'error') {
    return (
      <ViewerFallback
        title="The Spark scene could not load."
        description={metrics.error ?? 'Unknown Spark runtime error.'}
        actionLabel="Retry scene"
        onAction={() => setAttempt((current) => current + 1)}
      />
    )
  }

  return (
    <div
      className="splat-runtime"
      data-splat-state={metrics.phase}
      data-splat-mode={sceneConfig.mode}
    >
      <canvas
        key={attempt}
        ref={canvasRef}
        className="spark-canvas"
        aria-label="Spark Gaussian Splat scene"
      />
      <SparkMetrics metrics={metrics} config={sceneConfig} />
    </div>
  )
}
