"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, AlertCircle, Info, Check, ArrowUpRight, BellOff } from "lucide-react"
import { ALERTS, type Alert, type AlertSeverity } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const SEVERITY_META: Record<
  AlertSeverity,
  { label: string; icon: typeof Info; accent: string; badge: string }
> = {
  urgent: {
    label: "Urgent",
    icon: AlertCircle,
    accent: "border-l-stale",
    badge: "bg-stale-muted text-stale-foreground",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    accent: "border-l-warn",
    badge: "bg-warn-muted text-warn-foreground",
  },
  info: {
    label: "Info",
    icon: Info,
    accent: "border-l-primary",
    badge: "bg-primary/10 text-primary",
  },
}

type Filter = "all" | "unread" | AlertSeverity

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "urgent", label: "Urgent" },
  { key: "warning", label: "Warnings" },
  { key: "info", label: "Info" },
]

export function AlertsContent() {
  const [alerts, setAlerts] = useState<Alert[]>(ALERTS)
  const [filter, setFilter] = useState<Filter>("all")

  const unreadCount = alerts.filter((a) => !a.read).length

  const filtered = useMemo(() => {
    if (filter === "all") return alerts
    if (filter === "unread") return alerts.filter((a) => !a.read)
    return alerts.filter((a) => a.severity === filter)
  }, [alerts, filter])

  const markRead = (id: string) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)))
  const markAllRead = () => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const isActive = filter === f.key
            const count =
              f.key === "unread"
                ? unreadCount
                : f.key === "all"
                  ? alerts.length
                  : alerts.filter((a) => a.severity === f.key).length
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={isActive}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                    isActive ? "bg-primary-foreground/20" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40"
        >
          <Check className="size-4" aria-hidden />
          Mark all read
        </button>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
            <BellOff className="size-6 text-muted-foreground" aria-hidden />
            <p className="text-sm text-muted-foreground">No alerts here.</p>
          </div>
        ) : (
          filtered.map((a) => {
            const meta = SEVERITY_META[a.severity]
            const Icon = meta.icon
            return (
              <article
                key={a.id}
                className={cn(
                  "rounded-2xl border border-l-4 border-border bg-card p-4 shadow-sm transition-colors",
                  meta.accent,
                  !a.read && "bg-secondary/30",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                      meta.badge,
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {!a.read && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      )}
                      <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", meta.badge)}>
                        {a.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{a.detail}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-muted-foreground">{a.time}</span>
                      {a.href && (
                        <Link
                          href={a.href}
                          onClick={() => markRead(a.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View
                          <ArrowUpRight className="size-3.5" aria-hidden />
                        </Link>
                      )}
                      {!a.read && (
                        <button
                          type="button"
                          onClick={() => markRead(a.id)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          <Check className="size-3.5" aria-hidden />
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })
        )}
      </div>
    </div>
  )
}
