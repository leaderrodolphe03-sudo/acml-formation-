'use client'

import { Bell, ChevronDown, ChevronRight, Globe, LogOut, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore } from '../lib/store'
import { LogoImg } from './Logo'
import { Avatar } from './ui'

export interface NavItem {
  to: string
  label: string
  short?: string
  icon: LucideIcon
  badge?: number
  end?: boolean
  /** rubrique sous laquelle le lien est rangé dans la barre latérale */
  section?: string
}

const ROLE_NAME = { etudiant: 'Étudiant', superviseur: 'Superviseur', admin: 'Administrateur' } as const

function UserMenu({ compact = false }: { compact?: boolean }) {
  const { me, logout } = useStore()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  if (!me) return null
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 rounded-full p-1 pr-2 transition hover:bg-slate-100"
      >
        <Avatar name={me.name} size="size-8" />
        {!compact && (
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-medium text-ink">{me.name}</span>
            <span className="block text-[11.5px] text-ink-soft">{ROLE_NAME[me.role]}</span>
          </span>
        )}
        <ChevronDown size={15} className={`text-ink-soft transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" className="animate-menu absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-line bg-white p-1.5 shadow-[0_24px_48px_-20px_rgba(10,44,80,0.35)]">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <Avatar name={me.name} />
            <div className="min-w-0">
              <p className="truncate text-[13.5px] font-medium text-ink">{me.name}</p>
              <p className="truncate text-[12px] text-ink-soft">{me.email}</p>
            </div>
          </div>
          <div className="my-1 h-px bg-line" />
          <Link role="menuitem" href="/" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13.5px] text-ink hover:bg-surface">
            <Globe size={16} className="text-ink-soft" aria-hidden="true" /> Retour au site
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              logout()
              router.push('/connexion')
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13.5px] text-accent-700 hover:bg-accent-50"
          >
            <LogOut size={16} aria-hidden="true" /> Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

export default function Shell({
  nav, roleLabel, top, notifications, children,
}: { nav: NavItem[]; roleLabel: string; top?: ReactNode; notifications?: { count: number; href: string; label: string }; children: ReactNode }) {
  const pathname = usePathname()
  const isActive = (n: NavItem) => (n.end ? pathname === n.to : pathname === n.to || pathname.startsWith(`${n.to}/`))
  const current = nav.find(isActive)
  const sections = [...new Set(nav.map((n) => n.section ?? ''))]

  const bell = notifications && (
    <Link
      href={notifications.href}
      className="relative grid size-10 place-items-center rounded-full text-ink-soft transition hover:bg-slate-100 hover:text-ink"
      aria-label={notifications.count ? `${notifications.label} (${notifications.count})` : notifications.label}
    >
      <Bell size={19} aria-hidden="true" />
      {notifications.count > 0 && (
        <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-accent-600 px-1 text-[10px] font-semibold leading-4 text-white ring-2 ring-white">
          {notifications.count > 9 ? '9+' : notifications.count}
        </span>
      )}
    </Link>
  )

  return (
    <div className="app min-h-dvh bg-canvas lg:pl-64">
      {/* ── Barre latérale (ordinateur) ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-white lg:flex">
        <div className="flex h-16 items-center px-5">
          <Link href="/" aria-label="ACML – site" className="transition hover:opacity-80">
            <LogoImg className="h-9" />
          </Link>
        </div>
        <div className="px-4 pb-2">
          <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-[.14em] text-ink-soft">{roleLabel}</p>
          {top}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Menu de l'espace">
          {sections.map((sec) => (
            <div key={sec || 'main'} className="mt-4 first:mt-2">
              {sec && <p className="mb-1.5 px-3 text-[11px] font-medium uppercase tracking-[.12em] text-ink-soft/80">{sec}</p>}
              <ul className="space-y-0.5">
                {nav.filter((n) => (n.section ?? '') === sec).map((n) => {
                  const active = isActive(n)
                  return (
                    <li key={n.to}>
                      <Link
                        href={n.to}
                        aria-current={active ? 'page' : undefined}
                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-2 text-[13.5px] font-medium transition ${
                          active ? 'bg-tint text-brand-900' : 'text-ink-soft hover:bg-surface hover:text-ink'
                        }`}
                      >
                        {active && <span className="absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-accent-600" aria-hidden="true" />}
                        <n.icon size={18} className={active ? 'text-brand-700' : 'text-ink-soft group-hover:text-ink'} aria-hidden="true" />
                        <span className="flex-1">{n.label}</span>
                        {!!n.badge && (
                          <span className="grid min-w-5 place-items-center rounded-full bg-accent-600 px-1.5 text-[11px] font-semibold leading-5 text-white">{n.badge}</span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>
        <div className="m-3 rounded-2xl border border-line bg-surface p-4">
          <p className="text-[13px] font-medium text-ink">Besoin d&apos;aide ?</p>
          <p className="mt-1 text-[12px] leading-relaxed text-ink-soft">L&apos;équipe ACML répond du lundi au samedi.</p>
          <a href="/#contact" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand-700 hover:underline">
            Nous contacter <ChevronRight size={14} aria-hidden="true" />
          </a>
        </div>
      </aside>

      {/* ── En-tête ── */}
      <header className="sticky top-0 z-20 border-b border-line bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" className="lg:hidden" aria-label="ACML – site">
              <LogoImg className="h-8" />
            </Link>
            <nav aria-label="Fil d'Ariane" className="hidden min-w-0 items-center gap-1.5 text-[13px] lg:flex">
              <span className="text-ink-soft">{roleLabel}</span>
              {current && (
                <>
                  <ChevronRight size={14} className="text-ink-soft/60" aria-hidden="true" />
                  <span className="truncate font-medium text-ink">{current.label}</span>
                </>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            {bell}
            <UserMenu />
          </div>
        </div>
      </header>
      {top && <div className="border-b border-line bg-white px-4 py-2.5 lg:hidden">{top}</div>}

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-14 lg:pt-8">{children}</main>

      {/* ── Navigation basse (mobile) ── */}
      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid border-t border-line bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
        style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}
        aria-label="Menu mobile"
      >
        {nav.map((n) => {
          const active = isActive(n)
          return (
            <Link key={n.to} href={n.to} aria-current={active ? 'page' : undefined} className={`relative flex flex-col items-center gap-1 pb-2 pt-1.5 text-[10.5px] font-medium ${active ? 'text-brand-800' : 'text-ink-soft'}`}>
              <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? 'bg-tint' : ''}`}>
                <n.icon size={19} aria-hidden="true" />
              </span>
              <span className="max-w-full truncate px-0.5">{n.short ?? n.label}</span>
              {!!n.badge && <span className="absolute right-[calc(50%-20px)] top-1.5 size-2 rounded-full bg-accent-600 ring-2 ring-white" />}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
