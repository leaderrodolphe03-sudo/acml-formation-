'use client'

import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'
import { homeOf } from '../lib/nav'
import { useStore } from '../lib/store'
import type { Role } from '../lib/types'

/** Protège un espace : redirige vers /connexion (ou vers le bon espace) selon le rôle. */
export default function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { me, ready } = useStore()
  const router = useRouter()
  const allowed = !!me && roles.includes(me.role)

  useEffect(() => {
    if (!ready) return
    if (!me) router.replace('/connexion')
    else if (!roles.includes(me.role)) router.replace(homeOf(me.role))
  }, [ready, me, roles, router])

  if (!ready || !allowed)
    return (
      <div className="grid min-h-dvh place-items-center bg-[#f4f7fb]">
        <span className="size-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-700" aria-label="Chargement" />
      </div>
    )
  return <>{children}</>
}
