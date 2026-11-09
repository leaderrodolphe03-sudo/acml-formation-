'use client'

import {
  ArrowLeft, ArrowRight, BookText, CalendarDays, Captions, Check, CheckCircle2, Clock3, Download, FileText, Gauge, ListChecks,
  ListOrdered, Lock, Pause, Play, RotateCcw, Target, Trophy,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { LogoImg } from '../../components/Logo'
import { Empty, IconTile, Panel, ProgressBar, StatusChip } from '../../components/ui'
import { moduleById } from '../../lib/catalog'
import { COMPLETION_THRESHOLD, fmtDate, fmtDuration } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import type { Lesson as LessonT, Progress } from '../../lib/types'
import { useStudent } from './StudentSpace'

const SPEEDS = [0.75, 1, 1.25, 1.5, 2, 10]
const SUBS = {
  en: ['Hello everyone, and welcome to this lesson!', 'Listen carefully and repeat after me.', "Let's practise together.", 'Great job! Now try it on your own.'],
  fr: ['Bonjour à tous et bienvenue dans cette leçon !', 'Écoutez bien et répétez après moi.', 'Pratiquons ensemble.', 'Bravo ! Maintenant, essayez seul(e).'],
}

/**
 * Lecteur de démonstration : il simule la lecture pour illustrer la reprise automatique,
 * le temps de visionnage réel et la règle des 90 %. En production, il sera remplacé par le
 * lecteur de l'hébergeur vidéo (Bunny Stream, Vimeo, Mux…) branché sur les mêmes évènements.
 */
function Player({ lesson, progress }: { lesson: LessonT; progress?: Progress }) {
  const { watch, log } = useStore()
  const resumeAt = progress && progress.position < lesson.duration - 2 ? progress.position : 0
  const [pos, setPos] = useState(resumeAt)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [subs, setSubs] = useState<'off' | 'en' | 'fr'>('off')
  const pending = useRef(0)
  const posRef = useRef(pos)
  const started = useRef(false)
  posRef.current = pos

  const flush = () => {
    if (pending.current > 0) {
      watch(lesson.id, posRef.current, pending.current)
      pending.current = 0
    }
  }

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      const p = posRef.current
      const np = Math.min(lesson.duration, p + 0.25 * speed)
      pending.current += np - p
      posRef.current = np
      setPos(np)
      if (np >= lesson.duration) setPlaying(false)
    }, 250)
    const f = setInterval(flush, 2000)
    return () => {
      clearInterval(t)
      clearInterval(f)
      flush()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, lesson.id])

  useEffect(() => () => flush(), []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => {
    if (playing) {
      setPlaying(false)
      log('pause', lesson.id, `${Math.round((posRef.current / lesson.duration) * 100)} % de la vidéo`)
    } else {
      if (pos >= lesson.duration) setPos(0)
      log(started.current || pos > 0 ? 'reprise' : 'lancement', lesson.id)
      started.current = true
      setPlaying(true)
    }
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    flush()
    setPos(Math.round(ratio * lesson.duration)) // un saut ne compte pas comme du temps regardé
  }

  const pct = (pos / lesson.duration) * 100
  const sub = subs === 'off' ? null : SUBS[subs][Math.floor(pos / 20) % 4]

  return (
    <div className="overflow-hidden rounded-2xl bg-brand-950 shadow-xl shadow-brand-900/20">
      <div className="relative aspect-video select-none" onContextMenu={(e) => e.preventDefault()}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1d63ad_0,#0a2c50_55%,#061c35_100%)]" />
        <div className={`absolute -right-10 top-10 size-48 rounded-full bg-accent-600/25 blur-2xl transition-transform duration-[4000ms] ${playing ? 'translate-y-10' : ''}`} />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[.2em] text-accent-500">Leçon {lesson.order}</p>
          <p className="mt-2 text-2xl font-medium text-white sm:text-4xl">{lesson.title}</p>
          <p className="mt-2 font-script text-xl text-brand-100 sm:text-2xl">L'anglais comme ma langue</p>
        </div>
        <span className="absolute right-3 top-3 rounded bg-white/90 px-1.5 py-1 opacity-85"><LogoImg className="h-5" /></span>
        {sub && <p className="absolute inset-x-6 bottom-6 mx-auto w-fit rounded-md bg-black/70 px-3 py-1 text-center text-sm text-white sm:text-base">{sub}</p>}
        <button onClick={toggle} className="absolute inset-0 grid place-items-center" aria-label={playing ? 'Pause' : 'Lecture'}>
          {!playing && (
            <span className="grid size-16 place-items-center rounded-full bg-white/95 text-brand-800 shadow-2xl transition hover:scale-105 sm:size-20">
              {pos >= lesson.duration ? <RotateCcw size={30} /> : <Play size={32} className="ml-1" fill="currentColor" />}
            </span>
          )}
        </button>
        {resumeAt > 0 && !started.current && (
          <p className="absolute left-3 top-3 rounded-md bg-white/15 px-2 py-1 text-xs font-medium text-white backdrop-blur">Reprise à {fmtDuration(resumeAt)}</p>
        )}
      </div>
      <div className="space-y-2 px-4 pb-3 pt-2.5">
        <div className="group relative h-1.5 cursor-pointer rounded-full bg-white/15" onClick={seek} role="slider" aria-label="Position" aria-valuenow={Math.round(pct)}>
          <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${((progress?.watched ?? 0) / lesson.duration) * 100}%` }} />
          <div className="absolute inset-y-0 left-0 rounded-full bg-accent-500" style={{ width: `${pct}%` }} />
          <div className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow" style={{ left: `${pct}%` }} />
        </div>
        <div className="flex items-center gap-3 text-white">
          <button onClick={toggle} className="grid size-9 place-items-center rounded-lg hover:bg-white/10" aria-label={playing ? 'Pause' : 'Lecture'}>
            {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <span className="font-mono text-xs text-white/80">{fmtDuration(pos)} / {fmtDuration(lesson.duration)}</span>
          <div className="ml-auto flex items-center gap-1.5">
            <label className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-white/10">
              <Captions size={16} />
              <select value={subs} onChange={(e) => setSubs(e.target.value as typeof subs)} className="bg-transparent text-xs outline-none [&>option]:text-ink" aria-label="Sous-titres">
                <option value="off">Off</option><option value="en">EN</option><option value="fr">FR</option>
              </select>
            </label>
            <label className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs hover:bg-white/10">
              <Gauge size={16} />
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="bg-transparent text-xs outline-none [&>option]:text-ink" aria-label="Vitesse de lecture">
                {SPEEDS.map((s) => <option key={s} value={s}>{s === 10 ? '×10 (démo)' : `×${s}`}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function Quiz({ lesson, progress, enabled }: { lesson: LessonT; progress?: Progress; enabled: boolean }) {
  const { submitQuiz } = useStore()
  const [answers, setAnswers] = useState<number[]>([])
  const [score, setScore] = useState<number | null>(null)
  if (!lesson.quiz) return null
  const quiz = lesson.quiz
  const answered = answers.filter((a) => a !== undefined).length

  return (
    <Panel
      title="Quiz de validation"
      icon={ListChecks}
      description={`${quiz.length} questions`}
      action={progress?.quizScore !== undefined && <span className="chip bg-emerald-50 text-emerald-700 ring-emerald-600/15">Meilleur score : {progress.quizScore} %</span>}
    >
      {!enabled ? (
        <div className="flex items-center gap-3 rounded-xl bg-surface p-4 text-[14px] text-ink-soft">
          <IconTile icon={Lock} tone="slate" size="sm" />
          Terminez la vidéo (au moins {COMPLETION_THRESHOLD * 100} % regardés) pour débloquer le quiz.
        </div>
      ) : (
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            const s = Math.round((quiz.filter((q, i) => answers[i] === q.answer).length / quiz.length) * 100)
            setScore(s)
            submitQuiz(lesson.id, s)
          }}
        >
          {quiz.map((q, i) => (
            <fieldset key={i}>
              <legend className="text-[14.5px] font-medium text-ink">
                <span className="mr-2 text-ink-soft">{i + 1}.</span>{q.q}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {q.choices.map((c, j) => {
                  const chosen = answers[i] === j
                  const reveal = score !== null
                  const cls = reveal
                    ? j === q.answer ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : chosen ? 'border-accent-600/40 bg-accent-50 text-accent-700' : 'border-line opacity-55'
                    : chosen ? 'border-brand-600 bg-brand-50 text-brand-900 ring-4 ring-brand-100' : 'border-line hover:border-brand-200 hover:bg-surface'
                  return (
                    <label key={j} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-[14px] transition has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100 ${cls}`}>
                      <input
                        type="radio"
                        name={`q${i}`}
                        className="sr-only"
                        disabled={reveal}
                        checked={chosen}
                        onChange={() => setAnswers((a) => { const n = [...a]; n[i] = j; return n })}
                      />
                      <span className={`grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-medium ${chosen ? 'border-current bg-current' : 'border-slate-300'}`}>
                        {chosen && <span className="size-1.5 rounded-full bg-white" />}
                      </span>
                      {c}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
          {score === null ? (
            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
              <button className="btn-primary" disabled={answered < quiz.length}>Valider mes réponses</button>
              <span className="text-[12.5px] text-ink-soft">{answered}/{quiz.length} réponse{answered > 1 ? 's' : ''}</span>
            </div>
          ) : (
            <div className={`flex flex-wrap items-center gap-4 rounded-2xl p-4 ${score >= 50 ? 'bg-emerald-50' : 'bg-accent-50'}`}>
              <IconTile icon={score >= 50 ? Trophy : RotateCcw} tone={score >= 50 ? 'green' : 'accent'} />
              <div>
                <p className={`text-[15px] font-medium ${score >= 50 ? 'text-emerald-800' : 'text-accent-700'}`}>{score >= 50 ? 'Well done!' : 'Keep trying!'} Score : {score} %</p>
                <p className="text-[12.5px] text-ink-soft">{score >= 50 ? 'Votre résultat est transmis à votre superviseur.' : 'Revoyez la vidéo puis retentez le quiz.'}</p>
              </div>
              <button type="button" className="btn-ghost ml-auto" onClick={() => { setScore(null); setAnswers([]) }}>
                <RotateCcw size={15} aria-hidden="true" /> Recommencer
              </button>
            </div>
          )}
        </form>
      )}
    </Panel>
  )
}

export default function Lesson() {
  const { id } = useParams<{ id: string }>()
  const { rows, cls } = useStudent()
  const { log } = useStore()
  const [toast, setToast] = useState('')
  const idx = rows.findIndex((r) => r.lesson.id === id)
  const row = rows[idx]

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2600)
    return () => clearTimeout(t)
  }, [toast])

  if (!row || !cls)
    return (
      <Empty icon={Lock} title="Leçon introuvable">
        <Link href="/etudiant/lecons" className="font-medium text-brand-700 hover:underline">Retour à mes leçons</Link>
      </Empty>
    )

  const { lesson, status, progress } = row
  const blockedReplay = status === 'terminee' && !cls.rules.revisit
  const prev = rows[idx - 1]
  const next = rows[idx + 1]
  const mod = moduleById(lesson.moduleId)
  const siblings = rows.filter((r) => r.lesson.moduleId === lesson.moduleId)

  return (
    <>
      <Link href="/etudiant/lecons" className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-soft transition hover:text-brand-700">
        <ArrowLeft size={15} aria-hidden="true" /> Mes leçons
      </Link>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-2">{mod?.title} · Leçon {lesson.order}</p>
          <h1 className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">{lesson.title}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-ink-soft">
            <span className="inline-flex items-center gap-1.5"><Clock3 size={14} aria-hidden="true" />{Math.round(lesson.duration / 60)} min</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={14} aria-hidden="true" />Depuis le {fmtDate(row.entry.date, { day: 'numeric', month: 'long' })}</span>
          </p>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          {status === 'verrouillee' ? (
            <div className="grid aspect-video place-items-center rounded-2xl border border-line bg-surface text-center">
              <div className="px-6">
                <span className="icon-tile mx-auto size-14 rounded-2xl bg-white text-ink-soft ring-1 ring-line"><Lock size={24} aria-hidden="true" /></span>
                <p className="mt-4 text-[16px] font-medium text-ink">Disponible le {fmtDate(row.entry.date, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                {cls.rules.requirePrevious && <p className="mt-1 text-[13.5px] text-ink-soft">Terminez d&apos;abord la leçon précédente.</p>}
              </div>
            </div>
          ) : blockedReplay ? (
            <div className="grid aspect-video place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
              <div className="px-6">
                <span className="icon-tile mx-auto size-14 rounded-2xl bg-white text-emerald-600"><CheckCircle2 size={24} aria-hidden="true" /></span>
                <p className="mt-4 text-[16px] font-medium text-emerald-900">Leçon terminée</p>
                <p className="mt-1 text-[13.5px] text-emerald-800/80">Le revisionnage a été désactivé par votre superviseur.</p>
              </div>
            </div>
          ) : (
            <Player key={lesson.id} lesson={lesson} progress={progress} />
          )}

          {status !== 'verrouillee' && (
            <div className="card flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
              <div className="min-w-48 flex-1">
                <div className="mb-2 flex justify-between text-[12.5px]">
                  <span className="font-medium text-ink">Temps de visionnage réel</span>
                  <span className={status === 'terminee' ? 'font-medium text-emerald-700' : 'text-ink-soft'}>
                    {row.percent} %{status === 'terminee' && ' · leçon validée'}
                  </span>
                </div>
                <ProgressBar value={row.percent} color={status === 'terminee' ? 'bg-emerald-500' : 'bg-accent-600'} />
              </div>
              <p className="text-[12.5px] text-ink-soft">Validation à partir de {COMPLETION_THRESHOLD * 100} % regardés</p>
            </div>
          )}

          <Panel title="Objectifs de la leçon" icon={Target}>
            <ul className="grid gap-3 sm:grid-cols-3">
              {lesson.objectives.map((o, i) => (
                <li key={o} className="rounded-xl border border-line bg-surface/60 p-3.5 text-[13.5px] leading-snug text-ink">
                  <span className="mb-2 block text-[11px] font-medium uppercase tracking-[.14em] text-accent-600">Objectif {i + 1}</span>
                  {o}
                </li>
              ))}
            </ul>
          </Panel>

          <Quiz key={`quiz-${lesson.id}`} lesson={lesson} progress={progress} enabled={status === 'terminee'} />
        </div>

        <aside className="space-y-5">
          <Panel title="Ressources" icon={FileText} bodyClassName="p-3">
            <ul className="space-y-1">
              {lesson.resources.map((r) => (
                <li key={r.name}>
                  <button
                    type="button"
                    disabled={status === 'verrouillee'}
                    onClick={() => {
                      log('telechargement', lesson.id, r.name)
                      setToast(`« ${r.name} » : téléchargement simulé (démonstration)`)
                    }}
                    className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-surface disabled:opacity-50"
                  >
                    <IconTile icon={r.kind === 'pdf' ? FileText : BookText} tone={r.kind === 'pdf' ? 'accent' : 'brand'} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px] font-medium text-ink">{r.name}</span>
                      <span className="block text-[11.5px] text-ink-soft">{r.kind === 'pdf' ? 'Fiche PDF' : 'Vocabulaire'}</span>
                    </span>
                    <Download size={16} className="text-ink-soft transition group-hover:text-brand-700" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel title="Dans ce module" icon={ListOrdered} description={mod?.title} bodyClassName="p-2">
            <ol>
              {siblings.map((s) => {
                const current = s.lesson.id === lesson.id
                const locked = s.status === 'verrouillee'
                const inner = (
                  <>
                    <span
                      className={`icon-tile size-7 rounded-full text-[11px] font-medium ${
                        s.status === 'terminee' ? 'bg-emerald-50 text-emerald-600' : current ? 'bg-brand-700 text-white' : 'bg-slate-100 text-ink-soft'
                      }`}
                    >
                      {s.status === 'terminee' ? <Check size={14} strokeWidth={2.4} aria-hidden="true" /> : locked ? <Lock size={12} aria-hidden="true" /> : s.lesson.order}
                    </span>
                    <span className={`min-w-0 flex-1 truncate text-[13.5px] ${current ? 'font-medium text-ink' : locked ? 'text-ink-soft' : 'text-ink'}`}>{s.lesson.title}</span>
                  </>
                )
                return (
                  <li key={s.lesson.id}>
                    {locked || current ? (
                      <div aria-current={current ? 'page' : undefined} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${current ? 'bg-tint' : ''}`}>{inner}</div>
                    ) : (
                      <Link href={`/etudiant/lecons/${s.lesson.id}`} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-surface">{inner}</Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </Panel>

          <div className="flex gap-2">
            {prev && (
              <Link href={`/etudiant/lecons/${prev.lesson.id}`} className="btn-ghost flex-1">
                <ArrowLeft size={16} aria-hidden="true" /> Précédente
              </Link>
            )}
            {next && next.status !== 'verrouillee' && (
              <Link href={`/etudiant/lecons/${next.lesson.id}`} className="btn-primary flex-1">
                Suivante <ArrowRight size={16} aria-hidden="true" />
              </Link>
            )}
          </div>
        </aside>
      </div>

      {toast && (
        <div role="status" className="fixed inset-x-4 bottom-24 z-50 mx-auto flex max-w-sm items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-[13.5px] text-white shadow-2xl lg:bottom-8">
          <Download size={16} className="shrink-0 text-white/70" aria-hidden="true" />
          {toast}
        </div>
      )}
    </>
  )
}
