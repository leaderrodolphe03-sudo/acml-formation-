'use client'

import { Activity, CalendarRange, ChevronsUpDown, Layers, LayoutGrid, MessagesSquare, School, Users } from 'lucide-react'
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
    <label className="relative flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2 transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100 hover:border-brand-200">
      <span className="icon-tile size-8 rounded-lg bg-white text-brand-700 ring-1 ring-line"><School size={16} aria-hidden="true" /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] text-ink-soft">Classe active</span>
        <span className="block truncate text-[13.5px] font-medium text-ink">{cls ? `${cls.name} · ${levelById(cls.levelId).name}` : '—'}</span>
      </span>
      <ChevronsUpDown size={15} className="shrink-0 text-ink-soft" aria-hidden="true" />
      <select
        value={cls?.id}
        onChange={(e) => setClassId(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
        aria-label="Changer de classe"
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
      notifications={{ count: unread, href: '/superviseur/messages', label: 'Messages non lus' }}
      nav={[
        { to: '/superviseur', label: 'Tableau de bord', short: 'Accueil', icon: LayoutGrid, end: true, section: 'Pilotage' },
        { to: '/superviseur/etudiants', label: 'Étudiants', icon: Users, badge: toFollow || undefined, section: 'Pilotage' },
        { to: '/superviseur/activite', label: "Journal d'activité", short: 'Activité', icon: Activity, section: 'Pilotage' },
        { to: '/superviseur/programmation', label: 'Programmation', short: 'Planning', icon: CalendarRange, section: 'Organisation' },
        { to: '/superviseur/classes', label: 'Mes classes', short: 'Classes', icon: Layers, section: 'Organisation' },
        { to: '/superviseur/messages', label: 'Communication', short: 'Messages', icon: MessagesSquare, badge: unread || undefined, section: 'Échanger' },
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
