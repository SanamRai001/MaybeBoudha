export function LoadingState() {
  return (
    <div className="viewer-state" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <div>
        <p className="viewer-state-label">Preparing scene</p>
        <p className="viewer-state-copy">Starting the replaceable viewer runtime…</p>
      </div>
    </div>
  )
}
