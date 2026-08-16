import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { AssignmentsPageContent } from "@/components/assignments/assignments-page-content"

export default function AssignmentsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="Assignments" />
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

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">Assignments</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything due, grouped by when it&apos;s owed — with descriptions, effort estimates, and status.
          </p>

          <div className="mt-8">
            <AssignmentsPageContent />
          </div>
        </main>
      </div>
    </div>
  )
}
