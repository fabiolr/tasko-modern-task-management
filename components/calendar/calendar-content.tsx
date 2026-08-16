"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CALENDAR_EVENTS,
  CALENDAR_REFERENCE_TODAY,
  type CalendarEvent,
  type CalendarEventKind,
} from "@/lib/mock-data"

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

const KIND_META: Record<CalendarEventKind, { label: string; dot: string; chip: string }> = {
  class: { label: "Class", dot: "bg-primary", chip: "bg-primary/10 text-primary" },
  assignment: { label: "Assignment", dot: "bg-warn", chip: "bg-warn-muted text-warn-foreground" },
  exam: { label: "Exam", dot: "bg-stale", chip: "bg-stale-muted text-stale-foreground" },
  activity: { label: "Activity", dot: "bg-chart-3", chip: "bg-chart-3/15 text-foreground" },
  personal: { label: "Personal", dot: "bg-muted-foreground", chip: "bg-secondary text-muted-foreground" },
}

/** Parse a YYYY-MM-DD string into local date parts (no timezone shift). */
function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number)
  return { year: y, month: m - 1, day: d }
}

function toISO(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, "0")
  const dd = String(day).padStart(2, "0")
  return `${year}-${mm}-${dd}`
}

export function CalendarContent() {
  const todayParts = parseISO(CALENDAR_REFERENCE_TODAY)
  const todayISO = CALENDAR_REFERENCE_TODAY

  const [view, setView] = useState({ year: todayParts.year, month: todayParts.month })
  const [selected, setSelected] = useState(todayISO)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of CALENDAR_EVENTS) {
      const list = map.get(e.date) ?? []
      list.push(e)
      map.set(e.date, list)
    }
    return map
  }, [])

  const firstWeekday = new Date(view.year, view.month, 1).getDay()
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const goMonth = (delta: number) => {
    setView((v) => {
      const next = new Date(v.year, v.month + delta, 1)
      return { year: next.getFullYear(), month: next.getMonth() }
    })
  }

  const selectedEvents = eventsByDate.get(selected) ?? []
  const selectedParts = parseISO(selected)
  const selectedLabel = new Date(
    selectedParts.year,
    selectedParts.month,
    selectedParts.day,
  ).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Calendar grid */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {MONTHS[view.month]} {view.year}
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView({ year: todayParts.year, month: todayParts.month })}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} />
            const iso = toISO(view.year, view.month, day)
            const dayEvents = eventsByDate.get(iso) ?? []
            const isToday = iso === todayISO
            const isSelected = iso === selected
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                aria-pressed={isSelected}
                className={cn(
                  "flex min-h-16 flex-col rounded-lg border p-1.5 text-left transition-colors",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-transparent hover:border-border hover:bg-secondary/60",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full text-xs font-semibold tabular-nums",
                    isToday
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground",
                  )}
                >
                  {day}
                </span>
                <span className="mt-1 flex flex-wrap gap-0.5">
                  {dayEvents.slice(0, 4).map((e) => (
                    <span
                      key={e.id}
                      className={cn("size-1.5 rounded-full", KIND_META[e.kind].dot)}
                      aria-hidden
                    />
                  ))}
                </span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-border/70 pt-3">
          {(Object.keys(KIND_META) as CalendarEventKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className={cn("size-2 rounded-full", KIND_META[k].dot)} aria-hidden />
              {KIND_META[k].label}
            </span>
          ))}
        </div>
      </div>

      {/* Day detail */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{selectedLabel}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {selectedEvents.length} {selectedEvents.length === 1 ? "event" : "events"}
        </p>

        <div className="mt-4 space-y-2.5">
          {selectedEvents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted-foreground">
              Nothing scheduled.
            </p>
          ) : (
            selectedEvents.map((e) => (
              <div key={e.id} className="rounded-xl border border-border p-3">
                <div className="flex items-start gap-2.5">
                  <span className={cn("mt-1 size-2.5 shrink-0 rounded-full", KIND_META[e.kind].dot)} aria-hidden />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{e.title}</p>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          KIND_META[e.kind].chip,
                        )}
                      >
                        {KIND_META[e.kind].label}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{e.time ?? "All day"}</p>
                    {e.location ? (
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" aria-hidden />
                        {e.location}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
