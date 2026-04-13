'use client'

import { useState, useEffect } from 'react'
import { X, Download, Share } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showAndroid, setShowAndroid] = useState(false)
  const [showIOS, setShowIOS] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (sessionStorage.getItem('pwa-dismissed')) return

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isIOS && !isInStandaloneMode && isSafari) {
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

  async function installAndroid() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const result = await deferredPrompt.userChoice
    if (result.outcome === 'accepted') {
      setShowAndroid(false)
      setDeferredPrompt(null)
    }
  }

  if (dismissed || (!showAndroid && !showIOS)) return null

  if (showAndroid) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto bg-navy text-white rounded-xl shadow-2xl p-4 animate-fade-in">
        <button onClick={dismiss} className="absolute top-3 right-3 text-text-muted hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold text-sm mb-0.5">Install SafeReach NG</p>
            <p className="text-text-muted text-xs mb-3 leading-relaxed">
              Add to your home screen for instant access to emergency contacts — even offline.
            </p>
            <button
              onClick={installAndroid}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-accent-dark transition-colors"
            >
              Install App
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto bg-navy text-white rounded-xl shadow-2xl p-4 animate-fade-in">
        <button onClick={dismiss} className="absolute top-3 right-3 text-text-muted hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <Share className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-bold text-sm mb-0.5">Install SafeReach NG</p>
            <p className="text-text-muted text-xs leading-relaxed">
              Tap the{' '}
              <span className="inline-flex items-center gap-0.5 bg-white/10 px-1.5 py-0.5 rounded text-white font-medium">
                <Share className="w-3 h-3" /> Share
              </span>{' '}
              button at the bottom of Safari, then tap{' '}
              <strong className="text-white">"Add to Home Screen"</strong>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
