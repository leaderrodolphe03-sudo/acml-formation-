import { lessonById } from './catalog'
import { DAY, isDone, isoDay, lessonStatus, startOfDay } from './schedule'
import type { ClassRoom, DbState, Lesson, LessonStatus, Progress, ScheduleEntry, User } from './types'

export interface LessonRow {
  lesson: Lesson
  entry: ScheduleEntry
  progress?: Progress
  status: LessonStatus
  percent: number
}

export function studentRows(db: DbState, student: User, now = new Date()): LessonRow[] {
  const cls = db.classes.find((c) => c.id === student.classId)
  if (!cls) return []
  const rows: LessonRow[] = []
  let prevDone = true
  for (const entry of cls.schedule) {
    const lesson = lessonById(entry.lessonId)
    if (!lesson) continue
    const progress = db.progress.find((p) => p.studentId === student.id && p.lessonId === lesson.id)
    const status = lessonStatus(cls, entry, progress, lesson.duration, prevDone, now)
    rows.push({ lesson, entry, progress, status, percent: progress ? Math.round((progress.watched / lesson.duration) * 100) : 0 })
    prevDone = isDone(progress, lesson.duration)
  }
  return rows
}

export interface StudentStats {
  total: number
  done: number
  late: number
  inProgress: number
  unlocked: number
  percent: number // avancement dans le parcours complet
  onTrack: number // % des vidéos débloquées qui sont terminées
  quizAvg?: number
  lastSeen?: string
  activeDays: number
  streak: number
  failedQuizzes: number
  inactiveDays: number
}

export function studentStats(db: DbState, student: User, rows = studentRows(db, student)): StudentStats {
  const done = rows.filter((r) => r.status === 'terminee').length
  const late = rows.filter((r) => r.status === 'en-retard').length
  const inProgress = rows.filter((r) => r.status === 'en-cours').length
  const unlocked = rows.filter((r) => r.status !== 'verrouillee').length
  const scores = rows.map((r) => r.progress?.quizScore).filter((x): x is number => x !== undefined)
  const acts = db.activity.filter((a) => a.userId === student.id)
  const lastSeen = acts.reduce<string | undefined>((m, a) => (!m || a.at > m ? a.at : m), undefined)
  const days = new Set(acts.map((a) => isoDay(new Date(a.at))))
  let streak = 0
  let cursor = startOfDay(new Date())
  if (!days.has(isoDay(cursor))) cursor = new Date(cursor.getTime() - DAY)
  while (days.has(isoDay(cursor))) {
    streak++
    cursor = new Date(cursor.getTime() - DAY)
  }
  return {
    total: rows.length,
    done,
    late,
    inProgress,
    unlocked,
    percent: rows.length ? Math.round((done / rows.length) * 100) : 0,
    onTrack: unlocked ? Math.round((done / unlocked) * 100) : 100,
    quizAvg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : undefined,
    lastSeen,
    activeDays: days.size,
    streak,
    failedQuizzes: rows.filter((r) => (r.progress?.quizScore ?? 100) < 50).length,
    inactiveDays: lastSeen ? Math.floor((Date.now() - new Date(lastSeen).getTime()) / DAY) : 99,
  }
}

export interface Alert {
  kind: 'inactif' | 'retard' | 'quiz'
  text: string
}

export function studentAlerts(s: StudentStats): Alert[] {
  const out: Alert[] = []
  if (!s.lastSeen) out.push({ kind: 'inactif', text: 'Jamais connecté(e)' })
  else if (s.inactiveDays >= 5) out.push({ kind: 'inactif', text: `Inactif depuis ${s.inactiveDays} jours` })
  if (s.late >= 2) out.push({ kind: 'retard', text: `${s.late} vidéos en retard` })
  if (s.failedQuizzes >= 1) out.push({ kind: 'quiz', text: `Quiz sous 50 % (${s.failedQuizzes})` })
  return out
}

export const studentsOf = (db: DbState, cls: ClassRoom) =>
  db.users.filter((u) => u.role === 'etudiant' && u.classId === cls.id)
