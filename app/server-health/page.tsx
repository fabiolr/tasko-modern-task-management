import Link from "next/link"
import { ArrowLeft, Globe, Bot, Cpu, MemoryStick, HardDrive, Clock, Wifi } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"

type Metric = {
  label: string
  value: string
  icon: typeof Cpu
}

type Server = {
  id: string
  name: string
  role: string
  icon: typeof Globe
  status: "online" | "degraded" | "offline" | "unknown"
  metrics: Metric[]
}

const servers: Server[] = [
  {
    id: "web-host",
    name: "Web Host",
    role: "Runs this dashboard",
    icon: Globe,
    status: "unknown",
    metrics: [
      { label: "CPU", value: "—", icon: Cpu },
      { label: "Memory", value: "—", icon: MemoryStick },
      { label: "Disk", value: "—", icon: HardDrive },
      { label: "Uptime", value: "—", icon: Clock },
    ],
  },
  {
    id: "mrta-bot",
    name: "MrTA",
    role: "OpenClaw bot host",
    icon: Bot,
    status: "unknown",
    metrics: [
      { label: "CPU", value: "—", icon: Cpu },
      { label: "Memory", value: "—", icon: MemoryStick },
      { label: "Disk", value: "—", icon: HardDrive },
      { label: "Uptime", value: "—", icon: Clock },
    ],
  },
]

const statusStyles: Record<Server["status"], { dot: string; text: string; label: string }> = {
  online: { dot: "bg-fresh", text: "text-fresh", label: "Online" },
  degraded: { dot: "bg-warn", text: "text-warn", label: "Degraded" },
  offline: { dot: "bg-stale", text: "text-stale", label: "Offline" },
  unknown: { dot: "bg-muted-foreground", text: "text-muted-foreground", label: "Not connected" },
}

export default function ServerHealthPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="Server Health" />
      </div>

      <div className="lg:pl-64">
        <TopBar />

        <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Back to dashboard
          </Link>

          <div className="mt-4">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Server Health</h1>
            <p className="mt-1 text-sm text-muted-foreground text-pretty">
              Live status for your two servers. Metrics are placeholders until each host is wired up
              to report real telemetry.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {servers.map((server) => {
              const status = statusStyles[server.status]
              return (
                <section
                  key={server.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <server.icon className="size-5" aria-hidden />
                      </div>
                      <div className="leading-tight">
                        <h2 className="text-base font-semibold text-foreground">{server.name}</h2>
                        <p className="text-xs text-muted-foreground">{server.role}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium ${status.text}`}
                    >
                      <span className={`size-1.5 rounded-full ${status.dot}`} aria-hidden />
                      {status.label}
                    </span>
                  </div>

                  <dl className="mt-5 grid grid-cols-2 gap-3">
                    {server.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl border border-border bg-secondary/40 p-3"
                      >
                        <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                          <metric.icon className="size-3.5" aria-hidden />
                          {metric.label}
                        </dt>
                        <dd className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                          {metric.value}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-2.5 text-xs text-muted-foreground">
                    <Wifi className="size-3.5 shrink-0" aria-hidden />
                    <span className="text-pretty">
                      Waiting for a telemetry endpoint. Point this host at the dashboard to stream
                      live metrics.
                    </span>
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
