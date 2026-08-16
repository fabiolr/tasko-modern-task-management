"use client"

import { useState } from "react"
import { Plus, GraduationCap, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { COURSEWORK_TODOS, PERSONAL_TODOS, type Todo } from "@/lib/mock-data"
import { SectionCard } from "@/components/dashboard/section-card"
import { FreshnessIndicator } from "@/components/dashboard/freshness-indicator"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

let idCounter = 0

function TodoColumn({
  title,
  Icon,
  initial,
}: {
  title: string
  Icon: typeof User
  initial: Todo[]
}) {
  const [todos, setTodos] = useState<Todo[]>(initial)
  const [value, setValue] = useState("")

  function add() {
    const text = value.trim()
    if (!text) return
    setTodos((t) => [{ id: `new-${idCounter++}`, text, done: false }, ...t])
    setValue("")
  }

  function toggle(id: string) {
    setTodos((t) => t.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo)))
  }

  const open = todos.filter((t) => !t.done).length

  return (
    <div className="flex flex-col">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="size-4 text-primary" aria-hidden />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
          {title}
        </h3>
        <span className="ml-auto text-xs tabular-nums text-muted-foreground">{open} open</span>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) add()
          }}
          placeholder={`Add to ${title.toLowerCase()}...`}
          className="h-9"
          aria-label={`Add a ${title} todo`}
        />
        <Button size="icon" className="size-9 shrink-0" onClick={add} aria-label="Add todo">
          <Plus className="size-4" aria-hidden />
        </Button>
      </div>

      <ul className="space-y-1">
        {todos.map((todo) => (
          <li key={todo.id} className="flex items-center gap-2.5 rounded-md px-1 py-1.5">
            <Checkbox
              checked={todo.done}
              onCheckedChange={() => toggle(todo.id)}
              aria-label={`Mark "${todo.text}" done`}
            />
            <span
              className={cn(
                "text-sm text-foreground",
                todo.done && "text-muted-foreground line-through",
              )}
            >
              {todo.text}
            </span>
          </li>
        ))}
        {todos.length === 0 ? (
          <li className="px-1 py-2 text-xs text-muted-foreground">Nothing here yet.</li>
        ) : null}
      </ul>
    </div>
  )
}

export function TodoLists() {
  return (
    <SectionCard
      eyebrow="03"
      title="Todo Lists"
      freshness={
        <FreshnessIndicator freshness={{ status: "fresh", label: "synced", minutesAgo: 0 }} />
      }
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 md:divide-x md:divide-border/60">
        <TodoColumn title="Coursework" Icon={GraduationCap} initial={COURSEWORK_TODOS} />
        <div className="md:pl-8">
          <TodoColumn title="Personal" Icon={User} initial={PERSONAL_TODOS} />
        </div>
      </div>
    </SectionCard>
  )
}
