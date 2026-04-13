import { Phone, Info, Twitter, AlertCircle, Mail } from 'lucide-react'
import Image from 'next/image'
import type { Force } from '@/lib/contacts'
import { FORCE_LABELS, FORCE_COLORS } from '@/lib/contacts'
import { formatPhoneForDisplay } from '@/lib/utils'
import { cn } from '@/lib/utils'

function ForceImage({ type }: { type: string }) {
  const images: Record<string, string> = {
    police: '/police-logo.jpg',
    army: '/army-logo.png',
    nscdc: '/nscdc-logo.png',
  }
  if (!images[type]) return null
  return (
    <div className="w-10 h-10 rounded border border-border bg-surface-dark flex items-center justify-center overflow-hidden shrink-0">
      <Image
        src={images[type]}
        alt={FORCE_LABELS[type as keyof typeof FORCE_LABELS] ?? type}
        width={40}
        height={40}
        className="object-contain w-9 h-9"
      />
    </div>
  )
}

export default function ContactCard({ force }: { force: Force }) {
  const hasNumbers = force.numbers.length > 0
  const hasX = force.x_handle && force.x_url
  const hasTrulyFreeNumber = force.numbers.some((n) => n === '112' || n === '767' || n === '193' || n === '199')

  return (
    <div className={cn(
      'rounded-lg border bg-white shadow-card transition-all',
      hasTrulyFreeNumber ? 'border-accent' : 'border-border'
    )}>
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <ForceImage type={force.type} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded border', FORCE_COLORS[force.type])}>
                {FORCE_LABELS[force.type]}
              </span>
              {hasTrulyFreeNumber && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded border border-accent/50 bg-accent/10 text-accent">
                  Free Line
                </span>
              )}
              {force.is_national && (
                <span className="text-xs px-2 py-0.5 rounded border border-border text-text-muted">
                  National
                </span>
              )}
              {!force.verified && (
                <span className="text-xs px-2 py-0.5 rounded border border-amber/30 bg-amber-light text-amber flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" />
                  Unverified
                </span>
              )}
            </div>
            <h3 className="font-semibold text-text-primary text-sm leading-snug">{force.name}</h3>
            {force.division && (
              <p className="text-text-muted text-xs mt-0.5">{force.division}</p>
            )}
          </div>
        </div>

        {hasNumbers ? (
          <div className="space-y-2">
            {force.numbers.map((number) => {
              const isFree = number === '112' || number === '767' || number === '193' || number === '199'
              return (
                <a
                  key={number}
                  href={`tel:${number}`}
                  className={cn(
                    'flex items-center justify-between w-full px-4 py-3 rounded border font-mono font-semibold text-base transition-all active:scale-[0.98]',
                    isFree
                      ? 'border-accent bg-accent text-white hover:bg-accent-dark'
                      : 'border-border bg-surface hover:border-accent hover:bg-accent/5 text-text-primary'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{formatPhoneForDisplay(number)}</span>
                  </div>
                  <span className="text-xs font-sans opacity-70">
                    {isFree ? 'Free · Call' : 'Tap to call'}
                  </span>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded bg-surface border border-border text-text-muted text-sm">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>No public number — contact via X or call 112</span>
          </div>
        )}

        {(hasX || force.email) && (
          <div className="mt-2 space-y-1.5">
            {hasX && (
              <a
                href={force.x_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-3 py-2 rounded border border-border bg-surface hover:border-[#1DA1F2] transition-colors group text-sm"
              >
                <Twitter className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                <span className="text-text-secondary group-hover:text-text-primary transition-colors text-xs">{force.x_handle}</span>
                <span className="ml-auto text-text-muted text-xs">DM →</span>
              </a>
            )}
            {force.email && (
              <a
                href={`mailto:${force.email}`}
                className="flex items-center gap-2 w-full px-3 py-2 rounded border border-border bg-surface hover:border-accent transition-colors group text-sm"
              >
                <Mail className="w-4 h-4 text-text-muted shrink-0" />
                <span className="text-text-muted text-xs truncate">{force.email}</span>
                <span className="ml-auto text-text-muted text-xs opacity-60 shrink-0">May not be monitored</span>
              </a>
            )}
          </div>
        )}

        {force.notes && (
          <p className="mt-3 text-text-muted text-xs leading-relaxed border-t border-border pt-3">
            {force.notes}
          </p>
        )}
      </div>
    </div>
  )
}
