"use client"

import { Mail, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { USER } from "@/lib/mock-data"

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-card/80 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/70 sm:px-6">
      <div className="flex items-center gap-2 lg:hidden">
        <MobileNav />
      </div>

      {/* Spacer keeps the account cluster right-aligned on desktop */}
      <div className="hidden flex-1 lg:block" />

      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label="Messages">
          <Mail className="size-4" aria-hidden />
        </Button>

        <Button variant="ghost" size="icon" className="relative size-9 rounded-full" aria-label="Alerts">
          <Bell className="size-4" aria-hidden />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive ring-2 ring-card" />
        </Button>

        <div className="ml-1 flex items-center gap-2.5 border-l border-border pl-3">
          <Avatar className="size-9 ring-2 ring-primary/20">
            <AvatarImage src={USER.avatar || "/placeholder.svg"} alt={USER.fullName} />
            <AvatarFallback className="text-xs">{initials(USER.fullName)}</AvatarFallback>
          </Avatar>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-foreground">{USER.fullName}</p>
            <p className="text-xs text-muted-foreground">{USER.email}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
