import { Component, type ErrorInfo, type ReactNode } from 'react'

type RendererErrorBoundaryProps = {
  children: ReactNode
  fallback: (error: Error) => ReactNode
}

type RendererErrorBoundaryState = {
  error: Error | null
}

export class RendererErrorBoundary extends Component<
  RendererErrorBoundaryProps,
  RendererErrorBoundaryState
> {
  state: RendererErrorBoundaryState = {
    error: null,
  }

  static getDerivedStateFromError(error: Error): RendererErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('MaybeBoudha renderer error', error, info)
    }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error)
    }

    return this.props.children
  }
}
