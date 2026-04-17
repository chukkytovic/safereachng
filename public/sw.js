const CACHE = 'safereachng-v2'
const OFFLINE_URLS = [
  '/',
  '/manifest.json',
  '/icon-76.png',
  '/icon-120.png',
  '/icon-152.png',
  '/icon-167.png',
  '/icon-180.png',
  '/icon-192.png',
  '/icon-512.png',
  '/logo.png',
  '/police-logo.jpg',
  '/nscdc-logo.png',
  '/army-logo.png',
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
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(event.request, clone))
        return res
      })
      .catch(() => caches.match(event.request))
  )
})