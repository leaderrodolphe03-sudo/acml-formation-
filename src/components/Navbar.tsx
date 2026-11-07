'use client'

import { LogIn, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { homeOf } from '../lib/nav'
import { useStore } from '../lib/store'
import Logo from './Logo'

const LINKS = [
  ['Accueil', '#accueil'],
  ['À propos', '#a-propos'],
  ['Parcours', '#parcours'],
  ['Méthode', '#methode'],
  ['Témoignages', '#temoignages'],
  ['Contact', '#contact'],
] as const

export default function Navbar() {
  const { me } = useStore()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-40 bg-white/90 backdrop-blur transition-shadow ${scrolled ? 'shadow-[0_6px_24px_-12px_rgba(10,44,80,.25)]' : ''}`}>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo className="h-10 sm:h-12" />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
          {LINKS.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold transition hover:text-brand-700 ${i === 0 ? 'text-brand-700' : 'text-slate-600'}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          {me ? (
            <Link href={homeOf(me.role)} className="btn-primary">
              Mon espace
            </Link>
          ) : (
            <Link href="/connexion" className="btn-ghost">
              <LogIn size={16} /> Se connecter
            </Link>
          )}
          <a href="#contact" className="btn-accent">
            Cours d'essai gratuit
          </a>
        </div>

        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 text-brand-800 xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 pt-2 xl:hidden">
          <nav className="flex flex-col" aria-label="Navigation mobile">
            {LINKS.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-3 text-[15px] font-semibold text-slate-700">
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link href={me ? homeOf(me.role) : '/connexion'} className="btn-ghost">
              {me ? 'Mon espace' : 'Se connecter'}
            </Link>
            <a href="#contact" onClick={() => setOpen(false)} className="btn-accent">
              Cours d'essai
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
