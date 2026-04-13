'use client'

export interface GeoLocation {
  lat: number
  lng: number
  accuracy: number
}

export type GeoError = 'denied' | 'unavailable' | 'timeout' | null

export async function requestLocation(): Promise<{ location: GeoLocation | null; error: GeoError }> {
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
        if (err.code === 1) resolve({ location: null, error: 'denied' })
        else if (err.code === 2) resolve({ location: null, error: 'unavailable' })
        else resolve({ location: null, error: 'timeout' })
      },
      { timeout: 15000, enableHighAccuracy: true, maximumAge: 30000 }
    )
  })
}