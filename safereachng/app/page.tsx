'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, ChevronRight, Phone, AlertTriangle, Search } from 'lucide-react'
import { STATES } from '@/lib/utils'
import { requestLocation, detectStateFromCoords } from '@/lib/geo'
import { cn } from '@/lib/utils'

export default function HomePage() {
  const router = useRouter()
  const [detecting, setDetecting] = useState(false)
  const [detectedState, setDetectedState] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    autoDetect()
  }, [])

  async function autoDetect() {
    setDetecting(true)
    try {
      const loc = await requestLocation()
      if (loc) {
        const slug = detectStateFromCoords(loc.lat, loc.lng)
        if (slug) setDetectedState(slug)
      }
    } finally {
      setDetecting(false)
    }
  }

  const filtered = STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const detectedStateName = STATES.find((s) => s.slug === detectedState)?.name

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-navy text-white rounded-lg p-6 sm:p-10 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Nigeria Civic Safety Platform
          </span>
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl text-white leading-tight mb-2">
          Reach Security Forces Fast.
        </h1>
        <p className="text-accent font-semibold text-lg sm:text-xl mb-4">
          See Something, Say Something.
        </p>
        <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl">
          Direct, verified contact lines for Police, Army, and NSCDC across all 36 states and FCT.
          One tap. No searching. No wasted time.
        </p>
      </div>

      <div className="bg-white border border-accent rounded-lg p-4 mb-8 flex items-start gap-3">
        <div className="w-10 h-10 rounded bg-accent/10 flex items-center justify-center shrink-0">
          <Phone className="w-5 h-5 text-accent" />
        </div>
        <div>
          <p className="font-semibold text-text-primary text-sm">
            No airtime? Dial <a href="tel:112" className="text-accent font-bold text-base hover:underline">112</a>
          </p>
          <p className="text-text-secondary text-sm mt-0.5 leading-relaxed">
            Works free on MTN, Airtel, Glo, 9mobile — even without a SIM card.
            This is the most reliable emergency line in Nigeria.
            Army toll-free:{' '}
            <a href="tel:193" className="text-accent font-semibold hover:underline">193</a>.
            NSCDC direct:{' '}
            <a href="tel:09029164164" className="text-accent font-semibold hover:underline">09029164164</a>.
          </p>
        </div>
      </div>

      {detectedState && detectedStateName && (
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-2 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            {detecting ? 'Detecting your location...' : 'Your detected location'}
          </p>
          <button
            onClick={() => router.push(`/${detectedState}`)}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <div className="text-left">
                <p className="font-bold text-text-primary">{detectedStateName} State</p>
                <p className="text-text-secondary text-sm">View emergency contacts</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold">
            Select Your State
          </p>
          {detecting && !detectedState && (
            <span className="text-text-muted text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber inline-block animate-pulse" />
              Detecting...
            </span>
          )}
        </div>

        <div className="relative mb-3">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search state..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {filtered.map((state) => (
            <button
              key={state.slug}
              onClick={() => router.push(`/${state.slug}`)}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-medium transition-all group text-left',
                state.slug === detectedState
                  ? 'border-accent bg-accent/5 text-text-primary'
                  : 'border-border bg-white text-text-secondary hover:border-accent hover:text-text-primary'
              )}
            >
              <span>{state.name}</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-text-muted py-8 text-sm">No state found</p>
        )}
      </div>

      <div className="bg-danger-light border border-danger-border rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-danger text-sm mb-1">Witnessed an attack or threat?</p>
            <p className="text-text-secondary text-sm mb-3">
              Alert security forces directly. Your report is sent via Email, SMS, and WhatsApp to the relevant command.
            </p>
            <a
              href="/report"
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-danger text-white text-sm font-semibold hover:bg-red-800 transition-colors"
            >
              Report Now
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
