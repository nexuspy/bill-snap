import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import TopNav from '@/components/TopNav'
import { ToastProvider } from '@/components/ui/Toast'
import HelloIntro from '@/components/HelloIntro'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'BillSnap',
  description: 'Minimal invoicing & payment tracking',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ToastProvider>
          {/* Animated gradient background layer */}
          <div aria-hidden className="animated-bg" />
          {/* Apple-style Hello intro */}
          <HelloIntro />
          <TopNav />
          <main className="max-w-6xl mx-auto px-4">
            {children}
          </main>
          <footer className="py-8 text-center text-white/60">
            made with <span role="img" aria-label="love">❤️</span> by nexus
          </footer>
        </ToastProvider>
      </body>
    </html>
  )
}
