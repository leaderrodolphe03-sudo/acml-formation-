'use client'

import {
  AlarmClock, CalendarCog, CircleAlert, CircleCheck, Clock3, Download, ListChecks, LogIn, MessageSquare, Pause, Play, RotateCw,
  type LucideIcon,
} from 'lucide-react'
import { TONE_TILE, type Tone } from '../../components/ui'
import { lessonById } from '../../lib/catalog'
import { fmtDate, timeAgo } from '../../lib/schedule'
import type { ActivityType } from '../../lib/types'
import type { Alert } from '../../lib/insights'
import type { StudentInfo } from './SupervisorSpace'

const meta = (label: string, icon: LucideIcon, tone: Tone) => ({ label, icon, tone, color: TONE_TILE[tone] })

/** Libellé, icône et teinte de chaque type d'action du journal. */
export const ACTIVITY_META: Record<ActivityType, { label: string; icon: LucideIcon; tone: Tone; color: string }> = {
  connexion: meta('Connexion', LogIn, 'slate'),
  lancement: meta('Lancement de vidéo', Play, 'brand'),
  pause: meta('Pause', Pause, 'amber'),
  reprise: meta('Reprise', RotateCw, 'brand'),
  fin: meta('Vidéo terminée', CircleCheck, 'green'),
  telechargement: meta('Téléchargement', Download, 'slate'),
  quiz: meta('Quiz', ListChecks, 'amber'),
  message: meta('Message', MessageSquare, 'brand'),
  programmation: meta('Programmation', CalendarCog, 'accent'),
}

export function activityText(type: ActivityType, lessonId?: string, detail?: string) {
  const lesson = lessonId ? lessonById(lessonId)?.title : undefined
  const parts = [ACTIVITY_META[type].label, lesson && `« ${lesson} »`, detail].filter(Boolean)
  return parts.join(' · ')
}

export const ALERT_ICON: Record<Alert['kind'], LucideIcon> = { inactif: Clock3, retard: AlarmClock, quiz: CircleAlert }

export function AlertChips({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {alerts.map((a) => {
        const Icon = ALERT_ICON[a.kind]
        return (
          <span key={a.kind} className="chip bg-accent-50 text-accent-700 ring-accent-600/20">
            <Icon size={12} aria-hidden="true" />
            {a.text}
          </span>
        )
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
