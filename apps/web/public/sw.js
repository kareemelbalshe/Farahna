// Farahna Admin PWA Service Worker
const CACHE_NAME = 'farahna-admin-v1';
const OFFLINE_URL = '/admin/offline';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Pre-cache error:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ONLY intercept navigation requests within the /admin scope
  if (event.request.mode === 'navigate' && url.pathname.startsWith('/admin')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(
            `<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><title>لا يوجد اتصال</title></head><body style="font-family:sans-serif;text-align:center;padding:50px;"><h2>لا يوجد اتصال بالإنترنت حالياً</h2><p>يرجى التحقق من اتصالك والمحاولة مرة أخرى.</p><button onclick="window.location.reload()">إعادة المحاولة</button></body></html>`,
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        });
      })
    );
    return;
  }

  // Pass-through for all other requests (zero overhead for guests)
  return;
});
