// Minimal service worker for PWA installability.
// Serves cached shell for offline, passes everything else to the network.

const CACHE_NAME = 'core-view-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Let all requests go to the network; we only need this SW for installability.
  event.respondWith(fetch(event.request));
});
