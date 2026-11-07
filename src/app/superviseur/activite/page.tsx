import type { Metadata } from 'next'
import Activity from '@/views/superviseur/Activity'

export const metadata: Metadata = { title: "Journal d'activité" }

export default function Page() {
  return <Activity />
}
