import { useCallback, useEffect, useRef, useState } from 'react'

import type { SceneRendererProps } from '../ExperienceViewport'
import { ViewerFallback } from '../ui/ViewerFallback'
import {
  PLAYCANVAS_CAMERA_CONTROLS_URL,
  PLAYCANVAS_MODULE_URL,
  PLAYCANVAS_SPZ_PARSER_URL,
  PLAYCANVAS_VERSION,
  PLAYCANVAS_ZSTD_GLUE_URL,
  PLAYCANVAS_ZSTD_WASM_URL,
} from './playcanvasSpike'
import { formatBytes, TEST_ASSET } from './sparkSpike'

type RuntimeMetrics = {
  phase: 'loading' | 'ready' | 'error'
  loadMs: number | null
  fps: number | null
  error: string | null
}

const INITIAL_METRICS: RuntimeMetrics = {
  phase: 'loading',
  loadMs: null,
  fps: null,
  error: null,
}

const CAMERA_TARGET: [number, number, number] = [0.1, 0.141, 0.206]
const CAMERA_POSITION: [number, number, number] = [
  -1.9104306297,
  1.3367805898,
  -2.1217193697,
]

type PlayCanvasAsset = {
  resource?: unknown
}

type PlayCanvasApplication = {
  assets: unknown
  loader: {
    getHandler: (type: string) => {
      addParser: (parser: unknown) => void
    }
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
  script?: {
    create: (name: string) => void
  }
  setPosition: (x: number, y: number, z: number) => void
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
  ) => PlayCanvasAsset
  AssetListLoader: new (
    assets: PlayCanvasAsset[],
    registry: unknown,
  ) => {
    load: (
      callback: (error?: string | Error | null) => void,
    ) => void
  }
  Color: new (r: number, g: number, b: number, a?: number) => unknown
  Entity: new (name: string) => PlayCanvasEntity
  WasmModule: {
    setConfig: (
      name: string,
      config: {
        glueUrl: string
        wasmUrl: string
      },
    ) => void
  }
}

type SpzParserModule = {
  SpzParser: new (app: PlayCanvasApplication) => unknown
}

function toErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

async function loadPlayCanvasModules() {
  const [playcanvas, parser] = await Promise.all([
    import(/* @vite-ignore */ PLAYCANVAS_MODULE_URL),
    import(/* @vite-ignore */ PLAYCANVAS_SPZ_PARSER_URL),
  ])

  return {
    playcanvas: playcanvas as unknown as PlayCanvasModule,
    parser: parser as unknown as SpzParserModule,
  }
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
        <strong>786,233</strong>
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

    void loadPlayCanvasModules()
      .then(async ({ playcanvas, parser }) => {
        if (disposed) {
          return
        }

        const {
          Application,
          Asset,
          AssetListLoader,
          Color,
          Entity,
          WasmModule,
        } = playcanvas

        WasmModule.setConfig('ZstdDecoderModule', {
          glueUrl: PLAYCANVAS_ZSTD_GLUE_URL,
          wasmUrl: PLAYCANVAS_ZSTD_WASM_URL,
        })

        app = new Application(canvas, {
          graphicsDeviceOptions: {
            antialias: false,
          },
        })

        app.loader
          .getHandler('gsplat')
          .addParser(new parser.SpzParser(app))

        app.start()

        resizeObserver = new ResizeObserver(() => {
          if (!app) {
            return
          }

          app.resizeCanvas(canvas.clientWidth, canvas.clientHeight)
        })
        resizeObserver.observe(canvas)
        app.resizeCanvas(canvas.clientWidth, canvas.clientHeight)

        const controlsAsset = new Asset(
          'camera-controls',
          'script',
          { url: PLAYCANVAS_CAMERA_CONTROLS_URL },
        )
        const splatAsset = new Asset(
          'niantic-horned-lizard',
          'gsplat',
          { url: TEST_ASSET.url },
        )

        const loader = new AssetListLoader(
          [controlsAsset, splatAsset],
          app.assets,
        )

        await new Promise<void>((resolve, reject) => {
          loader.load((error) => {
            if (error) {
              reject(
                error instanceof Error
                  ? error
                  : new Error(String(error)),
              )
              return
            }

            resolve()
          })
        })

        if (disposed || !app) {
          return
        }

        const camera = new Entity('Camera')
        camera.setPosition(...CAMERA_POSITION)
        camera.lookAt(...CAMERA_TARGET)
        camera.addComponent('camera', {
          clearColor: new Color(0.035, 0.043, 0.039),
        })
        camera.addComponent('script')
        camera.script?.create('cameraControls')
        app.root.addChild(camera)

        const splat = new Entity('SPZ comparison fixture')
        splat.addComponent('gsplat', {
          asset: splatAsset,
        })
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
          error: null,
        }))
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
