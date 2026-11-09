'use client'

import { CalendarDays, LayoutGrid, MessagesSquare, MonitorPlay } from 'lucide-react'
import { useMemo, type ReactNode } from 'react'
import Shell from '../../components/Shell'
import { levelById } from '../../lib/catalog'
import { studentRows, studentStats } from '../../lib/insights'
import { useStore } from '../../lib/store'

export function useStudent() {
  const { db, me } = useStore()
  return useMemo(() => {
    const student = me!
    const cls = db.classes.find((c) => c.id === student.classId)
    const supervisor = db.users.find((u) => u.id === cls?.supervisorId)
    const rows = studentRows(db, student)
    const stats = studentStats(db, student, rows)
    const level = levelById(student.level ?? cls?.levelId ?? 'debutant')
    const messages = cls
      ? db.messages.filter((m) => m.classId === cls.id && (m.to === 'classe' || m.to === student.id || m.from === student.id))
      : []
    const unread = messages.filter((m) => !m.readBy.includes(student.id)).length
    return { db, student, cls, supervisor, rows, stats, level, messages, unread }
  }, [db, me])
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  const { unread, stats } = useStudent()
  return (
    <Shell
      roleLabel="Espace étudiant"
      notifications={{ count: unread, href: '/etudiant/messages', label: 'Messages non lus' }}
      nav={[
        { to: '/etudiant', label: 'Tableau de bord', short: 'Accueil', icon: LayoutGrid, end: true, section: 'Apprendre' },
        { to: '/etudiant/lecons', label: 'Mes leçons', short: 'Leçons', icon: MonitorPlay, badge: stats.late || undefined, section: 'Apprendre' },
        { to: '/etudiant/calendrier', label: 'Calendrier', icon: CalendarDays, section: 'Apprendre' },
        { to: '/etudiant/messages', label: 'Messages', icon: MessagesSquare, badge: unread || undefined, section: 'Échanger' },
      ]}
    >
      {children}
    </Shell>
  )
}
