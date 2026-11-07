import type { Metadata } from 'next'
import { Suspense } from 'react'
import Messages from '@/views/superviseur/Messages'

export const metadata: Metadata = { title: "Communication" }

export default function Page() {
  return (
    <Suspense>
      <Messages />
    </Suspense>
  )
}
