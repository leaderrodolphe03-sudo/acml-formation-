import type { Metadata } from 'next'
import StudentDetail from '@/views/superviseur/StudentDetail'

export const metadata: Metadata = { title: "Fiche étudiant" }

export default function Page() {
  return <StudentDetail />
}
