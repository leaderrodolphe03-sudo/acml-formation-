import { lessonById } from './catalog'
import { addDays, DAY, isoDay, scheduleForLevel, startOfDay } from './schedule'
import type { Activity, ClassRoom, DbState, Message, Progress, User } from './types'

export const DB_VERSION = 3

/**
 * Comptes de démonstration (données fictives, à remplacer par Supabase Auth).
 * Ils sont aussi proposés en connexion rapide sur la page /connexion.
 */
export const DEMO_ACCOUNTS = [
  { label: 'Étudiant', email: 'etudiant@acml.bj', password: 'demo-acml' },
  { label: 'Superviseur', email: 'superviseur@acml.bj', password: 'demo-acml' },
] as const

function rng(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let uid = 0
export const newId = (p: string) => `${p}_${Date.now().toString(36)}${(uid++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

export function createSeed(): DbState {
  const now = new Date()
  const r = rng(2026)
  const iso = (d: Date) => d.toISOString()

  const users: User[] = [
    { id: 'u_admin', name: 'Direction ACML', email: 'admin@acml.bj', password: 'demo-acml', role: 'admin', joinedAt: iso(addDays(now, -120)) },
    { id: 'u_sup1', name: 'Carine Dossou', email: 'superviseur@acml.bj', phone: '+229 01 97 00 00 01', password: 'demo-acml', role: 'superviseur', joinedAt: iso(addDays(now, -90)) },
  ]

  const c1Start = addDays(now, -24)
  const c2Start = addDays(now, -38)
  const classes: ClassRoom[] = [
    {
      id: 'c_samedi', name: 'Groupe du samedi', supervisorId: 'u_sup1', levelId: 'debutant', code: 'SAMEDI-24',
      startDate: isoDay(c1Start), rhythm: { days: [1, 4], perSession: 1 },
      rules: { revisit: true, requirePrevious: false }, schedule: [],
    },
    {
      id: 'c_octobre', name: 'Promo Octobre', supervisorId: 'u_sup1', levelId: 'intermediaire', code: 'OCTO-25',
      startDate: isoDay(c2Start), rhythm: { days: [2, 5], perSession: 1 },
      rules: { revisit: true, requirePrevious: true }, schedule: [],
    },
  ]
  classes.forEach((c) => (c.schedule = scheduleForLevel(c)))

  const roster: [string, string, string, number][] = [
    // id, nom, classe, assiduité (0–1)
    ['u_etu1', 'Koffi Agbo', 'c_samedi', 0.8],
    ['u_etu2', 'Aïcha Sossa', 'c_samedi', 0.95],
    ['u_etu3', 'Mariam Bello', 'c_samedi', 0.65],
    ['u_etu4', 'Jean-Baptiste Houngbo', 'c_samedi', 0.25],
    ['u_etu5', 'Grâce Adjovi', 'c_samedi', 0.9],
    ['u_etu6', 'Sèna Akpo', 'c_samedi', 0.45],
    ['u_etu7', 'Rachidi Alao', 'c_octobre', 0.85],
    ['u_etu8', 'Esther Gbaguidi', 'c_octobre', 1],
    ['u_etu9', 'Fiacre Tossou', 'c_octobre', 0.3],
    ['u_etu10', 'Nadège Kpadé', 'c_octobre', 0.7],
  ]

  const progress: Progress[] = []
  const activity: Activity[] = []
  const log = (a: Omit<Activity, 'id'>) => activity.push({ id: newId('a'), ...a })

  for (const [id, name, classId, assiduity] of roster) {
    const cls = classes.find((c) => c.id === classId)!
    const slug = name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]+/g, '.')
    users.push({
      id, name, classId, level: cls.levelId, role: 'etudiant', password: 'demo-acml',
      email: id === 'u_etu1' ? 'etudiant@acml.bj' : `${slug}@exemple.bj`,
      phone: `+229 01 6${Math.floor(r() * 9)} ${String(Math.floor(r() * 90) + 10)} ${String(Math.floor(r() * 90) + 10)} ${String(Math.floor(r() * 90) + 10)}`,
      joinedAt: iso(addDays(cls.startDate, -3)),
    })

    const unlocked = cls.schedule.filter((e) => startOfDay(e.date) <= now)
    let stopped = false
    unlocked.forEach((entry, idx) => {
      const lesson = lessonById(entry.lessonId)!
      const isLast = idx === unlocked.length - 1
      if (stopped) return
      const roll = r()
      const day = startOfDay(entry.date).getTime()
      const at = (offsetDays: number, h: number) => new Date(Math.min(day + offsetDays * DAY + h * 3600000, now.getTime() - 3600000))
      if (roll < assiduity && !(isLast && r() < 0.4)) {
        const finished = at(Math.floor(r() * 2), 18 + Math.floor(r() * 4))
        const score = lesson.quiz ? Math.round((0.45 + r() * 0.55 * (0.5 + assiduity / 2)) * 100) : undefined
        progress.push({ studentId: id, lessonId: lesson.id, position: lesson.duration, watched: lesson.duration, completedAt: iso(finished), quizScore: score, quizAttempts: score ? 1 : undefined })
        log({ userId: id, classId, type: 'connexion', at: iso(new Date(finished.getTime() - 20 * 60000)) })
        log({ userId: id, classId, type: 'lancement', lessonId: lesson.id, at: iso(new Date(finished.getTime() - lesson.duration * 1000 - 120000)) })
        log({ userId: id, classId, type: 'fin', lessonId: lesson.id, detail: '100 % regardé', at: iso(finished) })
        if (r() < 0.5) log({ userId: id, classId, type: 'telechargement', lessonId: lesson.id, detail: lesson.resources[0].name, at: iso(new Date(finished.getTime() + 60000)) })
        if (score !== undefined) log({ userId: id, classId, type: 'quiz', lessonId: lesson.id, detail: `Score : ${score} %`, at: iso(new Date(finished.getTime() + 180000)) })
      } else {
        stopped = assiduity < 0.5
        if (r() < 0.6) {
          const watched = Math.floor(lesson.duration * (0.15 + r() * 0.5))
          const started = at(1, 19)
          progress.push({ studentId: id, lessonId: lesson.id, position: watched, watched })
          log({ userId: id, classId, type: 'connexion', at: iso(new Date(started.getTime() - 60000)) })
          log({ userId: id, classId, type: 'lancement', lessonId: lesson.id, at: iso(started) })
          log({ userId: id, classId, type: 'pause', lessonId: lesson.id, detail: `${Math.round((watched / lesson.duration) * 100)} % regardé`, at: iso(new Date(started.getTime() + watched * 1000)) })
        }
      }
    })
  }

  const messages: Message[] = [
    {
      id: newId('m'), classId: 'c_samedi', from: 'u_sup1', to: 'classe', readBy: ['u_sup1'],
      content: "Welcome everyone ! 🎉 Bienvenue dans le Groupe du samedi. Deux vidéos par semaine (lundi et jeudi). Pensez à faire les quiz après chaque module.",
      at: iso(addDays(c1Start, 0)),
    },
    {
      id: newId('m'), classId: 'c_samedi', from: 'u_sup1', to: 'classe', readBy: ['u_sup1'],
      content: 'Rappel : la leçon « Numbers 1 to 100 » est très importante pour la suite. Prenez le temps de bien la regarder jusqu’au bout.',
      at: iso(addDays(now, -6)),
    },
    {
      id: newId('m'), classId: 'c_samedi', from: 'u_sup1', to: 'u_etu1', readBy: ['u_sup1'],
      content: 'Bonjour Koffi, très bon travail cette semaine ! Continue comme ça. 👏',
      at: iso(addDays(now, -2)),
    },
    {
      id: newId('m'), classId: 'c_samedi', from: 'u_etu1', to: 'u_sup1', readBy: ['u_etu1'],
      content: 'Merci Madame ! J’ai une question sur la prononciation de « thirteen » et « thirty ».',
      at: iso(new Date(addDays(now, -2).getTime() + 3 * 3600000)),
    },
    {
      id: newId('m'), classId: 'c_octobre', from: 'u_sup1', to: 'classe', readBy: ['u_sup1'],
      content: 'Hello Promo Octobre ! Pour débloquer chaque vidéo, il faut terminer la précédente. Bon courage !',
      at: iso(addDays(c2Start, 0)),
    },
  ]

  activity.sort((a, b) => b.at.localeCompare(a.at))
  return { version: DB_VERSION, users, classes, progress, activity, messages }
}
