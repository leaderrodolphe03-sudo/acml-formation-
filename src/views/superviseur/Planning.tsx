'use client'

import { CalendarCog, CalendarPlus, CheckCircle2, History, Lock, PauseCircle, Sparkles, Unlock } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Empty, PageHeader, Toggle } from '../../components/ui'
import { lessonById, LEVELS, moduleById } from '../../lib/catalog'
import { addDays, fmtDate, isoDay, scheduleForLevel, startOfDay, WEEKDAYS } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import type { LevelId } from '../../lib/types'
import { useSupervisor } from './SupervisorSpace'

export default function Planning() {
  const { db, cls, students } = useSupervisor()
  const { updateClass, updateStudent } = useStore()
  const [form, setForm] = useState(() => ({
    levelId: cls?.levelId ?? ('debutant' as LevelId),
    startDate: cls?.startDate ?? isoDay(new Date()),
    days: cls?.rhythm.days ?? [1, 4],
    perSession: cls?.rhythm.perSession ?? 1,
  }))
  const [pause, setPause] = useState({ from: isoDay(new Date()), days: 7 })
  const [flash, setFlash] = useState('')

  useEffect(() => {
    if (cls) setForm({ levelId: cls.levelId, startDate: cls.startDate, days: cls.rhythm.days, perSession: cls.rhythm.perSession })
  }, [cls?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(''), 3000)
    return () => clearTimeout(t)
  }, [flash])

  if (!cls) return <Empty icon={CalendarCog} title="Aucune classe sélectionnée" />

  const preview = scheduleForLevel({ levelId: form.levelId, startDate: form.startDate, rhythm: { days: form.days, perSession: form.perSession } })
  const today = startOfDay(new Date())
  const history = db.activity.filter((a) => a.classId === cls.id && a.type === 'programmation').slice(0, 8)

  const programAll = () => {
    const changedLevel = form.levelId !== cls.levelId
    updateClass(
      cls.id,
      { levelId: form.levelId, startDate: form.startDate, rhythm: { days: [...form.days].sort(), perSession: form.perSession }, schedule: preview },
      `Parcours ${LEVELS.find((l) => l.id === form.levelId)?.name} programmé : ${preview.length} vidéos, ${form.perSession}/séance (${form.days.map((d) => WEEKDAYS[d]).join(', ')}) à partir du ${fmtDate(form.startDate)}`,
    )
    if (changedLevel) students.forEach((s) => updateStudent(s.user.id, { level: form.levelId }))
    setFlash(`✅ ${preview.length} vidéos programmées jusqu'au ${fmtDate(preview.at(-1)?.date ?? form.startDate, { day: 'numeric', month: 'long' })}.`)
  }

  const moveLesson = (lessonId: string, date: string) => {
    if (!date) return
    updateClass(cls.id, { schedule: cls.schedule.map((e) => (e.lessonId === lessonId ? { ...e, date } : e)) }, `« ${lessonById(lessonId)?.title} » déplacée au ${fmtDate(date)}`)
  }

  const applyPause = () => {
    const from = startOfDay(pause.from)
    const shifted = cls.schedule.map((e) => (startOfDay(e.date) >= from ? { ...e, date: isoDay(addDays(e.date, pause.days)) } : e))
    updateClass(cls.id, { schedule: shifted }, `Pause de ${pause.days} jours à partir du ${fmtDate(pause.from)} : la suite du programme est décalée`)
    setFlash(`⏸️ Programme décalé de ${pause.days} jours à partir du ${fmtDate(pause.from)}.`)
  }

  const setRule = (k: 'revisit' | 'requirePrevious', v: boolean) =>
    updateClass(cls.id, { rules: { ...cls.rules, [k]: v } }, `${k === 'revisit' ? 'Revisionnage après la date' : 'Déblocage conditionné à la vidéo précédente'} : ${v ? 'activé' : 'désactivé'}`)

  return (
    <>
      <PageHeader title="Programmation des vidéos" subtitle={`Classe « ${cls.name} » · ${cls.schedule.length} vidéos programmées`} />
      {flash && <div className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">{flash}</div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_1.25fr]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-brand-900"><Sparkles size={18} className="text-accent-600" /> Programmer tout le parcours en un clic</h2>
            <p className="mt-1 text-sm text-slate-500">Choisissez le niveau et le rythme : la plateforme répartit automatiquement toutes les vidéos.</p>

            <div className="mt-5 space-y-4">
              <div>
                <span className="label">Parcours</span>
                <div className="grid grid-cols-3 gap-2">
                  {LEVELS.map((l) => (
                    <button key={l.id} type="button" onClick={() => setForm({ ...form, levelId: l.id })} className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${form.levelId === l.id ? 'border-brand-600 bg-brand-50 text-brand-800 ring-2 ring-brand-100' : 'border-slate-200 text-slate-600 hover:border-brand-200'}`}>
                      {l.name}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="label">Jours de diffusion</span>
                <div className="flex flex-wrap gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => {
                    const on = form.days.includes(d)
                    return (
                      <button key={d} type="button" aria-pressed={on} onClick={() => setForm({ ...form, days: on ? form.days.filter((x) => x !== d) : [...form.days, d] })} className={`h-10 w-12 rounded-xl text-sm font-semibold transition ${on ? 'bg-brand-700 text-white' : 'border border-slate-200 text-slate-600 hover:border-brand-200'}`}>
                        {WEEKDAYS[d]}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="start">Date de début</label>
                  <input id="start" type="date" className="input" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="per">Vidéos par séance</label>
                  <select id="per" className="input" value={form.perSession} onChange={(e) => setForm({ ...form, perSession: Number(e.target.value) })}>
                    {[1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3.5 text-sm text-brand-900">
                {form.days.length === 0 ? 'Choisissez au moins un jour.' : (
                  <><b>{preview.length} vidéos</b> · {form.days.length * form.perSession} par semaine · fin prévue le <b>{fmtDate(preview.at(-1)?.date ?? form.startDate, { weekday: 'long', day: 'numeric', month: 'long' })}</b></>
                )}
              </div>
              <button className="btn-accent w-full py-3" disabled={!form.days.length} onClick={programAll}><CalendarPlus size={17} /> Programmer le parcours</button>
            </div>
          </section>

          <section className="card space-y-3 p-5">
            <h2 className="font-bold text-brand-900">Règles de diffusion</h2>
            <Toggle checked={cls.rules.revisit} onChange={(v) => setRule('revisit', v)} label="Revoir après la date" hint="Une vidéo terminée reste disponible pour être revue." />
            <Toggle checked={cls.rules.requirePrevious} onChange={(v) => setRule('requirePrevious', v)} label="Exiger la vidéo précédente" hint="La vidéo suivante se débloque seulement quand la précédente est terminée (90 %)." />
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-brand-900"><PauseCircle size={18} className="text-amber-500" /> Suspendre (vacances, examens…)</h2>
            <p className="mt-1 text-sm text-slate-500">Décale toutes les vidéos prévues à partir d'une date.</p>
            <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
              <div><label className="label" htmlFor="pfrom">À partir du</label><input id="pfrom" type="date" className="input" value={pause.from} onChange={(e) => setPause({ ...pause, from: e.target.value })} /></div>
              <div><label className="label" htmlFor="pdays">Durée</label>
                <select id="pdays" className="input" value={pause.days} onChange={(e) => setPause({ ...pause, days: Number(e.target.value) })}>
                  {[3, 7, 14, 21].map((n) => <option key={n} value={n}>{n} jours</option>)}
                </select>
              </div>
            </div>
            <button className="btn-ghost mt-3 w-full" onClick={applyPause}>Appliquer la pause</button>
          </section>

          <section className="card p-5">
            <h2 className="flex items-center gap-2 font-bold text-brand-900"><History size={18} /> Historique des modifications</h2>
            <ul className="mt-3 space-y-2.5 text-sm">
              {history.length === 0 && <li className="text-slate-500">Aucune modification pour l'instant.</li>}
              {history.map((h) => (
                <li key={h.id} className="border-l-2 border-accent-500 pl-3"><p className="text-slate-700">{h.detail}</p><p className="text-[11px] text-slate-400">{fmtDate(h.at, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></li>
              ))}
            </ul>
          </section>
        </div>

        <section className="card overflow-hidden">
          <header className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-brand-900">Calendrier de diffusion</h2>
            <span className="text-xs text-slate-500">Modifiez une date pour décaler ou avancer une vidéo</span>
          </header>
          {cls.schedule.length === 0 ? (
            <div className="p-5"><Empty icon={CalendarCog} title="Aucune vidéo programmée">Utilisez « Programmer le parcours » pour démarrer.</Empty></div>
          ) : (
            <ol className="divide-y divide-slate-100">
              {cls.schedule.map((e, i) => {
                const lesson = lessonById(e.lessonId)
                const d = startOfDay(e.date)
                const past = d <= today
                const prevModule = i > 0 ? lessonById(cls.schedule[i - 1].lessonId)?.moduleId : undefined
                return (
                  <li key={e.lessonId}>
                    {lesson && lesson.moduleId !== prevModule && <p className="bg-slate-50 px-5 py-2 text-xs font-bold uppercase tracking-wide text-brand-700">{moduleById(lesson.moduleId)?.title}</p>}
                    <div className="flex items-center gap-3 px-5 py-2.5">
                      {past ? <Unlock size={16} className="shrink-0 text-emerald-600" /> : <Lock size={16} className="shrink-0 text-slate-300" />}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800"><span className="mr-1 text-slate-400">{lesson?.order}.</span>{lesson?.title}</p>
                        <p className="text-[11px] capitalize text-slate-500">{fmtDate(e.date, { weekday: 'long', day: 'numeric', month: 'long' })}{past && ' · débloquée'}</p>
                      </div>
                      <input type="date" value={e.date} onChange={(ev) => moveLesson(e.lessonId, ev.target.value)} className="input w-36 shrink-0 px-2 py-1.5 text-xs" aria-label={`Date de « ${lesson?.title} »`} />
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
          <p className="flex items-center gap-1.5 border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><CheckCircle2 size={14} className="text-emerald-600" /> Les étudiants ne voient que les vidéos déjà débloquées.</p>
        </section>
      </div>
    </>
  )
}
