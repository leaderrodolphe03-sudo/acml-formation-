import type { Metadata } from 'next'
import Lesson from '@/views/etudiant/Lesson'

export const metadata: Metadata = { title: "Leçon" }

export default function Page() {
  return <Lesson />
}
