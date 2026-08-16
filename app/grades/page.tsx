import Link from "next/link"
import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react"
import { GRADES } from "@/lib/mock-data"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { cn } from "@/lib/utils"

export default function GradesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="Grades" />
      </div>

      <div className="lg:pl-64">
        <TopBar />

        <main className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to dashboard
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Grades</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Current standing across all classes this term.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            {GRADES.map((g) => {
              const Trend = g.trend >= 0 ? TrendingUp : TrendingDown
              return (
                <section
                  key={g.slug}
                  id={g.slug}
                  className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-foreground">{g.course}</h2>
                      <p className="text-sm text-muted-foreground">{g.teacher}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold tabular-nums text-foreground">
                        {g.percent.toFixed(1)}%
                        <span className="ml-1.5 text-base font-medium text-muted-foreground">
                          {g.letter}
                        </span>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-xs tabular-nums",
                          g.trend >= 0 ? "text-fresh" : "text-warn",
                        )}
                      >
                        <Trend className="size-3.5" aria-hidden />
                        {g.trend >= 0 ? "+" : ""}
                        {g.trend.toFixed(1)} pts since last posted
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.min(100, g.percent)}%` }}
                    />
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}
