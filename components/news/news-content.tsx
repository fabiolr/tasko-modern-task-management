"use client"

import { useMemo, useState } from "react"
import { Globe, ArrowUpRight, Rss } from "lucide-react"
import {
  NEWS_ARTICLES,
  NEWS_SOURCES,
  type NewsCategory,
} from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CATEGORIES: (NewsCategory | "All")[] = [
  "All",
  "World",
  "Politics",
  "Business",
  "Technology",
  "Science",
  "Sports",
]

export function NewsContent() {
  const [sourceId, setSourceId] = useState<string>("all")
  const [category, setCategory] = useState<NewsCategory | "All">("All")

  const sourceName = useMemo(() => {
    const map = new Map(NEWS_SOURCES.map((s) => [s.id, s.name]))
    return (id: string) => map.get(id) ?? id
  }, [])

  const filtered = useMemo(() => {
    return NEWS_ARTICLES.filter(
      (a) =>
        (sourceId === "all" || a.sourceId === sourceId) &&
        (category === "All" || a.category === category),
    )
  }, [sourceId, category])

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
      {/* Sources rail */}
      <aside className="lg:col-span-1">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <Rss className="size-4 text-primary" aria-hidden />
            <h2 className="text-sm font-bold uppercase tracking-wide text-foreground">Sources</h2>
          </div>
          <div className="mt-3 space-y-1">
            <button
              type="button"
              onClick={() => setSourceId("all")}
              aria-pressed={sourceId === "all"}
              className={cn(
                "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                sourceId === "all"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              All sources
              <span
                className={cn(
                  "rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                  sourceId === "all" ? "bg-primary-foreground/20" : "bg-secondary",
                )}
              >
                {NEWS_ARTICLES.length}
              </span>
            </button>
            {NEWS_SOURCES.map((s) => {
              const count = NEWS_ARTICLES.filter((a) => a.sourceId === s.id).length
              const isActive = sourceId === s.id
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSourceId(s.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span className="truncate">{s.name}</span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-1.5 text-[11px] font-semibold tabular-nums",
                        isActive ? "bg-primary-foreground/20" : "bg-secondary",
                      )}
                    >
                      {count}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "inline-flex w-fit items-center gap-1 text-[10px] font-semibold uppercase tracking-wide",
                      s.connected
                        ? "text-fresh"
                        : isActive
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground/70",
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        s.connected ? "bg-fresh" : "bg-muted-foreground/50",
                      )}
                      aria-hidden
                    />
                    {s.connected ? "Live" : "Sample feed"}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl border border-dashed border-border bg-secondary/40 p-3">
            <p className="text-xs font-medium text-foreground">More feeds coming</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              WorldMonitor and other sources will stream in live once their backends are connected.
            </p>
          </div>
        </div>
      </aside>

      {/* Feed */}
      <div className="lg:col-span-3">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const isActive = category === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {c}
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
              <Globe className="size-6 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">No stories match this filter.</p>
            </div>
          ) : (
            filtered.map((a) => (
              <article
                key={a.id}
                className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-primary">{sourceName(a.sourceId)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 font-medium text-muted-foreground">
                    {a.category}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{a.time}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground text-balance">
                  {a.headline}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.summary}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground/70">
                  Full story when source is connected
                  <ArrowUpRight className="size-4" aria-hidden />
                </span>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
