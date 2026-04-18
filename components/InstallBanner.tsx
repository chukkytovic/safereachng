'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, Download, Share, Plus } from 'lucide-react'

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
      setTimeout(() => setShowIOS(true), 2000)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShowAndroid(true), 2000)
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

  if (showIOS) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 px-4 pb-6">
        <div className="w-full max-w-sm bg-navy rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-dark flex items-center justify-center shrink-0">
                  <Image src="/logo.png" alt="SafeReach NG" width={48} height={48} className="object-contain" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Install SafeReach NG</p>
                  <p className="text-text-muted text-xs mt-0.5">3 steps to add to your home screen</p>
                </div>
              </div>
              <button onClick={dismiss} className="text-text-muted hover:text-white p-1 shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-3 bg-navy-light rounded-xl p-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold mb-0.5">
                    Tap the <Share className="w-3 h-3 inline-block mx-1 text-accent" /> icon in Safari
                  </p>
                  <p className="text-text-muted text-xs">
                    It is the box with an upward arrow at the <span className="text-white font-semibold">bottom centre</span> of your Safari browser — not this banner
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-navy-light rounded-xl p-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold mb-0.5">
                    Tap <Plus className="w-3 h-3 inline-block mx-1 text-accent" /> Add to Home Screen
                  </p>
                  <p className="text-text-muted text-xs">Scroll down in the menu that appears until you see this option</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-navy-light rounded-xl p-3">
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-accent text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="text-white text-xs font-semibold mb-0.5">Tap Add in the top right</p>
                  <p className="text-text-muted text-xs">SafeReach NG will appear on your home screen like a normal app</p>
                </div>
              </div>
            </div>

            <button
              onClick={dismiss}
              className="w-full py-3 rounded-xl bg-accent text-white text-sm font-bold hover:bg-accent-dark transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-navy-light shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-surface-dark flex items-center justify-center">
            <Image src="/logo.png" alt="SafeReach NG" width={48} height={48} className="object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-sm leading-tight">Install SafeReach NG</p>
            <p className="text-text-muted text-xs mt-0.5">Add to home screen for quick access</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-accent text-accent text-sm font-bold hover:bg-accent hover:text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={dismiss}
              className="px-4 py-2 rounded-lg bg-navy-light text-text-muted text-sm font-medium hover:text-white transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}