"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
import { BRIEFINGS, BRIEFING_FRESHNESS } from "@/lib/mock-data"
import { getFreshness } from "@/lib/freshness"
import { SectionCard } from "@/components/dashboard/section-card"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { Button } from "@/components/ui/button"

export function MorningBriefing() {
  const [index, setIndex] = useState(0)
  const briefing = BRIEFINGS[index]
  const freshness = getFreshness(BRIEFING_FRESHNESS.minutesAgo, BRIEFING_FRESHNESS.thresholds)

  const atLatest = index === 0
  const atOldest = index === BRIEFINGS.length - 1
  const PeriodIcon = briefing.period === "Morning" ? Sun : Moon

  return (
    <SectionCard
      eyebrow="04"
      title="Morning Briefing"
      freshness={<FreshnessIndicator freshness={freshness} />}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
            <PeriodIcon className="size-3.5" aria-hidden />
            {briefing.period} · {briefing.date}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Newer briefing"
              disabled={atLatest}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="size-4" aria-hidden />
            </Button>
            <span className="text-xs tabular-nums text-muted-foreground">
              {index + 1}/{BRIEFINGS.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Older briefing"
              disabled={atOldest}
              onClick={() => setIndex((i) => Math.min(BRIEFINGS.length - 1, i + 1))}
            >
              <ChevronRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>

        <p className="text-pretty text-[15px] leading-relaxed text-foreground/90">
          {briefing.body}
        </p>

        {!atLatest ? (
          <button
            type="button"
            onClick={() => setIndex(0)}
            className="mt-auto self-start text-xs font-medium text-primary hover:underline"
          >
            Back to latest
          </button>
        ) : null}
      </div>
    </SectionCard>
  )
}
