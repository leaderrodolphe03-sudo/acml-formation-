'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { lessonById } from './catalog'
import { COMPLETION_THRESHOLD } from './schedule'
import { createSeed, DB_VERSION, newId } from './seed'
import type { Activity, ActivityType, ClassRoom, DbState, LevelId, Message, User } from './types'

const DB_KEY = 'acml-db'
const SESSION_KEY = 'acml-session'

function load(): DbState {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as DbState
      if (parsed.version === DB_VERSION) return parsed
    }
  } catch {
    /* stockage indisponible : on repart du jeu de démo */
  }
  return createSeed()
}

interface Store {
  db: DbState
  me: User | null
  ready: boolean // true une fois les données du navigateur chargées
  login: (identifier: string, password: string) => User | null
  logout: () => void
  register: (data: { name: string; email: string; phone?: string; password: string; code: string }) => User | string
  log: (type: ActivityType, lessonId?: string, detail?: string, userId?: string) => void
  watch: (lessonId: string, position: number, watchedDelta: number) => void
  submitQuiz: (lessonId: string, score: number) => void
  sendMessage: (classId: string, to: string, content: string) => void
  markRead: (ids: string[]) => void
  createClass: (name: string, levelId: LevelId) => ClassRoom
  updateClass: (id: string, patch: Partial<ClassRoom>, historyDetail?: string) => void
  updateStudent: (id: string, patch: Partial<User>) => void
  resetDemo: () => void
}

const EMPTY: DbState = { version: DB_VERSION, users: [], classes: [], progress: [], activity: [], messages: [] }

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  // Côté serveur et au premier rendu client : état vide (évite les écarts d'hydratation).
  const [db, setDb] = useState<DbState>(EMPTY)
  const [meId, setMeId] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setDb(load())
    try {
      setMeId(localStorage.getItem(SESSION_KEY))
    } catch {
      /* ignore */
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db))
    } catch {
      /* ignore */
    }
  }, [db, ready])

  useEffect(() => {
    if (!ready) return
    try {
      if (meId) localStorage.setItem(SESSION_KEY, meId)
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      /* ignore */
    }
  }, [meId, ready])

  const me = useMemo(() => db.users.find((u) => u.id === meId) ?? null, [db.users, meId])

  const pushActivity = (s: DbState, a: Omit<Activity, 'id' | 'at'>): DbState => ({
    ...s,
    activity: [{ id: newId('a'), at: new Date().toISOString(), ...a }, ...s.activity].slice(0, 3000),
  })

  const log = useCallback<Store['log']>(
    (type, lessonId, detail, userId) => {
      const uidv = userId ?? meId
      if (!uidv) return
      setDb((s) => {
        const u = s.users.find((x) => x.id === uidv)
        return pushActivity(s, { userId: uidv, classId: u?.classId, type, lessonId, detail })
      })
    },
    [meId],
  )

  const login = useCallback<Store['login']>(
    (identifier, password) => {
      const id = identifier.trim().toLowerCase().replace(/\s+/g, '')
      const user = db.users.find(
        (u) => (u.email.toLowerCase() === id || u.phone?.replace(/\s+/g, '') === id) && u.password === password,
      )
      if (!user) return null
      setMeId(user.id)
      setDb((s) => pushActivity(s, { userId: user.id, classId: user.classId, type: 'connexion' }))
      return user
    },
    [db.users],
  )

  const logout = useCallback(() => setMeId(null), [])

  const register = useCallback<Store['register']>(
    ({ name, email, phone, password, code }) => {
      const cls = db.classes.find((c) => c.code.toLowerCase() === code.trim().toLowerCase())
      if (!cls) return "Code de classe introuvable. Vérifiez le code envoyé par votre superviseur."
      if (db.users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase()))
        return 'Un compte existe déjà avec cet e-mail.'
      const user: User = {
        id: newId('u'),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || undefined,
        password,
        role: 'etudiant',
        classId: cls.id,
        level: cls.levelId,
        joinedAt: new Date().toISOString(),
      }
      setDb((s) => pushActivity({ ...s, users: [...s.users, user] }, { userId: user.id, classId: cls.id, type: 'connexion', detail: 'A rejoint la classe' }))
      setMeId(user.id)
      return user
    },
    [db.classes, db.users],
  )

  const watch = useCallback<Store['watch']>(
    (lessonId, position, watchedDelta) => {
      if (!meId) return
      const lesson = lessonById(lessonId)
      if (!lesson) return
      setDb((s) => {
        const existing = s.progress.find((p) => p.studentId === meId && p.lessonId === lessonId)
        const watched = Math.min(lesson.duration, (existing?.watched ?? 0) + watchedDelta)
        const justCompleted = !existing?.completedAt && watched >= lesson.duration * COMPLETION_THRESHOLD
        const updated = {
          ...(existing ?? { studentId: meId, lessonId }),
          position,
          watched,
          completedAt: existing?.completedAt ?? (justCompleted ? new Date().toISOString() : undefined),
        }
        let next: DbState = {
          ...s,
          progress: existing ? s.progress.map((p) => (p === existing ? updated : p)) : [...s.progress, updated],
        }
        if (justCompleted) {
          const u = s.users.find((x) => x.id === meId)
          next = pushActivity(next, { userId: meId, classId: u?.classId, type: 'fin', lessonId, detail: `${Math.round((watched / lesson.duration) * 100)} % regardé` })
        }
        return next
      })
    },
    [meId],
  )

  const submitQuiz = useCallback<Store['submitQuiz']>(
    (lessonId, score) => {
      if (!meId) return
      setDb((s) => {
        const u = s.users.find((x) => x.id === meId)
        const existing = s.progress.find((p) => p.studentId === meId && p.lessonId === lessonId)
        const updated = {
          ...(existing ?? { studentId: meId, lessonId, position: 0, watched: 0 }),
          quizScore: Math.max(score, existing?.quizScore ?? 0),
          quizAttempts: (existing?.quizAttempts ?? 0) + 1,
        }
        return pushActivity(
          { ...s, progress: existing ? s.progress.map((p) => (p === existing ? updated : p)) : [...s.progress, updated] },
          { userId: meId, classId: u?.classId, type: 'quiz', lessonId, detail: `Score : ${score} %` },
        )
      })
    },
    [meId],
  )

  const sendMessage = useCallback<Store['sendMessage']>(
    (classId, to, content) => {
      if (!meId || !content.trim()) return
      const m: Message = { id: newId('m'), classId, from: meId, to, content: content.trim(), at: new Date().toISOString(), readBy: [meId] }
      setDb((s) => {
        const sender = s.users.find((u) => u.id === meId)
        const withMsg = { ...s, messages: [...s.messages, m] }
        return sender?.role === 'etudiant'
          ? pushActivity(withMsg, { userId: meId, classId, type: 'message', detail: content.trim().slice(0, 60) })
          : withMsg
      })
    },
    [meId],
  )

  const markRead = useCallback<Store['markRead']>(
    (ids) => {
      if (!meId || !ids.length) return
      setDb((s) => ({
        ...s,
        messages: s.messages.map((m) => (ids.includes(m.id) && !m.readBy.includes(meId) ? { ...m, readBy: [...m.readBy, meId] } : m)),
      }))
    },
    [meId],
  )

  const createClass = useCallback<Store['createClass']>(
    (name, levelId) => {
      const code = `${name.replace(/[^A-Za-z]/g, '').slice(0, 5).toUpperCase() || 'ACML'}-${Math.floor(10 + Math.random() * 89)}`
      const today = new Date().toISOString().slice(0, 10)
      const cls: ClassRoom = {
        id: newId('c'), name, levelId, code, supervisorId: meId ?? '', startDate: today,
        rhythm: { days: [1, 4], perSession: 1 }, rules: { revisit: true, requirePrevious: false }, schedule: [],
      }
      setDb((s) => ({ ...s, classes: [...s.classes, cls] }))
      return cls
    },
    [meId],
  )

  const updateClass = useCallback<Store['updateClass']>(
    (id, patch, historyDetail) => {
      setDb((s) => {
        const next = { ...s, classes: s.classes.map((c) => (c.id === id ? { ...c, ...patch } : c)) }
        return historyDetail && meId ? pushActivity(next, { userId: meId, classId: id, type: 'programmation', detail: historyDetail }) : next
      })
    },
    [meId],
  )

  const updateStudent = useCallback<Store['updateStudent']>((id, patch) => {
    setDb((s) => ({ ...s, users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)) }))
  }, [])

  const resetDemo = useCallback(() => {
    setDb(createSeed())
    setMeId(null)
  }, [])

  const value: Store = { db, me, ready, login, logout, register, log, watch, submitQuiz, sendMessage, markRead, createClass, updateClass, updateStudent, resetDemo }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore doit être utilisé dans <StoreProvider>')
  return v
}
