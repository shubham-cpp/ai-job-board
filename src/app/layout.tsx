import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import { Geist, IBM_Plex_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import AppProvider from '@/components/app-providers'
import Navbar from '@/components/navbar'
import './globals.css'

const fontSans = Geist({
  variable: '--font-next-sans',
  subsets: ['latin'],
})

const fontMono = IBM_Plex_Mono({
  variable: '--font-next-mono',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Starter App',
  description:
    'Creating a starter template for next.js with drizzle-orm, better-auth, google oauth, shadcn-ui and login/signup routes.',
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${fontSans.variable}
          ${fontMono.variable}
          grid min-h-screen grid-rows-[auto_1fr] font-sans antialiased
        `}
      >
        <AppProvider>
          <Navbar />
          <main className="container mx-auto">{children}</main>
          <Toaster richColors />
        </AppProvider>
      </body>
    </html>
  )
}
