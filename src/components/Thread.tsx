'use client'

import { Megaphone, MessagesSquare, SendHorizontal } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { fmtDate, isoDay } from '../lib/schedule'
import { useStore } from '../lib/store'
import type { Message } from '../lib/types'
import { Avatar, Empty } from './ui'

const dayLabel = (iso: string) => {
  const d = isoDay(new Date(iso))
  const today = isoDay(new Date())
  const yesterday = isoDay(new Date(Date.now() - 86_400_000))
  if (d === today) return "Aujourd'hui"
  if (d === yesterday) return 'Hier'
  return fmtDate(iso, { weekday: 'long', day: 'numeric', month: 'long' })
}
const time = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

/** Fil de discussion : messages individuels et annonces de classe, groupés par jour. */
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
    <div className="flex h-full min-h-[440px] flex-col">
      <div className="max-h-[60vh] flex-1 space-y-3 overflow-y-auto bg-surface/50 p-4 sm:p-5">
        {!sorted.length && <Empty icon={MessagesSquare} title="Aucun message pour l'instant">Écrivez le premier message ci-dessous.</Empty>}
        {sorted.map((m, i) => {
          const author = db.users.find((u) => u.id === m.from)
          const mine = m.from === me?.id
          const newDay = i === 0 || isoDay(new Date(sorted[i - 1].at)) !== isoDay(new Date(m.at))
          return (
            <Fragment key={m.id}>
              {newDay && (
                <div className="flex items-center gap-3 py-2 text-[11.5px] font-medium capitalize text-ink-soft">
                  <span className="h-px flex-1 bg-line" />
                  {dayLabel(m.at)}
                  <span className="h-px flex-1 bg-line" />
                </div>
              )}
              {m.to === 'classe' ? (
                <div className="rounded-2xl border border-brand-100 bg-white p-4 shadow-[0_1px_2px_rgba(15,31,53,0.04)]">
                  <div className="flex items-center gap-2.5">
                    <span className="icon-tile size-7 rounded-lg bg-tint text-brand-700"><Megaphone size={14} aria-hidden="true" /></span>
                    <p className="text-[12.5px] font-medium text-ink">Annonce · {author?.name}</p>
                    <span className="ml-auto text-[11.5px] text-ink-soft">{time(m.at)}</span>
                  </div>
                  <p className="mt-2.5 whitespace-pre-line text-[14px] leading-relaxed text-ink">{m.content}</p>
                </div>
              ) : (
                <div className={`flex items-end gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                  {!mine && <Avatar name={author?.name ?? '?'} size="size-8" />}
                  <div
                    className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed ${
                      mine ? 'rounded-br-md bg-brand-700 text-white' : 'rounded-bl-md border border-line bg-white text-ink'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.content}</p>
                    <p className={`mt-1 text-right text-[10.5px] ${mine ? 'text-white/65' : 'text-ink-soft'}`}>{time(m.at)}</p>
                  </div>
                </div>
              )}
            </Fragment>
          )
        })}
        <div ref={endRef} />
      </div>
      {onSend && (
        <form
          className="flex items-center gap-2 border-t border-line bg-white p-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!text.trim()) return
            onSend(text)
            setText('')
          }}
        >
          <input value={text} onChange={(e) => setText(e.target.value)} className="input rounded-full bg-surface" placeholder={placeholder ?? 'Votre message…'} aria-label="Votre message" />
          <button className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-700 text-white transition hover:bg-brand-800 disabled:opacity-40" disabled={!text.trim()} aria-label="Envoyer">
            <SendHorizontal size={18} aria-hidden="true" />
          </button>
        </form>
      )}
    </div>
  )
}
