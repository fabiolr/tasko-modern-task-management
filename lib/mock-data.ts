import type { FreshnessThresholds } from "@/lib/freshness"

export const USER = {
  name: "Teo",
  fullName: "Teo Ribeiro",
  email: "teoribeiro2132@gmail.com",
  avatar: "/profile.jpg",
  schoolTimeZone: "America/New_York",
  schoolTimeZoneLabel: "school time",
  localTimeZone: "America/Sao_Paulo",
  localCity: "São Paulo",
}

/* ---------------- Weather ---------------- */

export const WEATHER = {
  location: "Miami, FL",
  condition: "Partly Cloudy",
  tempF: 82,
  highF: 88,
  lowF: 74,
  forecast: "Afternoon storms rolling in around 4 PM, clearing by evening.",
  minutesAgo: 12,
  thresholds: { warnAfter: 60, staleAfter: 180 } as FreshnessThresholds,
}

/* ---------------- Morning Briefing ---------------- */

export type Briefing = {
  id: string
  period: "Morning" | "Evening"
  date: string
  body: string
}

export const BRIEFINGS: Briefing[] = [
  {
    id: "b-2026-05-18-am",
    period: "Morning",
    date: "Monday, May 18",
    body: "Heavy day up front: your AP Chemistry lab report is due at 11:59 PM and there's a Physics C problem set right behind it. Grades held steady over the weekend except AP US History, which slipped 4 points after the missing reading quiz posted. You have a clear afternoon after 3 PM, so front-load the lab writeup. Track practice is on despite the forecast — storms should clear before 5.",
  },
  {
    id: "b-2026-05-17-pm",
    period: "Evening",
    date: "Sunday, May 17",
    body: "You closed out the Calculus review set and the English annotations — nice. Tomorrow is the heaviest day of the week: two STEM deadlines land the same night. Nothing new posted to Google Classroom since this afternoon. Set aside two focused blocks after school and you'll stay ahead of it.",
  },
  {
    id: "b-2026-05-17-am",
    period: "Morning",
    date: "Sunday, May 17",
    body: "Light academic load today — a good window to get ahead on next week's Chemistry lab and outline the History essay before it becomes urgent. Weather is clear all day.",
  },
  {
    id: "b-2026-05-16-pm",
    period: "Evening",
    date: "Saturday, May 16",
    body: "Quiet Saturday. One personal reminder still open: email Coach Ruiz about the make-up test. Everything academic is under control heading into Sunday.",
  },
]

export const BRIEFING_FRESHNESS = {
  minutesAgo: 34,
  thresholds: { warnAfter: 240, staleAfter: 720 } as FreshnessThresholds,
}

/* ---------------- Assignments ---------------- */

export type AssignmentSource = "Veracross" | "Google Classroom"

export type AssignmentStatus = "not-started" | "in-progress" | "submitted"

export type Assignment = {
  id: string
  course: string
  title: string
  due: string
  dueBucket: "today" | "tomorrow" | "week"
  points: number
  source: AssignmentSource
  done: boolean
  /** Assignment type, used for a small category label. */
  type: "Homework" | "Lab" | "Essay" | "Exam" | "Reading" | "Project"
  /** Longer description shown on the full Assignments page. */
  description: string
  /** Rough estimated effort in minutes. */
  estMinutes: number
  /** Work status independent of the done checkbox. */
  status: AssignmentStatus
}

export const ASSIGNMENTS: Assignment[] = [
  {
    id: "a1",
    course: "AP Chemistry",
    title: "Lab Report: Enthalpy of Reaction",
    due: "Today · 11:59 PM",
    dueBucket: "today",
    points: 50,
    source: "Veracross",
    done: false,
    type: "Lab",
    description:
      "Write up the calorimetry lab: include the calculated ΔH, a full error analysis, and the graph of temperature vs. time. Sections should follow the standard lab report format.",
    estMinutes: 120,
    status: "in-progress",
  },
  {
    id: "a2",
    course: "AP Physics C",
    title: "Problem Set 9: Rotational Dynamics",
    due: "Today · 11:59 PM",
    dueBucket: "today",
    points: 30,
    source: "Google Classroom",
    done: false,
    type: "Homework",
    description:
      "Problems 9.1–9.14 covering torque, moment of inertia, and angular momentum conservation. Show all free-body diagrams.",
    estMinutes: 75,
    status: "not-started",
  },
  {
    id: "a3",
    course: "AP English Lit",
    title: "Annotate 'Hamlet' Act IV",
    due: "Today · 8:00 AM",
    dueBucket: "today",
    points: 15,
    source: "Google Classroom",
    done: true,
    type: "Reading",
    description:
      "Close-read Act IV and annotate for motifs of madness and surveillance. At least three margin notes per scene.",
    estMinutes: 45,
    status: "submitted",
  },
  {
    id: "a4",
    course: "AP Calculus BC",
    title: "Section 7.3 — Integration by Parts",
    due: "Tomorrow · 11:59 PM",
    dueBucket: "tomorrow",
    points: 25,
    source: "Veracross",
    done: false,
    type: "Homework",
    description:
      "Odd-numbered exercises 1–29. Focus on choosing u and dv strategically and recognizing repeated integration by parts.",
    estMinutes: 60,
    status: "not-started",
  },
  {
    id: "a5",
    course: "AP US History",
    title: "DBQ Outline: Progressive Era",
    due: "Tomorrow · 3:00 PM",
    dueBucket: "tomorrow",
    points: 20,
    source: "Veracross",
    done: false,
    type: "Essay",
    description:
      "Draft a thesis and outline body paragraphs using at least four of the seven provided documents. Bring a printed copy to class.",
    estMinutes: 50,
    status: "not-started",
  },
  {
    id: "a6",
    course: "AP Chemistry",
    title: "Unit 6 Practice Exam",
    due: "Thu · 11:59 PM",
    dueBucket: "week",
    points: 40,
    source: "Google Classroom",
    done: false,
    type: "Exam",
    description:
      "Timed practice exam on thermodynamics and kinetics. Complete in one sitting and submit a photo of your work.",
    estMinutes: 90,
    status: "not-started",
  },
  {
    id: "a7",
    course: "AP English Lit",
    title: "Essay Draft: Tragic Heroes",
    due: "Fri · 11:59 PM",
    dueBucket: "week",
    points: 60,
    source: "Veracross",
    done: false,
    type: "Essay",
    description:
      "Full first draft (900–1100 words) comparing the tragic arc of Hamlet with one other protagonist studied this year. MLA citations required.",
    estMinutes: 150,
    status: "not-started",
  },
]

// Google Classroom scrape is lagging to demonstrate the stale/warning treatment.
export const ASSIGNMENT_SOURCES = [
  {
    source: "Veracross" as AssignmentSource,
    minutesAgo: 22,
    thresholds: { warnAfter: 120, staleAfter: 360 } as FreshnessThresholds,
  },
  {
    source: "Google Classroom" as AssignmentSource,
    minutesAgo: 4300,
    thresholds: { warnAfter: 120, staleAfter: 360 } as FreshnessThresholds,
  },
]

/* ---------------- Todos ---------------- */

export type Todo = {
  id: string
  text: string
  done: boolean
}

export const COURSEWORK_TODOS: Todo[] = [
  { id: "cw1", text: "Email Coach Ruiz about the make-up test", done: false },
  { id: "cw2", text: "Start outlining the History DBQ essay", done: false },
  { id: "cw3", text: "Ask Dr. Patel to re-check the missing reading quiz", done: false },
  { id: "cw4", text: "Rewrite Chem lab intro paragraph", done: true },
]

export const PERSONAL_TODOS: Todo[] = [
  { id: "p1", text: "Renew passport before summer trip", done: false },
  { id: "p2", text: "Pick up new cleats for track", done: false },
  { id: "p3", text: "Call Grandma back", done: true },
]

/* ---------------- Grades ---------------- */

export type Grade = {
  /** URL-safe id used to anchor the class in the Grades tab. */
  slug: string
  course: string
  teacher: string
  /** Current percentage grade, e.g. 94.2 */
  percent: number
  letter: string
  /** Change vs. last posted grade, in percentage points. */
  trend: number
}

export const GRADES: Grade[] = [
  { slug: "ap-calculus-bc", course: "AP Calculus BC", teacher: "Ms. Okafor", percent: 96.4, letter: "A", trend: 1.2 },
  { slug: "ap-chemistry", course: "AP Chemistry", teacher: "Dr. Patel", percent: 91.8, letter: "A-", trend: -0.6 },
  { slug: "ap-physics-c", course: "AP Physics C", teacher: "Mr. Lindqvist", percent: 88.3, letter: "B+", trend: 2.1 },
  { slug: "ap-english-lit", course: "AP English Lit", teacher: "Ms. Herrera", percent: 93.5, letter: "A", trend: 0.4 },
  { slug: "ap-us-history", course: "AP US History", teacher: "Mr. Boone", percent: 84.1, letter: "B", trend: -1.4 },
  { slug: "ap-spanish-lang", course: "AP Spanish Lang", teacher: "Sra. Delgado", percent: 90.7, letter: "A-", trend: 0.9 },
  { slug: "ap-cs-a", course: "AP Computer Science A", teacher: "Mr. Nakamura", percent: 97.2, letter: "A", trend: 1.6 },
]

export const GRADES_FRESHNESS = {
  minutesAgo: 55,
  thresholds: { warnAfter: 180, staleAfter: 720 } as FreshnessThresholds,
}

/* ---------------- Calendar ---------------- */

export type CalendarEventKind = "class" | "assignment" | "exam" | "activity" | "personal"

export type CalendarEvent = {
  id: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  title: string
  /** Display time range, e.g. "9:00 – 9:50 AM". All-day if omitted. */
  time?: string
  kind: CalendarEventKind
  location?: string
}

/**
 * The calendar is seeded to May 2026 to line up with the morning briefings.
 * When the real Apple Calendar backend lands, replace CALENDAR_EVENTS (and
 * CALENDAR_REFERENCE_TODAY) with live data in this same shape.
 */
export const CALENDAR_REFERENCE_TODAY = "2026-05-18"

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: "e1", date: "2026-05-18", title: "AP Chemistry", time: "8:00 – 8:50 AM", kind: "class", location: "Room 214" },
  { id: "e2", date: "2026-05-18", title: "AP Physics C", time: "9:00 – 9:50 AM", kind: "class", location: "Room 118" },
  { id: "e3", date: "2026-05-18", title: "Chem Lab Report due", time: "11:59 PM", kind: "assignment" },
  { id: "e4", date: "2026-05-18", title: "Track practice", time: "3:30 – 5:00 PM", kind: "activity", location: "Field" },
  { id: "e5", date: "2026-05-19", title: "AP Calculus BC", time: "10:00 – 10:50 AM", kind: "class", location: "Room 203" },
  { id: "e6", date: "2026-05-19", title: "DBQ Outline due", time: "3:00 PM", kind: "assignment" },
  { id: "e7", date: "2026-05-20", title: "AP US History", time: "9:00 – 9:50 AM", kind: "class", location: "Room 140" },
  { id: "e8", date: "2026-05-20", title: "College info night", time: "6:30 – 8:00 PM", kind: "personal", location: "Auditorium" },
  { id: "e9", date: "2026-05-21", title: "Chem Unit 6 Exam", time: "8:00 – 9:30 AM", kind: "exam", location: "Room 214" },
  { id: "e10", date: "2026-05-22", title: "English Essay Draft due", time: "11:59 PM", kind: "assignment" },
  { id: "e11", date: "2026-05-22", title: "Track meet vs. Ransom", time: "4:00 PM", kind: "activity", location: "Away" },
  { id: "e12", date: "2026-05-25", title: "Memorial Day — no school", kind: "personal" },
  { id: "e13", date: "2026-05-27", title: "AP Spanish oral exam", time: "1:00 – 1:45 PM", kind: "exam", location: "Room 106" },
  { id: "e14", date: "2026-05-15", title: "AP CS A project demo", time: "2:00 – 2:45 PM", kind: "activity", location: "Lab B" },
  { id: "e15", date: "2026-05-12", title: "Calculus review set due", time: "11:59 PM", kind: "assignment" },
]

export const CALENDAR_FRESHNESS = {
  minutesAgo: 8,
  thresholds: { warnAfter: 60, staleAfter: 240 } as FreshnessThresholds,
}
