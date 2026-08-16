import type { FreshnessThresholds } from "@/lib/freshness"

export const USER = {
  name: "Jessin",
  fullName: "Jessin Sam",
  email: "jessin@gmail.com",
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

export type Assignment = {
  id: string
  course: string
  title: string
  due: string
  dueBucket: "today" | "tomorrow" | "week"
  points: number
  source: AssignmentSource
  done: boolean
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
