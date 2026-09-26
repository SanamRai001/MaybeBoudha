type ViewerFallbackProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function ViewerFallback({
  title,
  description,
  actionLabel,
  onAction,
}: ViewerFallbackProps) {
  return (
    <div className="viewer-state viewer-state-error" role="alert">
      <div>
        <p className="viewer-state-label">{title}</p>
        <p className="viewer-state-copy">{description}</p>
      </div>

      {actionLabel && onAction ? (
        <button className="viewer-action" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  )
}
