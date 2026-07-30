import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import type { ReactNode } from 'react'
import { QueryProvider } from '@/lib/tanstack-query/query-provider'

import './globals.css'

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
  ),
  title: 'FX Checker - Foreign Exchange Rates by Adam Turner',
  description:
    'Next.js, Tailwind and TypeScript app for checking foreign exchange rates by Adam Turner',
  openGraph: {
    title: 'FX Checker - Foreign Exchange Rates by Adam Turner',
    description:
      'Next.js, Tailwind and TypeScript app for checking foreign exchange rates by Adam Turner',
    url: '/',
    siteName: 'FX Checker',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'FX Checker by Adam Turner',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FX Checker - Foreign Exchange Rates by Adam Turner',
    description:
      'Next.js, Tailwind and TypeScript app for checking foreign exchange rates by Adam Turner',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'FX Checker by Adam Turner',
      },
    ],
    creator: '@devadam88',
  },
}

type RootLayoutProps = Readonly<{
  children: ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en-GB" className={`${jetBrainsMono.variable} dark`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
