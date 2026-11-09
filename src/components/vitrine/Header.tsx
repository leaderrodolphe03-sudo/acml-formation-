'use client'

import { CalendarDays, LogIn, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { homeOf } from '@/lib/nav'
import { useStore } from '@/lib/store'
import { LogoImg } from '../Logo'

export const NAV = [
  { label: 'Accueil', id: 'accueil' },
  { label: 'À propos', id: 'a-propos' },
  { label: 'Parcours', id: 'parcours' },
  { label: 'Méthode', id: 'methode' },
  { label: 'Avis', id: 'temoignages' },
  { label: 'Contact', id: 'contact' },
] as const

export function Header() {
  const { me } = useStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [active, setActive] = useState<string>('accueil')
  const menuRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const indicatorRef = useRef<HTMLLIElement>(null)
  const progressRef = useRef<HTMLSpanElement>(null)
  const openRef = useRef(open)
  openRef.current = open

  // Défilement : ombre, progression, barre masquée en descendant / réaffichée en remontant
  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const update = () => {
      ticking = false
      const y = window.scrollY
      setScrolled(y > 12)
      if (!openRef.current) {
        if (y > 160 && y > last + 6) setHidden(true)
        else if (y < last - 6 || y < 160) setHidden(false)
      }
      last = y
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Section visible à l'écran (pour le lien actif)
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => !!el)
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  // Pastille blanche qui glisse sous le lien survolé puis revient sur la section active
  const moveIndicator = useCallback((el: HTMLElement | null) => {
    const ind = indicatorRef.current
    if (!ind) return
    if (!el) {
      ind.style.opacity = '0'
      return
    }
    ind.style.opacity = '1'
    ind.style.width = `${el.offsetWidth}px`
    ind.style.transform = `translateX(${el.offsetLeft}px)`
  }, [])
  const activeLink = () => listRef.current?.querySelector<HTMLElement>('a[aria-current="true"]') ?? null

  useEffect(() => {
    const place = () => moveIndicator(activeLink())
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active, moveIndicator])

  // Menu mobile : fermeture par Échap ou clic à l'extérieur
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onPointer = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  const spaceHref = me ? homeOf(me.role) : '/connexion'

  return (
    <header className={`site-header sticky top-0 z-40 px-3 pt-3 sm:px-5 ${hidden && !open ? 'site-header--hidden' : ''}`}>
      <div className={`nav-shell relative mx-auto flex max-w-[1240px] items-center justify-between gap-4 rounded-full py-2 pr-2 pl-4 sm:pl-5 ${scrolled ? 'nav-shell--scrolled' : ''}`}>
        <a href="#accueil" className="nav-logo shrink-0" aria-label="ACML – haut de page">
          <LogoImg className="h-8 sm:h-9" />
        </a>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul ref={listRef} onMouseLeave={() => moveIndicator(activeLink())} className="relative flex items-center gap-0.5 rounded-full bg-surface/80 p-1 text-[12.5px] font-medium xl:gap-1 xl:text-[13px]">
            <li
              ref={indicatorRef}
              aria-hidden="true"
              className="nav-indicator pointer-events-none absolute top-1 bottom-1 left-0 rounded-full bg-white shadow-[0_2px_10px_-4px_rgba(10,44,80,0.35)]"
              style={{ width: 0, opacity: 0 }}
            />
            {NAV.map((item) => (
              <li key={item.id} onMouseEnter={(e) => moveIndicator(e.currentTarget.querySelector('a'))}>
                <a
                  href={`#${item.id}`}
                  onFocus={(e) => moveIndicator(e.currentTarget)}
                  onBlur={() => moveIndicator(activeLink())}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`nav-pill ${active === item.id ? 'nav-pill--active' : ''}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={spaceHref}
            className="hidden h-10 items-center gap-2 rounded-full border border-line px-4 text-[13px] font-medium text-brand-700 transition hover:border-brand-700 hover:bg-tint sm:flex"
          >
            <LogIn className="size-4" aria-hidden="true" />
            {me ? 'Mon espace' : 'Se connecter'}
          </Link>
          <a href="#contact" className="v-btn hidden py-1.5 sm:inline-flex">
            <span className="grid size-7 place-items-center rounded-full bg-white/20">
              <CalendarDays className="size-3.5" aria-hidden="true" />
            </span>
            Cours d&apos;essai
          </a>

          <div ref={menuRef} className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-medium text-white"
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              {open ? <X className="size-4" aria-hidden="true" /> : <Menu className="size-4" aria-hidden="true" />}
              {open ? 'Fermer' : 'Menu'}
            </button>

            {open && (
              <nav id="menu-mobile" aria-label="Menu" className="menu-dropdown absolute top-[calc(100%+10px)] right-0 w-[min(80vw,260px)] rounded-3xl p-2">
                <ul>
                  {NAV.map((item, i) => (
                    <li key={item.id} className="menu-item" style={{ animationDelay: `${i * 25}ms` }}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-[14px] font-medium transition-colors ${
                          active === item.id ? 'bg-tint text-brand-900' : 'text-ink hover:bg-surface'
                        }`}
                      >
                        {item.label}
                        {active === item.id && <span className="size-1.5 rounded-full bg-accent-600" aria-hidden="true" />}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="mt-1 grid gap-1.5 border-t border-line p-2 pt-3 sm:hidden">
                  <a href="#contact" onClick={() => setOpen(false)} className="v-btn justify-center py-2.5">
                    <CalendarDays className="size-4" aria-hidden="true" />
                    Cours d&apos;essai gratuit
                  </a>
                  <Link href={spaceHref} className="flex items-center justify-center gap-2 rounded-full border border-line py-2.5 text-[13px] font-medium text-brand-700">
                    <LogIn className="size-4" aria-hidden="true" />
                    {me ? 'Mon espace' : 'Se connecter'}
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-8 bottom-0 h-[2px] overflow-hidden rounded-full">
          <span ref={progressRef} className="nav-progress block h-full w-full rounded-full bg-gradient-to-r from-brand-700 to-accent-600" />
        </span>
      </div>
    </header>
  )
}
