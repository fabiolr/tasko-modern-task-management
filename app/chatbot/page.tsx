import Link from "next/link"
import { ArrowLeft, Bot } from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/top-bar"
import { ChatbotContent } from "@/components/chatbot/chatbot-content"

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar activeLabel="Chatbot" />
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

          <div className="mt-4 flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Bot className="size-5" aria-hidden />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Assistant</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Ask questions about anything in your dashboard — grades, assignments, schedule, and more.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <ChatbotContent />
          </div>
        </main>
      </div>
    </div>
  )
}
