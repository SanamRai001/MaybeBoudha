import { useCallback, useState } from 'react'

import { useReducedMotion } from '../hooks/useReducedMotion'
import { BoudhaPrototypeCanvas } from './BoudhaPrototypeCanvas'

export function BoudhaPrototypeExperience() {
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <main
      className="prototype-page"
      data-prototype-state={ready ? 'ready' : 'loading'}
    >
      <BoudhaPrototypeCanvas
        reducedMotion={reducedMotion}
        onReady={handleReady}
      />

      <div className="prototype-vignette" aria-hidden="true" />

      <header className="prototype-header">
        <a className="prototype-brand" href="/" aria-label="MaybeBoudha">
          MaybeBoudha
        </a>
        <div className="prototype-header-meta">
          <span>Visual Study 01</span>
          <a href="?renderer=rad">Engineering proof</a>
        </div>
      </header>

      <section className="prototype-copy" aria-labelledby="prototype-title">
        <p className="prototype-eyebrow">Kathmandu · Visual feasibility study</p>
        <h1 id="prototype-title">
          Boudha,
          <span> before the scan.</span>
        </h1>
        <p className="prototype-description">
          A synthetic architectural study built to test scale, light, atmosphere,
          and movement before we invest in a real-world reconstruction.
        </p>

        <div className="prototype-status-row">
          <span className="prototype-status">
            <i className={ready ? 'is-ready' : ''} aria-hidden="true" />
            {ready ? 'Interactive study ready' : 'Preparing scene'}
          </span>
          <span className="prototype-disclosure">Synthetic study · no scan data</span>
        </div>
      </section>

      <aside className="prototype-side-note" aria-label="Visual study focus">
        <span>01</span>
        <div>
          <strong>Architecture</strong>
          <small>Scale · silhouette · material</small>
        </div>
        <span>02</span>
        <div>
          <strong>Atmosphere</strong>
          <small>Light · depth · motion</small>
        </div>
      </aside>

      <footer className="prototype-controls">
        <span>Drag to orbit</span>
        <span aria-hidden="true">·</span>
        <span>Scroll to zoom</span>
        <span aria-hidden="true">·</span>
        <span>{reducedMotion ? 'Reduced motion' : 'Cinematic entry'}</span>
      </footer>
    </main>
  )
}
