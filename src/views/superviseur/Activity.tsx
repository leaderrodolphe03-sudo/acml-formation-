'use client'

import { Filter, History } from 'lucide-react'
import { useState } from 'react'
import { Avatar, Empty, PageHeader } from '../../components/ui'
import { lessonById } from '../../lib/catalog'
import { DAY, fmtDate, isoDay } from '../../lib/schedule'
import type { ActivityType } from '../../lib/types'
import { ACTIVITY_META, activityText } from './shared'
import { useSupervisor } from './SupervisorSpace'

export default function Activity() {
  const { db, cls, students } = useSupervisor()
  const [f, setF] = useState({ student: '', type: '', period: '30', lesson: '' })
  const [limit, setLimit] = useState(60)

  if (!cls) return <Empty icon={History} title="Aucune classe sélectionnée" />

  const since = f.period ? Date.now() - Number(f.period) * DAY : 0
  const list = db.activity.filter(
    (a) =>
      a.classId === cls.id &&
      (!f.student || a.userId === f.student) &&
      (!f.type || a.type === f.type) &&
      (!f.lesson || a.lessonId === f.lesson) &&
      new Date(a.at).getTime() >= since,
  )
  const groups = new Map<string, typeof list>()
  list.slice(0, limit).forEach((a) => {
    const k = isoDay(new Date(a.at))
    groups.set(k, [...(groups.get(k) ?? []), a])
  })

  return (
    <>
      <PageHeader title="Journal d'activité" subtitle={`${list.length} évènement(s) · historique chronologique de la classe`} />

      <section className="card mb-6 p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-bold text-brand-900"><Filter size={16} /> Filtrer</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <select className="input" value={f.student} onChange={(e) => setF({ ...f, student: e.target.value })} aria-label="Étudiant">
            <option value="">Tous les étudiants</option>
            {students.map((s) => <option key={s.user.id} value={s.user.id}>{s.user.name}</option>)}
          </select>
          <select className="input" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} aria-label="Type d'action">
            <option value="">Toutes les actions</option>
            {(Object.keys(ACTIVITY_META) as ActivityType[]).map((t) => <option key={t} value={t}>{ACTIVITY_META[t].label}</option>)}
          </select>
          <select className="input" value={f.lesson} onChange={(e) => setF({ ...f, lesson: e.target.value })} aria-label="Vidéo">
            <option value="">Toutes les vidéos</option>
            {cls.schedule.map((e) => <option key={e.lessonId} value={e.lessonId}>{lessonById(e.lessonId)?.title}</option>)}
          </select>
          <select className="input" value={f.period} onChange={(e) => setF({ ...f, period: e.target.value })} aria-label="Période">
            <option value="1">Dernières 24 h</option>
            <option value="7">7 derniers jours</option>
            <option value="30">30 derniers jours</option>
            <option value="">Tout l'historique</option>
          </select>
        </div>
      </section>

      {list.length === 0 ? (
        <Empty icon={History} title="Aucune activité pour ces filtres" />
      ) : (
        <div className="space-y-6">
          {[...groups.entries()].map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{fmtDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
              <ul className="card divide-y divide-slate-100">
                {items.map((a) => {
                  const meta = ACTIVITY_META[a.type]
                  const who = db.users.find((u) => u.id === a.userId)
                  return (
                    <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-12 shrink-0 font-mono text-xs text-slate-400">{new Date(a.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${meta.color}`}><meta.icon size={15} /></span>
                      <Avatar name={who?.name ?? '?'} size="size-7" className="hidden text-[10px] sm:grid" />
                      <p className="min-w-0 flex-1 text-sm text-slate-700"><b className="font-semibold text-slate-900">{who?.name}</b> — {activityText(a.type, a.lessonId, a.detail)}</p>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
          {list.length > limit && <button className="btn-ghost mx-auto flex" onClick={() => setLimit(limit + 60)}>Afficher plus</button>}
        </div>
      )}
    </>
  )
}
