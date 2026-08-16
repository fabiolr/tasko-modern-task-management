"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin, CalendarDays } from "lucide-react"
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

const KIND_META: Record<
  CalendarEventKind,
  { label: string; dot: string; chip: string; bar: string }
> = {
  class: { label: "Class", dot: "bg-primary", chip: "bg-primary/10 text-primary", bar: "border-l-primary" },
  assignment: { label: "Assignment", dot: "bg-warn", chip: "bg-warn-muted text-warn-foreground", bar: "border-l-warn" },
  exam: { label: "Exam", dot: "bg-stale", chip: "bg-stale-muted text-stale-foreground", bar: "border-l-stale" },
  activity: { label: "Activity", dot: "bg-chart-3", chip: "bg-chart-3/15 text-foreground", bar: "border-l-chart-3" },
  personal: { label: "Personal", dot: "bg-muted-foreground", chip: "bg-secondary text-muted-foreground", bar: "border-l-muted-foreground" },
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
  // Pad the tail so the grid always fills complete weeks.
  while (cells.length % 7 !== 0) cells.push(null)

  const monthEventCount = useMemo(() => {
    const prefix = `${view.year}-${String(view.month + 1).padStart(2, "0")}-`
    return CALENDAR_EVENTS.filter((e) => e.date.startsWith(prefix)).length
  }, [view])

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
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-4">
      {/* Calendar grid */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6 xl:col-span-3">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {MONTHS[view.month]} <span className="text-muted-foreground">{view.year}</span>
            </h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {monthEventCount} {monthEventCount === 1 ? "event" : "events"} this month
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => goMonth(-1)}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4.5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setView({ year: todayParts.year, month: todayParts.month })}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => goMonth(1)}
              className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Next month"
            >
              <ChevronRight className="size-4.5" aria-hidden />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
            >
              <span className="hidden sm:inline">{d}</span>
              <span className="sm:hidden">{d.charAt(0)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 overflow-hidden rounded-lg">
          {cells.map((day, i) => {
            if (day === null) return <div key={`blank-${i}`} className="min-h-24 border-b border-r border-border/50 bg-secondary/20 sm:min-h-32" />
            const iso = toISO(view.year, view.month, day)
            const dayEvents = eventsByDate.get(iso) ?? []
            const isToday = iso === todayISO
            const isSelected = iso === selected
            const visible = dayEvents.slice(0, 3)
            const overflow = dayEvents.length - visible.length
            return (
              <button
                key={iso}
                type="button"
                onClick={() => setSelected(iso)}
                aria-pressed={isSelected}
                className={cn(
                  "group flex min-h-24 flex-col gap-1 border-b border-r border-border/50 p-1.5 text-left align-top transition-colors sm:min-h-32 sm:p-2",
                  isSelected ? "bg-primary/5 ring-1 ring-inset ring-primary" : "hover:bg-secondary/50",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold tabular-nums",
                    isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                  )}
                >
                  {day}
                </span>
                <span className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden">
                  {visible.map((e) => (
                    <span
                      key={e.id}
                      className={cn(
                        "flex items-center gap-1 truncate rounded-[5px] border-l-2 bg-secondary/70 px-1.5 py-0.5 text-[11px] font-medium leading-tight text-foreground",
                        KIND_META[e.kind].bar,
                      )}
                    >
                      <span className="truncate">{e.title}</span>
                    </span>
                  ))}
                  {overflow > 0 && (
                    <span className="px-1 text-[11px] font-medium text-muted-foreground">+{overflow} more</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 pt-1">
          {(Object.keys(KIND_META) as CalendarEventKind[]).map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("size-2.5 rounded-full", KIND_META[k].dot)} aria-hidden />
              {KIND_META[k].label}
            </span>
          ))}
        </div>
      </div>

      {/* Day detail */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" aria-hidden />
          <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{selectedLabel}</h3>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {selectedEvents.length} {selectedEvents.length === 1 ? "event" : "events"}
        </p>

        <div className="mt-4 space-y-2.5">
          {selectedEvents.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-10 text-center text-sm text-muted-foreground">
              Nothing scheduled.
            </p>
          ) : (
            selectedEvents.map((e) => (
              <div
                key={e.id}
                className={cn("rounded-xl border border-l-4 border-border bg-secondary/30 p-3", KIND_META[e.kind].bar)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{e.title}</p>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      KIND_META[e.kind].chip,
                    )}
                  >
                    {KIND_META[e.kind].label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{e.time ?? "All day"}</p>
                {e.location ? (
                  <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" aria-hidden />
                    {e.location}
                  </p>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
