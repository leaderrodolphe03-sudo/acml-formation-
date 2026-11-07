'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { PageHeader, StatusChip } from '../../components/ui'
import { fmtDate, isoDay, STATUS_STYLE, toDate } from '../../lib/schedule'
import { useStudent } from './StudentSpace'

export default function Calendar() {
  const { rows, cls } = useStudent()
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const today = isoDay(new Date())

  const first = new Date(month)
  const offset = (first.getDay() + 6) % 7 // semaine qui commence le lundi
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells = Array.from({ length: Math.ceil((offset + daysInMonth) / 7) * 7 }, (_, i) => {
    const day = i - offset + 1
    return day >= 1 && day <= daysInMonth ? new Date(month.getFullYear(), month.getMonth(), day) : null
  })
  const byDay = new Map<string, typeof rows>()
  rows.forEach((r) => byDay.set(r.entry.date, [...(byDay.get(r.entry.date) ?? []), r]))
  const monthRows = rows.filter((r) => { const d = toDate(r.entry.date); return d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear() })

  const rhythm = cls ? `${cls.rhythm.perSession} vidéo(s) chaque ${cls.rhythm.days.map((d) => ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'][d]).join(' et ')}` : ''

  return (
    <>
      <PageHeader title="Mon calendrier" subtitle={`Rythme de la classe : ${rhythm}`} />
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <button className="grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mois précédent"><ChevronLeft size={18} /></button>
            <h2 className="text-lg font-extrabold capitalize text-brand-900">{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
            <button className="grid size-9 place-items-center rounded-lg border border-slate-200 hover:bg-slate-50" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mois suivant"><ChevronRight size={18} /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-slate-400">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => <div key={d} className="py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const key = isoDay(d)
              const items = byDay.get(key) ?? []
              const isToday = key === today
              return (
                <div key={i} className={`min-h-16 rounded-xl border p-1.5 text-left sm:min-h-20 ${isToday ? 'border-accent-500 bg-accent-50/40' : 'border-slate-100'}`}>
                  <p className={`text-xs font-bold ${isToday ? 'text-accent-600' : 'text-slate-500'}`}>{d.getDate()}</p>
                  <div className="mt-1 space-y-1">
                    {items.map((r) => (
                      <Link key={r.lesson.id} href={r.status === 'verrouillee' ? '#' : `/etudiant/lecons/${r.lesson.id}`} title={r.lesson.title} className={`block truncate rounded-md px-1 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${STATUS_STYLE[r.status]}`}>
                        <span className="hidden sm:inline">{r.lesson.title}</span><span className="sm:hidden">L{r.lesson.order}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-bold text-brand-900">Ce mois-ci</h2>
          <ul className="mt-4 space-y-3">
            {monthRows.length === 0 && <li className="text-sm text-slate-500">Aucune vidéo programmée ce mois-ci.</li>}
            {monthRows.map((r) => (
              <li key={r.lesson.id} className="flex items-center gap-3">
                <span className="w-14 shrink-0 text-xs font-bold capitalize text-slate-500">{fmtDate(r.entry.date, { weekday: 'short', day: 'numeric' })}</span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{r.lesson.title}</span>
                <StatusChip status={r.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
