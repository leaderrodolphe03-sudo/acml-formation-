'use client'

import Thread from '../../components/Thread'
import { Avatar, PageHeader } from '../../components/ui'
import { useStore } from '../../lib/store'
import { useStudent } from './StudentSpace'

export default function Messages() {
  const { sendMessage } = useStore()
  const { messages, supervisor, cls } = useStudent()
  return (
    <>
      <PageHeader title="Messages" subtitle="Annonces de la classe et échanges avec votre superviseur" />
      <section className="card overflow-hidden">
        {supervisor && (
          <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
            <Avatar name={supervisor.name} />
            <div>
              <p className="font-bold text-brand-900">{supervisor.name}</p>
              <p className="text-xs text-slate-500">Superviseur · {cls?.name}</p>
            </div>
          </div>
        )}
        <Thread
          messages={messages}
          placeholder={`Écrire à ${supervisor?.name ?? 'votre superviseur'}…`}
          onSend={cls && supervisor ? (t) => sendMessage(cls.id, supervisor.id, t) : undefined}
        />
      </section>
    </>
  )
}
