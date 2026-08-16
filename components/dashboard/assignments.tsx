"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ASSIGNMENTS, ASSIGNMENT_SOURCES, type Assignment } from "@/lib/mock-data"
import { getFreshness } from "@/lib/freshness"
import { SectionCard } from "@/components/dashboard/section-card"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { Checkbox } from "@/components/ui/checkbox"

const BUCKETS: { key: Assignment["dueBucket"]; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "tomorrow", label: "Tomorrow" },
  { key: "week", label: "This Week" },
]

function AssignmentRow({
  assignment,
  checked,
  onToggle,
}: {
  assignment: Assignment
  checked: boolean
  onToggle: () => void
}) {
  return (
    <li className="flex items-start gap-3 py-2.5">
      <Checkbox
        checked={checked}
        onCheckedChange={onToggle}
        className="mt-0.5"
        aria-label={`Mark "${assignment.title}" done`}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              checked && "text-muted-foreground line-through",
            )}
          >
            {assignment.title}
          </p>
          <span className="shrink-0 text-xs font-semibold tabular-nums text-primary">
            {assignment.points} pts
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          <span className="font-medium text-foreground/70">{assignment.course}</span>
          <span aria-hidden>·</span>
          <span>{assignment.due}</span>
          <span aria-hidden>·</span>
          <span className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
            {assignment.source}
          </span>
        </div>
      </div>
    </li>
  )
}

export function Assignments() {
  const [done, setDone] = useState<Record<string, boolean>>(
    () => Object.fromEntries(ASSIGNMENTS.map((a) => [a.id, a.done])),
  )

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }))

  const remaining = ASSIGNMENTS.filter((a) => !done[a.id]).length

  return (
    <SectionCard
      eyebrow="02"
      title="Assignments"
      freshness={
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {ASSIGNMENT_SOURCES.map((s) => (
            <FreshnessIndicator
              key={s.source}
              source={s.source}
              freshness={getFreshness(s.minutesAgo, s.thresholds)}
            />
          ))}
        </div>
      }
    >
      <p className="mb-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">{remaining}</span> open ·{" "}
        {ASSIGNMENTS.length - remaining} done
      </p>
      <div className="space-y-4">
        {BUCKETS.map((bucket) => {
          const items = ASSIGNMENTS.filter((a) => a.dueBucket === bucket.key)
          if (items.length === 0) return null
          return (
            <div key={bucket.key}>
              <h3 className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                {bucket.label}
              </h3>
              <ul className="divide-y divide-border/60">
                {items.map((a) => (
                  <AssignmentRow
                    key={a.id}
                    assignment={a}
                    checked={!!done[a.id]}
                    onToggle={() => toggle(a.id)}
                  />
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
