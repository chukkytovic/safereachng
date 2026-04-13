import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, GitPullRequest, Phone } from 'lucide-react'
import { getStateContacts, isStubState } from '@/lib/contacts'
import { STATES } from '@/lib/utils'
import ContactCard from '@/components/contacts/ContactCard'
import type { Metadata } from 'next'

interface Props { params: { state: string } }

export async function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const contacts = getStateContacts(params.state)
  if (!contacts) return { title: 'Not Found' }
  return {
    title: `${contacts.state} Emergency Contacts — SafeReach NG`,
    description: `Police, Army, NSCDC emergency contacts for ${contacts.state}. One-tap calling.`,
  }
}

export default function StatePage({ params }: Props) {
  const contacts = getStateContacts(params.state)
  if (!contacts) notFound()

  const isStub = isStubState(contacts)
  const priority = (contacts as { priority?: string }).priority

  const freeForces = contacts.forces.filter((f) => f.is_national)
  const directForces = contacts.forces.filter((f) => !f.is_national)

  const priorityBanner = priority === 'critical' || priority === 'high'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-6 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        All States
      </Link>

      <div className="bg-navy text-white rounded-lg px-6 py-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">Emergency Contacts</span>
        </div>
        <h1 className="font-bold text-3xl text-white">{contacts.state}</h1>
        <p className="text-text-muted text-sm mt-1">Tap any number to call instantly</p>
      </div>

      {priorityBanner && (
        <div className="mb-6 p-4 rounded-lg border border-danger-border bg-danger-light flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-danger text-sm">High-Risk State</p>
            <p className="text-text-secondary text-sm mt-0.5">
              This state has documented active security incidents. Keep these numbers saved. Always try{' '}
              <a href="tel:112" className="text-accent font-bold hover:underline">112</a> first if lines are busy.
            </p>
          </div>
        </div>
      )}

      {isStub && (
        <div className="mb-6 p-4 rounded-lg border border-amber/30 bg-amber-light">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-text-primary text-sm mb-1">Direct numbers not yet verified</p>
              <p className="text-text-secondary text-sm mb-3">
                Use the national free lines below — they work anywhere in Nigeria.
              </p>
              <a href="https://github.com/yourusername/safereachng" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-text-primary transition-colors">
                <GitPullRequest className="w-3.5 h-3.5" />
                Contribute contacts for {contacts.state}
              </a>
            </div>
          </div>
        </div>
      )}

      {freeForces.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-accent inline-block"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              Free Emergency Lines — Works Without Airtime
            </h2>
          </div>
          <div className="space-y-3">
            {freeForces.map((force, i) => (
              <ContactCard key={i} force={force} />
            ))}
          </div>
        </section>
      )}

      {directForces.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-navy-light inline-block"></span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-secondary">
              {contacts.state} Direct Lines
            </h2>
          </div>
          <div className="space-y-3">
            {directForces.map((force, i) => (
              <ContactCard key={i} force={force} />
            ))}
          </div>
        </section>
      )}

      <div className="bg-danger-light border border-danger-border rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-danger shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-danger text-sm">Witnessed an incident?</p>
            <p className="text-text-secondary text-xs mt-0.5">Alert security forces directly</p>
          </div>
          <Link href="/report" className="px-4 py-2 rounded bg-danger text-white text-sm font-semibold hover:bg-red-800 transition-colors whitespace-nowrap">
            Report Now
          </Link>
        </div>
      </div>

      <p className="text-text-muted text-xs text-center leading-relaxed">
        Numbers sourced from <strong className="text-text-secondary">police.gov.ng</strong> (official NPF directory, 2025) and verified state police accounts.
        Last reviewed: {contacts.last_reviewed}.
        Always try <a href="tel:112" className="text-accent font-semibold hover:underline">112</a> first.
      </p>
    </div>
  )
}
