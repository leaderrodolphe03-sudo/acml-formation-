'use client'

import { ArrowUpDown, Check, Copy, Download, Link2, Search, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Avatar, Empty, PageHeader, ProgressBar } from '../../components/ui'
import { AlertChips, exportCsv, lastSeenLabel } from './shared'
import { useSupervisor, type StudentInfo } from './SupervisorSpace'

type SortKey = 'name' | 'percent' | 'late' | 'quiz' | 'lastSeen'

export default function Students() {
  const { cls, students } = useSupervisor()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'percent', dir: -1 })
  const [copied, setCopied] = useState('')

  if (!cls) return <Empty icon={Users} title="Aucune classe sélectionnée" />

  const link = `${window.location.origin}/rejoindre?code=${encodeURIComponent(cls.code)}`
  const copy = (txt: string, what: string) => {
    navigator.clipboard?.writeText(txt).catch(() => {})
    setCopied(what)
    setTimeout(() => setCopied(''), 1800)
  }

  const val = (s: StudentInfo, k: SortKey): string | number =>
    k === 'name' ? s.user.name : k === 'percent' ? s.stats.percent : k === 'late' ? s.stats.late : k === 'quiz' ? s.stats.quizAvg ?? -1 : s.stats.lastSeen ?? ''
  const list = students
    .filter((s) => s.user.name.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => { const x = val(a, sort.key), y = val(b, sort.key); return (x > y ? 1 : x < y ? -1 : 0) * sort.dir })

  const Th = ({ k, children, className = '' }: { k: SortKey; children: string; className?: string }) => (
    <th className={`px-4 py-3 font-medium ${className}`}>
      <button onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : -1 }))} className={`inline-flex items-center gap-1 ${sort.key === k ? 'text-brand-700' : ''}`}>
        {children} <ArrowUpDown size={12} />
      </button>
    </th>
  )

  return (
    <>
      <PageHeader
        eyebrow="Pilotage"
        title="Étudiants"
        subtitle={`${students.length} étudiant${students.length > 1 ? 's' : ''} dans « ${cls.name} »`}
        actions={
          <button type="button" className="btn-ghost" onClick={() => exportCsv(cls.name, students)}>
            <Download size={16} aria-hidden="true" /> Exporter
          </button>
        }
      />

      <section className="panel-blue mb-5 flex flex-col gap-4 rounded-[24px] p-5 text-white sm:p-6 md:flex-row md:items-center">
        <span className="icon-tile size-12 rounded-2xl bg-white/15 backdrop-blur"><UserPlus size={22} aria-hidden="true" /></span>
        <div className="flex-1">
          <h2 className="text-[17px] font-medium tracking-tight">Inviter des étudiants</h2>
          <p className="mt-0.5 text-[13.5px] text-white/75">Partagez le code ou le lien : l&apos;étudiant crée son compte et rejoint directement cette classe.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => copy(cls.code, 'code')} className="btn border border-white/25 bg-white/10 font-mono text-white backdrop-blur hover:bg-white/20">
            {copied === 'code' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {cls.code}
          </button>
          <button type="button" onClick={() => copy(link, 'link')} className="btn bg-white text-brand-900 hover:bg-tint">
            {copied === 'link' ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />} {copied === 'link' ? 'Lien copié' : 'Copier le lien'}
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-line/80 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft/70" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-9" placeholder="Rechercher un étudiant…" aria-label="Rechercher un étudiant" />
          </div>
        </div>

        {/* Tableau (ordinateur) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-surface/70 text-[11.5px] uppercase tracking-[.08em] text-ink-soft">
              <tr>
                <Th k="name">Étudiant</Th>
                <Th k="percent" className="w-52">Avancement</Th>
                <Th k="late">Retards</Th>
                <Th k="quiz">Quiz</Th>
                <Th k="lastSeen">Dernière connexion</Th>
                <th className="px-4 py-3 font-medium">Alertes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {list.map(({ user, stats, alerts }) => (
                <tr key={user.id} className="hover:bg-surface">
                  <td className="px-4 py-3">
                    <Link href={`/superviseur/etudiants/${user.id}`} className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <span><span className="block font-medium text-ink hover:text-brand-700">{user.name}</span><span className="text-xs text-ink-soft">{user.email}</span></span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><ProgressBar value={stats.percent} className="flex-1" color={stats.percent >= 40 ? 'bg-emerald-500' : 'bg-brand-600'} /><span className="w-9 text-right text-xs font-medium">{stats.percent} %</span></div>
                    <p className="mt-1 text-[11px] text-ink-soft">{stats.done}/{stats.total} leçons · {stats.inProgress} en cours</p>
                  </td>
                  <td className="px-4 py-3"><span className={`font-medium ${stats.late ? 'text-accent-600' : 'text-ink-soft/70'}`}>{stats.late}</span></td>
                  <td className="px-4 py-3 font-medium text-ink">{stats.quizAvg !== undefined ? `${stats.quizAvg} %` : '—'}</td>
                  <td className="px-4 py-3 text-ink-soft">{lastSeenLabel(stats.lastSeen)}<p className="text-[11px] text-ink-soft/70">{stats.activeDays} jours actifs · série {stats.streak}</p></td>
                  <td className="px-4 py-3">{alerts.length ? <AlertChips alerts={alerts} /> : <span className="chip bg-emerald-50 text-emerald-700 ring-emerald-600/15"><span className="size-1.5 rounded-full bg-emerald-500" aria-hidden="true" />À jour</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartes (mobile) */}
        <ul className="divide-y divide-line/70 md:hidden">
          {list.map(({ user, stats, alerts }) => (
            <li key={user.id}>
              <Link href={`/superviseur/etudiants/${user.id}`} className="block p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1"><p className="truncate font-medium text-ink">{user.name}</p><p className="text-xs text-ink-soft">vu {lastSeenLabel(stats.lastSeen)}</p></div>
                  <span className="text-sm font-medium tracking-tight text-ink">{stats.percent} %</span>
                </div>
                <ProgressBar value={stats.percent} className="mt-3" color={stats.percent >= 40 ? 'bg-emerald-500' : 'bg-brand-600'} />
                {alerts.length > 0 && <div className="mt-2.5"><AlertChips alerts={alerts} /></div>}
              </Link>
            </li>
          ))}
        </ul>
        {list.length === 0 && <div className="p-5"><Empty icon={Users} title="Aucun étudiant">Partagez le code d'invitation pour remplir votre classe.</Empty></div>}
      </section>
    </>
  )
}
