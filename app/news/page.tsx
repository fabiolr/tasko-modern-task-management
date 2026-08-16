import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { NewsContent } from "@/components/news/news-content"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { getFreshness } from "@/lib/freshness"
import { NEWS_FRESHNESS } from "@/lib/mock-data"

export default function NewsPage() {
  const freshness = getFreshness(NEWS_FRESHNESS.minutesAgo, NEWS_FRESHNESS.thresholds)

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="News" />
      </div>

      <div className="lg:pl-64">
        <TopBar />

        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to dashboard
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">News</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Headlines pulled from multiple sources, filterable by feed and topic.
              </p>
            </div>
            <FreshnessIndicator source="WorldMonitor +3" freshness={freshness} />
          </div>

          <div className="mt-6">
            <NewsContent />
          </div>
        </main>
      </div>
    </div>
  )
}
