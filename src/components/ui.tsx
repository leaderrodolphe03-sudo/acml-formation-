'use client'

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { STATUS_DOT, STATUS_LABEL, STATUS_STYLE } from '../lib/schedule'
import type { LessonStatus } from '../lib/types'

/* ───────────── Teintes ───────────── */
export type Tone = 'brand' | 'accent' | 'green' | 'amber' | 'slate'

export const TONE_TILE: Record<Tone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-600',
  green: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  slate: 'bg-slate-100 text-slate-500',
}

/** Icône posée sur une tuile arrondie teintée. */
export function IconTile({ icon: Icon, tone = 'brand', size = 'md', className = '' }: { icon: LucideIcon; tone?: Tone; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const s = { sm: 'size-8 rounded-lg', md: 'size-10', lg: 'size-12 rounded-2xl' }[size]
  const i = { sm: 15, md: 18, lg: 22 }[size]
  return (
    <span className={`icon-tile ${s} ${TONE_TILE[tone]} ${className}`}>
      <Icon size={i} aria-hidden="true" />
    </span>
  )
}

/* ───────────── Avatar ───────────── */
const AVATAR_TONES = [
  'bg-brand-50 text-brand-700',
  'bg-accent-50 text-accent-700',
  'bg-emerald-50 text-emerald-700',
  'bg-amber-50 text-amber-800',
  'bg-slate-100 text-slate-700',
]

export function Avatar({ name, size = 'size-9', className = '' }: { name: string; size?: string; className?: string }) {
  const initials = name.split(/[\s-]+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  const tone = AVATAR_TONES[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length]
  return (
    <span className={`grid shrink-0 place-items-center rounded-full text-[12px] font-semibold tracking-tight ring-1 ring-inset ring-black/5 ${size} ${tone} ${className}`} aria-hidden="true">
      {initials}
    </span>
  )
}

/* ───────────── Progression ───────────── */
export function ProgressBar({ value, className = '', color = 'bg-brand-600' }: { value: number; className?: string; color?: string }) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div className={`h-1.5 overflow-hidden rounded-full bg-slate-100 ${className}`} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100}>
      <div className={`h-full rounded-full transition-[width] duration-700 ease-out ${color}`} style={{ width: `${v}%` }} />
    </div>
  )
}

/** Anneau de progression (SVG) avec valeur au centre. */
export function ProgressRing({
  value, size = 120, stroke = 10, label, track = 'stroke-slate-100', color = 'stroke-brand-600', children,
}: { value: number; size?: number; stroke?: number; label?: string; track?: string; color?: string; children?: ReactNode }) {
  const v = Math.min(100, Math.max(0, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={track} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v / 100)} className={`${color} transition-[stroke-dashoffset] duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children ?? <span className="text-xl font-medium tracking-tight">{Math.round(v)} %</span>}</div>
    </div>
  )
}

/* ───────────── Statut ───────────── */
export function StatusChip({ status }: { status: LessonStatus }) {
  return (
    <span className={`chip ${STATUS_STYLE[status]}`}>
      <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} aria-hidden="true" />
      {STATUS_LABEL[status]}
    </span>
  )
}

/* ───────────── Chiffre clé ───────────── */
export function StatCard({ icon, label, value, hint, tone = 'brand' }: { icon: LucideIcon; label: string; value: ReactNode; hint?: ReactNode; tone?: Tone }) {
  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-ink-soft">{label}</p>
        <IconTile icon={icon} tone={tone} size="sm" />
      </div>
      <p className="mt-3 text-[28px] font-medium leading-none tracking-[-0.03em] text-ink sm:text-[32px]">{value}</p>
      {hint && <div className="mt-2 text-[12.5px] text-ink-soft">{hint}</div>}
    </div>
  )
}

/* ───────────── En-tête de page ───────────── */
export function PageHeader({ eyebrow, title, subtitle, actions }: { eyebrow?: string; title: string; subtitle?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4 lg:mb-8">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-[26px] font-medium leading-tight tracking-[-0.03em] text-ink sm:text-[30px]">{title}</h1>
        {subtitle && <p className="mt-1.5 text-[14px] text-ink-soft">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

/* ───────────── Panneau avec en-tête ───────────── */
export function Panel({
  title, icon, description, action, children, className = '', bodyClassName = 'p-5',
}: { title: string; icon?: LucideIcon; description?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; bodyClassName?: string }) {
  const Icon = icon
  return (
    <section className={`card overflow-hidden ${className}`}>
      <header className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2.5 border-b border-line/80 px-5 py-4">
        <div className="flex min-w-[12rem] flex-1 items-center gap-2.5">
          {Icon && <Icon size={17} className="shrink-0 text-ink-soft" aria-hidden="true" />}
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-medium tracking-tight text-ink">{title}</h2>
            {description && <p className="truncate text-[12.5px] text-ink-soft">{description}</p>}
          </div>
        </div>
        {action}
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

/* ───────────── État vide ───────────── */
export function Empty({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children?: ReactNode }) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-10 text-center">
      <span className="icon-tile size-12 rounded-2xl bg-white text-ink-soft ring-1 ring-line"><Icon size={20} aria-hidden="true" /></span>
      <p className="mt-3 text-[15px] font-medium text-ink">{title}</p>
      {children && <div className="mt-1 text-[13.5px] text-ink-soft">{children}</div>}
    </div>
  )
}

/* ───────────── Interrupteur ───────────── */
export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-line p-3.5 transition hover:border-brand-200">
      <span>
        <span className="block text-[14px] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[12.5px] text-ink-soft">{hint}</span>}
      </span>
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full bg-slate-200 transition peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-5" />
    </label>
  )
}

/* ───────────── Segments (onglets) ───────────── */
export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[] }) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1" role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition ${value === o.value ? 'bg-white text-ink shadow-sm' : 'text-ink-soft hover:text-ink'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
