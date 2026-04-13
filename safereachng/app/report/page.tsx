'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, MapPin, CheckCircle, Loader2, ArrowLeft, MessageCircle, Mail, Smartphone } from 'lucide-react'
import { STATES } from '@/lib/utils'
import { requestLocation } from '@/lib/geo'

interface WhatsAppLink { forceName: string; number: string; url: string }

interface SubmitResult {
  summary: { forcesAlerted: number; emailsSent: number; smsSent: number; whatsappLinksGenerated: number }
  whatsappLinks: WhatsAppLink[]
  isStubState: boolean
}

const MAX_CHARS = 2000

export default function ReportPage() {
  const [form, setForm] = useState({ state: '', lga: '', description: '' })
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleGetLocation() {
    setLocating(true)
    try {
      const loc = await requestLocation()
      if (loc) setLocation({ lat: loc.lat, lng: loc.lng })
      else setError('Could not get location. Please enable location permissions and try again.')
    } finally {
      setLocating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.state || !form.lga || !form.description) { setError('Please fill in all fields.'); return }
    if (form.description.length < 20) { setError('Please describe the incident in more detail — at least 20 characters.'); return }

    setSubmitting(true)
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: form.state, lga: form.lga, description: form.description, lat: location?.lat ?? null, lng: location?.lng ?? null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/10 border-2 border-accent flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-bold text-2xl text-text-primary mb-2">Report Sent</h2>
          <p className="text-text-secondary text-sm max-w-sm">
            Your incident report has been dispatched to security forces in{' '}
            {STATES.find((s) => s.slug === form.state)?.name}.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: Mail, label: 'Email sent', value: result.summary.emailsSent },
            { icon: Smartphone, label: 'SMS sent', value: result.summary.smsSent },
            { icon: MessageCircle, label: 'WhatsApp ready', value: result.summary.whatsappLinksGenerated },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="p-4 rounded-lg border border-border bg-white text-center shadow-card">
              <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="font-bold text-2xl text-text-primary">{value}</p>
              <p className="text-text-muted text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {result.whatsappLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-text-primary mb-1 text-sm">Also send via WhatsApp</h3>
            <p className="text-text-secondary text-sm mb-4">
              Tap each button to open WhatsApp with your report pre-typed. Hit send to deliver directly.
            </p>
            <div className="space-y-2">
              {result.whatsappLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3.5 rounded-lg border border-[#25D366]/40 bg-[#25D366]/5 hover:bg-[#25D366]/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                    <div className="text-left">
                      <p className="text-text-primary text-sm font-medium leading-snug">{link.forceName}</p>
                      <p className="text-text-muted text-xs">{link.number}</p>
                    </div>
                  </div>
                  <span className="text-[#25D366] text-xs font-semibold shrink-0 ml-3">Send →</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {result.isStubState && (
          <div className="mb-6 p-4 rounded-lg border border-amber/30 bg-amber-light text-sm">
            <p className="font-semibold text-amber mb-1">No direct contacts on file for this state yet.</p>
            <p className="text-text-secondary">
              Call <a href="tel:112" className="text-accent font-bold">112</a> — works without airtime on all networks.
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Link href="/" className="flex-1 py-3 rounded-lg border border-border text-text-secondary text-sm font-medium text-center hover:border-border-dark hover:text-text-primary transition-colors">
            Back to Home
          </Link>
          <button
            onClick={() => { setResult(null); setForm({ state: '', lga: '', description: '' }); setLocation(null); setError(null) }}
            className="flex-1 py-3 rounded-lg bg-surface border border-border text-text-secondary text-sm font-medium hover:border-border-dark hover:text-text-primary transition-colors"
          >
            Submit Another
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
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-4 h-4 text-danger" />
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Community Alert</span>
        </div>
        <h1 className="font-bold text-2xl text-white mb-1">Report an Incident</h1>
        <p className="text-text-muted text-sm">
          Your report is sent directly to security forces via Email, SMS, and WhatsApp.
        </p>
      </div>

      <div className="mb-6 p-4 rounded-lg border border-border bg-white shadow-card">
        <p className="text-text-secondary text-sm font-semibold mb-3">When you submit this form:</p>
        <div className="space-y-2.5">
          {[
            { icon: Mail, label: 'Full report emailed to official state police command' },
            { icon: Smartphone, label: 'SMS summary sent to control room number' },
            { icon: MessageCircle, label: 'WhatsApp links pre-typed — you tap Send' },
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
          Call <a href="tel:112" className="text-accent font-bold hover:underline">112</a> first — works without airtime on all networks.
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
            placeholder="Describe the incident — what happened, exact location, approximate time, number of attackers if known, direction they went, any details that help security forces respond..."
            rows={6}
            className="w-full px-4 py-3 rounded-lg bg-white border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm resize-none leading-relaxed"
            required
            minLength={20}
          />
          <div className="mt-1.5 flex items-center justify-between">
            <p className="text-text-muted text-xs">Full detail helps — email receives the complete report</p>
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
              <button type="button" onClick={() => setLocation(null)} className="ml-auto text-text-muted text-xs hover:text-text-secondary transition-colors">Remove</button>
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
            GPS helps forces respond faster. Only share if you are safe to do so — coordinates are not anonymous.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-danger-light border border-danger-border text-danger text-sm">{error}</div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-lg bg-danger text-white font-bold text-base hover:bg-red-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          {submitting
            ? <><Loader2 className="w-4 h-4 animate-spin" />Alerting security forces...</>
            : <><AlertTriangle className="w-4 h-4" />Send Alert to Security Forces</>
          }
        </button>

        <p className="text-center text-text-muted text-xs leading-relaxed">
          No name or account required. Your IP address is logged for abuse prevention only.
          False reports obstruct emergency response — only submit genuine incidents.
        </p>
      </form>
    </div>
  )
}
