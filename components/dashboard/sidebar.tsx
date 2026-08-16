"use client"

import { useEffect, useState } from "react"
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  GraduationCap,
  Bell,
  Newspaper,
  Settings,
  HelpCircle,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

type NavItem = {
  icon: typeof LayoutDashboard
  label: string
  href: string
  badge?: string
}

const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ClipboardList, label: "Assignments", href: "/assignments", badge: "6" },
  { icon: CalendarDays, label: "Calendar", href: "/calendar" },
  { icon: GraduationCap, label: "Grades", href: "/grades" },
  { icon: Bell, label: "Alerts", href: "/#alerts", badge: "3" },
  { icon: Newspaper, label: "News", href: "/#news" },
]

const generalItems: NavItem[] = [
  { icon: Settings, label: "Settings", href: "/#settings" },
  { icon: HelpCircle, label: "Help", href: "/#help" },
  { icon: LogOut, label: "Logout", href: "/logout" },
]

function NavList({ items, activeLabel }: { items: NavItem[]; activeLabel: string }) {
  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.label === activeLabel
        return (
          <Link
            key={item.label}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <item.icon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-primary/10 text-primary",
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

function ThemeToggleRow() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = resolvedTheme === "dark"

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle theme"}
      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
    >
      <span className="relative flex size-4 shrink-0 items-center justify-center" aria-hidden>
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </span>
      <span className="truncate">{mounted && isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  )
}

export function Sidebar({ activeLabel = "Dashboard" }: { activeLabel?: string }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar p-4">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <GraduationCap className="size-5" aria-hidden />
        </div>
        <div className="leading-tight">
          <p className="text-base font-semibold text-foreground">MrT - Dash</p>
          <p className="text-[11px] text-muted-foreground">Student Dashboard</p>
        </div>
      </Link>

      <div className="space-y-5">
        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
          <NavList items={menuItems} activeLabel={activeLabel} />
        </div>

        <div>
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            General
          </p>
          <NavList items={generalItems} activeLabel={activeLabel} />
          <div className="mt-0.5">
            <ThemeToggleRow />
          </div>
        </div>
      </div>
    </aside>
  )
}
