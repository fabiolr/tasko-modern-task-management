import type React from "react"
import { cn } from "@/lib/utils"
import { SectionErrorBoundary } from "@/components/dashboard/section-error-boundary"

export function SectionCard({
  title,
  eyebrow,
  freshness,
  action,
  className,
  contentClassName,
  children,
}: {
  title: string
  /** Small label above the title, e.g. a section number. */
  eyebrow?: string
  /** Right-aligned freshness indicator(s). */
  freshness?: React.ReactNode
  /** Right-aligned actions such as buttons or tabs. */
  action?: React.ReactNode
  className?: string
  contentClassName?: string
  children: React.ReactNode
}) {
  return (
    <section
      className={cn(
        "flex flex-col rounded-2xl border border-border bg-card text-card-foreground shadow-sm",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary/70">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {freshness}
          {action}
        </div>
      </header>
      <div className={cn("flex-1 p-5", contentClassName)}>
        <SectionErrorBoundary name={title}>{children}</SectionErrorBoundary>
      </div>
    </section>
  )
}
