"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import { USER } from "@/lib/mock-data"
import { ThemeToggle } from "@/components/dashboard/theme-toggle"

function offsetMinutes(timeZone: string, date: Date): number {
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
  const local = new Date(date.toLocaleString("en-US", { timeZone }))
  return Math.round((local.getTime() - utc.getTime()) / 60000)
}

function greeting(hour: number): string {
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

export function DashboardHeader({ guest = false }: { guest?: boolean }) {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const tz = USER.schoolTimeZone

  const timeStr = now
    ? now.toLocaleTimeString("en-US", {
        timeZone: tz,
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    : "--:--:--"

  const dateStr = now
    ? now.toLocaleDateString("en-US", {
        timeZone: tz,
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "\u00A0"

  const schoolHour = now
    ? Number(now.toLocaleString("en-US", { timeZone: tz, hour: "numeric", hour12: false }))
    : 8

  // Difference between the viewer's local zone and school time.
  const diffHours = now ? (offsetMinutes(USER.localTimeZone, now) - offsetMinutes(tz, now)) / 60 : 0
  const showsDiff = diffHours !== 0
  const diffLabel = `${diffHours > 0 ? "+" : ""}${diffHours}h`

  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {greeting(schoolHour)},{" "}
          <span className="text-primary">{guest ? "there" : USER.name}</span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{dateStr}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="flex items-center gap-1.5 font-mono text-xl font-semibold tabular-nums text-foreground">
            <Clock className="size-4 text-muted-foreground" aria-hidden />
            {timeStr}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {showsDiff
              ? `${USER.localCity} · ${USER.schoolTimeZoneLabel} ${diffLabel}`
              : USER.schoolTimeZoneLabel}
          </span>
        </div>
        <ThemeToggle />
      </div>
    </header>
  )
}
