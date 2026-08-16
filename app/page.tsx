import { WeatherBanner } from "@/components/dashboard/weather-banner"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MorningBriefing } from "@/components/dashboard/morning-briefing"
import { Assignments } from "@/components/dashboard/assignments"
import { TodoLists } from "@/components/dashboard/todo-lists"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-20">
        <WeatherBanner />
      </div>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <DashboardHeader />

        <div className="mt-8 grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <MorningBriefing />
          </div>
          <div className="lg:col-span-3">
            <Assignments />
          </div>
        </div>

        <div className="mt-5">
          <TodoLists />
        </div>
      </main>
    </div>
  )
}
