import { useCallback, useState } from 'react'

import { useReducedMotion } from '../hooks/useReducedMotion'
import { BoudhaPrototypeCanvas } from './BoudhaPrototypeCanvas'
import { useAmbientSound } from './useAmbientSound'

export function BoudhaPrototypeExperience() {
  const reducedMotion = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [resetViewToken, setResetViewToken] = useState(0)
  const ambientSound = useAmbientSound()
  const handleReady = useCallback(() => setReady(true), [])

  return (
    <main
      className={[
        'prototype-page',
        ready ? 'is-ready' : 'is-loading',
        focusMode ? 'is-focus-mode' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-prototype-state={ready ? 'ready' : 'loading'}
      data-reset-view-token={resetViewToken}
      data-audio-state={ambientSound.state}
    >
      <BoudhaPrototypeCanvas
        reducedMotion={reducedMotion}
        resetViewToken={resetViewToken}
        onReady={handleReady}
      />

      <div className="prototype-vignette" aria-hidden="true" />

      <div
        className="prototype-loader"
        role="status"
        aria-live="polite"
        aria-hidden={ready}
      >
        <div className="prototype-loader-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <strong>MaybeBoudha</strong>
          <small>Preparing the visual study</small>
        </div>
      </div>

      <header className="prototype-header">
        <a className="prototype-brand" href={import.meta.env.BASE_URL} aria-label="MaybeBoudha">
          MaybeBoudha
        </a>

        <div className="prototype-header-actions">
          <div className="prototype-header-meta">
            <span>Visual Study 01</span>
            <a href="?renderer=rad">Engineering proof</a>
          </div>

          <div className="prototype-view-actions">
            <button
              className="prototype-view-button prototype-audio-toggle"
              type="button"
              aria-pressed={ambientSound.pressed}
              disabled={ambientSound.state === 'unavailable'}
              onClick={ambientSound.toggle}
            >
              {ambientSound.label}
            </button>

            <button
              className="prototype-view-button prototype-reset-view"
              type="button"
              disabled={!ready}
              onClick={() => setResetViewToken((current) => current + 1)}
            >
              Reset view
            </button>

            <button
              className="prototype-view-button prototype-focus-toggle"
              type="button"
              aria-pressed={focusMode}
              onClick={() => setFocusMode((current) => !current)}
            >
              {focusMode ? 'Show story' : 'Focus view'}
            </button>
          </div>
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

      <div className="prototype-explore-hint" aria-hidden="true">
        <span />
        Drag to explore
      </div>

      <footer className="prototype-controls">
        <span>Drag to orbit</span>
        <span aria-hidden="true">·</span>
        <span>Scroll to zoom</span>
        <span aria-hidden="true">·</span>
        <span>{reducedMotion ? 'Reduced motion' : 'Cinematic entry'}</span>
        <span aria-hidden="true">·</span>
        <a
          href="https://commons.wikimedia.org/wiki/File:Boudha_eyes.jpg"
          target="_blank"
          rel="noreferrer"
        >
          Eye texture: Christopher J. Fynn · CC BY-SA 4.0
        </a>
      </footer>
    </main>
  )
}
