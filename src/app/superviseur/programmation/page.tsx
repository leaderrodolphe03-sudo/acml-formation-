import type { Metadata } from 'next'
import Planning from '@/views/superviseur/Planning'

export const metadata: Metadata = { title: "Programmation" }

export default function Page() {
  return <Planning />
}
