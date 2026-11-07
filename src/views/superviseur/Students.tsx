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
    <th className={`px-4 py-3 font-semibold ${className}`}>
      <button onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : -1 }))} className={`inline-flex items-center gap-1 ${sort.key === k ? 'text-brand-700' : ''}`}>
        {children} <ArrowUpDown size={12} />
      </button>
    </th>
  )

  return (
    <>
      <PageHeader title="Étudiants" subtitle={`${students.length} étudiant(s) dans « ${cls.name} »`} actions={<button className="btn-ghost" onClick={() => exportCsv(cls.name, students)}><Download size={16} /> Exporter</button>} />

      <section className="card mb-6 flex flex-col gap-4 bg-gradient-to-r from-brand-50 to-white p-5 md:flex-row md:items-center">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-700 text-white"><UserPlus size={22} /></span>
        <div className="flex-1">
          <h2 className="font-bold text-brand-900">Inviter des étudiants</h2>
          <p className="text-sm text-slate-600">Partagez le code ou le lien : l'étudiant crée son compte et rejoint directement cette classe.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => copy(cls.code, 'code')} className="btn-ghost font-mono">
            {copied === 'code' ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />} {cls.code}
          </button>
          <button onClick={() => copy(link, 'link')} className="btn-primary">
            {copied === 'link' ? <Check size={16} /> : <Link2 size={16} />} {copied === 'link' ? 'Lien copié !' : 'Copier le lien'}
          </button>
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="border-b border-slate-100 p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input pl-9" placeholder="Rechercher un étudiant…" aria-label="Rechercher un étudiant" />
          </div>
        </div>

        {/* Tableau (ordinateur) */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <Th k="name">Étudiant</Th>
                <Th k="percent" className="w-52">Avancement</Th>
                <Th k="late">Retards</Th>
                <Th k="quiz">Quiz</Th>
                <Th k="lastSeen">Dernière connexion</Th>
                <th className="px-4 py-3 font-semibold">Alertes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(({ user, stats, alerts }) => (
                <tr key={user.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <Link href={`/superviseur/etudiants/${user.id}`} className="flex items-center gap-3">
                      <Avatar name={user.name} />
                      <span><span className="block font-semibold text-slate-800 hover:text-brand-700">{user.name}</span><span className="text-xs text-slate-500">{user.email}</span></span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2"><ProgressBar value={stats.percent} className="flex-1" color={stats.percent >= 40 ? 'bg-emerald-500' : 'bg-brand-600'} /><span className="w-9 text-right text-xs font-bold">{stats.percent} %</span></div>
                    <p className="mt-1 text-[11px] text-slate-500">{stats.done}/{stats.total} leçons · {stats.inProgress} en cours</p>
                  </td>
                  <td className="px-4 py-3"><span className={`font-bold ${stats.late ? 'text-red-600' : 'text-slate-400'}`}>{stats.late}</span></td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{stats.quizAvg !== undefined ? `${stats.quizAvg} %` : '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{lastSeenLabel(stats.lastSeen)}<p className="text-[11px] text-slate-400">{stats.activeDays} jours actifs · série {stats.streak}</p></td>
                  <td className="px-4 py-3">{alerts.length ? <AlertChips alerts={alerts} /> : <span className="chip bg-emerald-50 text-emerald-700 ring-emerald-200">RAS</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cartes (mobile) */}
        <ul className="divide-y divide-slate-100 md:hidden">
          {list.map(({ user, stats, alerts }) => (
            <li key={user.id}>
              <Link href={`/superviseur/etudiants/${user.id}`} className="block p-4">
                <div className="flex items-center gap-3">
                  <Avatar name={user.name} />
                  <div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">vu {lastSeenLabel(stats.lastSeen)}</p></div>
                  <span className="text-sm font-extrabold text-brand-900">{stats.percent} %</span>
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
