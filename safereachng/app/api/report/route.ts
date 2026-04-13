import { NextRequest, NextResponse } from 'next/server'
import { getStateContacts, getAlertableForces } from '@/lib/contacts'
import { alertForce, type IncidentPayload, type AlertResult } from '@/lib/alerts'
import { STATES } from '@/lib/utils'

// Basic rate limiting — 3 reports per IP per hour
const rateLimit = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3
const RATE_WINDOW = 60 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many reports. Please wait before submitting again.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { state, lga, description, lat, lng } = body

    // Validate
    if (!state || typeof state !== 'string')
      return NextResponse.json({ error: 'State is required.' }, { status: 400 })
    if (!lga || typeof lga !== 'string' || lga.trim().length < 2)
      return NextResponse.json({ error: 'LGA is required.' }, { status: 400 })
    if (!description || typeof description !== 'string' || description.trim().length < 20)
      return NextResponse.json(
        { error: 'Description must be at least 20 characters.' },
        { status: 400 }
      )
    if (description.length > 2000)
      return NextResponse.json(
        { error: 'Description must be under 2000 characters.' },
        { status: 400 }
      )

    // Look up state contacts
    const contacts = getStateContacts(state)
    if (!contacts)
      return NextResponse.json({ error: 'Invalid state.' }, { status: 400 })

    const stateName = STATES.find((s) => s.slug === state)?.name ?? state

    const incident: IncidentPayload = {
      state,
      stateName,
      lga: lga.trim(),
      description: description.trim(),
      lat: typeof lat === 'number' ? lat : null,
      lng: typeof lng === 'number' ? lng : null,
      timestamp: new Date().toLocaleString('en-NG', {
        timeZone: 'Africa/Lagos',
        dateStyle: 'full',
        timeStyle: 'short',
      }),
    }

    // Get forces that can be alerted
    const alertableForces = getAlertableForces(contacts)

    // Fire Email + SMS to all forces simultaneously
    const alertResults: AlertResult[] = await Promise.all(
      alertableForces.map((force) => alertForce(force, incident))
    )

    // Collect WhatsApp links to return to client (user taps to send)
    const whatsappLinks = alertResults.flatMap((r) =>
      (r.whatsapp?.links ?? []).map((l) => ({
        forceName: r.forceName,
        number: l.number,
        url: l.url,
      }))
    )

    const emailsSent = alertResults.filter((r) => r.email?.sent).length
    const smsSent = alertResults.filter((r) => r.sms?.sent).length

    return NextResponse.json({
      success: true,
      summary: {
        forcesAlerted: alertableForces.length,
        emailsSent,
        smsSent,
        whatsappLinksGenerated: whatsappLinks.length,
      },
      whatsappLinks,
      isStubState: alertableForces.length === 0,
    })
  } catch (err) {
    console.error('Report API error:', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
