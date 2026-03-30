const CACHE_NAME = 'agilics-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Stratégie de fetch
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // API requests - Network first, fallback to cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((response) => {
            return response || new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }

  // Static assets - Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
            return response;
          })
          .catch(() => new Response('Offline', { status: 503 }))
      );
    })
  );
});

// Message handling pour la mise à jour
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notifications background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-detections') {
    event.waitUntil(syncDetections());
  }
});

async function syncDetections() {
  try {
    const db = await openDB('agilics-db');
    const tx = db.transaction('detections', 'readonly');
    const store = tx.objectStore('detections');
    const pendingDetections = await store.getAll();

    for (const detection of pendingDetections) {
      if (detection.pending) {
        // Envoyer à l'API
        await fetch('/api/detections', {
          method: 'POST',
          body: JSON.stringify(detection),
        });
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}
