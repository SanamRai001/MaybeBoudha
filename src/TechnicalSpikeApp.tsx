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

export function TechnicalSpikeApp() {
  const reducedMotion = useReducedMotion()
  const rendererCandidate = rendererCandidateFromSearch(window.location.search)
  const sparkScene = sparkSceneConfigFromSearch(window.location.search)
  const isPlayCanvas = rendererCandidate === 'playcanvas'
  const isRad = rendererCandidate === 'rad'
  const Renderer = isPlayCanvas ? PlayCanvasSceneCanvas : SparkSceneCanvas

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="MaybeBoudha visual prototype">
          MaybeBoudha
        </a>
        <span className="phase-badge">Engineering · renderer and delivery proof</span>
      </header>

      <section className="hero" aria-labelledby="technical-page-title">
        <div className="hero-copy">
          <p className="eyebrow">Technical verification</p>
          <h1 id="technical-page-title">Reconstruction delivery pipeline.</h1>
          <p className="hero-description">
            These routes preserve the verified Spark, paged RAD, and PlayCanvas
            engineering probes while the default experience moves into the
            synthetic Boudhanath visual study.
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
          <div className="viewer-frame" aria-label="Gaussian Splat engineering proof">
            <ExperienceViewport
              reducedMotion={reducedMotion}
              renderer={Renderer}
            />
          </div>
          <p className="viewer-caption">
            Technical fixture only — this is not Boudhanath.
          </p>
        </div>
      </section>
    </main>
  )
}
