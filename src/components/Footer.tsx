'use client'

import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { SITE } from '../lib/site'
import Logo from './Logo'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo boxed className="h-12" />
          <p className="mt-5 text-sm leading-relaxed text-slate-400">
            ACML accompagne les francophones vers un anglais naturel et fluide, du premier « Hello » jusqu'à l'aisance professionnelle.
          </p>
          <p className="mt-3 font-script text-2xl text-white">{SITE.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Liens rapides</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[['À propos', '#a-propos'], ['Nos parcours', '#parcours'], ['Notre méthode', '#methode'], ['Témoignages', '#temoignages']].map(([l, h]) => (
              <li key={h}><a href={h} className="transition hover:text-white">{l}</a></li>
            ))}
            <li><Link href="/connexion" className="transition hover:text-white">Espace étudiant / superviseur</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Nous contacter</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-3"><Phone size={16} className="mt-0.5 shrink-0 text-accent-500" />{SITE.phone}</li>
            <li className="flex gap-3"><Mail size={16} className="mt-0.5 shrink-0 text-accent-500" />{SITE.email}</li>
            <li className="flex gap-3"><MapPin size={16} className="mt-0.5 shrink-0 text-accent-500" />{SITE.address}</li>
            <li className="flex gap-3"><Clock size={16} className="mt-0.5 shrink-0 text-accent-500" />{SITE.hours}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Restez informé</h3>
          <p className="mt-4 text-sm text-slate-400">Recevez nos conseils et l'ouverture des prochaines classes.</p>
          <form
            className="mt-4 flex overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 focus-within:ring-white/30"
            onSubmit={(e) => {
              e.preventDefault()
              if (email) setSent(true)
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre e-mail"
              aria-label="Votre e-mail"
              className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <button className="grid w-11 place-items-center bg-accent-600 text-white hover:bg-accent-700" aria-label="S'inscrire">
              <Send size={16} />
            </button>
          </form>
          {sent && <p className="mt-2 text-xs text-emerald-400">Merci ! Vous êtes bien inscrit(e).</p>}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} ACML – L'Anglais Comme Ma Langue. Tous droits réservés.</p>
          <p>Données des étudiants utilisées uniquement pour le suivi pédagogique.</p>
        </div>
      </div>
    </footer>
  )
}
