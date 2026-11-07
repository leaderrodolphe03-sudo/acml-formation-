'use client'

import { ArrowDownWideNarrow, BellRing, CheckCircle2, Download, Eye, EyeOff, Gauge, School, Send, UserCheck, Users } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Avatar, Empty, PageHeader, ProgressBar, StatCard } from '../../components/ui'
import { lessonById } from '../../lib/catalog'
import { COMPLETION_THRESHOLD, fmtDate, LATE_AFTER_DAYS, startOfDay } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import { ACTIVITY_META, activityText, AlertChips, exportCsv, lastSeenLabel } from './shared'
import { useSupervisor } from './SupervisorSpace'

export default function Overview() {
  const { db, me, cls, level, students } = useSupervisor()
  const { sendMessage } = useStore()
  const [sent, setSent] = useState<string[]>([])
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  if (!cls)
    return <Empty icon={School} title="Aucune classe pour le moment"><Link href="/superviseur/classes" className="font-semibold text-brand-700 underline">Créer ma première classe</Link></Empty>

  const active7 = students.filter((s) => s.stats.inactiveDays < 7).length
  const avgCompletion = students.length ? Math.round(students.reduce((a, s) => a + s.stats.onTrack, 0) / students.length) : 0
  const avgPercent = students.length ? Math.round(students.reduce((a, s) => a + s.stats.percent, 0) / students.length) : 0
  const toFollow = students.filter((s) => s.alerts.length)
  const sorted = [...students].sort((a, b) => (sort === 'desc' ? b.stats.percent - a.stats.percent : a.stats.percent - b.stats.percent))

  const unlocked = cls.schedule.filter((e) => startOfDay(e.date) <= new Date())
  const views = unlocked
    .map((e) => ({ lesson: lessonById(e.lessonId)!, done: students.filter((s) => s.rows.find((r) => r.lesson.id === e.lessonId)?.status === 'terminee').length }))
    .sort((a, b) => b.done - a.done)
  const nextUnlock = cls.schedule.find((e) => startOfDay(e.date) > new Date())
  const recent = db.activity.filter((a) => a.classId === cls.id).slice(0, 8)

  const remind = (id: string, name: string, late: number) => {
    sendMessage(cls.id, id, `Bonjour ${name.split(' ')[0]}, je vois que tu as ${late > 0 ? `${late} vidéo(s) en retard` : "été moins actif(ve) ces derniers jours"}. Prends 10 minutes aujourd'hui pour avancer, tu peux le faire ! 💪`)
    setSent((s) => [...s, id])
  }

  return (
    <>
      <PageHeader
        title={`Bonjour ${me.name.split(' ')[0]} 👋`}
        subtitle={<>{cls.name} · Niveau {level?.name} · Code d'invitation <b className="font-mono text-brand-700">{cls.code}</b></>}
        actions={<button className="btn-ghost" onClick={() => exportCsv(cls.name, students)}><Download size={16} /> Exporter le bilan</button>}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={Users} label="Étudiants" value={students.length} hint={`${active7} actif(s) cette semaine`} />
        <StatCard icon={Gauge} label="Taux de complétion" value={`${avgCompletion} %`} hint="des vidéos déjà débloquées" tone="green" />
        <StatCard icon={UserCheck} label="Avancement moyen" value={`${avgPercent} %`} hint={`du parcours ${level?.name}`} tone="amber" />
        <StatCard icon={BellRing} label="À relancer" value={toFollow.length} hint={nextUnlock ? `Prochaine vidéo le ${fmtDate(nextUnlock.date)}` : 'Parcours entièrement débloqué'} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-brand-900">Progression des étudiants</h2>
            <button onClick={() => setSort(sort === 'desc' ? 'asc' : 'desc')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-brand-700">
              <ArrowDownWideNarrow size={15} className={sort === 'asc' ? 'rotate-180' : ''} /> {sort === 'desc' ? 'Meilleurs en premier' : 'Plus faibles en premier'}
            </button>
          </header>
          <ul className="divide-y divide-slate-100">
            {sorted.map(({ user, stats }, i) => (
              <li key={user.id}>
                <Link href={`/superviseur/etudiants/${user.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                  <span className="w-5 text-center text-xs font-bold text-slate-400">{i + 1}</span>
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-slate-800">{user.name}</p>
                      <span className="text-xs font-bold text-brand-900">{stats.percent} %</span>
                    </div>
                    <ProgressBar value={stats.percent} className="mt-1.5" color={stats.late >= 2 ? 'bg-red-500' : stats.percent >= 40 ? 'bg-emerald-500' : 'bg-brand-600'} />
                    <p className="mt-1 text-[11px] text-slate-500">{stats.done} terminée(s) · {stats.late} en retard · vu {lastSeenLabel(stats.lastSeen)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-brand-900">Étudiants à relancer</h2>
            <span className="chip bg-accent-50 text-accent-700 ring-accent-100">{toFollow.length}</span>
          </header>
          {toFollow.length === 0 ? (
            <div className="p-5"><Empty icon={CheckCircle2} title="Tout le monde est à jour">Aucune alerte de décrochage.</Empty></div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {toFollow.map(({ user, stats, alerts }) => (
                <li key={user.id} className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} size="size-8" />
                    <Link href={`/superviseur/etudiants/${user.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800 hover:text-brand-700">{user.name}</Link>
                    <button disabled={sent.includes(user.id)} onClick={() => remind(user.id, user.name, stats.late)} className="btn-ghost px-3 py-1.5 text-xs">
                      {sent.includes(user.id) ? <><CheckCircle2 size={14} className="text-emerald-600" /> Relancé</> : <><Send size={14} /> Relancer</>}
                    </button>
                  </div>
                  <div className="mt-2 pl-11"><AlertChips alerts={alerts} /></div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-bold text-brand-900">Vidéos les plus et les moins regardées</h2>
          {views.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">Aucune vidéo débloquée pour l'instant.</p>
          ) : (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {[['Les plus vues', Eye, views.slice(0, 3)], ['Les moins vues', EyeOff, [...views].reverse().slice(0, 3)]].map(([title, Icon, list]) => {
                const I = Icon as typeof Eye
                return (
                  <div key={title as string}>
                    <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500"><I size={14} />{title as string}</p>
                    <ul className="space-y-2.5">
                      {(list as typeof views).map((v) => (
                        <li key={v.lesson.id}>
                          <div className="flex justify-between gap-2 text-sm"><span className="truncate font-medium text-slate-700">{v.lesson.title}</span><span className="shrink-0 text-xs font-bold text-slate-500">{v.done}/{students.length}</span></div>
                          <ProgressBar value={students.length ? (v.done / students.length) * 100 : 0} className="mt-1 h-1.5" color={title === 'Les plus vues' ? 'bg-emerald-500' : 'bg-amber-500'} />
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-900">Activité récente</h2>
            <Link href="/superviseur/activite" className="text-sm font-semibold text-brand-700 hover:underline">Tout voir</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {recent.map((a) => {
              const meta = ACTIVITY_META[a.type]
              const who = db.users.find((u) => u.id === a.userId)
              return (
                <li key={a.id} className="flex items-start gap-3">
                  <span className={`grid size-8 shrink-0 place-items-center rounded-lg ${meta.color}`}><meta.icon size={15} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-700"><b className="font-semibold text-slate-900">{who?.name}</b> — {activityText(a.type, a.lessonId, a.detail)}</p>
                    <p className="text-[11px] text-slate-400">{lastSeenLabel(a.at)}</p>
                  </div>
                </li>
              )
            })}
            {recent.length === 0 && <li className="text-sm text-slate-500">Pas encore d'activité.</li>}
          </ul>
        </section>
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">Statistiques calculées en temps réel · une vidéo est « terminée » à {COMPLETION_THRESHOLD * 100} % de visionnage · « en retard » {LATE_AFTER_DAYS} jours après son déblocage.</p>
    </>
  )
}
