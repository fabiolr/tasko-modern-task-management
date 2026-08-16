import { CloudSun, MapPin } from "lucide-react"
import { WEATHER } from "@/lib/mock-data"
import { getFreshness } from "@/lib/freshness"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"

export function WeatherBanner() {
  const freshness = getFreshness(WEATHER.minutesAgo, WEATHER.thresholds)

  return (
    <div className="w-full border-b border-border bg-secondary/60 backdrop-blur supports-[backdrop-filter]:bg-secondary/50">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 text-xs sm:px-6">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <CloudSun className="size-4 text-primary" aria-hidden />
          {WEATHER.condition}
        </span>
        <span className="flex items-center gap-1 tabular-nums text-foreground">
          <span className="font-semibold">{WEATHER.tempF}&deg;</span>
          <span className="text-muted-foreground">
            H:{WEATHER.highF}&deg; L:{WEATHER.lowF}&deg;
          </span>
        </span>
        <span className="hidden items-center gap-1 text-muted-foreground sm:flex">
          <MapPin className="size-3.5" aria-hidden />
          {WEATHER.location}
        </span>
        <span className="hidden min-w-0 flex-1 truncate text-muted-foreground md:block">
          {WEATHER.forecast}
        </span>
        <span className="ml-auto">
          <FreshnessIndicator freshness={freshness} />
        </span>
      </div>
    </div>
  )
}
