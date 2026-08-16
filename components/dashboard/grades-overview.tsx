import Link from "next/link"
import { ChevronRight, TrendingDown, TrendingUp } from "lucide-react"
import { GRADES, GRADES_FRESHNESS } from "@/lib/mock-data"
import { getFreshness } from "@/lib/freshness"
import { SectionCard } from "@/components/dashboard/section-card"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { cn } from "@/lib/utils"

function gradeColor(percent: number) {
  if (percent >= 93) return "text-fresh"
  if (percent >= 85) return "text-foreground"
  return "text-warn"
}

export function GradesOverview() {
  const freshness = getFreshness(GRADES_FRESHNESS.minutesAgo, GRADES_FRESHNESS.thresholds)

  return (
    <SectionCard
      className="h-full"
      eyebrow="01"
      title="Grades"
      freshness={<FreshnessIndicator freshness={freshness} />}
      action={
        <Link
          href="/grades"
          className="text-xs font-medium text-primary hover:underline"
        >
          View all
        </Link>
      }
      contentClassName="p-0"
    >
      <ul className="flex h-full flex-col divide-y divide-border/70">
        {GRADES.map((g) => {
          const Trend = g.trend >= 0 ? TrendingUp : TrendingDown
          return (
            <li key={g.slug} className="flex-1">
              <Link
                href={`/grades#${g.slug}`}
                className="group flex h-full items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/60 focus-visible:bg-accent/60 focus-visible:outline-none"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{g.course}</p>
                  <p className="truncate text-xs text-muted-foreground">{g.teacher}</p>
                </div>

                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] tabular-nums",
                    g.trend >= 0 ? "text-fresh" : "text-warn",
                  )}
                >
                  <Trend className="size-3" aria-hidden />
                  {g.trend >= 0 ? "+" : ""}
                  {g.trend.toFixed(1)}
                </span>

                <div className="w-16 text-right">
                  <span className={cn("text-sm font-bold tabular-nums", gradeColor(g.percent))}>
                    {g.percent.toFixed(1)}%
                  </span>
                  <span className="ml-1 text-xs text-muted-foreground">{g.letter}</span>
                </div>

                <ChevronRight
                  className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}
