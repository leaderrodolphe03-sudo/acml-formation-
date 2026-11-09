'use client'

import {
  AlarmClock, ArrowRight, BadgeCheck, CalendarClock, CalendarDays, CheckCircle2, Clock3, Flame, Footprints, Lock, Medal, Play,
  Sparkles, Target, Trophy, UserRoundX,
} from 'lucide-react'
import Link from 'next/link'
import { Empty, IconTile, Panel, PageHeader, ProgressBar, ProgressRing, StatusChip } from '../../components/ui'
import { moduleById, modulesOfLevel } from '../../lib/catalog'
import { fmtDate, fmtDuration, toDate } from '../../lib/schedule'
import { useStudent } from './StudentSpace'

export default function Dashboard() {
  const { student, cls, rows, stats, level, supervisor } = useStudent()
  const firstName = student.name.split(' ')[0]

  if (!cls)
    return (
      <Empty icon={UserRoundX} title="Vous n'êtes rattaché(e) à aucune classe">
        Demandez un code d&apos;invitation à votre superviseur, puis utilisez « Rejoindre une classe ».
      </Empty>
    )

  const next = rows.find((r) => r.status === 'en-cours' || r.status === 'non-vue' || r.status === 'en-retard')
  const late = rows.filter((r) => r.status === 'en-retard')
  const upcoming = rows.filter((r) => r.status === 'verrouillee').slice(0, 4)
  const modules = modulesOfLevel(level.id)

  const badges = [
    { icon: Footprints, label: 'Premier pas', desc: 'Terminer une première leçon', ok: stats.done >= 1 },
    { icon: Flame, label: 'Série de 3 jours', desc: '3 jours actifs d’affilée', ok: stats.streak >= 3 },
    {
      icon: BadgeCheck, label: 'Module bouclé', desc: 'Terminer un module complet',
      ok: modules.some((m) => {
        const r = rows.filter((x) => x.lesson.moduleId === m.id)
        return r.length > 0 && r.every((x) => x.status === 'terminee')
      }),
    },
    { icon: Trophy, label: 'Sans faute', desc: 'Obtenir 100 % à un quiz', ok: rows.some((r) => r.progress?.quizScore === 100) },
    { icon: Medal, label: 'Assidu(e)', desc: '5 leçons et aucun retard', ok: stats.done >= 5 && stats.late === 0 },
  ]
  const earned = badges.filter((b) => b.ok).length

  return (
    <>
      <PageHeader
        eyebrow="Tableau de bord"
        title={`Bonjour ${firstName}`}
        subtitle={`${cls.name} · Niveau ${level.name}${supervisor ? ` · Superviseur : ${supervisor.name}` : ''}`}
        actions={
          next && (
            <Link href={`/etudiant/lecons/${next.lesson.id}`} className="btn-primary">
              <Play size={15} fill="currentColor" aria-hidden="true" /> {next.percent > 0 ? 'Reprendre ma leçon' : 'Commencer ma leçon'}
            </Link>
          )
        }
      />

      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        {/* ── Prochaine leçon ── */}
        <section className="panel-blue relative overflow-hidden rounded-[24px] p-5 text-white sm:p-6" aria-labelledby="next-title">
          <p className="text-[11px] font-medium uppercase tracking-[.16em] text-white/70">Prochaine leçon</p>
          {next ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-center">
              <Link
                href={`/etudiant/lecons/${next.lesson.id}`}
                className="group relative grid aspect-video place-items-center overflow-hidden rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur"
                aria-label={`Regarder « ${next.lesson.title} »`}
              >
                <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium backdrop-blur">Leçon {next.lesson.order}</span>
                <span className="grid size-14 place-items-center rounded-full bg-white text-brand-800 shadow-xl transition group-hover:scale-105">
                  <Play size={22} className="ml-0.5" fill="currentColor" aria-hidden="true" />
                </span>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/35 px-1.5 py-0.5 font-mono text-[11px]">{fmtDuration(next.lesson.duration)}</span>
                {next.percent > 0 && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><span className="block h-full bg-accent-500" style={{ width: `${next.percent}%` }} /></span>
                )}
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[12.5px] text-white/75">{moduleById(next.lesson.moduleId)?.title}</span>
                  {next.status === 'en-retard' && <span className="chip bg-accent-600 text-white ring-transparent">En retard</span>}
                </div>
                <h2 id="next-title" className="mt-1.5 text-[24px] font-medium leading-tight tracking-[-0.02em] sm:text-[26px]">{next.lesson.title}</h2>
                <p className="mt-1.5 text-[14px] leading-relaxed text-white/80">{next.lesson.description}</p>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-white/70">
                  <span className="inline-flex items-center gap-1.5"><Clock3 size={14} aria-hidden="true" />{Math.round(next.lesson.duration / 60)} min</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />Disponible depuis le {fmtDate(next.entry.date, { day: 'numeric', month: 'long' })}</span>
                </p>
                <Link href={`/etudiant/lecons/${next.lesson.id}`} className="btn mt-5 bg-white text-brand-900 hover:bg-tint">
                  {next.percent > 0 ? `Reprendre à ${next.percent} %` : 'Regarder maintenant'} <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-4">
              <span className="icon-tile size-12 rounded-2xl bg-white/15"><CheckCircle2 size={22} aria-hidden="true" /></span>
              <div>
                <h2 id="next-title" className="text-[22px] font-medium tracking-tight">Vous êtes à jour</h2>
                <p className="text-[14px] text-white/80">
                  {upcoming[0] ? `Prochaine leçon le ${fmtDate(upcoming[0].entry.date, { weekday: 'long', day: 'numeric', month: 'long' })}.` : 'Parcours terminé, félicitations !'}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ── Progression ── */}
        <section className="card p-5 sm:p-6" aria-labelledby="progress-title">
          <h2 id="progress-title" className="text-[15px] font-medium tracking-tight text-ink">Ma progression</h2>
          <div className="mt-4 flex items-center gap-5">
            <ProgressRing value={stats.percent} size={112} stroke={10} label={`Progression du niveau ${level.name}`}>
              <span>
                <span className="block text-[24px] font-medium leading-none tracking-tight text-ink">{stats.percent}%</span>
                <span className="mt-1 block text-[11px] text-ink-soft">du niveau</span>
              </span>
            </ProgressRing>
            <div className="min-w-0 space-y-1">
              <p className="text-[14px] text-ink"><b className="font-medium">{stats.done}</b> leçon{stats.done > 1 ? 's' : ''} terminée{stats.done > 1 ? 's' : ''} sur {stats.total}</p>
              <p className="text-[13px] text-ink-soft">Niveau {level.name}</p>
              <p className="text-[13px] text-ink-soft">{stats.unlocked - stats.done > 0 ? `${stats.unlocked - stats.done} disponible(s) à regarder` : 'Toutes les leçons disponibles sont faites'}</p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-xl border border-line">
            {[
              { icon: Target, label: 'À jour', value: `${stats.onTrack} %` },
              { icon: Trophy, label: 'Quiz', value: stats.quizAvg !== undefined ? `${stats.quizAvg} %` : '—' },
              { icon: Flame, label: 'Série', value: `${stats.streak} j` },
            ].map((s) => (
              <div key={s.label} className="px-3 py-3 text-center">
                <dt className="flex items-center justify-center gap-1.5 text-[11.5px] text-ink-soft"><s.icon size={13} aria-hidden="true" />{s.label}</dt>
                <dd className="mt-1 text-[18px] font-medium tracking-tight text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        {/* ── À rattraper ── */}
        <Panel
          title="À rattraper"
          icon={AlarmClock}
          description={late.length ? `${late.length} leçon${late.length > 1 ? 's' : ''} en retard` : 'Aucun retard'}
          bodyClassName=""
        >
          {late.length === 0 ? (
            <div className="flex items-center gap-3 px-5 py-6">
              <IconTile icon={CheckCircle2} tone="green" />
              <p className="text-[14px] text-ink-soft">Bravo, vous suivez le rythme de la classe.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line/80">
              {late.slice(0, 4).map((r) => (
                <li key={r.lesson.id}>
                  <Link href={`/etudiant/lecons/${r.lesson.id}`} className="group flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-surface">
                    <IconTile icon={Play} tone="accent" size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">{r.lesson.title}</p>
                      <p className="text-[12.5px] text-ink-soft">Prévue le {fmtDate(r.entry.date)} · {r.percent} % regardé</p>
                    </div>
                    <span className="text-[12.5px] font-medium text-brand-700 opacity-0 transition group-hover:opacity-100">Rattraper</span>
                    <ArrowRight size={16} className="text-ink-soft" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ── À venir ── */}
        <Panel
          title="À venir"
          icon={CalendarClock}
          description="Prochaines leçons programmées"
          action={<Link href="/etudiant/calendrier" className="text-[12.5px] font-medium text-brand-700 hover:underline">Calendrier</Link>}
          bodyClassName=""
        >
          {upcoming.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-ink-soft">Toutes les leçons du parcours sont déjà disponibles.</p>
          ) : (
            <ol className="divide-y divide-line/80">
              {upcoming.map((r) => {
                const d = toDate(r.entry.date)
                return (
                  <li key={r.lesson.id} className="flex items-center gap-3.5 px-5 py-3">
                    <div className="grid w-12 shrink-0 rounded-xl border border-line bg-surface py-1.5 text-center">
                      <span className="text-[10px] font-medium uppercase tracking-wide text-accent-600">{fmtDate(d, { month: 'short' }).replace('.', '')}</span>
                      <span className="text-[18px] font-medium leading-none tracking-tight text-ink">{d.getDate()}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-ink">{r.lesson.title}</p>
                      <p className="truncate text-[12.5px] text-ink-soft">{moduleById(r.lesson.moduleId)?.title} · {Math.round(r.lesson.duration / 60)} min</p>
                    </div>
                    <StatusChip status={r.status} />
                  </li>
                )
              })}
            </ol>
          )}
        </Panel>
      </div>

      {/* ── Badges ── */}
      <Panel
        className="mt-5"
        title="Mes badges"
        icon={Sparkles}
        description={`${earned} sur ${badges.length} obtenus`}
        action={<ProgressBar value={(earned / badges.length) * 100} className="hidden w-28 sm:block" color="bg-accent-600" />}
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {badges.map((b) => (
            <li
              key={b.label}
              className={`relative flex flex-col items-start rounded-2xl border p-4 transition ${b.ok ? 'border-brand-100 bg-gradient-to-br from-white to-tint' : 'border-line bg-surface/60'}`}
            >
              <span
                className={`icon-tile size-11 rounded-2xl ${b.ok ? 'bg-gradient-to-br from-brand-500 to-brand-900 text-white shadow-[0_10px_20px_-12px_rgba(10,44,80,0.8)]' : 'bg-white text-ink-soft/70 ring-1 ring-line'}`}
              >
                <b.icon size={20} aria-hidden="true" />
              </span>
              {!b.ok && <Lock size={13} className="absolute right-3 top-3 text-ink-soft/70" aria-label="Pas encore obtenu" />}
              <p className={`mt-3 text-[13.5px] font-medium ${b.ok ? 'text-ink' : 'text-ink-soft'}`}>{b.label}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-soft">{b.desc}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}
