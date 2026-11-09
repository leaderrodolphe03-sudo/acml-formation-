'use client'

import { ArrowLeft, CalendarCheck, MonitorPlay, ShieldCheck, UserRoundCheck } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { SITE } from '../lib/site'
import Logo from './Logo'
import { GlassBubble } from './vitrine/GlassArt'

const POINTS = [
  { icon: CalendarCheck, text: 'Vidéos débloquées selon votre calendrier' },
  { icon: MonitorPlay, text: 'Reprise automatique de la lecture' },
  { icon: UserRoundCheck, text: 'Un superviseur à votre écoute' },
]

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="app grid min-h-dvh bg-white lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="h-9" />
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium text-ink-soft transition hover:bg-surface hover:text-ink">
            <ArrowLeft size={15} aria-hidden="true" /> Retour au site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col justify-center py-10">
          <h1 className="text-[30px] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[34px]">{title}</h1>
          <p className="mt-2 text-[14.5px] leading-relaxed text-ink-soft">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
        <p className="flex items-center justify-center gap-1.5 text-[12px] text-ink-soft">
          <ShieldCheck size={14} aria-hidden="true" /> Vos données servent uniquement au suivi pédagogique.
        </p>
      </div>

      <aside className="panel-blue relative m-3 hidden overflow-hidden rounded-[28px] lg:block">
        <div className="absolute right-[8%] top-[10%] w-[min(60%,380px)]">
          <div className="absolute inset-x-10 -bottom-2 h-10 rounded-full bg-black/25 blur-2xl" aria-hidden="true" />
          <GlassBubble id="auth-bubble" className="animate-float relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.25)]" />
        </div>
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-script text-[34px] leading-none text-white/90">{SITE.tagline}</p>
          <h2 className="mt-4 max-w-md text-[34px] font-medium leading-[1.05] tracking-[-0.03em]">Votre progression, suivie à chaque leçon.</h2>
          <ul className="mt-7 space-y-3">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-[14.5px] text-white/85">
                <span className="icon-tile size-9 rounded-xl border border-white/15 bg-white/10 backdrop-blur"><p.icon size={17} aria-hidden="true" /></span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
