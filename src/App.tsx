import { ExperienceViewport } from './experience/ExperienceViewport'
import { PlayCanvasSceneCanvas } from './experience/renderer/PlayCanvasSceneCanvas'
import {
  PLAYCANVAS_VERSION,
  rendererCandidateFromSearch,
} from './experience/renderer/playcanvasSpike'
import { SparkSceneCanvas } from './experience/renderer/SparkSceneCanvas'
import { sparkSceneConfigFromSearch } from './experience/renderer/sparkSceneConfig'
import { SPARK_VERSION } from './experience/renderer/sparkSpike'
import { useReducedMotion } from './hooks/useReducedMotion'

function App() {
  const reducedMotion = useReducedMotion()
  const rendererCandidate = rendererCandidateFromSearch(window.location.search)
  const sparkScene = sparkSceneConfigFromSearch(window.location.search)
  const isPlayCanvas = rendererCandidate === 'playcanvas'
  const isRad = rendererCandidate === 'rad'
  const Renderer = isPlayCanvas ? PlayCanvasSceneCanvas : SparkSceneCanvas

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="MaybeBoudha home">
          MaybeBoudha
        </a>
        <span className="phase-badge">Phase 3B · PLY → paged RAD proof</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Boudhanath · Kathmandu, Nepal</p>
          <h1 id="page-title">Proving the reconstruction delivery pipeline.</h1>
          <p className="hero-description">
            The renderer spike is complete. This phase proves that a portable
            reconstruction can be converted into Spark&apos;s paged RAD format
            and streamed through the same Three.js runtime planned for Boudhanath.
          </p>

          <dl className="prototype-notes">
            <div>
              <dt>Renderer</dt>
              <dd>
                {isPlayCanvas
                  ? `PlayCanvas ${PLAYCANVAS_VERSION}`
                  : `Spark ${SPARK_VERSION} · Three.js integration`}
              </dd>
            </div>
            <div>
              <dt>Asset</dt>
              <dd>
                {isPlayCanvas
                  ? 'PlayCanvas biker · pinned compressed PLY'
                  : `${sparkScene.label} · ${sparkScene.format}`}
              </dd>
            </div>
            <div>
              <dt>Proof</dt>
              <dd className="renderer-links">
                <a
                  href="?renderer=spark"
                  aria-current={rendererCandidate === 'spark' ? 'page' : undefined}
                >
                  PLY
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="?renderer=rad"
                  aria-current={isRad ? 'page' : undefined}
                >
                  Paged RAD
                </a>
                <span aria-hidden="true">·</span>
                <a
                  href="?renderer=playcanvas"
                  aria-current={isPlayCanvas ? 'page' : undefined}
                >
                  PlayCanvas
                </a>
              </dd>
            </div>
            <div>
              <dt>Motion</dt>
              <dd>
                {reducedMotion
                  ? 'Reduced motion respected'
                  : 'Standard interaction enabled'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="viewer-column">
          <div className="viewer-frame" aria-label="Gaussian Splat delivery proof">
            <ExperienceViewport
              reducedMotion={reducedMotion}
              renderer={Renderer}
            />
          </div>
          <p className="viewer-caption">
            Technical test asset only — this is not Boudhanath. The RAD mode is
            generated from the same pinned legal fixture so the asset-processing
            path can be proven before any field capture.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
