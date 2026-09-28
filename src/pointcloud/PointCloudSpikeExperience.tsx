import { useCallback, useState } from 'react'

import { useReducedMotion } from '../hooks/useReducedMotion'
import {
  PointCloudCanvas,
  type PointCloudRuntimeMetadata,
} from './PointCloudCanvas'
import { POINT_CLOUD_SOURCE } from './pointCloudConfig'

function colorLabel(metadata: PointCloudRuntimeMetadata | null) {
  if (!metadata) {
    return '—'
  }

  if (metadata.colorMode === 'varied') {
    return 'Per-point RGB'
  }

  if (metadata.colorMode === 'uniform') {
    return 'Uniform gray'
  }

  return 'No color'
}

export function PointCloudSpikeExperience() {
  const reducedMotion = useReducedMotion()
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [metadata, setMetadata] = useState<PointCloudRuntimeMetadata | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleReady = useCallback((next: PointCloudRuntimeMetadata) => {
    setMetadata(next)
    setError(null)
    setState('ready')
  }, [])

  const handleError = useCallback((message: string) => {
    setError(message)
    setState('error')
  }, [])

  return (
    <main
      className="pointcloud-page"
      data-pointcloud-state={state}
    >
      <PointCloudCanvas
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
          <span>Phase 3P.3 · Licensed point data</span>
          <a href="/">Hybrid baseline</a>
        </div>
      </header>

      <section className="pointcloud-copy" aria-labelledby="pointcloud-title">
        <p className="prototype-eyebrow">Real licensed point data · A/B spike</p>
        <h1 id="pointcloud-title">
          Boudha,
          <span> as points.</span>
        </h1>
        <p className="prototype-description">
          Direct browser rendering of the uploaded Sketchfab GLB. The source
          contains geometry and normals but only uniform gray color, so this
          inspection view uses deterministic normal-based shading to reveal the
          captured shape without pretending it contains photographic RGB.
        </p>

        <dl className="pointcloud-metrics">
          <div>
            <dt>Points</dt>
            <dd>
              {metadata
                ? new Intl.NumberFormat('en-US').format(metadata.pointCount)
                : '—'}
            </dd>
          </div>
          <div>
            <dt>Color</dt>
            <dd>{colorLabel(metadata)}</dd>
          </div>
          <div>
            <dt>Normals</dt>
            <dd>{metadata ? (metadata.hasNormals ? 'Present' : 'Missing') : '—'}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{(POINT_CLOUD_SOURCE.repositoryBytes / 1024 / 1024).toFixed(2)} MB GLB</dd>
          </div>
        </dl>

        <div className="prototype-status-row">
          <span className="prototype-status">
            <i className={state === 'ready' ? 'is-ready' : ''} aria-hidden="true" />
            {state === 'ready'
              ? 'Point cloud ready'
              : state === 'error'
                ? 'Point cloud failed'
                : 'Loading point data'}
          </span>
          <span className="prototype-disclosure">
            CC Attribution · NoAI respected
          </span>
        </div>

        {error ? <p className="pointcloud-error">{error}</p> : null}
      </section>

      <aside className="pointcloud-source" aria-label="Point-cloud provenance">
        <span>Source</span>
        <strong>{POINT_CLOUD_SOURCE.title}</strong>
        <small>{POINT_CLOUD_SOURCE.author} · {POINT_CLOUD_SOURCE.sketchfabHandle}</small>
        <a
          href={POINT_CLOUD_SOURCE.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          View original listing
        </a>
      </aside>

      <footer className="prototype-controls">
        <span>Drag to orbit</span>
        <span aria-hidden="true">·</span>
        <span>Scroll to zoom</span>
        <span aria-hidden="true">·</span>
        <span>{reducedMotion ? 'Reduced motion' : 'Gentle auto orbit'}</span>
      </footer>
    </main>
  )
}
