'use client'

import { Eye, EyeOff, GraduationCap, LogIn, Users } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import AuthLayout from '../components/AuthLayout'
import { homeOf } from '../lib/nav'
import { DEMO_ACCOUNTS } from '../lib/seed'
import { useStore } from '../lib/store'

export default function Login() {
  const { login } = useStore()
  const router = useRouter()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const submit = (id: string, pw: string) => {
    const user = login(id, pw)
    if (!user) return setError('Identifiant ou mot de passe incorrect.')
    router.push(homeOf(user.role))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    submit(identifier, password)
  }

  if (resetMode)
    return (
      <AuthLayout title="Mot de passe oublié" subtitle="Indiquez votre e-mail ou votre numéro : nous vous enverrons un lien de réinitialisation.">
        {resetSent ? (
          <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-800">
            Si un compte correspond, un lien de réinitialisation vient d'être envoyé. Pensez à vérifier vos courriers indésirables.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setResetSent(true) }} className="space-y-4">
            <div>
              <label className="label" htmlFor="r-id">E-mail ou téléphone</label>
              <input id="r-id" required className="input" placeholder="vous@exemple.com" />
            </div>
            <button className="btn-primary w-full py-3">Envoyer le lien</button>
          </form>
        )}
        <button onClick={() => { setResetMode(false); setResetSent(false) }} className="mt-6 text-sm font-semibold text-brand-700 hover:underline">
          ← Retour à la connexion
        </button>
      </AuthLayout>
    )

  return (
    <AuthLayout title="Bon retour parmi nous 👋" subtitle="Connectez-vous à votre espace étudiant ou superviseur.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="id">E-mail ou numéro de téléphone</label>
          <input id="id" className="input" autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="vous@exemple.com ou +229…" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="pw">Mot de passe</label>
            <button type="button" onClick={() => setResetMode(true)} className="mb-1.5 text-xs font-semibold text-brand-700 hover:underline">Mot de passe oublié ?</button>
          </div>
          <div className="relative">
            <input id="pw" type={show ? 'text' : 'password'} className="input pr-11" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</p>}
        <button className="btn-primary w-full py-3"><LogIn size={16} /> Se connecter</button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Vous avez un code de classe ?{' '}
        <Link href="/rejoindre" className="font-bold text-accent-600 hover:underline">Créer mon compte étudiant</Link>
      </p>

      <div className="mt-8 rounded-2xl border border-dashed border-brand-200 bg-brand-50/60 p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-700">Démonstration</p>
        <p className="mt-1 text-xs text-slate-600">Découvrez la plateforme avec un compte de test :</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} type="button" onClick={() => submit(a.email, a.password)} className="btn-ghost px-3 text-xs">
              {a.label === 'Étudiant' ? <GraduationCap size={16} /> : <Users size={16} />} Espace {a.label.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}
