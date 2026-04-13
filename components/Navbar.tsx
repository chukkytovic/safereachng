'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { AlertTriangle, BookmarkCheck, Radio, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy border-b border-navy-light">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="SafeReach NG" width={36} height={36} className="object-contain mix-blend-screen" />
          <div>
            <span className="font-bold text-base text-white tracking-tight block leading-tight">
              SafeReach <span className="text-accent">NG</span>
            </span>
            <span className="text-[10px] text-text-muted uppercase tracking-widest block leading-tight">
              Emergency Contacts
            </span>
          </div>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          <Link href="/feed" className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            pathname === '/feed' ? 'text-accent' : 'text-text-muted hover:text-white'
          )}>
            <Radio className="w-4 h-4" />
            Alerts
          </Link>
          <Link href="/my-contacts" className={cn(
            'flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors',
            pathname === '/my-contacts' ? 'text-accent' : 'text-text-muted hover:text-white'
          )}>
            <BookmarkCheck className="w-4 h-4" />
            My Contacts
          </Link>
          <Link href="/report" className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded text-sm font-medium transition-colors',
            pathname === '/report'
              ? 'bg-danger text-white'
              : 'bg-danger/20 text-danger hover:bg-danger hover:text-white'
          )}>
            <AlertTriangle className="w-4 h-4" />
            Report Incident
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="sm:hidden text-text-muted hover:text-white transition-colors p-2"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden bg-navy border-t border-navy-light px-4 py-3 space-y-1">
          <Link
            href="/feed"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded transition-colors',
              pathname === '/feed' ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-white'
            )}
          >
            <Radio className="w-4 h-4" />
            Community Alerts
          </Link>
          <Link
            href="/my-contacts"
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded transition-colors',
              pathname === '/my-contacts' ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-white'
            )}
          >
            <BookmarkCheck className="w-4 h-4" />
            My Contacts
          </Link>
          <Link
            href="/report"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded bg-danger/20 text-danger hover:bg-danger hover:text-white transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            Report an Incident
          </Link>
        </div>
      )}
    </header>
  )
}
