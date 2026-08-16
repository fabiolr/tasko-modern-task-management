import { cn } from "@/lib/utils"
import type { Freshness, FreshnessStatus } from "@/lib/freshness"
import { CircleCheck, TriangleAlert, CircleAlert } from "lucide-react"

const CONFIG: Record<
  FreshnessStatus,
  { label: string; Icon: typeof CircleCheck; classes: string; dot: string }
> = {
  fresh: {
    label: "Live",
    Icon: CircleCheck,
    classes: "border-fresh/30 bg-fresh-muted text-fresh",
    dot: "bg-fresh",
  },
  warn: {
    label: "Delayed",
    Icon: TriangleAlert,
    classes: "border-warn/40 bg-warn-muted text-warn-foreground",
    dot: "bg-warn",
  },
  stale: {
    label: "Stale",
    Icon: CircleAlert,
    classes: "border-stale/40 bg-stale-muted text-stale-foreground",
    dot: "bg-stale",
  },
}

export function FreshnessIndicator({
  freshness,
  source,
  className,
}: {
  freshness: Freshness
  source?: string
  className?: string
}) {
  const { status, label } = freshness
  const cfg = CONFIG[status]
  const Icon = cfg.Icon

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none",
        cfg.classes,
        className,
      )}
      title={`${source ? source + " · " : ""}Updated ${label}${status !== "fresh" ? " — data may be out of date" : ""}`}
    >
      {status === "fresh" ? (
        <span className={cn("size-1.5 rounded-full", cfg.dot)} aria-hidden />
      ) : (
        <Icon className="size-3" aria-hidden />
      )}
      <span className="tabular-nums">
        {source ? `${source} · ${label}` : label}
      </span>
      <span className="sr-only">
        {cfg.label} data, updated {label}
      </span>
    </span>
  )
}
