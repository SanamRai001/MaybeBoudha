import { useCallback, useState } from 'react'

import { useReducedMotion } from '../hooks/useReducedMotion'
import {
  SurfaceReconstructionCanvas,
  type SurfaceRuntimeMetadata,
} from './SurfaceReconstructionCanvas'
import { SURFACE_SOURCE } from './surfaceConfig'

export function SurfaceReconstructionExperience() {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [metadata, setMetadata] = useState<SurfaceRuntimeMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReady = useCallback((next: SurfaceRuntimeMetadata) => {
    setMetadata(next)
    setError(null)
    setState('ready')
  }, [])

  const handleError = useCallback((message: string) => {
    setError(message)
    setState('error')
  }, [])

  return (
    <main className="pointcloud-page" data-surface-state={state}>
      <SurfaceReconstructionCanvas
        reducedMotion={reducedMotion}
        onReady={handleReady}
        onError={handleError}
      />

      <div className="pointcloud-vignette" aria-hidden="true" />

      <header className="prototype-header">
        <a className="prototype-brand" href="/" aria-label="MaybeBoudha hybrid baseline">
          MaybeBoudha
        </a>
        <div className="prototype-header-meta">
          <span>Phase 3P.4 · Deterministic surface</span>
          <a href="/?pointcloud=1">Point source</a>
        </div>
      </header>

      <section className="pointcloud-copy" aria-labelledby="surface-title">
        <p className="prototype-eyebrow">Licensed geometry · deterministic reconstruction</p>
        <h1 id="surface-title">
          Boudha,
          <span> as a surface.</span>
        </h1>
        <p className="prototype-description">
          A Poisson surface reconstructed from the unchanged 99,992-point
          Boudhanath GLB and its stored normals. No generative AI is used, and
          the result is an engineering derivative rather than survey-grade geometry.
        </p>

        <dl className="pointcloud-metrics">
          <div>
            <dt>Vertices</dt>
            <dd>{metadata ? new Intl.NumberFormat('en-US').format(metadata.vertexCount) : '—'}</dd>
          </div>
          <div>
            <dt>Triangles</dt>
            <dd>{metadata ? new Intl.NumberFormat('en-US').format(metadata.triangleCount) : '—'}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{new Intl.NumberFormat('en-US').format(SURFACE_SOURCE.sourcePoints)} pts</dd>
          </div>
          <div>
            <dt>Method</dt>
            <dd>Poisson d9</dd>
          </div>
        </dl>

        <div className="prototype-status-row">
          <span className="prototype-status">
            <i className={state === 'ready' ? 'is-ready' : ''} aria-hidden="true" />
            {state === 'ready'
              ? 'Surface ready'
              : state === 'error'
                ? 'Surface failed'
                : 'Reconstructing proof'}
          </span>
          <span className="prototype-disclosure">
            CC Attribution · NoAI respected
          </span>
        </div>

        {error ? <p className="pointcloud-error">{error}</p> : null}
      </section>

      <aside className="pointcloud-source" aria-label="Reconstruction provenance">
        <span>Input</span>
        <strong>{SURFACE_SOURCE.sourceTitle}</strong>
        <small>{SURFACE_SOURCE.sourceAuthor} · {SURFACE_SOURCE.sourceHandle}</small>
        <span>Pipeline</span>
        <strong>{SURFACE_SOURCE.reconstruction}</strong>
        <small>Deterministic geometry processing</small>
      </aside>

      <footer className="prototype-controls">
        <span>Drag to orbit</span>
        <span aria-hidden="true">·</span>
        <span>Scroll to zoom</span>
        <span aria-hidden="true">·</span>
        <a href="/">Hybrid baseline</a>
      </footer>
    </main>
  )
}
