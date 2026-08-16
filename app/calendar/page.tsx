import Link from "next/link"
import { ArrowLeft, Apple } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { CalendarContent } from "@/components/calendar/calendar-content"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { getFreshness } from "@/lib/freshness"
import { CALENDAR_FRESHNESS } from "@/lib/mock-data"

export default function CalendarPage() {
  const freshness = getFreshness(CALENDAR_FRESHNESS.minutesAgo, CALENDAR_FRESHNESS.thresholds)

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="Calendar" />
      </div>

      <div className="lg:pl-64">
        <TopBar />

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Calendar</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Classes, deadlines, and activities in one view.
              </p>
            </div>
            <FreshnessIndicator source="Apple Calendar" freshness={freshness} />
          </div>

          {/* Placeholder until the real Apple Calendar backend is wired up */}
          <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background">
              <Apple className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">Showing sample events</p>
              <p className="text-xs text-muted-foreground">
                Connect your Apple Calendar to replace these with your real schedule. Backend sync coming soon.
              </p>
            </div>
            <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
              Not connected
            </span>
          </div>

          <div className="mt-6">
            <CalendarContent />
          </div>
        </main>
      </div>
    </div>
  )
}
