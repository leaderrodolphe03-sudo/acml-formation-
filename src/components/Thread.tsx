'use client'

import { Megaphone, MessageCircle, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { fmtDate } from '../lib/schedule'
import { useStore } from '../lib/store'
import type { Message } from '../lib/types'
import { Avatar, Empty } from './ui'

/** Fil de discussion : messages individuels et annonces de classe. */
export default function Thread({ messages, onSend, placeholder }: { messages: Message[]; onSend?: (text: string) => void; placeholder?: string }) {
  const { db, me, markRead } = useStore()
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const sorted = [...messages].sort((a, b) => a.at.localeCompare(b.at))

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
    if (me) markRead(sorted.filter((m) => !m.readBy.includes(me.id)).map((m) => m.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length])

  return (
    <div className="flex h-full min-h-[420px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        {!sorted.length && <Empty icon={MessageCircle} title="Aucun message pour l'instant">Écrivez le premier message ci-dessous.</Empty>}
        {sorted.map((m) => {
          const author = db.users.find((u) => u.id === m.from)
          const mine = m.from === me?.id
          const when = `${fmtDate(m.at, { weekday: 'short', day: 'numeric', month: 'short' })} · ${new Date(m.at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
          if (m.to === 'classe')
            return (
              <div key={m.id} className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-amber-700"><Megaphone size={14} /> Annonce · {author?.name}</p>
                <p className="mt-1.5 whitespace-pre-line text-sm text-slate-800">{m.content}</p>
                <p className="mt-2 text-[11px] text-slate-500">{when}</p>
              </div>
            )
          return (
            <div key={m.id} className={`flex items-end gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
              {!mine && <Avatar name={author?.name ?? '?'} size="size-8" />}
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${mine ? 'rounded-br-md bg-brand-700 text-white' : 'rounded-bl-md bg-slate-100 text-slate-800'}`}>
                <p className="whitespace-pre-line">{m.content}</p>
                <p className={`mt-1 text-[10.5px] ${mine ? 'text-brand-200' : 'text-slate-500'}`}>{when}</p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      {onSend && (
        <form
          className="flex gap-2 border-t border-slate-100 p-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            onSend(text)
            setText('')
          }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} className="input" placeholder={placeholder ?? 'Votre message…'} aria-label="Votre message" />
          <button className="btn-primary px-4" aria-label="Envoyer"><Send size={16} /></button>
        </form>
      )}
    </div>
  )
}
