import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import InstallBanner from '@/components/InstallBanner'

export const metadata: Metadata = {
  title: 'SafeReach NG - Emergency Security Contacts',
  description: 'Direct emergency contacts for Nigerian security forces. Police, Army, NSCDC.',
  keywords: ['emergency', 'Nigeria', 'police', 'security', 'safety', 'contact', 'army', 'NSCDC'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: [
      { url: '/icon-76.png',  sizes: '76x76' },
      { url: '/icon-120.png', sizes: '120x120' },
      { url: '/icon-152.png', sizes: '152x152' },
      { url: '/icon-167.png', sizes: '167x167' },
      { url: '/icon-180.png', sizes: '180x180' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SafeReach NG',
    startupImage: '/icon-512.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0D1B2A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="SafeReach NG" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icon-180.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/icon-76.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/icon-120.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icon-152.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icon-167.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png" />
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
            first; the most reliable emergency line in Nigeria. Works free on all networks.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs">
            <a href="https://github.com/chukkytovic/safereachng" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors">
              Open Source on GitHub
            </a>
          </div>
        </footer>
      </body>
    </html>
  )
}