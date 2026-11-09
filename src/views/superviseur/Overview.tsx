'use client'

import {
  Activity, BellRing, CalendarRange, Check, CircleCheck, Copy, Download, Layers, Info, MonitorPlay, Send, TrendingUp, Users,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { Avatar, Empty, IconTile, Panel, PageHeader, ProgressBar, Segmented, StatCard } from '../../components/ui'
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
  const [views, setViews] = useState<'top' | 'flop'>('top')
  const [copied, setCopied] = useState(false)

  if (!cls)
    return (
      <Empty icon={Layers} title="Aucune classe pour le moment">
        <Link href="/superviseur/classes" className="font-medium text-brand-700 hover:underline">Créer ma première classe</Link>
      </Empty>
    )

  const active7 = students.filter((s) => s.stats.inactiveDays < 7).length
  const avgCompletion = students.length ? Math.round(students.reduce((a, s) => a + s.stats.onTrack, 0) / students.length) : 0
  const avgPercent = students.length ? Math.round(students.reduce((a, s) => a + s.stats.percent, 0) / students.length) : 0
  const toFollow = students.filter((s) => s.alerts.length)
  const sorted = [...students].sort((a, b) => (sort === 'desc' ? b.stats.percent - a.stats.percent : a.stats.percent - b.stats.percent))

  const unlocked = cls.schedule.filter((e) => startOfDay(e.date) <= new Date())
  const engagement = unlocked
    .map((e) => ({ lesson: lessonById(e.lessonId)!, done: students.filter((s) => s.rows.find((r) => r.lesson.id === e.lessonId)?.status === 'terminee').length }))
    .sort((a, b) => b.done - a.done)
  const shownViews = views === 'top' ? engagement.slice(0, 5) : [...engagement].reverse().slice(0, 5)
  const nextUnlock = cls.schedule.find((e) => startOfDay(e.date) > new Date())
  const recent = db.activity.filter((a) => a.classId === cls.id).slice(0, 7)

  const remind = (id: string, name: string, late: number) => {
    sendMessage(
      cls.id,
      id,
      `Bonjour ${name.split(' ')[0]}, je vois que tu as ${late > 0 ? `${late} vidéo(s) en retard` : 'été moins actif(ve) ces derniers jours'}. Prends 10 minutes aujourd'hui pour avancer, tu peux le faire !`,
    )
    setSent((s) => [...s, id])
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(cls.code).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <>
      <PageHeader
        eyebrow="Tableau de bord"
        title={`Bonjour ${me.name.split(' ')[0]}`}
        subtitle={
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {cls.name} · Niveau {level?.name}
            <button type="button" onClick={copyCode} className="chip bg-white text-ink ring-line transition hover:ring-brand-200" title="Copier le code d'invitation">
              {copied ? <Check size={12} className="text-emerald-600" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
              Code <span className="font-mono">{cls.code}</span>
            </button>
          </span>
        }
        actions={
          <>
            <button type="button" className="btn-ghost" onClick={() => exportCsv(cls.name, students)}>
              <Download size={16} aria-hidden="true" /> Exporter le bilan
            </button>
            <Link href="/superviseur/programmation" className="btn-primary">
              <CalendarRange size={16} aria-hidden="true" /> Programmation
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard icon={Users} label="Étudiants" value={students.length} hint={`${active7} actif${active7 > 1 ? 's' : ''} ces 7 derniers jours`} />
        <StatCard icon={CircleCheck} label="Taux de complétion" value={`${avgCompletion} %`} hint="des vidéos déjà débloquées" tone="green" />
        <StatCard icon={TrendingUp} label="Avancement moyen" value={`${avgPercent} %`} hint={<ProgressBar value={avgPercent} className="mt-1" />} tone="amber" />
        <StatCard
          icon={BellRing}
          label="À relancer"
          value={toFollow.length}
          hint={nextUnlock ? `Prochaine vidéo le ${fmtDate(nextUnlock.date, { day: 'numeric', month: 'long' })}` : 'Parcours entièrement débloqué'}
          tone="accent"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <Panel
          title="Progression de la classe"
          icon={TrendingUp}
          description={`${students.length} étudiant${students.length > 1 ? 's' : ''}`}
          bodyClassName=""
          action={
            <Segmented<'desc' | 'asc'>
              value={sort}
              onChange={setSort}
              options={[
                { value: 'desc', label: 'Meilleurs' },
                { value: 'asc', label: 'À aider' },
              ]}
            />
          }
        >
          <ul className="divide-y divide-line/70">
            {sorted.map(({ user, stats }, i) => (
              <li key={user.id}>
                <Link href={`/superviseur/etudiants/${user.id}`} className="flex items-center gap-3.5 px-5 py-3 transition hover:bg-surface">
                  <span className="w-5 text-center text-[12px] font-medium text-ink-soft">{i + 1}</span>
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[14px] font-medium text-ink">{user.name}</p>
                      <span className="text-[13px] font-medium tabular-nums text-ink">{stats.percent} %</span>
                    </div>
                    <ProgressBar value={stats.percent} className="mt-2" color={stats.late >= 2 ? 'bg-accent-600' : stats.percent >= 40 ? 'bg-emerald-500' : 'bg-brand-600'} />
                    <p className="mt-1.5 text-[12px] text-ink-soft">
                      {stats.done} terminée{stats.done > 1 ? 's' : ''}
                      {stats.late > 0 && <span className="text-accent-700"> · {stats.late} en retard</span>} · vu {lastSeenLabel(stats.lastSeen)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="À relancer" icon={BellRing} description="Décrochage, retards ou quiz en échec" bodyClassName="">
          {toFollow.length === 0 ? (
            <div className="flex items-center gap-3 px-5 py-6">
              <IconTile icon={CircleCheck} tone="green" />
              <p className="text-[14px] text-ink-soft">Aucune alerte : toute la classe suit le rythme.</p>
            </div>
          ) : (
            <ul className="divide-y divide-line/70">
              {toFollow.map(({ user, stats, alerts }) => {
                const done = sent.includes(user.id)
                return (
                  <li key={user.id} className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="size-8" />
                      <Link href={`/superviseur/etudiants/${user.id}`} className="min-w-0 flex-1 truncate text-[14px] font-medium text-ink hover:text-brand-700">
                        {user.name}
                      </Link>
                      <button
                        type="button"
                        disabled={done}
                        onClick={() => remind(user.id, user.name, stats.late)}
                        className={`btn h-8 px-3 text-[12.5px] ${done ? 'bg-emerald-50 text-emerald-700 disabled:opacity-100' : 'btn-soft'}`}
                      >
                        {done ? <><Check size={14} aria-hidden="true" /> Relancé</> : <><Send size={14} aria-hidden="true" /> Relancer</>}
                      </button>
                    </div>
                    <div className="mt-2 pl-11"><AlertChips alerts={alerts} /></div>
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel
          title="Engagement par vidéo"
          icon={MonitorPlay}
          description="Élèves ayant terminé chaque vidéo débloquée"
          action={
            <Segmented<'top' | 'flop'>
              value={views}
              onChange={setViews}
              options={[
                { value: 'top', label: 'Plus vues' },
                { value: 'flop', label: 'Moins vues' },
              ]}
            />
          }
        >
          {engagement.length === 0 ? (
            <p className="text-[14px] text-ink-soft">Aucune vidéo débloquée pour l&apos;instant.</p>
          ) : (
            <ul className="space-y-4">
              {shownViews.map((v) => {
                const pct = students.length ? (v.done / students.length) * 100 : 0
                return (
                  <li key={v.lesson.id}>
                    <div className="flex items-baseline justify-between gap-3 text-[13.5px]">
                      <span className="truncate text-ink">
                        <span className="mr-2 text-ink-soft">{String(v.lesson.order).padStart(2, '0')}</span>
                        {v.lesson.title}
                      </span>
                      <span className="shrink-0 text-[12.5px] tabular-nums text-ink-soft">{v.done}/{students.length}</span>
                    </div>
                    <ProgressBar value={pct} className="mt-2" color={views === 'top' ? 'bg-brand-600' : 'bg-amber-500'} />
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>

        <Panel
          title="Activité récente"
          icon={Activity}
          action={<Link href="/superviseur/activite" className="text-[12.5px] font-medium text-brand-700 hover:underline">Tout voir</Link>}
        >
          {recent.length === 0 ? (
            <p className="text-[14px] text-ink-soft">Pas encore d&apos;activité.</p>
          ) : (
            <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-4 before:top-2 before:w-px before:bg-line">
              {recent.map((a) => {
                const m = ACTIVITY_META[a.type]
                const who = db.users.find((u) => u.id === a.userId)
                return (
                  <li key={a.id} className="relative flex items-start gap-3">
                    <span className={`icon-tile relative size-8 rounded-full ring-4 ring-white ${m.color}`}><m.icon size={14} aria-hidden="true" /></span>
                    <div className="min-w-0 pt-0.5">
                      <p className="text-[13.5px] leading-snug text-ink">
                        <span className="font-medium">{who?.name}</span> <span className="text-ink-soft">— {activityText(a.type, a.lessonId, a.detail)}</span>
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-ink-soft">{lastSeenLabel(a.at)}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </Panel>
      </div>

      <p className="mt-6 flex items-center justify-center gap-2 text-center text-[12px] text-ink-soft">
        <Info size={13} aria-hidden="true" />
        Une vidéo est « terminée » à {COMPLETION_THRESHOLD * 100} % de visionnage réel · « en retard » {LATE_AFTER_DAYS} jours après son déblocage.
      </p>
    </>
  )
}
