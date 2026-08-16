"use client"

import React from "react"
import { TriangleAlert } from "lucide-react"

type Props = {
  /** Section name shown in the fallback. */
  name: string
  children: React.ReactNode
}

type State = { hasError: boolean }

/**
 * Isolates a dashboard section so one broken data source cannot blank the page.
 * Renders a self-contained fallback in place of the failed section.
 */
export class SectionErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.log("[v0] Section failed to render:", this.props.name, error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex h-full min-h-[8rem] flex-col items-center justify-center gap-2 rounded-xl border border-stale/40 bg-stale-muted p-6 text-center"
        >
          <TriangleAlert className="size-5 text-stale" aria-hidden />
          <p className="text-sm font-medium text-stale-foreground">
            {this.props.name} couldn&apos;t load
          </p>
          <p className="max-w-xs text-xs text-stale-foreground/80">
            This section failed independently. The rest of your dashboard is unaffected.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
