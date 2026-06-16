const CACHE = 'safereachng-v4'

const OFFLINE_URLS = [
  '/',
  '/report',
  '/my-contacts',
  '/feed',
  '/manifest.json',
  '/logo.png',
  '/icon-76.png',
  '/icon-120.png',
  '/icon-152.png',
  '/icon-167.png',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png',
  '/police-logo.jpg',
  '/nscdc-logo.png',
  '/army-logo.png',
  '/abia',
  '/adamawa',
  '/akwa-ibom',
  '/anambra',
  '/bauchi',
  '/bayelsa',
  '/benue',
  '/borno',
  '/cross-river',
  '/delta',
  '/ebonyi',
  '/edo',
  '/ekiti',
  '/enugu',
  '/fct',
  '/gombe',
  '/imo',
  '/jigawa',
  '/kaduna',
  '/kano',
  '/katsina',
  '/kebbi',
  '/kogi',
  '/kwara',
  '/lagos',
  '/nasarawa',
  '/niger',
  '/ogun',
  '/ondo',
  '/osun',
  '/oyo',
  '/plateau',
  '/rivers',
  '/sokoto',
  '/taraba',
  '/yobe',
  '/zamfara',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(OFFLINE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return

  const isNavigation = event.request.mode === 'navigate'

  if (isNavigation) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const clone = res.clone()
            caches.open(CACHE).then((cache) => cache.put(event.request, clone))
          }
          return res
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached
      return fetch(event.request).then((res) => {
        if (!res || res.status !== 200) return res
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, clone))
        return res
      })
    })
  )
})