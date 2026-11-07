'use client'

import { ArrowRight, CalendarDays, Plus, RotateCcw, School, Users } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '../../components/ui'
import { levelById, LEVELS } from '../../lib/catalog'
import { studentsOf } from '../../lib/insights'
import { fmtDate, WEEKDAYS } from '../../lib/schedule'
import { useStore } from '../../lib/store'
import type { LevelId } from '../../lib/types'
import { useSupervisor } from './SupervisorSpace'

export default function Classes() {
  const { db, classes, cls, setClassId } = useSupervisor()
  const { createClass, resetDemo } = useStore()
  const router = useRouter()
  const [name, setName] = useState('')
  const [level, setLevel] = useState<LevelId>('debutant')
  const [confirmReset, setConfirmReset] = useState(false)

  const open = (id: string, to = '/superviseur') => {
    setClassId(id)
    router.push(to)
  }

  return (
    <>
      <PageHeader title="Mes classes" subtitle="Créez une classe, puis partagez son code d'invitation à vos étudiants." />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {classes.map((c) => {
          const lvl = levelById(c.levelId)
          const n = studentsOf(db, c).length
          return (
            <article key={c.id} className={`card flex flex-col p-5 ${c.id === cls?.id ? 'ring-2 ring-brand-500' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-xl text-white" style={{ background: lvl.color }}><School size={20} /></span>
                <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-700">{c.code}</span>
              </div>
              <h2 className="mt-4 text-lg font-extrabold text-brand-900">{c.name}</h2>
              <p className="text-sm text-slate-500">Niveau {lvl.name}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                <li className="flex items-center gap-2"><Users size={15} className="text-slate-400" />{n} étudiant(s)</li>
                <li className="flex items-center gap-2"><CalendarDays size={15} className="text-slate-400" />
                  {c.schedule.length ? `${c.schedule.length} vidéos · ${c.rhythm.days.map((d) => WEEKDAYS[d]).join(', ')} · dès le ${fmtDate(c.startDate)}` : 'Parcours pas encore programmé'}
                </li>
              </ul>
              <div className="mt-auto flex gap-2 pt-5">
                <button className="btn-primary flex-1 px-3" onClick={() => open(c.id)}>Ouvrir <ArrowRight size={15} /></button>
                <button className="btn-ghost px-3" onClick={() => open(c.id, '/superviseur/programmation')}>Programmer</button>
              </div>
            </article>
          )
        })}

        <form
          className="card flex flex-col border-dashed p-5"
          onSubmit={(e) => {
            e.preventDefault()
            if (!name.trim()) return
            const c = createClass(name.trim(), level)
            setName('')
            open(c.id, '/superviseur/programmation')
          }}
        >
          <span className="grid size-11 place-items-center rounded-xl bg-brand-50 text-brand-700"><Plus size={22} /></span>
          <h2 className="mt-4 text-lg font-extrabold text-brand-900">Nouvelle classe</h2>
          <label className="label mt-4" htmlFor="cname">Nom de la classe</label>
          <input id="cname" className="input" placeholder="Ex. Promo Janvier" value={name} onChange={(e) => setName(e.target.value)} required />
          <label className="label mt-3" htmlFor="clevel">Niveau</label>
          <select id="clevel" className="input" value={level} onChange={(e) => setLevel(e.target.value as LevelId)}>
            {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <button className="btn-accent mt-5">Créer la classe</button>
        </form>
      </div>

      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Mode démonstration</p>
        <p className="mt-1">Les données sont enregistrées dans ce navigateur. Vous pouvez restaurer le jeu de données d'exemple à tout moment.</p>
        {confirmReset ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span>Toutes les modifications seront perdues. Continuer ?</span>
            <button className="btn bg-red-600 px-3 py-1.5 text-white hover:bg-red-700" onClick={() => { resetDemo(); router.push('/connexion') }}>Réinitialiser</button>
            <button className="btn-ghost px-3 py-1.5" onClick={() => setConfirmReset(false)}>Annuler</button>
          </div>
        ) : (
          <button className="btn-ghost mt-3" onClick={() => setConfirmReset(true)}><RotateCcw size={15} /> Réinitialiser la démo</button>
        )}
      </div>
    </>
  )
}
