import type { Metadata } from 'next'
import Login from '@/views/Login'

export const metadata: Metadata = { title: 'Connexion' }

export default function Page() {
  return <Login />
}
