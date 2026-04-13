import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import InstallBanner from '@/components/InstallBanner'

export const metadata: Metadata = {
  title: 'SafeReach NG — Emergency Security Contacts',
  description: 'Direct emergency contacts for Nigerian security forces. Police, Army, NSCDC — one tap from any state.',
  keywords: ['emergency', 'Nigeria', 'police', 'security', 'safety', 'contact', 'army', 'NSCDC'],
  manifest: '/manifest.json',
  icons: { icon: '/logo.png', apple: '/logo.png' },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'SafeReach NG' },
}

export const viewport: Viewport = {
  themeColor: '#0D1B2A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="apple-touch-icon" href="/logo.png" />
        <script dangerouslySetInnerHTML={{
          __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`
        }} />
      </head>
      <body className="bg-surface">
        <Navbar />
        <main className="min-h-dvh pt-16">{children}</main>
        <InstallBanner />
        <footer className="bg-navy border-t border-navy-light mt-12 py-8 px-4 text-center">
          <p className="text-text-muted text-xs mb-3">
            Always try{' '}
            <a href="tel:112" className="text-accent font-semibold hover:underline">112</a>{' '}
            first — the most reliable emergency line in Nigeria. Works free on all networks.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="https://github.com/yourusername/safereachng" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
              Open Source on GitHub
            </a>
            <span className="text-text-muted">·</span>
            <a href="/report" className="text-text-muted hover:text-accent transition-colors">Report Incident</a>
            <span className="text-text-muted">·</span>
            <span className="text-text-muted">SafeReach NG 2026</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
