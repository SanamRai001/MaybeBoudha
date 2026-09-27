import { ExperienceViewport } from './experience/ExperienceViewport'
import { PlayCanvasSceneCanvas } from './experience/renderer/PlayCanvasSceneCanvas'
import {
  PLAYCANVAS_VERSION,
  rendererCandidateFromSearch,
} from './experience/renderer/playcanvasSpike'
import { SparkSceneCanvas } from './experience/renderer/SparkSceneCanvas'
import { SPARK_VERSION, TEST_ASSET } from './experience/renderer/sparkSpike'
import { useReducedMotion } from './hooks/useReducedMotion'

function App() {
  const reducedMotion = useReducedMotion()
  const rendererCandidate = rendererCandidateFromSearch(window.location.search)
  const isPlayCanvas = rendererCandidate === 'playcanvas'
  const Renderer = isPlayCanvas ? PlayCanvasSceneCanvas : SparkSceneCanvas

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="MaybeBoudha home">
          MaybeBoudha
        </a>
        <span className="phase-badge">Phase 2 · Reconstruction renderer spike</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Boudhanath · Kathmandu, Nepal</p>
          <h1 id="page-title">Proving the photorealistic rendering path.</h1>
          <p className="hero-description">
            The viewer loads the same Gaussian Splat reconstruction through two candidate engines
            so we can compare integration and delivery behavior before capturing Boudhanath.
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
              <dt>Fixture</dt>
              <dd>{TEST_ASSET.label} · pinned compressed PLY</dd>
            </div>
            <div>
              <dt>Compare</dt>
              <dd className="renderer-links">
                <a
                  href="?renderer=spark"
                  aria-current={isPlayCanvas ? undefined : 'page'}
                >
                  Spark
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
              <dd>{reducedMotion ? 'Reduced motion respected' : 'Standard interaction enabled'}</dd>
            </div>
          </dl>
        </div>

        <div className="viewer-column">
          <div className="viewer-frame" aria-label="Gaussian Splat renderer spike">
            <ExperienceViewport
              reducedMotion={reducedMotion}
              renderer={Renderer}
            />
          </div>
          <p className="viewer-caption">
            Technical test asset only — this is not Boudhanath. Both candidates use the same
            compressed PLY source so renderer differences are easier to isolate.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
