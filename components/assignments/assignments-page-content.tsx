"use client"

import { useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import {
  ASSIGNMENTS,
  ASSIGNMENT_SOURCES,
  type Assignment,
  type AssignmentStatus,
} from "@/lib/mock-data"
import { getFreshness } from "@/lib/freshness"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, FileText } from "lucide-react"

const BUCKETS: { key: Assignment["dueBucket"]; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
]

type StatusFilter = "all" | "todo" | "done"

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "todo", label: "To do" },
  { key: "done", label: "Done" },
]

const STATUS_META: Record<AssignmentStatus, { label: string; className: string }> = {
  "not-started": { label: "Not started", className: "bg-secondary text-muted-foreground" },
  "in-progress": { label: "In progress", className: "bg-warn-muted text-warn-foreground" },
  submitted: { label: "Submitted", className: "bg-fresh-muted text-fresh-foreground" },
}

function formatEst(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h}h ${m}m` : `${h}h`
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{value}</p>
      {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function AssignmentCard({
  assignment,
  checked,
  onToggle,
}: {
  assignment: Assignment
  checked: boolean
  onToggle: () => void
}) {
  const status: AssignmentStatus = checked ? "submitted" : assignment.status
  const meta = STATUS_META[status]
  return (
    <li className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={checked}
          onCheckedChange={onToggle}
          className="mt-1"
          aria-label={`Mark "${assignment.title}" done`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <h3
              className={cn(
                "text-sm font-semibold text-foreground",
                checked && "text-muted-foreground line-through",
              )}
            >
              {assignment.title}
            </h3>
            <span className="shrink-0 text-sm font-bold tabular-nums text-primary">
              {assignment.points} pts
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">{assignment.course}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-medium text-accent-foreground">
              {assignment.type}
            </span>
            <span aria-hidden>·</span>
            <span className="font-medium text-foreground/80">{assignment.due}</span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{assignment.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", meta.className)}>
              {meta.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {formatEst(assignment.estMinutes)} est.
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground/70">
              <FileText className="size-3.5" aria-hidden />
              {assignment.source}
            </span>
          </div>
        </div>
      </div>
    </li>
  )
}

export function AssignmentsPageContent() {
  const [done, setDone] = useState<Record<string, boolean>>(
    () => Object.fromEntries(ASSIGNMENTS.map((a) => [a.id, a.done])),
  )
  const [filter, setFilter] = useState<StatusFilter>("all")

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }))

  const stats = useMemo(() => {
    const open = ASSIGNMENTS.filter((a) => !done[a.id])
    const dueToday = open.filter((a) => a.dueBucket === "today").length
    const points = open.reduce((sum, a) => sum + a.points, 0)
    const minutes = open.reduce((sum, a) => sum + a.estMinutes, 0)
    return { openCount: open.length, dueToday, points, minutes }
  }, [done])

  const visible = (a: Assignment) => {
    if (filter === "todo") return !done[a.id]
    if (filter === "done") return !!done[a.id]
    return true
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Open" value={String(stats.openCount)} hint={`${ASSIGNMENTS.length} total`} />
        <StatCard label="Due today" value={String(stats.dueToday)} hint="across all classes" />
        <StatCard label="Points at stake" value={String(stats.points)} hint="from open work" />
        <StatCard label="Est. time left" value={formatEst(stats.minutes)} hint="to finish open work" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-border bg-card p-0.5">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              aria-pressed={filter === f.key}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {ASSIGNMENT_SOURCES.map((s) => (
            <FreshnessIndicator
              key={s.source}
              source={s.source}
              freshness={getFreshness(s.minutesAgo, s.thresholds)}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-8">
        {BUCKETS.map((bucket) => {
          const items = ASSIGNMENTS.filter((a) => a.dueBucket === bucket.key && visible(a))
          if (items.length === 0) return null
          return (
            <section key={bucket.key}>
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {bucket.label}
                <span className="ml-2 text-muted-foreground/60">{items.length}</span>
              </h2>
              <ul className="space-y-3">
                {items.map((a) => (
                  <AssignmentCard
                    key={a.id}
                    assignment={a}
                    checked={!!done[a.id]}
                    onToggle={() => toggle(a.id)}
                  />
                ))}
              </ul>
            </section>
          )
        })}
      </div>
    </div>
  )
}
