'use client'

import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { PageHeader, Panel, StatusChip } from '../../components/ui'
import { fmtDate, isoDay, STATUS_DOT, STATUS_STYLE, toDate } from '../../lib/schedule'
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

  const legend: [string, string][] = [['terminee', 'Terminée'], ['en-cours', 'En cours'], ['non-vue', 'À regarder'], ['en-retard', 'En retard'], ['verrouillee', 'À venir']]

  return (
    <>
      <PageHeader eyebrow="Planning" title="Mon calendrier" subtitle={`Rythme de la classe : ${rhythm}`} />
      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <section className="card p-4 sm:p-5" aria-labelledby="cal-title">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 id="cal-title" className="text-[18px] font-medium capitalize tracking-tight text-ink">{month.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</h2>
            <div className="flex items-center gap-1.5">
              <button type="button" className="btn-ghost h-9 px-3 text-[12.5px]" onClick={() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)) }}>Aujourd&apos;hui</button>
              <button type="button" className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:bg-surface hover:text-ink" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} aria-label="Mois précédent"><ChevronLeft size={17} /></button>
              <button type="button" className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:bg-surface hover:text-ink" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} aria-label="Mois suivant"><ChevronRight size={17} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium uppercase tracking-wide text-ink-soft">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => <div key={d} className="py-1.5">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (!d) return <div key={i} />
              const key = isoDay(d)
              const items = byDay.get(key) ?? []
              const isToday = key === today
              const weekend = d.getDay() === 0 || d.getDay() === 6
              return (
                <div key={i} className={`min-h-16 rounded-xl border p-1.5 text-left sm:min-h-22 ${isToday ? 'border-brand-500 bg-tint/60' : weekend ? 'border-line/60 bg-surface/60' : 'border-line/70'}`}>
                  <p className={`grid size-6 place-items-center rounded-full text-[12px] font-medium ${isToday ? 'bg-brand-700 text-white' : 'text-ink-soft'}`}>{d.getDate()}</p>
                  <div className="mt-1 space-y-1">
                    {items.map((r) => {
                      const cls = `block truncate rounded-md px-1.5 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${STATUS_STYLE[r.status]}`
                      const label = <><span className="hidden sm:inline">{r.lesson.title}</span><span className="sm:hidden">L{r.lesson.order}</span></>
                      return r.status === 'verrouillee'
                        ? <span key={r.lesson.id} title={r.lesson.title} className={cls}>{label}</span>
                        : <Link key={r.lesson.id} href={`/etudiant/lecons/${r.lesson.id}`} title={r.lesson.title} className={cls}>{label}</Link>
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-4" aria-label="Légende">
            {legend.map(([k, l]) => (
              <li key={k} className="flex items-center gap-1.5 text-[12px] text-ink-soft">
                <span className={`size-2 rounded-full ${STATUS_DOT[k as keyof typeof STATUS_DOT]}`} aria-hidden="true" />{l}
              </li>
            ))}
          </ul>
        </section>

        <Panel title="Ce mois-ci" icon={CalendarDays} description={`${monthRows.length} leçon${monthRows.length > 1 ? 's' : ''} programmée${monthRows.length > 1 ? 's' : ''}`} bodyClassName="">
          {monthRows.length === 0 ? (
            <p className="px-5 py-6 text-[14px] text-ink-soft">Aucune vidéo programmée ce mois-ci.</p>
          ) : (
            <ul className="divide-y divide-line/70">
              {monthRows.map((r) => (
                <li key={r.lesson.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="w-16 shrink-0 text-[12px] font-medium capitalize text-ink-soft">{fmtDate(r.entry.date, { weekday: 'short', day: 'numeric' })}</span>
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{r.lesson.title}</span>
                  <StatusChip status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  )
}
