'use client'

import { Mail, Phone } from 'lucide-react'
import Thread from '../../components/Thread'
import { Avatar, PageHeader } from '../../components/ui'
import { useStore } from '../../lib/store'
import { useStudent } from './StudentSpace'

export default function Messages() {
  const { sendMessage } = useStore()
  const { messages, supervisor, cls } = useStudent()
  return (
    <>
      <PageHeader eyebrow="Échanger" title="Messages" subtitle="Annonces de la classe et échanges avec votre superviseur" />
      <section className="card overflow-hidden">
        {supervisor && (
          <header className="flex flex-wrap items-center gap-3 border-b border-line px-5 py-4">
            <Avatar name={supervisor.name} size="size-10" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-ink">{supervisor.name}</p>
              <p className="text-[12.5px] text-ink-soft">Superviseur · {cls?.name}</p>
            </div>
            <div className="flex gap-1.5">
              {supervisor.phone && (
                <a href={`tel:${supervisor.phone.replace(/\s+/g, '')}`} className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:bg-surface hover:text-ink" aria-label="Appeler">
                  <Phone size={16} aria-hidden="true" />
                </a>
              )}
              <a href={`mailto:${supervisor.email}`} className="grid size-9 place-items-center rounded-full border border-line text-ink-soft transition hover:bg-surface hover:text-ink" aria-label="Écrire un e-mail">
                <Mail size={16} aria-hidden="true" />
              </a>
            </div>
          </header>
        )}
        <Thread
          messages={messages}
          placeholder={`Écrire à ${supervisor?.name.split(' ')[0] ?? 'votre superviseur'}…`}
          onSend={cls && supervisor ? (t) => sendMessage(cls.id, supervisor.id, t) : undefined}
        />
      </section>
    </>
  )
}
