import type { Metadata } from 'next'
import { Suspense } from 'react'
import Register from '@/views/Register'

export const metadata: Metadata = { title: 'Rejoindre ma classe' }

export default function Page() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  )
}
