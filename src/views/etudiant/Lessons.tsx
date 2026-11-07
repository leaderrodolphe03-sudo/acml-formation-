'use client'

import { CheckCircle2, Circle, Clock3, Lock, PlayCircle } from 'lucide-react'
import Link from 'next/link'
import { PageHeader, ProgressBar, StatusChip } from '../../components/ui'
import { modulesOfLevel } from '../../lib/catalog'
import { fmtDate } from '../../lib/schedule'
import { useStudent } from './StudentSpace'

export default function Lessons() {
  const { rows, level, stats } = useStudent()
  const modules = modulesOfLevel(level.id)

  return (
    <>
      <PageHeader title="Mes leçons" subtitle={`Niveau ${level.name} · ${stats.done} leçon(s) terminée(s) sur ${stats.total}`} />
      <div className="space-y-5">
        {modules.map((m) => {
          const mRows = rows.filter((r) => r.lesson.moduleId === m.id)
          if (!mRows.length) return null
          const done = mRows.filter((r) => r.status === 'terminee').length
          return (
            <section key={m.id} className="card overflow-hidden">
              <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4">
                <span className="grid size-9 place-items-center rounded-xl bg-brand-700 text-sm font-extrabold text-white">{m.order}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-brand-900">{m.title}</h2>
                  <p className="text-xs text-slate-500">{done}/{mRows.length} leçons terminées</p>
                </div>
                <ProgressBar value={(done / mRows.length) * 100} className="w-full sm:w-40" color="bg-emerald-500" />
              </header>
              <ul className="divide-y divide-slate-100">
                {mRows.map((r) => {
                  const locked = r.status === 'verrouillee'
                  const Icon = r.status === 'terminee' ? CheckCircle2 : locked ? Lock : r.percent > 0 ? PlayCircle : Circle
                  const body = (
                    <>
                      <Icon size={22} className={`shrink-0 ${r.status === 'terminee' ? 'text-emerald-600' : locked ? 'text-slate-300' : r.status === 'en-retard' ? 'text-red-500' : 'text-brand-600'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`truncate font-semibold ${locked ? 'text-slate-400' : 'text-slate-800'}`}>
                          <span className="mr-1.5 text-slate-400">{r.lesson.order}.</span>{r.lesson.title}
                        </p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1"><Clock3 size={12} />{Math.round(r.lesson.duration / 60)} min</span>
                          <span>{locked ? 'Disponible le' : 'Depuis le'} {fmtDate(r.entry.date, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                          {r.progress?.quizScore !== undefined && <span>Quiz : {r.progress.quizScore} %</span>}
                        </p>
                        {r.percent > 0 && r.status !== 'terminee' && <ProgressBar value={r.percent} className="mt-2 h-1.5 max-w-xs" color="bg-accent-500" />}
                      </div>
                      <StatusChip status={r.status} />
                    </>
                  )
                  return (
                    <li key={r.lesson.id}>
                      {locked ? (
                        <div className="flex items-center gap-4 px-5 py-3.5">{body}</div>
                      ) : (
                        <Link href={`/etudiant/lecons/${r.lesson.id}`} className="flex items-center gap-4 px-5 py-3.5 transition hover:bg-brand-50/50">{body}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
