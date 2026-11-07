import type { Metadata } from 'next'
import Lessons from '@/views/etudiant/Lessons'

export const metadata: Metadata = { title: "Mes leçons" }

export default function Page() {
  return <Lessons />
}
