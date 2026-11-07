import type { Metadata, Viewport } from 'next'
import { Dancing_Script, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'
import { StoreProvider } from '@/lib/store'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-jakarta', display: 'swap' })
const dancing = Dancing_Script({ subsets: ['latin'], weight: ['600'], variable: '--font-dancing', display: 'swap' })

export const metadata: Metadata = {
  title: {
    default: "ACML – L'anglais comme ma langue",
    template: '%s · ACML',
  },
  description:
    "ACML – L'anglais comme ma langue. Apprenez l'anglais avec aisance, avec passion : parcours Débutant, Intermédiaire et Avancé, suivis par un superviseur.",
  icons: { icon: '/logo-acml.png' },
}

export const viewport: Viewport = {
  themeColor: '#0f4a85',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${dancing.variable}`}>
      <head>
        {/* Secours si next/font n'a pas pu télécharger les polices */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Dancing+Script:wght@600&display=swap" />
      </head>
      <body className="font-sans">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  )
}
