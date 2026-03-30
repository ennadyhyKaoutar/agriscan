const CACHE_NAME = 'agilics-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
];

// Liste de toutes les pages à précacher pour le offline complet
const ALL_PAGES = [
  '/',
  '/auth',
  '/dashboard',
  '/detection',
  '/history',
  '/plants',
  '/medicine',
  '/profile',
];

// ===================== INSTALLATION =====================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// ===================== ACTIVATION =====================
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

// ===================== FETCH =====================
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests - Network first, fallback to cache
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') return response;
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return response;
        })
        .catch(() =>
          caches.match(request).then((response) => response || new Response('Offline', { status: 503 }))
        )
    );
    return;
  }

  // Static assets & pages - Cache first, fallback to network
  event.respondWith(
    caches.match(request).then((response) => {
      return (
        response ||
        fetch(request)
          .then((response) => {
            if (!response || response.status !== 200 || response.type === 'error') return response;
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
            return response;
          })
          .catch(() => new Response('Offline', { status: 503 }))
      );
    })
  );
});

// ===================== MESSAGES =====================
self.addEventListener('message', (event) => {
  if (!event.data) return;

  // Forcer le SW à s'activer immédiatement
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  // Précharger toutes les pages après login
  if (event.data.type === 'CACHE_ALL') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(ALL_PAGES).catch((err) => console.error('Pre-cache failed:', err));
    });
  }
});

// ===================== BACKGROUND SYNC =====================
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-detections') {
    event.waitUntil(syncDetections());
  }
});

// ===================== FONCTION SYNC =====================
async function syncDetections() {
  try {
    const db = await openDB('agilics-db'); // IndexedDB
    const tx = db.transaction('detections', 'readonly');
    const store = tx.objectStore('detections');
    const pendingDetections = await store.getAll();

    for (const detection of pendingDetections) {
      if (detection.pending) {
        await fetch('/api/detections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(detection),
        });
      }
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}