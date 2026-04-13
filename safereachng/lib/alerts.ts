import { type Force, toInternational } from './contacts'

export interface IncidentPayload {
  state: string
  stateName: string
  lga: string
  description: string
  lat: number | null
  lng: number | null
  timestamp: string
}

// ─── Message composers (each channel has its own limit) ──────────────────────

export function composeEmailMessage(incident: IncidentPayload, forceName: string): string {
  // Email: full description — no limit
  const mapsLink = incident.lat && incident.lng
    ? `\nGPS: ${incident.lat.toFixed(5)}, ${incident.lng.toFixed(5)}\nMap: https://maps.google.com/?q=${incident.lat},${incident.lng}`
    : ''

  return `
<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9">
  <div style="background:#0A0F0D;color:#F0F4F1;padding:20px;border-radius:12px;margin-bottom:20px">
    <h1 style="margin:0;color:#00C853;font-size:20px">🚨 SafeReach NG — Security Incident Alert</h1>
  </div>
  <div style="background:#fff;padding:24px;border-radius:12px;border:1px solid #e5e7eb">
    <p style="margin-top:0"><strong>To:</strong> ${forceName}</p>
    <p><strong>State:</strong> ${incident.stateName}</p>
    <p><strong>LGA:</strong> ${incident.lga}</p>
    <p><strong>Reported at:</strong> ${incident.timestamp}</p>
    ${incident.lat ? `<p><strong>Location:</strong> <a href="https://maps.google.com/?q=${incident.lat},${incident.lng}" style="color:#00C853">View on Google Maps</a> (${incident.lat.toFixed(5)}, ${incident.lng!.toFixed(5)})</p>` : ''}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
    <h3 style="color:#dc2626;margin-top:0">Incident Report</h3>
    <p style="line-height:1.6;white-space:pre-wrap">${incident.description}</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
    <p style="color:#6b7280;font-size:13px;margin-bottom:0">
      Submitted anonymously via <strong>SafeReach NG</strong> civic safety platform.
    </p>
  </div>
</body></html>`
}

export function composeSMSMessage(incident: IncidentPayload): string {
  // SMS: hard 160-char limit per segment — keep to ~150 to be safe
  const desc = incident.description.slice(0, 80) + (incident.description.length > 80 ? '...' : '')
  const gps = incident.lat ? ` GPS:${incident.lat.toFixed(3)},${incident.lng!.toFixed(3)}` : ''
  return `ALERT|${incident.stateName},${incident.lga}|${desc}${gps}|SafeReachNG`
}

export function composeWhatsAppMessage(incident: IncidentPayload): string {
  // WhatsApp via wa.me link: keep under ~500 chars to avoid URL truncation
  const desc = incident.description.slice(0, 400) + (incident.description.length > 400 ? '...' : '')
  const gps = incident.lat
    ? `\n📍 GPS: ${incident.lat.toFixed(5)}, ${incident.lng!.toFixed(5)}\n🗺 https://maps.google.com/?q=${incident.lat},${incident.lng}`
    : ''

  return `🚨 *SECURITY ALERT — SafeReach NG*\n\n*State:* ${incident.stateName}\n*LGA:* ${incident.lga}\n*Time:* ${incident.timestamp}${gps}\n\n*Report:*\n${desc}\n\n_Sent via SafeReach NG_`
}

// ─── Sending functions ────────────────────────────────────────────────────────

export async function sendEmail(to: string, forceName: string, incident: IncidentPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { ok: false, error: 'RESEND_API_KEY not configured' }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'SafeReach NG <alerts@safereachng.com>',
        to: [to],
        subject: `🚨 Security Incident — ${incident.stateName}, ${incident.lga}`,
        html: composeEmailMessage(incident, forceName),
      }),
    })
    return res.ok ? { ok: true } : { ok: false, error: await res.text() }
  } catch (e) { return { ok: false, error: String(e) } }
}

export async function sendSMS(number: string, incident: IncidentPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.TERMII_API_KEY
  if (!apiKey) return { ok: false, error: 'TERMII_API_KEY not configured' }

  try {
    const res = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: toInternational(number),
        from: 'SafeReach',
        sms: composeSMSMessage(incident),
        type: 'plain',
        channel: 'generic',
        api_key: apiKey,
      }),
    })
    return res.ok ? { ok: true } : { ok: false, error: await res.text() }
  } catch (e) { return { ok: false, error: String(e) } }
}

export function buildWhatsAppLink(number: string, incident: IncidentPayload): string {
  return `https://wa.me/${toInternational(number)}?text=${encodeURIComponent(composeWhatsAppMessage(incident))}`
}

// ─── Alert result types ───────────────────────────────────────────────────────

export interface AlertResult {
  forceName: string
  email?: { sent: boolean; error?: string }
  sms?: { sent: boolean; numbers: string[] }
  whatsapp?: { links: Array<{ number: string; url: string }> }
}

export async function alertForce(force: Force, incident: IncidentPayload): Promise<AlertResult> {
  const result: AlertResult = { forceName: force.name }

  if (force.email) {
    const r = await sendEmail(force.email, force.name, incident)
    result.email = { sent: r.ok, error: r.error }
  }

  const dialable = force.numbers.filter((n) => n.replace(/\D/g, '').length >= 7)
  if (dialable.length > 0) {
    const results = await Promise.allSettled(dialable.map((n) => sendSMS(n, incident)))
    result.sms = { sent: results.some((r) => r.status === 'fulfilled' && r.value.ok), numbers: dialable }
  }

  if (dialable.length > 0) {
    result.whatsapp = { links: dialable.map((n) => ({ number: n, url: buildWhatsAppLink(n, incident) })) }
  }

  return result
}
