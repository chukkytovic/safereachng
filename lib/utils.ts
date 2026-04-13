import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatPhoneForDisplay(number: string): string {
  // Convert 0801234567 -> 080 123 4567
  if (number.length === 3 || number.length <= 4) return number // short codes like 112, 199
  const clean = number.replace(/\D/g, '')
  if (clean.length === 11) {
    return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`
  }
  return number
}

export const STATES = [
  { name: 'Abia', slug: 'abia' },
  { name: 'Adamawa', slug: 'adamawa' },
  { name: 'Akwa Ibom', slug: 'akwa-ibom' },
  { name: 'Anambra', slug: 'anambra' },
  { name: 'Bauchi', slug: 'bauchi' },
  { name: 'Bayelsa', slug: 'bayelsa' },
  { name: 'Benue', slug: 'benue' },
  { name: 'Borno', slug: 'borno' },
  { name: 'Cross River', slug: 'cross-river' },
  { name: 'Delta', slug: 'delta' },
  { name: 'Ebonyi', slug: 'ebonyi' },
  { name: 'Edo', slug: 'edo' },
  { name: 'Ekiti', slug: 'ekiti' },
  { name: 'Enugu', slug: 'enugu' },
  { name: 'FCT (Abuja)', slug: 'fct' },
  { name: 'Gombe', slug: 'gombe' },
  { name: 'Imo', slug: 'imo' },
  { name: 'Jigawa', slug: 'jigawa' },
  { name: 'Kaduna', slug: 'kaduna' },
  { name: 'Kano', slug: 'kano' },
  { name: 'Katsina', slug: 'katsina' },
  { name: 'Kebbi', slug: 'kebbi' },
  { name: 'Kogi', slug: 'kogi' },
  { name: 'Kwara', slug: 'kwara' },
  { name: 'Lagos', slug: 'lagos' },
  { name: 'Nasarawa', slug: 'nasarawa' },
  { name: 'Niger', slug: 'niger' },
  { name: 'Ogun', slug: 'ogun' },
  { name: 'Ondo', slug: 'ondo' },
  { name: 'Osun', slug: 'osun' },
  { name: 'Oyo', slug: 'oyo' },
  { name: 'Plateau', slug: 'plateau' },
  { name: 'Rivers', slug: 'rivers' },
  { name: 'Sokoto', slug: 'sokoto' },
  { name: 'Taraba', slug: 'taraba' },
  { name: 'Yobe', slug: 'yobe' },
  { name: 'Zamfara', slug: 'zamfara' },
] as const


