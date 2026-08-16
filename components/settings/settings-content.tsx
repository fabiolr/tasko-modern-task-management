"use client"

import { useEffect, useState } from "react"
import {
  User,
  Palette,
  Cable,
  BellRing,
  GraduationCap,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/components/theme-provider"
import { USER } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/* ---------- small building blocks ---------- */

function SectionCard({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof User
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-4" aria-hidden />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  )
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
  children,
}: {
  label: string
  description: string
  checked?: boolean
  onCheckedChange?: (v: boolean) => void
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children ?? <Switch checked={checked} onCheckedChange={onCheckedChange} />}
    </div>
  )
}

/* ---------- theme control ---------- */

const themeOptions = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

function ThemeControl() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const active = mounted ? theme ?? "system" : undefined

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="grid grid-cols-3 gap-2"
    >
      {themeOptions.map((opt) => {
        const isActive = active === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(opt.value)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors",
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <opt.icon className="size-5" aria-hidden />
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

/* ---------- data sources ---------- */

type Source = {
  id: string
  name: string
  desc: string
  connected: boolean
}

const initialSources: Source[] = [
  { id: "veracross", name: "Veracross", desc: "Grades and assignments", connected: true },
  { id: "classroom", name: "Google Classroom", desc: "Coursework and materials", connected: true },
  { id: "apple-cal", name: "Apple Calendar", desc: "Events and schedule", connected: false },
  { id: "worldmonitor", name: "WorldMonitor", desc: "World news feed", connected: false },
]

/* ---------- main ---------- */

export function SettingsContent() {
  const initials = USER.fullName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)

  // Profile
  const [fullName, setFullName] = useState(USER.fullName)
  const [email, setEmail] = useState(USER.email)
  const [saved, setSaved] = useState(false)

  // Preferences
  const [tempUnit, setTempUnit] = useState("f")
  const [weekStart, setWeekStart] = useState("sunday")
  const [timeMode, setTimeMode] = useState("school")

  // Data sources
  const [sources, setSources] = useState(initialSources)
  const [syncFrequency, setSyncFrequency] = useState("15")
  const [stalenessWarnings, setStalenessWarnings] = useState(true)

  // Notifications
  const [gradeAlerts, setGradeAlerts] = useState(true)
  const [dueReminders, setDueReminders] = useState(true)
  const [reminderLead, setReminderLead] = useState("24")
  const [newsDigest, setNewsDigest] = useState(false)
  const [quietHours, setQuietHours] = useState(true)

  // Academics
  const [gpaTarget, setGpaTarget] = useState([92])
  const [showGpa, setShowGpa] = useState(true)
  const [lowGradeThreshold, setLowGradeThreshold] = useState([85])

  function handleSaveProfile() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function toggleSource(id: string) {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, connected: !s.connected } : s)),
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile */}
      <SectionCard icon={User} title="Profile" description="Your identity across the dashboard.">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={USER.avatar || "/placeholder.svg"} alt={USER.fullName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                Change photo
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSaveProfile}>
            {saved ? (
              <>
                <Check className="size-4" aria-hidden />
                Saved
              </>
            ) : (
              "Save changes"
            )}
          </Button>
        </div>
      </SectionCard>

      {/* Appearance */}
      <SectionCard
        icon={Palette}
        title="Appearance"
        description="Theme and how dates and units are shown."
      >
        <div className="space-y-5">
          <div className="space-y-2.5">
            <Label>Theme</Label>
            <ThemeControl />
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Temperature</Label>
              <Select value={tempUnit} onValueChange={setTempUnit}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="f">Fahrenheit (°F)</SelectItem>
                  <SelectItem value="c">Celsius (°C)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Week starts on</Label>
              <Select value={weekStart} onValueChange={setWeekStart}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Clock shows</Label>
              <Select value={timeMode} onValueChange={setTimeMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School time</SelectItem>
                  <SelectItem value="local">Local time</SelectItem>
                  <SelectItem value="both">Both</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Data sources */}
      <SectionCard
        icon={Cable}
        title="Data sources & sync"
        description="Connect the services this dashboard pulls from."
      >
        <div className="space-y-1">
          {sources.map((s, i) => (
            <div key={s.id}>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{s.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                        s.connected ? "bg-fresh-muted text-fresh" : "bg-secondary text-muted-foreground",
                      )}
                    >
                      {s.connected ? "Connected" : "Not connected"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
                <Button
                  variant={s.connected ? "outline" : "default"}
                  size="sm"
                  onClick={() => toggleSource(s.id)}
                >
                  {s.connected ? "Disconnect" : "Connect"}
                </Button>
              </div>
              {i < sources.length - 1 && <Separator />}
            </div>
          ))}

          <Separator />

          <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 sm:items-center">
            <div>
              <p className="text-sm font-medium text-foreground">Sync frequency</p>
              <p className="text-sm text-muted-foreground">How often to check for new data.</p>
            </div>
            <Select value={syncFrequency} onValueChange={setSyncFrequency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Every 5 minutes</SelectItem>
                <SelectItem value="15">Every 15 minutes</SelectItem>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <ToggleRow
            label="Show data-freshness warnings"
            description="Flag sections when a source hasn't synced recently."
            checked={stalenessWarnings}
            onCheckedChange={setStalenessWarnings}
          />
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard
        icon={BellRing}
        title="Notifications & alerts"
        description="Choose what you get notified about."
      >
        <div className="space-y-1 divide-y divide-border">
          <ToggleRow
            label="Grade changes"
            description="Alert me when a class grade goes up or down."
            checked={gradeAlerts}
            onCheckedChange={setGradeAlerts}
          />
          <ToggleRow
            label="Assignment reminders"
            description="Remind me before an assignment is due."
            checked={dueReminders}
            onCheckedChange={setDueReminders}
          />
          {dueReminders && (
            <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2 sm:items-center">
              <div>
                <p className="text-sm font-medium text-foreground">Reminder lead time</p>
                <p className="text-sm text-muted-foreground">How far ahead to remind you.</p>
              </div>
              <Select value={reminderLead} onValueChange={setReminderLead}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="3">3 hours before</SelectItem>
                  <SelectItem value="24">1 day before</SelectItem>
                  <SelectItem value="48">2 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <ToggleRow
            label="Daily news digest"
            description="A morning summary from your connected news sources."
            checked={newsDigest}
            onCheckedChange={setNewsDigest}
          />
          <ToggleRow
            label="Quiet hours (10 PM – 7 AM)"
            description="Silence non-urgent notifications overnight."
            checked={quietHours}
            onCheckedChange={setQuietHours}
          />
        </div>
      </SectionCard>

      {/* Academics */}
      <SectionCard
        icon={GraduationCap}
        title="Academics"
        description="Goals and thresholds that drive your grade insights."
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Target grade</Label>
              <span className="text-sm font-semibold tabular-nums text-primary">{gpaTarget[0]}%</span>
            </div>
            <Slider value={gpaTarget} onValueChange={setGpaTarget} min={70} max={100} step={1} />
            <p className="text-sm text-muted-foreground">
              The dashboard highlights classes below this target.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Low-grade alert threshold</Label>
              <span className="text-sm font-semibold tabular-nums text-primary">
                {lowGradeThreshold[0]}%
              </span>
            </div>
            <Slider
              value={lowGradeThreshold}
              onValueChange={setLowGradeThreshold}
              min={60}
              max={95}
              step={1}
            />
            <p className="text-sm text-muted-foreground">
              Get an urgent alert if a class drops below this grade.
            </p>
          </div>

          <Separator />

          <ToggleRow
            label="Show GPA on dashboard"
            description="Display your calculated GPA in the grades overview."
            checked={showGpa}
            onCheckedChange={setShowGpa}
          />
        </div>
      </SectionCard>
    </div>
  )
}
