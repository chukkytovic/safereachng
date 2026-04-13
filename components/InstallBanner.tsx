'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showAndroid, setShowAndroid] = useState(false)
  const [showIOS, setShowIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('pwa-dismissed')) { setDismissed(true); return }
    if (window.matchMedia('(display-mode: standalone)').matches) { setInstalled(true); return }

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isIOS && isSafari) {
      setTimeout(() => setShowIOS(true), 3000)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowAndroid(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function dismiss() {
    setShowAndroid(false)
    setShowIOS(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-dismissed', '1')
  }

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShowAndroid(false)
      setInstalled(true)
    }
  }

  if (installed || dismissed) return null
  if (!showAndroid && !showIOS) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-navy-light shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-navy-light flex items-center justify-center">
            <Image src="/logo.png" alt="SafeReach NG" width={48} height={48} className="object-contain mix-blend-screen" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-tight">Install SafeReach NG</p>
            <p className="text-text-muted text-xs mt-0.5">
              {showIOS
                ? 'Tap the Share icon, then "Add to Home Screen"'
                : 'Add to home screen for quick access'}
            </p>
          </div>

          {showAndroid ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={install}
                className="px-4 py-2 rounded-lg border border-accent text-accent text-sm font-bold hover:bg-accent hover:text-white transition-colors"
              >
                Install
              </button>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg bg-navy-light text-text-muted text-sm font-medium hover:text-white transition-colors"
              >
                Later
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-navy-light text-text-muted text-xs">
                <Share className="w-3.5 h-3.5" />
                <span>Share</span>
              </div>
              <button
                onClick={dismiss}
                className="px-4 py-2 rounded-lg bg-navy-light text-text-muted text-sm font-medium hover:text-white transition-colors"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
