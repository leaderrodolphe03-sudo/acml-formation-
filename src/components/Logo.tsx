'use client'

import Link from 'next/link'

/**
 * Le fichier du logo contient de grandes marges blanches : on le recadre en CSS
 * (zone utile ≈ x 43→981, y 133→524 sur une image de 1024 × 574).
 */
export function LogoImg({ className = 'h-11' }: { className?: string }) {
  return (
    <span className={`relative block aspect-[938/391] overflow-hidden ${className}`}>
      <img
        src="/logo-acml.png"
        alt="L'Anglais comme ma langue"
        className="absolute max-w-none"
        style={{ width: `${(1024 / 938) * 100}%`, left: `${(-43 / 938) * 100}%`, top: `${(-133 / 391) * 100}%` }}
      />
    </span>
  )
}

export default function Logo({ className = 'h-11', boxed = false }: { className?: string; boxed?: boolean }) {
  return (
    <Link href="/" aria-label="ACML – Accueil" className={boxed ? 'inline-flex rounded-xl bg-white px-2.5 py-2' : 'inline-flex'}>
      <LogoImg className={className} />
    </Link>
  )
}
