const CACHE = 'portfolio-v4';
const HASHED_ASSET = /-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2?|png|jpe?g|svg|webp)$/;

function put(event, request, response) {
  if (!response.ok) {
    return;
  }
  const copy = response.clone();
  event.waitUntil(caches.open(CACHE).then((cache) => cache.put(request, copy)));
}

function cacheFirst(event, request) {
  return caches.match(request).then(
    (cached) =>
      cached ||
      fetch(request).then((response) => {
        put(event, request, response);
        return response;
      })
  );
}

function networkFirst(event, request, fallback) {
  return fetch(request)
    .then((response) => {
      put(event, request, response);
      return response;
    })
    .catch(() => caches.match(request).then((cached) => cached || (fallback ? fallback() : undefined)));
}

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(event, request, () => caches.match('/')));
    return;
  }

  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(HASHED_ASSET.test(url.pathname) ? cacheFirst(event, request) : networkFirst(event, request));
  }
});
