import Link from 'next/link'
import { Radio, AlertTriangle, Phone } from 'lucide-react'

export default function FeedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-navy text-white rounded-lg px-6 py-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Community</span>
        </div>
        <h1 className="font-bold text-2xl text-white mb-1">Community Alerts</h1>
        <p className="text-text-muted text-sm">
          Real-time alert feed is coming in V2. Use the Report page to send alerts directly to security forces.
        </p>
      </div>

      <div className="space-y-3 mb-10">
        <Link href="/report" className="flex items-center justify-between w-full p-5 rounded-lg border border-danger-border bg-danger-light hover:bg-red-50 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger" />
            </div>
            <div className="text-left">
              <p className="font-bold text-text-primary">Report an Incident</p>
              <p className="text-text-secondary text-sm">Send SMS and WhatsApp to security forces directly</p>
            </div>
          </div>
          <span className="text-danger text-sm font-semibold shrink-0 ml-3 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>

        <Link href="/" className="flex items-center justify-between w-full p-5 rounded-lg border border-border bg-white shadow-card hover:border-border-dark transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded bg-accent/10 flex items-center justify-center">
              <Phone className="w-5 h-5 text-accent" />
            </div>
            <div className="text-left">
              <p className="font-bold text-text-primary">Emergency Contacts</p>
              <p className="text-text-secondary text-sm">One-tap calls to security forces in your state</p>
            </div>
          </div>
          <span className="text-text-muted text-sm font-semibold shrink-0 ml-3 group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>

      <div className="p-4 rounded-lg border border-accent/30 bg-accent/5">
        <p className="text-sm text-text-secondary">
          <span className="text-accent font-semibold">No airtime? </span>
          Dial <a href="tel:112" className="text-accent font-bold hover:underline">112</a> — works free on all Nigerian networks.
          Army toll-free: <a href="tel:193" className="text-accent font-bold hover:underline">193</a>.
        </p>
      </div>
    </div>
  )
}
