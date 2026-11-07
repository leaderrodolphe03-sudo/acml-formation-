'use client'

import { CalendarCog, History, LayoutDashboard, MessageCircle, School, Users } from 'lucide-react'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import Shell from '../../components/Shell'
import { levelById } from '../../lib/catalog'
import { studentAlerts, studentRows, studentsOf, studentStats } from '../../lib/insights'
import { useStore } from '../../lib/store'
import type { ClassRoom } from '../../lib/types'

const CLASS_KEY = 'acml-classe'
const ClassCtx = createContext<{ classId: string; setClassId: (id: string) => void } | null>(null)

/** Données de la classe sélectionnée, calculées une fois pour toutes les pages. */
export function useSupervisor() {
  const { db, me } = useStore()
  const ctx = useContext(ClassCtx)!
  return useMemo(() => {
    const classes = db.classes.filter((c) => me?.role === 'admin' || c.supervisorId === me?.id)
    const cls = classes.find((c) => c.id === ctx.classId) ?? classes[0]
    const students = cls
      ? studentsOf(db, cls).map((s) => {
          const rows = studentRows(db, s)
          const stats = studentStats(db, s, rows)
          return { user: s, rows, stats, alerts: studentAlerts(stats) }
        })
      : []
    const unread = cls ? db.messages.filter((m) => m.classId === cls.id && m.to === me?.id && !m.readBy.includes(me!.id)).length : 0
    return { db, me: me!, classes, cls: cls as ClassRoom | undefined, level: cls ? levelById(cls.levelId) : undefined, students, unread, setClassId: ctx.setClassId }
  }, [db, me, ctx])
}

export type StudentInfo = ReturnType<typeof useSupervisor>['students'][number]

function ClassPicker() {
  const { classes, cls, setClassId } = useSupervisor()
  if (!classes.length) return null
  return (
    <label className="block">
      <span className="sr-only">Classe</span>
      <select
        value={cls?.id}
        onChange={(e) => setClassId(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-brand-900 outline-none lg:border-white/10 lg:bg-white/10 lg:text-white [&>option]:text-slate-900"
      >
        {classes.map((c) => <option key={c.id} value={c.id}>{c.name} · {levelById(c.levelId).name}</option>)}
      </select>
    </label>
  )
}

function Inner({ children }: { children: ReactNode }) {
  const { unread, students } = useSupervisor()
  const toFollow = students.filter((s) => s.alerts.length).length
  return (
    <Shell
      roleLabel="Espace superviseur"
      top={<ClassPicker />}
      nav={[
        { to: '/superviseur', label: 'Tableau de bord', short: 'Accueil', icon: LayoutDashboard, end: true },
        { to: '/superviseur/etudiants', label: 'Étudiants', icon: Users, badge: toFollow || undefined },
        { to: '/superviseur/programmation', label: 'Programmation', short: 'Planning', icon: CalendarCog },
        { to: '/superviseur/activite', label: "Journal d'activité", short: 'Activité', icon: History },
        { to: '/superviseur/messages', label: 'Communication', short: 'Messages', icon: MessageCircle, badge: unread || undefined },
        { to: '/superviseur/classes', label: 'Mes classes', short: 'Classes', icon: School },
      ]}
    >
      {children}
    </Shell>
  )
}

export default function SupervisorLayout({ children }: { children: ReactNode }) {
  const [classId, setClassId] = useState('')
  useEffect(() => {
    try {
      setClassId(localStorage.getItem(CLASS_KEY) ?? '')
    } catch {
      /* ignore */
    }
  }, [])
  useEffect(() => {
    try {
      if (classId) localStorage.setItem(CLASS_KEY, classId)
    } catch {
      /* ignore */
    }
  }, [classId])
  const value = useMemo(() => ({ classId, setClassId }), [classId])
  return (
    <ClassCtx.Provider value={value}>
      <Inner>{children}</Inner>
    </ClassCtx.Provider>
  )
}
