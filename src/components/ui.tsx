'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { STATUS_LABEL, STATUS_STYLE } from '../lib/schedule'
import type { LessonStatus } from '../lib/types'

const AVATAR_COLORS = ['bg-brand-700', 'bg-accent-600', 'bg-emerald-600', 'bg-amber-500', 'bg-violet-600', 'bg-sky-600', 'bg-rose-500']

export function Avatar({ name, size = 'size-9', className = '' }: { name: string; size?: string; className?: string }) {
  const initials = name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  const color = AVATAR_COLORS[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length]
  return <span className={`grid shrink-0 place-items-center rounded-full text-xs font-bold text-white ${size} ${color} ${className}`}>{initials}</span>
}

export function ProgressBar({ value, className = '', color = 'bg-brand-600' }: { value: number; className?: string; color?: string }) {
  return (
    <div className={`h-2 overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-[width] duration-500 ${color}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

export function StatusChip({ status }: { status: LessonStatus }) {
  return <span className={`chip ${STATUS_STYLE[status]}`}>{STATUS_LABEL[status]}</span>
}

export function StatCard({ icon: Icon, label, value, hint, tone = 'brand' }: { icon: LucideIcon; label: string; value: ReactNode; hint?: ReactNode; tone?: 'brand' | 'accent' | 'green' | 'amber' }) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
  }
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tones[tone]}`}><Icon size={20} /></span>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-brand-900 sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  )
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-brand-900 sm:text-[1.75rem]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Empty({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-200 px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-slate-100 text-slate-400"><Icon size={22} /></span>
      <p className="mt-3 font-semibold text-slate-700">{title}</p>
      {children && <div className="mt-1 text-sm text-slate-500">{children}</div>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-slate-200 p-3.5 hover:border-brand-200">
      <span>
        <span className="block text-sm font-semibold text-slate-800">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-slate-500">{hint}</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  )
}
