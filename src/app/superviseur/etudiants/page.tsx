import type { Metadata } from 'next'
import Students from '@/views/superviseur/Students'

export const metadata: Metadata = { title: "Étudiants" }

export default function Page() {
  return <Students />
}
