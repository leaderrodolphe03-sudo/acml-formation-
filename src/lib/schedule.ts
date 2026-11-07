import { lessonsOfLevel } from './catalog'
import type { ClassRoom, LessonStatus, Progress, ScheduleEntry } from './types'

export const DAY = 86_400_000
export const COMPLETION_THRESHOLD = 0.9 // une vidéo est « terminée » à 90 % de visionnage réel
export const LATE_AFTER_DAYS = 3

/** Les dates « AAAA-MM-JJ » sont lues en heure locale (et non UTC). */
export const toDate = (d: Date | string) => {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day)
  }
  return new Date(d)
}

export const startOfDay = (d: Date | string) => {
  const x = toDate(d)
  x.setHours(0, 0, 0, 0)
  return x
}
export const isoDay = (d: Date) => {
  const x = startOfDay(d)
  return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
}
export const addDays = (d: Date | string, n: number) => new Date(startOfDay(d).getTime() + n * DAY)

/** Répartit automatiquement tout le parcours selon le rythme choisi. */
export function buildSchedule(
  levelLessons: string[],
  startDate: string,
  days: number[],
  perSession: number,
): ScheduleEntry[] {
  const out: ScheduleEntry[] = []
  if (!days.length || perSession < 1) return out
  let cursor = startOfDay(startDate)
  let i = 0
  let guard = 0
  while (i < levelLessons.length && guard < 1000) {
    if (days.includes(cursor.getDay())) {
      for (let k = 0; k < perSession && i < levelLessons.length; k++) {
        out.push({ lessonId: levelLessons[i++], date: isoDay(cursor) })
      }
    }
    cursor = addDays(cursor, 1)
    guard++
  }
  return out
}

export const scheduleForLevel = (cls: Pick<ClassRoom, 'levelId' | 'startDate' | 'rhythm'>) =>
  buildSchedule(
    lessonsOfLevel(cls.levelId).map((l) => l.id),
    cls.startDate,
    cls.rhythm.days,
    cls.rhythm.perSession,
  )

export const isDone = (p?: Progress, duration?: number) =>
  !!p && (!!p.completedAt || (!!duration && p.watched >= duration * COMPLETION_THRESHOLD))

/** Statut d'une leçon pour un étudiant (règles du §8 du cahier de conception). */
export function lessonStatus(
  cls: ClassRoom,
  entry: ScheduleEntry,
  p: Progress | undefined,
  duration: number,
  prevDone: boolean,
  now = new Date(),
): LessonStatus {
  if (isDone(p, duration)) return 'terminee'
  const unlockDate = startOfDay(entry.date)
  if (unlockDate > now) return 'verrouillee'
  if (cls.rules.requirePrevious && !prevDone) return 'verrouillee'
  if (p && p.watched > 0) {
    return now.getTime() - unlockDate.getTime() > LATE_AFTER_DAYS * DAY ? 'en-retard' : 'en-cours'
  }
  return now.getTime() - unlockDate.getTime() > LATE_AFTER_DAYS * DAY ? 'en-retard' : 'non-vue'
}

export const STATUS_LABEL: Record<LessonStatus, string> = {
  terminee: 'Terminée',
  'en-cours': 'En cours',
  'non-vue': 'À regarder',
  'en-retard': 'En retard',
  verrouillee: 'À venir',
}

export const STATUS_STYLE: Record<LessonStatus, string> = {
  terminee: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'en-cours': 'bg-sky-50 text-sky-700 ring-sky-200',
  'non-vue': 'bg-amber-50 text-amber-700 ring-amber-200',
  'en-retard': 'bg-red-50 text-red-700 ring-red-200',
  verrouillee: 'bg-slate-100 text-slate-500 ring-slate-200',
}

export const fmtDate = (d: string | Date, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }) =>
  toDate(d).toLocaleDateString('fr-FR', opts)

export const fmtDuration = (s: number) => {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${String(sec).padStart(2, '0')}`
}

export const timeAgo = (iso?: string) => {
  if (!iso) return 'jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `il y a ${h} h`
  const d = Math.round(h / 24)
  return `il y a ${d} j`
}

export const WEEKDAYS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
