export type FreshnessStatus = "fresh" | "warn" | "stale"

export type FreshnessThresholds = {
  /** Minutes after which data is considered a warning. */
  warnAfter: number
  /** Minutes after which data is considered stale. */
  staleAfter: number
}

export type Freshness = {
  status: FreshnessStatus
  /** Human label like "6m ago", "3h ago", "2d ago". */
  label: string
  minutesAgo: number
}

function formatAge(minutesAgo: number): string {
  if (minutesAgo < 1) return "just now"
  if (minutesAgo < 60) return `${minutesAgo}m ago`
  const hours = Math.floor(minutesAgo / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function getFreshness(minutesAgo: number, thresholds: FreshnessThresholds): Freshness {
  let status: FreshnessStatus = "fresh"
  if (minutesAgo >= thresholds.staleAfter) status = "stale"
  else if (minutesAgo >= thresholds.warnAfter) status = "warn"
  return { status, label: formatAge(minutesAgo), minutesAgo }
}
