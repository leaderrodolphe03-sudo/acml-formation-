'use client'

import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { PHOTOS, SITE } from '../lib/site'
import Logo from './Logo'

export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[1fr_1.05fr]">
      <div className="flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Logo className="h-10" />
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-700">
            <ArrowLeft size={16} /> Retour au site
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-900">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
      <aside className="relative hidden overflow-hidden lg:block">
        <img src={PHOTOS.group} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800/95 via-brand-900/90 to-brand-950/95" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-script text-4xl">{SITE.tagline}</p>
          <h2 className="mt-3 max-w-md text-3xl font-extrabold leading-tight">Votre progression, suivie à chaque leçon.</h2>
          <ul className="mt-6 space-y-2.5 text-brand-100">
            {['Vidéos débloquées selon votre calendrier', 'Reprise automatique de la lecture', 'Un superviseur à votre écoute'].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><CheckCircle2 size={18} className="text-accent-500" />{t}</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
