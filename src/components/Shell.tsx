'use client'

import { LogOut, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { useStore } from '../lib/store'
import Logo from './Logo'
import { Avatar } from './ui'

export interface NavItem {
  to: string
  label: string
  short?: string
  icon: LucideIcon
  badge?: number
  end?: boolean
}

export default function Shell({ nav, roleLabel, top, children }: { nav: NavItem[]; roleLabel: string; top?: ReactNode; children: ReactNode }) {
  const { me, logout } = useStore()
  const router = useRouter()
  const pathname = usePathname()
  const isActive = (n: NavItem) => (n.end ? pathname === n.to : pathname === n.to || pathname.startsWith(`${n.to}/`))
  const doLogout = () => {
    logout()
    router.push('/connexion')
  }

  return (
    <div className="min-h-dvh bg-[#f4f7fb] lg:pl-68">
      {/* Barre latérale (ordinateur) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-68 flex-col bg-brand-950 text-slate-300 lg:flex">
        <div className="px-5 pb-4 pt-5">
          <Logo boxed className="h-12" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[.18em] text-brand-200/70">{roleLabel}</p>
        </div>
        {top && <div className="px-4 pb-3">{top}</div>}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3" aria-label="Menu de l'espace">
          {nav.map((n) => (
            <Link
              key={n.to}
              href={n.to}
              aria-current={isActive(n) ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive(n) ? 'bg-white text-brand-900 shadow' : 'hover:bg-white/5 hover:text-white'}`}
            >
              <n.icon size={19} />
              <span className="flex-1">{n.label}</span>
              {!!n.badge && <span className="grid min-w-5 place-items-center rounded-full bg-accent-600 px-1.5 text-[11px] font-bold text-white">{n.badge}</span>}
            </Link>
          ))}
        </nav>
        {me && (
          <div className="m-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <Avatar name={me.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{me.name}</p>
              <p className="truncate text-xs text-slate-400">{me.email}</p>
            </div>
            <button onClick={doLogout} className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white" aria-label="Se déconnecter" title="Se déconnecter">
              <LogOut size={17} />
            </button>
          </div>
        )}
      </aside>

      {/* Barre supérieure (mobile) */}
      <header className="sticky top-0 z-30 flex h-15 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Logo className="h-9" />
        <div className="flex items-center gap-2">
          {me && <Avatar name={me.name} size="size-8" />}
          <button onClick={doLogout} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100" aria-label="Se déconnecter">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      {top && <div className="border-b border-slate-200 bg-white px-4 py-2.5 lg:hidden">{top}</div>}

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12 lg:pt-8">{children}</main>

      {/* Navigation basse (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden" style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }} aria-label="Menu mobile">
        {nav.map((n) => (
          <Link key={n.to} href={n.to} aria-current={isActive(n) ? 'page' : undefined} className={`relative flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-semibold ${isActive(n) ? 'text-brand-700' : 'text-slate-500'}`}>
            <n.icon size={21} />
            {n.short ?? n.label}
            {!!n.badge && <span className="absolute right-[calc(50%-18px)] top-1 size-2 rounded-full bg-accent-600" />}
          </Link>
        ))}
      </nav>
    </div>
  )
}
