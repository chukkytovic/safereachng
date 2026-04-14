import type { ForceType } from './contact-types'

export interface SavedContact {
  id: string
  name: string
  type: ForceType | 'other'
  number: string
  notes?: string
  addedAt: string
}

const STORAGE_KEY = 'safereachng:saved-contacts'

export function getSavedContacts(): SavedContact[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as SavedContact[]
  } catch { return [] }
}

export function addSavedContact(
  contact: Omit<SavedContact, 'id' | 'addedAt'>
): SavedContact {
  const existing = getSavedContacts()
  const newContact: SavedContact = {
    ...contact,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newContact]))
  return newContact
}

export function deleteSavedContact(id: string): void {
  const remaining = getSavedContacts().filter((c) => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining))
}
