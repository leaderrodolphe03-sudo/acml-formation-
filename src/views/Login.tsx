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
          <div className="rounded-2xl bg-emerald-50 p-5 text-[14px] text-emerald-800 ring-1 ring-emerald-600/15">
            Si un compte correspond, un lien de réinitialisation vient d'être envoyé. Pensez à vérifier vos courriers indésirables.
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setResetSent(true) }} className="space-y-4">
            <div>
              <label className="label" htmlFor="r-id">E-mail ou téléphone</label>
              <input id="r-id" required className="input" placeholder="vous@exemple.com" />
            </div>
            <button className="btn-primary h-12 w-full">Envoyer le lien</button>
          </form>
        )}
        <button onClick={() => { setResetMode(false); setResetSent(false) }} className="mt-6 text-[13.5px] font-medium text-brand-700 hover:underline">
          ← Retour à la connexion
        </button>
      </AuthLayout>
    )

  return (
    <AuthLayout title="Bon retour parmi nous" subtitle="Connectez-vous à votre espace étudiant ou superviseur.">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="id">E-mail ou numéro de téléphone</label>
          <input id="id" className="input" autoComplete="username" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="vous@exemple.com ou +229…" />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="pw">Mot de passe</label>
            <button type="button" onClick={() => setResetMode(true)} className="mb-1.5 text-[12.5px] font-medium text-brand-700 hover:underline">Mot de passe oublié ?</button>
          </div>
          <div className="relative">
            <input id="pw" type={show ? 'text' : 'password'} className="input pr-11" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        {error && <p role="alert" className="rounded-xl bg-accent-50 px-3.5 py-2.5 text-[13.5px] text-accent-700 ring-1 ring-accent-600/15">{error}</p>}
        <button className="btn-primary h-12 w-full"><LogIn size={16} /> Se connecter</button>
      </form>

      <p className="mt-6 text-center text-[13.5px] text-ink-soft">
        Vous avez un code de classe ?{' '}
        <Link href="/rejoindre" className="font-medium text-accent-600 hover:underline">Créer mon compte étudiant</Link>
      </p>

      <div className="mt-8 rounded-2xl border border-line bg-surface p-4">
        <p className="eyebrow">Démonstration</p>
        <p className="mt-1.5 text-[12.5px] text-ink-soft">Découvrez la plateforme avec un compte de test :</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} type="button" onClick={() => submit(a.email, a.password)} className="btn-ghost px-3 text-[12.5px]">
              {a.label === 'Étudiant' ? <GraduationCap size={16} aria-hidden="true" /> : <Users size={16} aria-hidden="true" />} Espace {a.label.toLowerCase()}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}
