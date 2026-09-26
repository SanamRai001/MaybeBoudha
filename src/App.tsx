import { ExperienceViewport } from './experience/ExperienceViewport'
import { useReducedMotion } from './hooks/useReducedMotion'

function App() {
  const reducedMotion = useReducedMotion()

  return (
    <main className="app-shell">
      <header className="site-header">
        <a className="brand" href="/" aria-label="MaybeBoudha home">
          MaybeBoudha
        </a>
        <span className="phase-badge">Phase 1 · Viewer foundation</span>
      </header>

      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Boudhanath · Kathmandu, Nepal</p>
          <h1 id="page-title">A foundation for a place that should feel present.</h1>
          <p className="hero-description">
            This is the technical viewer prototype. The simple geometry is intentionally temporary;
            a measured real-scene reconstruction will replace it only after the rendering pipeline
            is proven.
          </p>

          <dl className="prototype-notes">
            <div>
              <dt>Interaction</dt>
              <dd>Drag to orbit · wheel or pinch to zoom</dd>
            </div>
            <div>
              <dt>Motion</dt>
              <dd>{reducedMotion ? 'Reduced motion respected' : 'Standard interaction enabled'}</dd>
            </div>
            <div>
              <dt>Scene</dt>
              <dd>Replaceable placeholder renderer</dd>
            </div>
          </dl>
        </div>

        <div className="viewer-column">
          <div className="viewer-frame" aria-label="Interactive 3D prototype">
            <ExperienceViewport reducedMotion={reducedMotion} />
          </div>
          <p className="viewer-caption">
            Placeholder geometry only — this is not a scan or reconstruction of Boudhanath.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
