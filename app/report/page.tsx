'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  AlertTriangle, MapPin, Loader2, ArrowLeft,
  MessageCircle, Smartphone, ChevronRight, Phone
} from 'lucide-react'
import { STATES } from '@/lib/utils'
import { requestLocation } from '@/lib/geo'
import { toInternational } from '@/lib/contact-types'
import type { Force } from '@/lib/contact-types'

interface AlertLinks {
  forceName: string
  type: string
  smsLinks: Array<{ number: string; url: string }>
  whatsappLinks: Array<{ number: string; url: string }>
  callLinks: Array<{ number: string; url: string }>
}

const MAX_CHARS = 2000

function buildSMSBody(stateName: string, lga: string, description: string, lat?: number, lng?: number) {
  const gps = lat ? ` | GPS:${lat.toFixed(4)},${lng!.toFixed(4)}` : ''
  const short = description.slice(0, 120) + (description.length > 120 ? '...' : '')
  return `SECURITY ALERT - SafeReachNG\nState: ${stateName} | LGA: ${lga}${gps}\n${short}`
}

function buildWhatsAppBody(stateName: string, lga: string, description: string, lat?: number, lng?: number) {
  const gps = lat ? `\nGPS: ${lat.toFixed(5)}, ${lng!.toFixed(5)}\nMap: https://maps.google.com/?q=${lat},${lng}` : ''
  return `*SECURITY ALERT — SafeReach NG*\n\n*State:* ${stateName}\n*LGA:* ${lga}${gps}\n\n*Report:*\n${description}`
}

export default function ReportPage() {
  const [form, setForm] = useState({ state: '', lga: '', description: '' })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alertLinks, setAlertLinks] = useState<AlertLinks[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGetLocation() {
    setLocating(true)
    try {
      const loc = await requestLocation()
      if (loc) setLocation({ lat: loc.lat, lng: loc.lng })
    } finally {
      setLocating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.state || !form.lga || !form.description) { setError('Please fill in all fields.'); return }
    if (form.description.length < 20) { setError('Describe the incident in more detail — at least 20 characters.'); return }

    setLoading(true)
    try {
      const res = await fetch(`/api/contacts/${form.state}`)
      const data = await res.json()
      if (!res.ok) throw new Error('Could not load contacts for this state.')

      const smsBody = buildSMSBody(data.stateName, form.lga, form.description, location?.lat, location?.lng)
      const waBody = buildWhatsAppBody(data.stateName, form.lga, form.description, location?.lat, location?.lng)

      const links: AlertLinks[] = (data.forces as Force[]).map((force) => ({
        forceName: force.name,
        type: force.type,
        callLinks: force.numbers.map((n) => ({ number: n, url: `tel:${n}` })),
        smsLinks: force.numbers.map((n) => ({
          number: n,
          url: `sms:${n}${/iphone|ipad|ipod/i.test(navigator.userAgent) ? '&' : '?'}body=${encodeURIComponent(smsBody)}`,
        })),
        whatsappLinks: force.numbers.map((n) => ({
          number: n,
          url: `https://wa.me/${toInternational(n)}?text=${encodeURIComponent(waBody)}`,
        })),
      }))

      setAlertLinks(links)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  if (alertLinks) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-navy text-white rounded-lg px-6 py-5 mb-6">
          <h2 className="font-bold text-xl text-white mb-1">Alert Ready to Send</h2>
          <p className="text-text-muted text-sm">
            Tap Call, SMS, or WhatsApp below to contact each force directly from your device.
          </p>
        </div>

        <div className="bg-amber-light border border-amber/30 rounded-lg p-4 mb-6">
          <p className="text-amber text-sm font-semibold mb-0.5">You must tap to send</p>
          <p className="text-text-secondary text-sm">
            Each button opens your phone&apos;s native app. Your device sends the message — not a server.
            This means it works even with limited data, and nothing is stored on our side.
          </p>
        </div>

        {alertLinks.length === 0 && (
          <div className="p-4 rounded-lg border border-amber/30 bg-amber-light mb-6">
            <p className="font-semibold text-amber text-sm mb-1">No direct contacts on file for this state yet.</p>
            <p className="text-text-secondary text-sm">
              Call <a href="tel:112" className="text-accent font-bold">112</a> — works without airtime on all networks.
            </p>
          </div>
        )}

        <div className="space-y-4 mb-8">
          {alertLinks.map((force, i) => (
            <div key={i} className="bg-white border border-border rounded-lg overflow-hidden shadow-card">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <p className="font-semibold text-text-primary text-sm">{force.forceName}</p>
              </div>
              <div className="p-4 space-y-3">
                {force.callLinks.map((link, j) => (
                  <div key={j} className="grid grid-cols-3 gap-2">
                    <a href={link.url}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-accent text-white font-semibold text-xs hover:bg-accent-dark transition-colors active:scale-95">
                      <Phone className="w-4 h-4" />
                      Call
                    </a>
                    <a href={force.smsLinks[j].url}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors active:scale-95">
                      <Smartphone className="w-4 h-4" />
                      SMS
                    </a>
                    <a href={force.whatsappLinks[j].url} target="_blank" rel="noopener noreferrer"
                      className="flex flex-col items-center gap-1.5 py-3 rounded-lg bg-[#25D366] text-white font-semibold text-xs hover:bg-[#128C7E] transition-colors active:scale-95">
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                ))}
                <p className="text-text-muted text-xs text-center font-mono">
                  {force.callLinks[0]?.number}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link href="/" className="flex-1 py-3 rounded-lg border border-border text-text-secondary text-sm font-medium text-center hover:border-border-dark hover:text-text-primary transition-colors">
            Back to Home
          </Link>
          <button
            onClick={() => { setAlertLinks(null); setForm({ state: '', lga: '', description: '' }); setLocation(null) }}
            className="flex-1 py-3 rounded-lg bg-surface border border-border text-text-secondary text-sm font-medium hover:border-border-dark hover:text-text-primary transition-colors"
          >
            New Report
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="bg-navy text-white rounded-lg px-6 py-5 mb-6">
        <h1 className="font-bold text-2xl text-white mb-1">Report an Incident</h1>
        <p className="text-text-muted text-sm">
          Fill in the details. Your phone will open SMS and WhatsApp to send directly to security forces — no app server involved.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-border bg-white shadow-card">
        <p className="text-text-secondary text-sm font-semibold mb-3">How it works:</p>
        <div className="space-y-2.5">
          {[
            { icon: Smartphone, label: 'Tap SMS — opens your default SMS app with the report pre-typed' },
            { icon: MessageCircle, label: 'Tap WhatsApp — opens WhatsApp with the report pre-typed' },
            { icon: Phone, label: 'Tap Call — dials the number directly from your phone' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <Icon className="w-4 h-4 shrink-0 text-accent" />
              <p className="text-text-secondary text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-danger-border bg-danger-light">
        <p className="text-sm text-text-secondary">
          <span className="text-danger font-semibold">Immediate danger? </span>
          Call <a href="tel:112" className="text-accent font-bold hover:underline">112</a> now — works without airtime on all networks.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-text-secondary text-sm font-semibold mb-2">
            State <span className="text-danger">*</span>
          </label>
          <select
            value={form.state}
            onChange={(e) => setForm({ ...form, state: e.target.value })}
            className="w-full px-4 py-3 rounded-lg bg-white border border-border text-text-primary focus:border-accent focus:outline-none text-sm appearance-none"
            required
          >
            <option value="">Select your state</option>
            {STATES.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-text-secondary text-sm font-semibold mb-2">
            Local Government Area <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={form.lga}
            onChange={(e) => setForm({ ...form, lga: e.target.value })}
            placeholder="e.g. Makurdi, Gboko, Katsina-Ala"
            className="w-full px-4 py-3 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-text-secondary text-sm font-semibold mb-2">
            Describe what happened <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, MAX_CHARS) })}
            placeholder="What happened, exact location, approximate time, number of attackers if known, which direction they went..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm resize-none leading-relaxed"
            required
            minLength={20}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-text-muted text-xs">More detail helps security forces respond accurately</p>
            <p className={`text-xs font-medium ${form.description.length > MAX_CHARS * 0.9 ? 'text-amber' : 'text-text-muted'}`}>
              {form.description.length} / {MAX_CHARS}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-text-secondary text-sm font-semibold mb-2">
            GPS Location <span className="text-text-muted font-normal">(optional)</span>
          </label>
          {location ? (
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/5 border border-accent/30">
              <MapPin className="w-4 h-4 text-accent shrink-0" />
              <div>
                <p className="text-accent text-sm font-medium">Location captured</p>
                <p className="text-text-muted text-xs">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
              </div>
              <button type="button" onClick={() => setLocation(null)} className="ml-auto text-text-muted text-xs hover:text-text-secondary">Remove</button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locating}
              className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-border bg-white text-text-secondary hover:border-border-dark hover:text-text-primary transition-colors text-sm disabled:opacity-60"
            >
              {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
              {locating ? 'Getting your location...' : 'Share my GPS location'}
            </button>
          )}
          <p className="mt-1.5 text-text-muted text-xs">
            Only share if you are safe to do so. Coordinates are sent as part of your SMS/WhatsApp message.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-danger-light border border-danger-border text-danger text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-lg bg-danger text-white font-bold text-base hover:bg-red-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" />Loading contacts...</>
            : <><ChevronRight className="w-4 h-4" />Get Alert Links</>
          }
        </button>

        <p className="text-center text-text-muted text-xs leading-relaxed">
          No name or account required. False reports obstruct emergency response — only submit genuine incidents.
        </p>
      </form>
    </div>
  )
}