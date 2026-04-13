'use client'

import { Phone, MessageSquare, Trash2, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPhoneForDisplay } from '@/lib/utils'
import { FORCE_LABELS, FORCE_COLORS, toInternational } from '@/lib/contact-types'
import type { SavedContact } from '@/lib/saved-contacts'

interface Props {
  contact: SavedContact
  onDelete: (id: string) => void
}

function buildSMSLink(number: string): string {
  const isIOS = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent)
  return `sms:${number}${isIOS ? '&' : '?'}body=`
}

function buildWhatsAppLink(number: string): string {
  return `https://wa.me/${toInternational(number)}`
}

export default function SavedContactCard({ contact, onDelete }: Props) {
  const labelKey = contact.type as keyof typeof FORCE_LABELS
  const colorKey = contact.type as keyof typeof FORCE_COLORS

  const label = FORCE_LABELS[labelKey] ?? 'Other'
  const color = FORCE_COLORS[colorKey] ?? 'text-slate-700 bg-slate-50 border-slate-200'

  return (
    <div className="rounded-lg border border-border bg-white shadow-card">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', color)}>
                {label}
              </span>
              <span className="text-xs px-2 py-0.5 rounded border border-border text-text-muted">
                Saved
              </span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm leading-snug">{contact.name}</h3>
            {contact.notes && (
              <p className="text-text-muted text-xs mt-0.5 leading-relaxed">{contact.notes}</p>
            )}
          </div>
          <button
            onClick={() => onDelete(contact.id)}
            className="p-1.5 rounded text-text-muted hover:text-danger hover:bg-danger-light transition-colors shrink-0"
            aria-label="Delete contact"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <a
          href={`tel:${contact.number}`}
          className="flex items-center justify-between w-full px-4 py-3.5 rounded border border-border bg-surface hover:border-accent hover:bg-accent/5 text-text-primary font-mono font-semibold text-base transition-all active:scale-[0.98] mb-2"
        >
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 shrink-0" />
            <span>{formatPhoneForDisplay(contact.number)}</span>
          </div>
          <span className="text-xs font-sans opacity-70">Tap to call</span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={buildSMSLink(contact.number)}
            className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-surface hover:border-blue-400 hover:bg-blue-50 text-text-secondary hover:text-blue-700 text-sm font-medium transition-colors active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            SMS
          </a>
          <a
            href={buildWhatsAppLink(contact.number)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 rounded border border-border bg-surface hover:border-[#25D366] hover:bg-green-50 text-text-secondary hover:text-[#128C7E] text-sm font-medium transition-colors active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
