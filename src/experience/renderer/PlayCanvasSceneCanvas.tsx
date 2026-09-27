import { useCallback, useEffect, useRef, useState } from 'react'

import type { SceneRendererProps } from '../ExperienceViewport'
import { ViewerFallback } from '../ui/ViewerFallback'
import {
  PLAYCANVAS_MODULE_URL,
  PLAYCANVAS_VERSION,
} from './playcanvasSpike'
import { formatBytes, TEST_ASSET } from './sparkSpike'

type RuntimeMetrics = {
  phase: 'loading' | 'ready' | 'error'
  loadMs: number | null
  numSplats: number | null
  fps: number | null
  error: string | null
}

const INITIAL_METRICS: RuntimeMetrics = {
  phase: 'loading',
  loadMs: null,
  numSplats: null,
  fps: null,
  error: null,
}

const CAMERA_TARGET: [number, number, number] = [-1.5, 1.05, 0]
const CAMERA_POSITION: [number, number, number] = [0.6, 1.75, 3.4]

type PlayCanvasAsset = {
  resource?: {
    gsplatData?: {
      numSplats?: number
    }
  }
}

type PlayCanvasApplication = {
  assets: {
    add: (asset: PlayCanvasAsset) => void
    load: (asset: PlayCanvasAsset) => void
  }
  root: {
    addChild: (entity: unknown) => void
  }
  start: () => void
  resizeCanvas: (width?: number, height?: number) => void
  on: (name: string, callback: () => void) => void
  off: (name: string, callback: () => void) => void
  destroy: () => void
}

type PlayCanvasEntity = {
  setPosition: (x: number, y: number, z: number) => void
  setLocalPosition: (x: number, y: number, z: number) => void
  setLocalEulerAngles: (x: number, y: number, z: number) => void
  setLocalScale: (x: number, y: number, z: number) => void
  lookAt: (x: number, y: number, z: number) => void
  addComponent: (type: string, data?: Record<string, unknown>) => void
}

type PlayCanvasModule = {
  Application: new (
    canvas: HTMLCanvasElement,
    options: {
      graphicsDeviceOptions: {
        antialias: boolean
      }
    },
  ) => PlayCanvasApplication
  Asset: new (
    name: string,
    type: string,
    file: { url: string },
  ) => PlayCanvasAsset & {
    ready: (callback: () => void) => void
    on: (name: string, callback: (error: unknown) => void) => void
  }
  Color: new (r: number, g: number, b: number, a?: number) => unknown
  Entity: new (name: string) => PlayCanvasEntity
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function loadPlayCanvasModule() {
  const playcanvas = await import(/* @vite-ignore */ PLAYCANVAS_MODULE_URL)
  return playcanvas as unknown as PlayCanvasModule
}

function PlayCanvasMetrics({ metrics }: { metrics: RuntimeMetrics }) {
  return (
    <aside className="splat-metrics" aria-label="Renderer spike metrics">
      <div>
        <span>Renderer</span>
        <strong>PlayCanvas {PLAYCANVAS_VERSION}</strong>
      </div>
      <div>
        <span>Asset</span>
        <strong>
          {TEST_ASSET.format} · {formatBytes(TEST_ASSET.bytes)}
        </strong>
      </div>
      <div>
        <span>Status</span>
        <strong>{metrics.phase === 'ready' ? 'Ready' : 'Loading asset'}</strong>
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

export function PlayCanvasSceneCanvas({
  reducedMotion: _reducedMotion,
}: SceneRendererProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [attempt, setAttempt] = useState(0)
  const [metrics, setMetrics] = useState<RuntimeMetrics>(INITIAL_METRICS)

  const handleFps = useCallback((fps: number) => {
    setMetrics((current) => ({ ...current, fps }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    let disposed = false
    let app: PlayCanvasApplication | null = null
    let resizeObserver: ResizeObserver | null = null
    let frameListener: (() => void) | null = null

    setMetrics(INITIAL_METRICS)
    const startedAt = performance.now()

    void loadPlayCanvasModule()
      .then((playcanvas) => {
        if (disposed) {
          return
        }

        const {
          Application,
          Asset,
          Color,
          Entity,
        } = playcanvas

        app = new Application(canvas, {
          graphicsDeviceOptions: {
            antialias: false,
          },
        })

        app.start()

        resizeObserver = new ResizeObserver(() => {
          if (!app) {
            return
          }

          app.resizeCanvas(canvas.clientWidth, canvas.clientHeight)
        })
        resizeObserver.observe(canvas)
        app.resizeCanvas(canvas.clientWidth, canvas.clientHeight)

        const splatAsset = new Asset(
          'playcanvas-biker-compressed-ply',
          'gsplat',
          { url: TEST_ASSET.url },
        )

        splatAsset.on('error', (error) => {
          if (!disposed) {
            setMetrics((current) => ({
              ...current,
              phase: 'error',
              error: toErrorMessage(error),
            }))
          }
        })

        splatAsset.ready(() => {
          if (disposed || !app) {
            return
          }

          const camera = new Entity('Camera')
          camera.setPosition(...CAMERA_POSITION)
          camera.lookAt(...CAMERA_TARGET)
          camera.addComponent('camera', {
            clearColor: new Color(0.035, 0.043, 0.039),
          })
          app.root.addChild(camera)

          const splat = new Entity('compressed PLY comparison fixture')
          splat.addComponent('gsplat', {
            asset: splatAsset,
          })
          splat.setLocalPosition(-1.5, 0.05, 0)
          splat.setLocalEulerAngles(180, 90, 0)
          splat.setLocalScale(0.7, 0.7, 0.7)
          app.root.addChild(splat)

          let frames = 0
          let sampledAt = performance.now()

          frameListener = () => {
            const now = performance.now()
            frames += 1
            const elapsed = now - sampledAt

            if (elapsed < 1000) {
              return
            }

            handleFps((frames * 1000) / elapsed)
            frames = 0
            sampledAt = now
          }

          app.on('update', frameListener)

          setMetrics((current) => ({
            ...current,
            phase: 'ready',
            loadMs: performance.now() - startedAt,
            numSplats: splatAsset.resource?.gsplatData?.numSplats ?? null,
            error: null,
          }))
        })

        app.assets.add(splatAsset)
        app.assets.load(splatAsset)
      })
      .catch((error: unknown) => {
        if (!disposed) {
          setMetrics((current) => ({
            ...current,
            phase: 'error',
            error: toErrorMessage(error),
          }))
        }
      })

    return () => {
      disposed = true
      resizeObserver?.disconnect()

      if (app && frameListener) {
        app.off('update', frameListener)
      }

      app?.destroy()
    }
  }, [attempt, handleFps])

  if (metrics.phase === 'error') {
    return (
      <ViewerFallback
        title="The PlayCanvas comparison could not load."
        description={metrics.error ?? 'Unknown PlayCanvas runtime error.'}
        actionLabel="Retry comparison"
        onAction={() => setAttempt((current) => current + 1)}
      />
    )
  }

  return (
    <div className="splat-runtime" data-playcanvas-state={metrics.phase}>
      <canvas
        key={attempt}
        ref={canvasRef}
        className="playcanvas-canvas"
        aria-label="PlayCanvas Gaussian Splat comparison"
      />
      <PlayCanvasMetrics metrics={metrics} />
    </div>
  )
}
