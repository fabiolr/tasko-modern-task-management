"use client"

import { useMemo, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { LineChart as LineChartIcon, TrendingUp, TrendingDown, ChevronDown } from "lucide-react"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { GRADES, GRADE_HISTORY, GRADE_HISTORY_LABELS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const AVG_KEY = "avg"

// Distinct hues (kept in the app's saturation/lightness range) so up to seven
// class lines remain readable at once.
const CLASS_COLORS: Record<string, string> = {
  "ap-calculus-bc": "oklch(0.55 0.2 295)",
  "ap-chemistry": "oklch(0.62 0.13 200)",
  "ap-physics-c": "oklch(0.64 0.15 150)",
  "ap-english-lit": "oklch(0.7 0.15 70)",
  "ap-us-history": "oklch(0.6 0.2 25)",
  "ap-spanish-lang": "oklch(0.62 0.18 340)",
  "ap-cs-a": "oklch(0.6 0.14 255)",
}

export function GradesAnalytics() {
  const [open, setOpen] = useState(false)
  // Which series are visible. Start with the overall average + a couple of classes.
  const [active, setActive] = useState<Set<string>>(
    () => new Set<string>([AVG_KEY, "ap-calculus-bc", "ap-us-history"]),
  )

  const chartData = useMemo(() => {
    return GRADE_HISTORY_LABELS.map((label, i) => {
      const row: Record<string, number | string> = { label }
      let sum = 0
      let n = 0
      for (const g of GRADES) {
        const v = GRADE_HISTORY[g.slug]?.[i]
        if (typeof v === "number") {
          row[g.slug] = v
          sum += v
          n += 1
        }
      }
      row[AVG_KEY] = n ? Number((sum / n).toFixed(1)) : 0
      return row
    })
  }, [])

  const config = useMemo<ChartConfig>(() => {
    const c: ChartConfig = {
      [AVG_KEY]: { label: "Overall average", color: "var(--primary)" },
    }
    for (const g of GRADES) {
      c[g.slug] = { label: g.course, color: CLASS_COLORS[g.slug] ?? "var(--chart-1)" }
    }
    return c
  }, [])

  const currentAvg = chartData[chartData.length - 1]?.[AVG_KEY] as number
  const firstAvg = chartData[0]?.[AVG_KEY] as number
  const avgChange = Number((currentAvg - firstAvg).toFixed(1))
  const AvgTrend = avgChange >= 0 ? TrendingUp : TrendingDown

  const toggle = (key: string) => {
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <section className="rounded-2xl border border-border bg-card text-card-foreground shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-5 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <LineChartIcon className="size-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-base font-semibold text-foreground">Grade Analytics</span>
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
                avgChange >= 0 ? "bg-fresh-muted text-fresh" : "bg-warn-muted text-warn-foreground",
              )}
            >
              <AvgTrend className="size-3" aria-hidden />
              {avgChange >= 0 ? "+" : ""}
              {avgChange} pts
            </span>
          </span>
          <span className="mt-0.5 block text-sm text-muted-foreground">
            Track your progress over the term. Overall average is now {currentAvg}%.
          </span>
        </span>
        <ChevronDown
          className={cn("size-5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="border-t border-border p-5">
          {/* Series toggles */}
          <div className="mb-4 flex flex-wrap gap-2">
            <SeriesChip
              label="Overall average"
              color="var(--primary)"
              active={active.has(AVG_KEY)}
              onClick={() => toggle(AVG_KEY)}
            />
            {GRADES.map((g) => (
              <SeriesChip
                key={g.slug}
                label={g.course}
                color={CLASS_COLORS[g.slug] ?? "var(--chart-1)"}
                active={active.has(g.slug)}
                onClick={() => toggle(g.slug)}
              />
            ))}
          </div>

          <ChartContainer config={config} className="h-[340px] w-full">
            <LineChart data={chartData} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <YAxis
                domain={[70, 100]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={44}
                tickFormatter={(v) => `${v}%`}
                className="text-xs"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              {active.has(AVG_KEY) && (
                <Line
                  type="monotone"
                  dataKey={AVG_KEY}
                  name="Overall average"
                  stroke="var(--color-avg)"
                  strokeWidth={3}
                  strokeDasharray="6 4"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              )}
              {GRADES.map((g) =>
                active.has(g.slug) ? (
                  <Line
                    key={g.slug}
                    type="monotone"
                    dataKey={g.slug}
                    name={g.course}
                    stroke={`var(--color-${g.slug})`}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ) : null,
              )}
            </LineChart>
          </ChartContainer>

          <p className="mt-3 text-xs text-muted-foreground">
            Showing {GRADE_HISTORY_LABELS.length} synced snapshots this term. New grade uploads are added here
            automatically.
          </p>
        </div>
      )}
    </section>
  )
}

function SeriesChip({
  label,
  color,
  active,
  onClick,
}: {
  label: string
  color: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "border-border bg-secondary text-foreground"
          : "border-border/60 bg-transparent text-muted-foreground hover:bg-secondary/50",
      )}
    >
      <span
        className={cn("size-2.5 rounded-full transition-opacity", !active && "opacity-40")}
        style={{ backgroundColor: color }}
        aria-hidden
      />
      {label}
    </button>
  )
}
