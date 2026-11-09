'use client'

import { Check, ChevronRight, Clock3, Lock, Play, RotateCcw, Trophy } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { PageHeader, ProgressBar, Segmented, StatusChip } from '../../components/ui'
import type { LessonRow } from '../../lib/insights'
import { modulesOfLevel } from '../../lib/catalog'
import { fmtDate } from '../../lib/schedule'
import { useStudent } from './StudentSpace'

type Filter = 'toutes' | 'a-faire' | 'terminees'

function StateIcon({ row }: { row: LessonRow }) {
  const base = 'icon-tile size-9 rounded-full'
  if (row.status === 'terminee') return <span className={`${base} bg-emerald-50 text-emerald-600`}><Check size={16} strokeWidth={2.4} aria-hidden="true" /></span>
  if (row.status === 'verrouillee') return <span className={`${base} bg-slate-100 text-ink-soft/70`}><Lock size={15} aria-hidden="true" /></span>
  if (row.status === 'en-retard') return <span className={`${base} bg-accent-50 text-accent-600`}><Play size={15} className="ml-0.5" aria-hidden="true" /></span>
  if (row.percent > 0) return <span className={`${base} bg-brand-50 text-brand-700`}><RotateCcw size={15} aria-hidden="true" /></span>
  return <span className={`${base} bg-brand-50 text-brand-700`}><Play size={15} className="ml-0.5" aria-hidden="true" /></span>
}

export default function Lessons() {
  const { rows, level, stats } = useStudent()
  const [filter, setFilter] = useState<Filter>('toutes')
  const modules = modulesOfLevel(level.id)
  const keep = (r: LessonRow) =>
    filter === 'toutes' ? true : filter === 'terminees' ? r.status === 'terminee' : r.status === 'en-cours' || r.status === 'non-vue' || r.status === 'en-retard'

  return (
    <>
      <PageHeader
        eyebrow="Parcours"
        title="Mes leçons"
        subtitle={`Niveau ${level.name} · ${stats.done} terminée${stats.done > 1 ? 's' : ''} sur ${stats.total}`}
        actions={
          <Segmented<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'toutes', label: 'Toutes' },
              { value: 'a-faire', label: 'À faire' },
              { value: 'terminees', label: 'Terminées' },
            ]}
          />
        }
      />

      <div className="space-y-5">
        {modules.map((m) => {
          const mRows = rows.filter((r) => r.lesson.moduleId === m.id)
          const shown = mRows.filter(keep)
          if (!mRows.length || !shown.length) return null
          const done = mRows.filter((r) => r.status === 'terminee').length
          const pct = Math.round((done / mRows.length) * 100)
          return (
            <section key={m.id} className="card overflow-hidden" aria-labelledby={`mod-${m.id}`}>
              <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-line/80 px-5 py-4">
                <span className="text-[12px] font-medium uppercase tracking-[.14em] text-accent-600">Module {m.order}</span>
                <h2 id={`mod-${m.id}`} className="min-w-0 flex-1 text-[16px] font-medium tracking-tight text-ink">{m.title}</h2>
                <div className="flex w-full items-center gap-3 sm:w-48">
                  <ProgressBar value={pct} className="flex-1" color={pct === 100 ? 'bg-emerald-500' : 'bg-brand-600'} />
                  <span className="w-14 text-right text-[12.5px] text-ink-soft">{done}/{mRows.length}</span>
                </div>
              </header>
              <ul className="divide-y divide-line/70">
                {shown.map((r) => {
                  const locked = r.status === 'verrouillee'
                  const body = (
                    <>
                      <StateIcon row={r} />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-[14.5px] font-medium ${locked ? 'text-ink-soft' : 'text-ink'}`}>
                          <span className="mr-2 font-normal text-ink-soft/80">{String(r.lesson.order).padStart(2, '0')}</span>
                          {r.lesson.title}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12.5px] text-ink-soft">
                          <span className="inline-flex items-center gap-1"><Clock3 size={13} aria-hidden="true" />{Math.round(r.lesson.duration / 60)} min</span>
                          <span>{locked ? 'Disponible le' : 'Depuis le'} {fmtDate(r.entry.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                          {r.progress?.quizScore !== undefined && (
                            <span className="inline-flex items-center gap-1"><Trophy size={13} aria-hidden="true" />Quiz {r.progress.quizScore} %</span>
                          )}
                        </p>
                        {r.percent > 0 && r.status !== 'terminee' && <ProgressBar value={r.percent} className="mt-2 max-w-xs" color="bg-accent-600" />}
                      </div>
                      <StatusChip status={r.status} />
                      {!locked && <ChevronRight size={17} className="hidden text-ink-soft/70 sm:block" aria-hidden="true" />}
                    </>
                  )
                  return (
                    <li key={r.lesson.id}>
                      {locked ? (
                        <div className="flex items-center gap-4 px-5 py-3.5">{body}</div>
                      ) : (
                        <Link href={`/etudiant/lecons/${r.lesson.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-surface">{body}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
        {rows.filter(keep).length === 0 && (
          <p className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center text-[14px] text-ink-soft">Aucune leçon dans cette catégorie.</p>
        )}
      </div>
    </>
  )
}
