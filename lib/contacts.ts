import fs from 'fs'
import path from 'path'

export type { ForceType, Force, StateContacts } from './contact-types'

import type { StateContacts } from './contact-types'

const contactsDir = path.join(process.cwd(), 'data', 'contacts')

export function getStateContacts(slug: string): StateContacts | null {
  try {
    const filePath = path.join(contactsDir, `${slug}.json`)
    if (!fs.existsSync(filePath)) return null
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as StateContacts
  } catch { return null }
}

export function isStubState(contacts: StateContacts): boolean {
  return contacts._stub === true
}
