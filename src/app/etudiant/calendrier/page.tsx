import type { Metadata } from 'next'
import Calendar from '@/views/etudiant/Calendar'

export const metadata: Metadata = { title: "Calendrier" }

export default function Page() {
  return <Calendar />
}
