'use client'

import { UserPlus } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import AuthLayout from '../components/AuthLayout'
import { useStore } from '../lib/store'

export default function Register() {
  const { register } = useStore()
  const router = useRouter()
  const params = useSearchParams()
  const [form, setForm] = useState({ code: params.get('code') ?? '', name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Le mot de passe doit contenir au moins 6 caractères.')
    const res = register(form)
    if (typeof res === 'string') return setError(res)
    router.push('/etudiant')
  }

  return (
    <AuthLayout title="Rejoindre ma classe" subtitle="Entrez le code ou utilisez le lien envoyé par votre superviseur, puis créez votre compte.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="code">Code de classe</label>
          <input id="code" required className="input font-mono uppercase tracking-widest" value={form.code} onChange={set('code')} placeholder="EX. SAMEDI-24" />
        </div>
        <div>
          <label className="label" htmlFor="name">Nom complet</label>
          <input id="name" required className="input" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Prénom Nom" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="email">E-mail</label>
            <input id="email" type="email" required className="input" autoComplete="email" value={form.email} onChange={set('email')} placeholder="vous@exemple.com" />
          </div>
          <div>
            <label className="label" htmlFor="phone">Téléphone <span className="font-normal text-slate-400">(facultatif)</span></label>
            <input id="phone" type="tel" className="input" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="+229 …" />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="pw">Mot de passe</label>
          <input id="pw" type="password" required className="input" autoComplete="new-password" value={form.password} onChange={set('password')} placeholder="6 caractères minimum" />
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
        <button className="btn-accent w-full py-3"><UserPlus size={16} /> Créer mon compte et rejoindre la classe</button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà inscrit ? <Link href="/connexion" className="font-bold text-brand-700 hover:underline">Se connecter</Link>
      </p>
    </AuthLayout>
  )
}
