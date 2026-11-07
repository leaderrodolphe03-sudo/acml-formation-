'use client'

import { AlarmClock, Award, BookOpenCheck, CalendarClock, Flame, Lock, Medal, PlayCircle, Rocket, Target, Trophy } from 'lucide-react'
import Link from 'next/link'
import { Empty, ProgressBar, StatCard, StatusChip } from '../../components/ui'
import { moduleById, modulesOfLevel } from '../../lib/catalog'
import { fmtDate, fmtDuration, toDate } from '../../lib/schedule'
import { useStudent } from './StudentSpace'

export default function Dashboard() {
  const { student, cls, rows, stats, level, supervisor } = useStudent()
  const firstName = student.name.split(' ')[0]

  if (!cls)
    return <Empty icon={Lock} title="Vous n'êtes rattaché(e) à aucune classe">Demandez un code d'invitation à votre superviseur.</Empty>

  const next = rows.find((r) => r.status === 'en-cours' || r.status === 'non-vue' || r.status === 'en-retard')
  const late = rows.filter((r) => r.status === 'en-retard')
  const upcoming = rows.filter((r) => r.status === 'verrouillee').slice(0, 4)

  const modules = modulesOfLevel(level.id)
  const badges = [
    { icon: Rocket, label: 'Premier pas', desc: '1re leçon terminée', ok: stats.done >= 1 },
    { icon: Flame, label: 'Série de 3 jours', desc: '3 jours consécutifs', ok: stats.streak >= 3 },
    { icon: Medal, label: 'Module bouclé', desc: 'Un module complet', ok: modules.some((m) => { const r = rows.filter((x) => x.lesson.moduleId === m.id); return r.length > 0 && r.every((x) => x.status === 'terminee') }) },
    { icon: Trophy, label: 'As du quiz', desc: 'Un quiz à 100 %', ok: rows.some((r) => r.progress?.quizScore === 100) },
    { icon: Award, label: 'Assidu(e)', desc: '5 leçons, 0 retard', ok: stats.done >= 5 && stats.late === 0 },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white sm:p-8">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 right-24 size-40 rounded-full bg-accent-600/20" />
        <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="font-script text-2xl text-brand-100">Hello {firstName}!</p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">Prêt(e) pour votre leçon du jour ?</h1>
            <p className="mt-2 text-sm text-brand-200">
              {cls.name} · Niveau {level.name} · Superviseur : {supervisor?.name}
            </p>
            <div className="mt-5 max-w-md">
              <div className="mb-1.5 flex justify-between text-xs font-semibold text-brand-100">
                <span>Progression du niveau {level.name}</span>
                <span>{stats.done}/{stats.total} leçons · {stats.percent} %</span>
              </div>
              <ProgressBar value={stats.percent} className="h-2.5 bg-white/15" color="bg-gradient-to-r from-accent-500 to-amber-400" />
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 ring-1 ring-white/15">
            <Flame size={32} className={stats.streak ? 'text-amber-400' : 'text-white/40'} />
            <div>
              <p className="text-2xl font-extrabold leading-none">{stats.streak} jour{stats.streak > 1 ? 's' : ''}</p>
              <p className="text-xs text-brand-100">de série d'assiduité</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-brand-900">Prochaine vidéo à regarder</h2>
            {next && <StatusChip status={next.status} />}
          </div>
          {next ? (
            <div className="grid gap-5 p-5 sm:grid-cols-[220px_1fr]">
              <Link href={`/etudiant/lecons/${next.lesson.id}`} className="group relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-800 to-brand-950">
                <span className="absolute left-3 top-3 rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">Leçon {next.lesson.order}</span>
                <PlayCircle size={52} className="text-white transition group-hover:scale-110" />
                <span className="absolute bottom-3 right-3 rounded-md bg-black/40 px-1.5 text-[11px] text-white">{fmtDuration(next.lesson.duration)}</span>
                {next.percent > 0 && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><div className="h-full bg-accent-500" style={{ width: `${next.percent}%` }} /></div>}
              </Link>
              <div className="flex flex-col">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{moduleById(next.lesson.moduleId)?.title}</p>
                <h3 className="mt-1 text-xl font-extrabold text-brand-900">{next.lesson.title}</h3>
                <p className="mt-1.5 text-sm text-slate-600">{next.lesson.description}</p>
                <p className="mt-2 text-xs text-slate-500">Disponible depuis le {fmtDate(next.entry.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                <Link href={`/etudiant/lecons/${next.lesson.id}`} className="btn-accent mt-4 self-start">
                  <PlayCircle size={17} /> {next.percent > 0 ? `Reprendre (${next.percent} %)` : 'Regarder maintenant'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-5">
              <Empty icon={BookOpenCheck} title="Vous êtes à jour ! 🎉">
                {upcoming[0] ? `Prochaine leçon le ${fmtDate(upcoming[0].entry.date, { weekday: 'long', day: 'numeric', month: 'long' })}.` : 'Parcours terminé, bravo !'}
              </Empty>
            </div>
          )}
        </section>

        <section className="card">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="flex items-center gap-2 font-bold text-brand-900"><AlarmClock size={18} className="text-accent-600" /> Vidéos en retard</h2>
            <span className="chip bg-red-50 text-red-700 ring-red-200">{late.length}</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {late.length === 0 && <li className="px-5 py-6 text-center text-sm text-slate-500">Aucun retard, continuez ainsi ! 💪</li>}
            {late.slice(0, 4).map((r) => (
              <li key={r.lesson.id}>
                <Link href={`/etudiant/lecons/${r.lesson.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                  <PlayCircle size={20} className="shrink-0 text-red-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">{r.lesson.title}</p>
                    <p className="text-xs text-slate-500">Prévue le {fmtDate(r.entry.date)} · {r.percent} % vu</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard icon={BookOpenCheck} label="Leçons terminées" value={stats.done} hint={`sur ${stats.unlocked} débloquées`} tone="green" />
        <StatCard icon={Target} label="À jour" value={`${stats.onTrack} %`} hint="des vidéos disponibles" />
        <StatCard icon={Trophy} label="Moyenne aux quiz" value={stats.quizAvg !== undefined ? `${stats.quizAvg} %` : '—'} tone="amber" />
        <StatCard icon={CalendarClock} label="Jours actifs" value={stats.activeDays} hint="depuis votre inscription" tone="accent" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-brand-900">À venir</h2>
            <Link href="/etudiant/calendrier" className="text-sm font-semibold text-brand-700 hover:underline">Calendrier</Link>
          </div>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 && <li className="text-sm text-slate-500">Toutes les leçons sont déjà disponibles.</li>}
            {upcoming.map((r) => (
              <li key={r.lesson.id} className="flex items-center gap-3">
                <div className="grid w-12 shrink-0 rounded-xl bg-brand-50 py-1.5 text-center">
                  <span className="text-[10px] font-bold uppercase text-brand-600">{fmtDate(r.entry.date, { month: 'short' })}</span>
                  <span className="text-lg font-extrabold leading-none text-brand-900">{toDate(r.entry.date).getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">{r.lesson.title}</p>
                  <p className="text-xs text-slate-500">{moduleById(r.lesson.moduleId)?.title} · {Math.round(r.lesson.duration / 60)} min</p>
                </div>
                <Lock size={16} className="text-slate-300" />
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="font-bold text-brand-900">Mes badges</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {badges.map((b) => (
              <div key={b.label} className={`flex flex-col items-center rounded-2xl p-3 text-center ${b.ok ? 'bg-amber-50' : 'bg-slate-50 opacity-60 grayscale'}`} title={b.desc}>
                <span className={`grid size-11 place-items-center rounded-full ${b.ok ? 'bg-gradient-to-br from-amber-400 to-accent-600 text-white shadow-md shadow-amber-500/30' : 'bg-slate-200 text-slate-400'}`}>
                  <b.icon size={20} />
                </span>
                <p className="mt-2 text-[11px] font-bold leading-tight text-slate-700">{b.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Débloquez des badges en restant régulier(ère) et en réussissant vos quiz.</p>
        </section>
      </div>
    </div>
  )
}
