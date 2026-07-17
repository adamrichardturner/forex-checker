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
  title: 'FX Checker',
  description: 'Check foreign exchange rates.',
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
