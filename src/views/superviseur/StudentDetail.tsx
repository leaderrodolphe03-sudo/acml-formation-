'use client'

import { ArrowLeft, BookOpenCheck, CalendarClock, Flame, Mail, MessageCircle, Phone, Target, Trophy, UserMinus, UserX } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { Avatar, Empty, ProgressBar, StatCard, StatusChip } from '../../components/ui'
import { levelById } from '../../lib/catalog'
import { fmtDate, fmtDuration } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import { ACTIVITY_META, activityText, AlertChips, lastSeenLabel } from './shared'
import { useSupervisor } from './SupervisorSpace'

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { db, classes, cls, students } = useSupervisor()
  const { updateStudent } = useStore()
  const [confirmRemove, setConfirmRemove] = useState(false)
  const info = students.find((s) => s.user.id === id)

  if (!info || !cls) return <Empty icon={UserX} title="Étudiant introuvable dans cette classe"><Link href="/superviseur/etudiants" className="text-brand-700 underline">Retour à la liste</Link></Empty>
  const { user, rows, stats, alerts } = info
  const acts = db.activity.filter((a) => a.userId === user.id).slice(0, 15)

  const transfer = (classId: string) => {
    const target = classes.find((c) => c.id === classId)
    if (!target) return
    updateStudent(user.id, { classId: target.id, level: target.levelId })
    router.push('/superviseur/etudiants')
  }

  return (
    <div className="space-y-6">
      <Link href="/superviseur/etudiants" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700"><ArrowLeft size={16} /> Tous les étudiants</Link>

      <section className="card flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <Avatar name={user.name} size="size-16" className="text-lg" />
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-extrabold text-brand-900">{user.name}</h1>
          <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="inline-flex items-center gap-1.5"><Mail size={14} />{user.email}</span>
            {user.phone && <span className="inline-flex items-center gap-1.5"><Phone size={14} />{user.phone}</span>}
          </p>
          <p className="mt-1 text-xs text-slate-500">Inscrit(e) le {fmtDate(user.joinedAt, { day: 'numeric', month: 'long', year: 'numeric' })} · Niveau {levelById(user.level ?? cls.levelId).name} · dernière connexion {lastSeenLabel(stats.lastSeen)}</p>
          {alerts.length > 0 && <div className="mt-3"><AlertChips alerts={alerts} /></div>}
        </div>
        <Link href={`/superviseur/messages?to=${user.id}`} className="btn-primary"><MessageCircle size={16} /> Envoyer un message</Link>
      </section>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Target} label="Avancement" value={`${stats.percent} %`} hint={<ProgressBar value={stats.percent} className="mt-1" />} />
        <StatCard icon={BookOpenCheck} label="Vidéos" value={`${stats.done}/${stats.unlocked}`} hint={`${stats.inProgress} en cours · ${stats.late} en retard`} tone="green" />
        <StatCard icon={Trophy} label="Moyenne quiz" value={stats.quizAvg !== undefined ? `${stats.quizAvg} %` : '—'} tone="amber" />
        <StatCard icon={Flame} label="Régularité" value={`${stats.streak} j`} hint={`${stats.activeDays} jours actifs au total`} tone="accent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="card overflow-hidden">
          <header className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-brand-900">Détail par vidéo</h2></header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-2.5">Leçon</th><th className="px-4 py-2.5">Prévue</th><th className="px-4 py-2.5">Visionnage réel</th><th className="px-4 py-2.5">Quiz</th><th className="px-4 py-2.5">Statut</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((r) => (
                  <tr key={r.lesson.id} className={r.status === 'verrouillee' ? 'text-slate-400' : ''}>
                    <td className="px-4 py-2.5"><span className="mr-1 text-slate-400">{r.lesson.order}.</span><span className="font-medium">{r.lesson.title}</span></td>
                    <td className="whitespace-nowrap px-4 py-2.5 text-xs">{fmtDate(r.entry.date)}</td>
                    <td className="px-4 py-2.5">
                      {r.status === 'verrouillee' ? '—' : (
                        <div className="flex items-center gap-2">
                          <ProgressBar value={r.percent} className="w-20" color={r.percent >= 90 ? 'bg-emerald-500' : 'bg-amber-500'} />
                          <span className="text-xs">{r.percent} % <span className="text-slate-400">({fmtDuration(r.progress?.watched ?? 0)})</span></span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs font-semibold">{r.progress?.quizScore !== undefined ? <span className={r.progress.quizScore < 50 ? 'text-red-600' : 'text-emerald-700'}>{r.progress.quizScore} %</span> : '—'}</td>
                    <td className="px-4 py-2.5"><StatusChip status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-brand-900"><CalendarClock size={18} /> Dernières actions</h2>
            <ul className="mt-4 space-y-3">
              {acts.map((a) => {
                const meta = ACTIVITY_META[a.type]
                return (
                  <li key={a.id} className="flex items-start gap-3">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-lg ${meta.color}`}><meta.icon size={14} /></span>
                    <div className="min-w-0"><p className="text-sm text-slate-700">{activityText(a.type, a.lessonId, a.detail)}</p><p className="text-[11px] text-slate-400">{fmtDate(a.at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
                  </li>
                )
              })}
              {acts.length === 0 && <li className="text-sm text-slate-500">Aucune activité enregistrée.</li>}
            </ul>
          </section>

          <section className="card p-5">
            <h2 className="font-bold text-brand-900">Gestion</h2>
            <label className="label mt-4" htmlFor="transfer">Transférer vers une autre classe (change le niveau)</label>
            <select id="transfer" className="input" value="" onChange={(e) => transfer(e.target.value)}>
              <option value="" disabled>Choisir une classe…</option>
              {classes.filter((c) => c.id !== cls.id).map((c) => <option key={c.id} value={c.id}>{c.name} · {levelById(c.levelId).name}</option>)}
            </select>
            {confirmRemove ? (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">
                Retirer {user.name} de la classe ? Son historique est conservé.
                <div className="mt-2 flex gap-2">
                  <button className="btn bg-red-600 px-3 py-1.5 text-white hover:bg-red-700" onClick={() => { updateStudent(user.id, { classId: undefined }); router.push('/superviseur/etudiants') }}>Retirer</button>
                  <button className="btn-ghost px-3 py-1.5" onClick={() => setConfirmRemove(false)}>Annuler</button>
                </div>
              </div>
            ) : (
              <button className="btn-ghost mt-4 w-full text-red-600 hover:border-red-200 hover:text-red-700" onClick={() => setConfirmRemove(true)}><UserMinus size={16} /> Retirer de la classe</button>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
