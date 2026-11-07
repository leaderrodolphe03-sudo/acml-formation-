import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import RequireRole from '@/components/RequireRole'
import StudentLayout from '@/views/etudiant/StudentSpace'

export const metadata: Metadata = { title: 'Espace étudiant', robots: { index: false } }

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <RequireRole roles={['etudiant']}>
      <StudentLayout>{children}</StudentLayout>
    </RequireRole>
  )
}
