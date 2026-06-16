import { NextRequest, NextResponse } from 'next/server'
import { getStateContacts } from '@/lib/contacts'
import { STATES } from '@/lib/utils'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ state: string }> }
) {
  const { state } = await params
  const contacts = getStateContacts(state)
  if (!contacts) return NextResponse.json({ error: 'State not found' }, { status: 404 })

  const stateName = STATES.find((s) => s.slug === state)?.name ?? state

  const forces = contacts.forces
    .filter((f) => !f.is_national && f.numbers.some((n) => n.replace(/\D/g, '').length >= 7))
    .map((f) => ({
      name: f.name,
      type: f.type,
      numbers: f.numbers.filter((n) => n.replace(/\D/g, '').length >= 7),
      x_handle: f.x_handle ?? null,
      x_url: f.x_url ?? null,
    }))

  return NextResponse.json({ state, stateName, forces })
}