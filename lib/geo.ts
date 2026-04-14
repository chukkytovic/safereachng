'use client'

export interface GeoLocation {
  lat: number
  lng: number
  accuracy: number
}

export type GeoError = 'denied' | 'unavailable' | 'timeout' | null

export async function requestLocation(
  highAccuracy = false
): Promise<{ location: GeoLocation | null; error: GeoError }> {
  if (!navigator.geolocation) return { location: null, error: 'unavailable' }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          },
          error: null,
        })
      },
      (err) => {
        if (err.code === 1) {
          resolve({ location: null, error: 'denied' })
        } else {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                location: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                },
                error: null,
              })
            },
            (err2) => {
              if (err2.code === 1) resolve({ location: null, error: 'denied' })
              else if (err2.code === 2) resolve({ location: null, error: 'unavailable' })
              else resolve({ location: null, error: 'timeout' })
            },
            { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 }
          )
        }
      },
      highAccuracy
        ? { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 }
        : { timeout: 5000, enableHighAccuracy: false, maximumAge: 60000 }
    )
  })
}

const STATE_BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
  lagos:         { minLat: 6.35,  maxLat: 6.70,  minLng: 2.68,  maxLng: 3.73  },
  ogun:          { minLat: 6.70,  maxLat: 7.80,  minLng: 2.68,  maxLng: 3.90  },
  oyo:           { minLat: 7.40,  maxLat: 9.00,  minLng: 2.70,  maxLng: 4.60  },
  osun:          { minLat: 7.20,  maxLat: 8.10,  minLng: 4.00,  maxLng: 5.00  },
  ekiti:         { minLat: 7.40,  maxLat: 8.10,  minLng: 4.70,  maxLng: 5.80  },
  ondo:          { minLat: 5.85,  maxLat: 7.80,  minLng: 4.50,  maxLng: 6.00  },
  edo:           { minLat: 5.60,  maxLat: 7.20,  minLng: 5.00,  maxLng: 6.70  },
  delta:         { minLat: 5.00,  maxLat: 6.60,  minLng: 5.00,  maxLng: 6.80  },
  anambra:       { minLat: 5.70,  maxLat: 6.70,  minLng: 6.50,  maxLng: 7.30  },
  imo:           { minLat: 5.10,  maxLat: 6.10,  minLng: 6.60,  maxLng: 7.40  },
  abia:          { minLat: 4.90,  maxLat: 6.00,  minLng: 7.10,  maxLng: 8.00  },
  rivers:        { minLat: 4.20,  maxLat: 5.60,  minLng: 6.40,  maxLng: 7.80  },
  bayelsa:       { minLat: 4.20,  maxLat: 5.20,  minLng: 5.60,  maxLng: 6.80  },
  'akwa-ibom':   { minLat: 4.30,  maxLat: 5.50,  minLng: 7.40,  maxLng: 8.60  },
  'cross-river': { minLat: 4.70,  maxLat: 6.90,  minLng: 7.80,  maxLng: 9.50  },
  enugu:         { minLat: 5.90,  maxLat: 7.10,  minLng: 6.80,  maxLng: 7.90  },
  ebonyi:        { minLat: 5.70,  maxLat: 6.80,  minLng: 7.60,  maxLng: 8.60  },
  kogi:          { minLat: 6.70,  maxLat: 8.90,  minLng: 5.70,  maxLng: 7.80  },
  kwara:         { minLat: 7.80,  maxLat: 9.50,  minLng: 3.90,  maxLng: 6.10  },
  niger:         { minLat: 8.70,  maxLat: 11.40, minLng: 3.50,  maxLng: 7.30  },
  fct:           { minLat: 8.30,  maxLat: 9.30,  minLng: 6.80,  maxLng: 7.80  },
  nasarawa:      { minLat: 7.80,  maxLat: 9.30,  minLng: 7.40,  maxLng: 9.30  },
  benue:         { minLat: 6.00,  maxLat: 8.30,  minLng: 7.50,  maxLng: 10.00 },
  plateau:       { minLat: 8.30,  maxLat: 10.60, minLng: 8.20,  maxLng: 10.50 },
  taraba:        { minLat: 6.50,  maxLat: 9.50,  minLng: 9.50,  maxLng: 12.30 },
  adamawa:       { minLat: 7.80,  maxLat: 11.00, minLng: 11.50, maxLng: 13.70 },
  borno:         { minLat: 10.00, maxLat: 14.00, minLng: 11.50, maxLng: 15.00 },
  yobe:          { minLat: 10.50, maxLat: 13.70, minLng: 9.50,  maxLng: 12.90 },
  gombe:         { minLat: 9.30,  maxLat: 11.70, minLng: 9.80,  maxLng: 12.00 },
  bauchi:        { minLat: 9.50,  maxLat: 12.30, minLng: 8.60,  maxLng: 11.20 },
  kaduna:        { minLat: 9.00,  maxLat: 11.50, minLng: 6.00,  maxLng: 8.90  },
  kano:          { minLat: 11.00, maxLat: 13.00, minLng: 7.50,  maxLng: 9.50  },
  katsina:       { minLat: 12.00, maxLat: 13.90, minLng: 6.50,  maxLng: 9.20  },
  jigawa:        { minLat: 11.50, maxLat: 13.50, minLng: 8.80,  maxLng: 10.50 },
  zamfara:       { minLat: 11.00, maxLat: 13.90, minLng: 5.40,  maxLng: 7.70  },
  kebbi:         { minLat: 10.00, maxLat: 13.50, minLng: 3.50,  maxLng: 6.30  },
  sokoto:        { minLat: 12.00, maxLat: 13.90, minLng: 4.10,  maxLng: 6.50  },
}

export function detectStateFromCoords(lat: number, lng: number): string | null {
  for (const [slug, bounds] of Object.entries(STATE_BOUNDS)) {
    if (
      lat >= bounds.minLat &&
      lat <= bounds.maxLat &&
      lng >= bounds.minLng &&
      lng <= bounds.maxLng
    ) {
      return slug
    }
  }
  return null
}
