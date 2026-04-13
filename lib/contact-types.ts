export type ForceType =
  | 'police' | 'army' | 'nscdc' | 'airforce'
  | 'navy' | 'dss' | 'amotekun' | 'vigilante' | 'other'

export interface Force {
  name: string
  type: ForceType
  division?: string
  numbers: string[]
  x_handle?: string
  x_url?: string
  is_free: boolean
  is_national: boolean
  source: string
  verified: boolean
  last_updated: string
  notes?: string
}

export interface StateContacts {
  state: string
  slug: string
  last_reviewed: string
  priority?: string
  _stub?: boolean
  forces: Force[]
}

export function toInternational(number: string): string {
  const clean = number.replace(/\D/g, '')
  if (clean.startsWith('0') && clean.length === 11) return `234${clean.slice(1)}`
  if (clean.startsWith('234')) return clean
  return clean
}

export const FORCE_LABELS: Record<ForceType, string> = {
  police: 'Police', army: 'Army', nscdc: 'NSCDC', airforce: 'Air Force',
  navy: 'Navy', dss: 'DSS', amotekun: 'Amotekun', vigilante: 'Vigilante', other: 'Other',
}

export const FORCE_COLORS: Record<ForceType, string> = {
  police:   'text-blue-800 bg-blue-50 border-blue-200',
  army:     'text-green-800 bg-green-50 border-green-200',
  nscdc:    'text-orange-800 bg-orange-50 border-orange-200',
  airforce: 'text-sky-800 bg-sky-50 border-sky-200',
  navy:     'text-indigo-800 bg-indigo-50 border-indigo-200',
  dss:      'text-purple-800 bg-purple-50 border-purple-200',
  amotekun: 'text-amber-800 bg-amber-50 border-amber-200',
  vigilante:'text-yellow-800 bg-yellow-50 border-yellow-200',
  other:    'text-slate-700 bg-slate-50 border-slate-200',
}
