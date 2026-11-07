'use client'

import { ArrowLeft, BellRing, Megaphone, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Thread from '../../components/Thread'
import { Avatar, Empty, PageHeader } from '../../components/ui'
import { fmtDate } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import { useSupervisor } from './SupervisorSpace'

export default function Messages() {
  const { db, me, cls, students } = useSupervisor()
  const { sendMessage } = useStore()
  const params = useSearchParams()
  const router = useRouter()
  const [reminded, setReminded] = useState(0)
  const selected = params.get('to') ?? 'classe'
  const [mobileThread, setMobileThread] = useState(!!params.get('to'))

  if (!cls) return <Empty icon={MessageCircle} title="Aucune classe sélectionnée" />

  const classMsgs = db.messages.filter((m) => m.classId === cls.id)
  const threadOf = (id: string) => (id === 'classe' ? classMsgs.filter((m) => m.to === 'classe') : classMsgs.filter((m) => (m.from === id && m.to === me.id) || (m.from === me.id && m.to === id)))
  const unreadOf = (id: string) => threadOf(id).filter((m) => !m.readBy.includes(me.id)).length
  const current = threadOf(selected)
  const student = students.find((s) => s.user.id === selected)
  const late = students.filter((s) => s.stats.late > 0)

  const pick = (id: string) => {
    router.replace(id === 'classe' ? '/superviseur/messages' : `/superviseur/messages?to=${encodeURIComponent(id)}`, { scroll: false })
    setMobileThread(true)
  }

  const remindLate = () => {
    late.forEach((s) => sendMessage(cls.id, s.user.id, `⏰ Rappel : tu as ${s.stats.late} vidéo(s) en retard. Connecte-toi aujourd'hui pour rattraper, on compte sur toi !`))
    setReminded(late.length)
  }

  const contacts = [
    { id: 'classe', name: 'Annonces de la classe', sub: `${students.length} étudiants`, isClass: true },
    ...students.map((s) => ({ id: s.user.id, name: s.user.name, sub: s.stats.late ? `${s.stats.late} en retard` : `${s.stats.percent} % du parcours`, isClass: false })),
  ].map((c) => ({ ...c, last: threadOf(c.id).at(-1), unread: unreadOf(c.id) }))
    .sort((a, b) => (a.isClass ? -1 : b.isClass ? 1 : (b.last?.at ?? '').localeCompare(a.last?.at ?? '')))

  return (
    <>
      <PageHeader
        title="Communication"
        subtitle="Annonces à toute la classe et messages individuels"
        actions={
          <button className="btn-ghost" disabled={!late.length || reminded > 0} onClick={remindLate}>
            <BellRing size={16} /> {reminded ? `${reminded} rappel(s) envoyé(s)` : `Rappeler les retardataires (${late.length})`}
          </button>
        }
      />
      <div className="card grid overflow-hidden md:grid-cols-[300px_1fr]">
        <aside className={`border-r border-slate-100 ${mobileThread ? 'hidden md:block' : ''}`}>
          <ul className="max-h-[600px] divide-y divide-slate-100 overflow-y-auto">
            {contacts.map((c) => (
              <li key={c.id}>
                <button onClick={() => pick(c.id)} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${selected === c.id ? 'bg-brand-50' : 'hover:bg-slate-50'}`}>
                  {c.isClass ? <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amber-100 text-amber-700"><Megaphone size={17} /></span> : <Avatar name={c.name} />}
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-slate-800">{c.name}</span>
                      {c.last && <span className="shrink-0 text-[10px] text-slate-400">{fmtDate(c.last.at)}</span>}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{c.last?.content ?? c.sub}</span>
                  </span>
                  {c.unread > 0 && <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent-600 text-[10px] font-bold text-white">{c.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <section className={`flex flex-col ${mobileThread ? '' : 'hidden md:flex'}`}>
          <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
            <button className="grid size-8 place-items-center rounded-lg hover:bg-slate-100 md:hidden" onClick={() => setMobileThread(false)} aria-label="Retour aux conversations"><ArrowLeft size={18} /></button>
            {student ? <Avatar name={student.user.name} size="size-8" /> : <span className="grid size-8 place-items-center rounded-full bg-amber-100 text-amber-700"><Megaphone size={15} /></span>}
            <div>
              <p className="text-sm font-bold text-brand-900">{student ? student.user.name : 'Annonce à toute la classe'}</p>
              <p className="text-xs text-slate-500">{student ? `${student.stats.percent} % du parcours · ${student.stats.late} en retard` : `Visible par les ${students.length} étudiants de « ${cls.name} »`}</p>
            </div>
          </header>
          <Thread key={selected} messages={current} placeholder={selected === 'classe' ? 'Rédiger une annonce…' : `Écrire à ${student?.user.name.split(' ')[0]}…`} onSend={(t) => sendMessage(cls.id, selected, t)} />
        </section>
      </div>
    </>
  )
}
