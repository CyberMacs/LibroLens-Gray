const CACHE_NAME = 'librolens-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.tsx',
  '/favicon.svg',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  // Stale-while-revalidate strategy
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try to get the resource from the cache.
      const cachedResponse = await cache.match(event.request);
      
      // Fetch the resource from the network.
      const fetchPromise = fetch(event.request).then(networkResponse => {
        // If we got a valid response, update the cache.
        if (networkResponse && networkResponse.status === 200) {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      }).catch(err => {
        // The network failed.
        // This error is swallowed if a cached response is available.
        console.warn('Network request for', event.request.url, 'failed:', err);
      });

      // Return the cached response if available, otherwise wait for the network response.
      return cachedResponse || fetchPromise;
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
