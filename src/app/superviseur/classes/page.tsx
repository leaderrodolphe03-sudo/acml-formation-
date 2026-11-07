import type { Metadata } from 'next'
import Classes from '@/views/superviseur/Classes'

export const metadata: Metadata = { title: "Mes classes" }

export default function Page() {
  return <Classes />
}
