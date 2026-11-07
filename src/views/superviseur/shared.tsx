'use client'

import { AlertTriangle, Clock, Download, LogIn, MessageSquare, Pause, Play, PlayCircle, Settings2, Trophy, type LucideIcon } from 'lucide-react'
import { lessonById } from '../../lib/catalog'
import { fmtDate, timeAgo } from '../../lib/schedule'
import type { ActivityType } from '../../lib/types'
import type { Alert } from '../../lib/insights'
import type { StudentInfo } from './SupervisorSpace'

export const ACTIVITY_META: Record<ActivityType, { label: string; icon: LucideIcon; color: string }> = {
  connexion: { label: 'Connexion', icon: LogIn, color: 'bg-slate-100 text-slate-600' },
  lancement: { label: 'Lancement de vidéo', icon: PlayCircle, color: 'bg-sky-50 text-sky-600' },
  pause: { label: 'Pause', icon: Pause, color: 'bg-amber-50 text-amber-600' },
  reprise: { label: 'Reprise', icon: Play, color: 'bg-sky-50 text-sky-600' },
  fin: { label: 'Vidéo terminée', icon: Trophy, color: 'bg-emerald-50 text-emerald-600' },
  telechargement: { label: 'Téléchargement', icon: Download, color: 'bg-violet-50 text-violet-600' },
  quiz: { label: 'Quiz', icon: Trophy, color: 'bg-amber-50 text-amber-600' },
  message: { label: 'Message', icon: MessageSquare, color: 'bg-brand-50 text-brand-600' },
  programmation: { label: 'Programmation', icon: Settings2, color: 'bg-accent-50 text-accent-600' },
}

export function activityText(type: ActivityType, lessonId?: string, detail?: string) {
  const lesson = lessonId ? lessonById(lessonId)?.title : undefined
  const parts = [ACTIVITY_META[type].label, lesson && `« ${lesson} »`, detail].filter(Boolean)
  return parts.join(' · ')
}

export const ALERT_ICON: Record<Alert['kind'], LucideIcon> = { inactif: Clock, retard: AlertTriangle, quiz: Trophy }

export function AlertChips({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {alerts.map((a) => {
        const Icon = ALERT_ICON[a.kind]
        return <span key={a.kind} className="chip bg-red-50 text-red-700 ring-red-200"><Icon size={12} />{a.text}</span>
      })}
    </div>
  )
}

export const lastSeenLabel = (iso?: string) => (iso ? timeAgo(iso) : 'jamais')

/** Export CSV (ouvrable dans Excel / LibreOffice) pour les rapports à l'administration. */
export function exportCsv(className: string, students: StudentInfo[]) {
  const header = ['Étudiant', 'E-mail', 'Téléphone', 'Avancement (%)', 'Terminées', 'En retard', 'Moyenne quiz (%)', 'Jours actifs', 'Dernière connexion']
  const lines = students.map(({ user, stats }) => [
    user.name, user.email, user.phone ?? '', stats.percent, stats.done, stats.late, stats.quizAvg ?? '', stats.activeDays,
    stats.lastSeen ? fmtDate(stats.lastSeen, { day: '2-digit', month: '2-digit', year: 'numeric' }) : '',
  ])
  const csv = [header, ...lines].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `bilan-${className.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
