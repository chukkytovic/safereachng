'use client'

import { useState, useEffect } from 'react'
import { UserPlus, BookmarkCheck, Phone, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FORCE_LABELS } from '@/lib/contact-types'
import type { ForceType } from '@/lib/contact-types'
import {
  getSavedContacts,
  addSavedContact,
  deleteSavedContact,
} from '@/lib/saved-contacts'
import type { SavedContact } from '@/lib/saved-contacts'
import SavedContactCard from '@/components/contacts/SavedContactCard'

const FORCE_OPTIONS = Object.entries(FORCE_LABELS) as [ForceType, string][]

const EMPTY_FORM = { name: '', type: 'police' as ForceType | 'other', number: '', notes: '' }

export default function MyContactsPage() {
  const [contacts, setContacts] = useState<SavedContact[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setContacts(getSavedContacts())
    setMounted(true)
  }, [])

  function handleAdd() {
    setError(null)

    if (!form.name.trim()) { setError('Enter a name for this contact.'); return }

    const cleanNumber = form.number.replace(/\D/g, '')
    if (cleanNumber.length < 7) { setError('Enter a valid phone number.'); return }

    const saved = addSavedContact({
      name: form.name.trim(),
      type: form.type,
      number: form.number.trim(),
      notes: form.notes.trim() || undefined,
    })

    setContacts((prev) => [...prev, saved])
    setForm(EMPTY_FORM)
    setShowForm(false)
  }

  function handleDelete(id: string) {
    deleteSavedContact(id)
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  if (!mounted) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-navy text-white rounded-lg px-6 py-5 mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookmarkCheck className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold uppercase tracking-widest text-text-muted">
            Personal
          </span>
        </div>
        <h1 className="font-bold text-2xl text-white mb-1">My Contacts</h1>
        <p className="text-text-muted text-sm">
          Save contacts for officers or units you know personally. Stored on this device only.
        </p>
      </div>

      <div className="bg-white border border-border rounded-lg p-4 mb-6 shadow-card">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-accent shrink-0 mt-0.5" />
          <p className="text-text-secondary text-sm leading-relaxed">
            These contacts are saved on your phone and never sent to any server.
            Use them to quickly reach a specific officer or unit you have a direct line to.
          </p>
        </div>
      </div>

      <button
        onClick={() => { setShowForm((v) => !v); setError(null) }}
        className={cn(
          'w-full flex items-center justify-between px-4 py-3.5 rounded-lg border font-semibold text-sm transition-colors mb-6',
          showForm
            ? 'border-accent bg-accent/5 text-accent'
            : 'border-border bg-white text-text-primary hover:border-accent hover:text-accent'
        )}
      >
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Add a Contact
        </div>
        {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showForm && (
        <div className="bg-white border border-border rounded-lg p-5 mb-6 shadow-card space-y-4">
          <div>
            <label className="block text-text-secondary text-sm font-semibold mb-1.5">
              Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Insp. Adeyemi, Benue Sector Command"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-semibold mb-1.5">
              Force <span className="text-danger">*</span>
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as ForceType | 'other' })}
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text-primary focus:border-accent focus:outline-none text-sm appearance-none"
            >
              {FORCE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-semibold mb-1.5">
              Phone Number <span className="text-danger">*</span>
            </label>
            <input
              type="tel"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
              placeholder="e.g. 08012345678"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm font-mono"
            />
          </div>

          <div>
            <label className="block text-text-secondary text-sm font-semibold mb-1.5">
              Notes <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="e.g. Lagos Island division, available after hours"
              className="w-full px-4 py-3 rounded-lg bg-surface border border-border text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none text-sm"
            />
          </div>

          {error && (
            <p className="text-danger text-sm px-3 py-2 rounded bg-danger-light border border-danger-border">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleAdd}
              className="flex-1 py-3 rounded-lg bg-accent text-white font-bold text-sm hover:bg-accent-dark transition-colors active:scale-[0.98]"
            >
              Save Contact
            </button>
            <button
              onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setError(null) }}
              className="px-5 py-3 rounded-lg border border-border text-text-secondary text-sm font-medium hover:border-border-dark hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-14 h-14 rounded-full bg-surface-dark flex items-center justify-center mx-auto mb-4">
            <BookmarkCheck className="w-6 h-6 text-text-muted" />
          </div>
          <p className="font-semibold text-text-primary mb-1">No saved contacts yet</p>
          <p className="text-text-muted text-sm">
            Add a contact above to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
            {contacts.length} {contacts.length === 1 ? 'Contact' : 'Contacts'}
          </p>
          {contacts.map((contact) => (
            <SavedContactCard
              key={contact.id}
              contact={contact}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
