import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import RequireRole from '@/components/RequireRole'
import SupervisorLayout from '@/views/superviseur/SupervisorSpace'

export const metadata: Metadata = { title: 'Espace superviseur', robots: { index: false } }

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireRole roles={['superviseur', 'admin']}>
      <SupervisorLayout>{children}</SupervisorLayout>
    </RequireRole>
  )
}
