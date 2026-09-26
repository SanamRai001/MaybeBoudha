import { ExperienceViewport } from './experience/ExperienceViewport'
import { SparkSceneCanvas } from './experience/renderer/SparkSceneCanvas'
import { SPARK_VERSION, TEST_ASSET } from './experience/renderer/sparkSpike'
import { useReducedMotion } from './hooks/useReducedMotion'

function App() {
  const reducedMotion = useReducedMotion()

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
            The viewer now loads a real Gaussian Splat reconstruction to measure the technology
            before we capture Boudhanath. This sample is deliberately unrelated to the monument.
          </p>

          <dl className="prototype-notes">
            <div>
              <dt>Renderer</dt>
              <dd>Spark {SPARK_VERSION} · Three.js integration</dd>
            </div>
            <div>
              <dt>Fixture</dt>
              <dd>{TEST_ASSET.label} · pinned upstream SPZ</dd>
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
              renderer={SparkSceneCanvas}
            />
          </div>
          <p className="viewer-caption">
            Technical test asset only — this is not Boudhanath. Runtime metrics are shown inside the
            viewer so we can evaluate the renderer before choosing the production pipeline.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
