"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, User, Send, Sparkles } from "lucide-react"
import { getAssistantReply, type ChatMessage } from "@/lib/chatbot"
import { USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const SUGGESTIONS = [
  "What's due today?",
  "What's my lowest grade?",
  "What's on my calendar today?",
  "Any unread alerts?",
]

let idCounter = 0
const nextId = () => `m${++idCounter}`

export function ChatbotContent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextId(),
      role: "assistant",
      content: `Hi ${USER.name}! I'm your dashboard assistant. Ask me about your grades, assignments, calendar, alerts, or to-dos.`,
    },
  ])
  const [input, setInput] = useState("")
  const [thinking, setThinking] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, thinking])

  const send = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || thinking) return

    const userMsg: ChatMessage = { id: nextId(), role: "user", content: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setThinking(true)

    // Simulated latency so the local responder feels conversational.
    // Replace with your AI API call when ready.
    window.setTimeout(() => {
      const reply = getAssistantReply(trimmed)
      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: reply }])
      setThinking(false)
    }, 450)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return
      e.preventDefault()
      send(input)
    }
  }

  return (
    <div className="flex h-[calc(100vh-11rem)] min-h-[420px] flex-col rounded-2xl border border-border bg-card shadow-sm">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex items-start gap-3", m.role === "user" && "flex-row-reverse")}
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                m.role === "assistant"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {m.role === "assistant" ? (
                <Bot className="size-4" aria-hidden />
              ) : (
                <User className="size-4" aria-hidden />
              )}
            </span>
            <div
              className={cn(
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "assistant"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Bot className="size-4" aria-hidden />
            </span>
            <div className="flex items-center gap-1 rounded-2xl bg-secondary px-4 py-3">
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Suggestions (only before the first question) */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-6">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Sparkles className="size-3.5 text-primary" aria-hidden />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="border-t border-border p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/40">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Ask about your grades, assignments, schedule…"
            aria-label="Message the assistant"
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => send(input)}
            disabled={!input.trim() || thinking}
            aria-label="Send message"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden />
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] text-muted-foreground">
          Answers come from your dashboard data. Connect your own AI key later for open-ended questions.
        </p>
      </div>
    </div>
  )
}
