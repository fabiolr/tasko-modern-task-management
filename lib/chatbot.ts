import {
  USER,
  WEATHER,
  GRADES,
  ASSIGNMENTS,
  CALENDAR_EVENTS,
  CALENDAR_REFERENCE_TODAY,
  ALERTS,
  COURSEWORK_TODOS,
  PERSONAL_TODOS,
} from "@/lib/mock-data"

export type ChatRole = "user" | "assistant"

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
}

/**
 * Local, offline responder over the dashboard's data.
 *
 * This is a stand-in so the chatbot is usable today. When you connect your own
 * AI API key, replace the body of `getAssistantReply` with a call to your model
 * (e.g. an API route using the AI SDK). Pass the same data below to the model as
 * grounding context so it can answer questions about anything in this database.
 */

function avg(nums: number[]) {
  return nums.reduce((a, b) => a + b, 0) / (nums.length || 1)
}

function fmtGrade(g: (typeof GRADES)[number]) {
  const arrow = g.trend > 0 ? "up" : g.trend < 0 ? "down" : "flat"
  const sign = g.trend > 0 ? "+" : ""
  return `${g.course}: ${g.percent}% (${g.letter}), ${arrow} ${sign}${g.trend} pts — ${g.teacher}`
}

/** A compact, human-readable dump of the whole dataset — also ideal as model context. */
export function buildKnowledgeContext(): string {
  const grades = GRADES.map(fmtGrade).join("\n")
  const openAssignments = ASSIGNMENTS.filter((a) => !a.done)
    .map((a) => `${a.course} — ${a.title} (due ${a.due}, ${a.points} pts, ${a.status})`)
    .join("\n")
  const events = CALENDAR_EVENTS.map(
    (e) => `${e.date}${e.time ? ` ${e.time}` : ""} — ${e.title}${e.location ? ` @ ${e.location}` : ""}`,
  ).join("\n")
  const alerts = ALERTS.map((a) => `[${a.severity}] ${a.title}: ${a.detail}`).join("\n")
  const todos = [...COURSEWORK_TODOS, ...PERSONAL_TODOS]
    .map((t) => `${t.done ? "[x]" : "[ ]"} ${t.text}`)
    .join("\n")

  return [
    `Student: ${USER.fullName} (${USER.email})`,
    `Weather (${WEATHER.location}): ${WEATHER.condition}, ${WEATHER.tempF}°F`,
    `Today (calendar reference): ${CALENDAR_REFERENCE_TODAY}`,
    `\nGRADES:\n${grades}`,
    `\nOPEN ASSIGNMENTS:\n${openAssignments}`,
    `\nCALENDAR:\n${events}`,
    `\nALERTS:\n${alerts}`,
    `\nTO-DOS:\n${todos}`,
  ].join("\n")
}

function answerGrades(q: string): string | null {
  if (!/(grade|gpa|average|score|class|doing|percent)/.test(q)) return null

  // Specific class match
  const hit = GRADES.find((g) => {
    const words = g.course.toLowerCase().replace(/^ap /, "").split(" ")
    return words.some((w) => w.length > 2 && q.includes(w)) || q.includes(g.course.toLowerCase())
  })
  if (hit) {
    const dir = hit.trend > 0 ? `up ${hit.trend}` : hit.trend < 0 ? `down ${Math.abs(hit.trend)}` : "unchanged"
    return `In ${hit.course} you have a ${hit.percent}% (${hit.letter}), taught by ${hit.teacher}. It's ${dir} points since the last posted grade.`
  }

  if (/(highest|best|top)/.test(q)) {
    const top = [...GRADES].sort((a, b) => b.percent - a.percent)[0]
    return `Your highest grade is ${top.course} at ${top.percent}% (${top.letter}).`
  }
  if (/(lowest|worst|struggl|weak)/.test(q)) {
    const low = [...GRADES].sort((a, b) => a.percent - b.percent)[0]
    return `Your lowest grade is ${low.course} at ${low.percent}% (${low.letter}). Might be worth focusing there.`
  }

  const average = avg(GRADES.map((g) => g.percent))
  const lines = GRADES.map((g) => `• ${g.course}: ${g.percent}% (${g.letter})`).join("\n")
  return `Across your ${GRADES.length} classes your average is ${average.toFixed(1)}%.\n${lines}`
}

function answerAssignments(q: string): string | null {
  if (!/(assignment|homework|due|task|work|submit|lab|essay|exam|test|quiz)/.test(q)) return null

  const open = ASSIGNMENTS.filter((a) => !a.done)

  if (/(today|tonight)/.test(q)) {
    const today = open.filter((a) => a.dueBucket === "today")
    if (today.length === 0) return "You have nothing due today. Nice."
    const lines = today.map((a) => `• ${a.course} — ${a.title} (${a.due}, ${a.points} pts)`).join("\n")
    return `You have ${today.length} assignment${today.length > 1 ? "s" : ""} due today:\n${lines}`
  }

  if (/(how many|count|number)/.test(q)) {
    return `You have ${open.length} open assignments totaling ${open.reduce((s, a) => s + a.points, 0)} points.`
  }

  if (open.length === 0) return "You're all caught up — no open assignments."
  const lines = open
    .slice(0, 8)
    .map((a) => `• ${a.course} — ${a.title} (due ${a.due}, ${a.status})`)
    .join("\n")
  return `Here are your open assignments:\n${lines}`
}

function answerCalendar(q: string): string | null {
  if (!/(calendar|schedule|event|class|today|tomorrow|week|when|happening)/.test(q)) return null

  const today = CALENDAR_EVENTS.filter((e) => e.date === CALENDAR_REFERENCE_TODAY)
  if (today.length === 0) return "Nothing is on your calendar for today."
  const lines = today
    .map((e) => `• ${e.time ?? "All day"} — ${e.title}${e.location ? ` @ ${e.location}` : ""}`)
    .join("\n")
  return `Here's your schedule for today:\n${lines}`
}

function answerAlerts(q: string): string | null {
  if (!/(alert|notification|notice|warning|urgent|reminder)/.test(q)) return null
  const unread = ALERTS.filter((a) => !a.read)
  if (unread.length === 0) return "No unread alerts right now."
  const lines = unread.map((a) => `• [${a.severity}] ${a.title} — ${a.detail}`).join("\n")
  return `You have ${unread.length} unread alert${unread.length > 1 ? "s" : ""}:\n${lines}`
}

function answerTodos(q: string): string | null {
  if (!/(todo|to-do|to do|reminder|need to|checklist)/.test(q)) return null
  const open = [...COURSEWORK_TODOS, ...PERSONAL_TODOS].filter((t) => !t.done)
  if (open.length === 0) return "Your to-do lists are clear."
  const lines = open.map((t) => `• ${t.text}`).join("\n")
  return `You have ${open.length} open to-do items:\n${lines}`
}

function answerWeather(q: string): string | null {
  if (!/(weather|temperature|hot|cold|rain|storm|forecast)/.test(q)) return null
  return `It's ${WEATHER.condition.toLowerCase()} and ${WEATHER.tempF}°F in ${WEATHER.location} (high ${WEATHER.highF}°, low ${WEATHER.lowF}°). ${WEATHER.forecast}`
}

function answerIdentity(q: string): string | null {
  if (/(who am i|my name|my email|who is teo)/.test(q)) {
    return `You're ${USER.fullName}, signed in as ${USER.email}.`
  }
  if (/(what can you|help|who are you|what do you do)/.test(q)) {
    return "I can answer questions about your dashboard data — grades, assignments, calendar, alerts, to-dos, and weather. Try asking things like \"what's due today?\", \"what's my lowest grade?\", or \"what's on my calendar?\""
  }
  return null
}

/**
 * Returns the assistant's reply to a question. Currently answers from local
 * dashboard data. Swap this for your own AI API call when ready — feed the model
 * `buildKnowledgeContext()` as grounding so it can answer anything in the DB.
 */
export function getAssistantReply(question: string): string {
  const q = question.toLowerCase().trim()

  const responders = [
    answerIdentity,
    answerGrades,
    answerAssignments,
    answerCalendar,
    answerAlerts,
    answerTodos,
    answerWeather,
  ]

  for (const r of responders) {
    const reply = r(q)
    if (reply) return reply
  }

  return "I couldn't find that in your dashboard yet. I can help with grades, assignments, your calendar, alerts, to-dos, and weather. Once you connect your own AI key, I'll be able to answer more open-ended questions across everything here."
}
