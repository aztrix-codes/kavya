const CACHE_NAME = 'kavya-portfolio-v16';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './about.html',
  './experience.html',
  './research.html',
  './projects.html',
  './publications.html',
  './research-notes.html',
  './cv.html',
  './contact.html',
  './assets/css/styles.css?v=16',
  './assets/js/navbar-burger.js',
  './assets/js/pwa.js',
  './assets/images/home.png',
  './assets/images/logo.png',
  './assets/images/favicon-16.png',
  './assets/images/favicon-32.png',
  './assets/images/apple-touch-icon.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  'https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css',
  'https://cdn.rawgit.com/jpswalsh/academicons/master/css/academicons.min.css',
  'https://use.fontawesome.com/releases/v6.5.2/js/all.js'
];

// Install Event - Pre-caching assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching offline assets...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache First, Network Fallback
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache, and optionally update cache in background
          fetch(event.request)
            .then(networkResponse => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
              }
            })
            .catch(() => { /* ignore background sync errors */ });
          return cachedResponse;
        }

        // Fallback to network
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Cache the newly fetched asset
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('./index.html');
            }
          });
      })
  );
});
