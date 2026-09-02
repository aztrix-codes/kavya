const CACHE_NAME = 'kavya-portfolio-v34';
const CORE_ASSETS = [
  './',
  './index.html',
  './about.html',
  './research.html',
  './projects.html',
  './impact.html',
  './publications.html',
  './experience.html',
  './research-notes.html',
  './cv.html',
  './contact.html',
  './assets/css/styles.css?v=34',
  './assets/js/site.js?v=34',
  './assets/js/pwa.js?v=34',
  './assets/images/contours.svg',
  './assets/images/kavya-portrait-hero.jpg',
  './assets/images/kavya-portrait-formal.jpg',
  './assets/images/lst-trends.png',
  './assets/images/lst-seasonal.png',
  './assets/images/indus-study-area.png',
  './output/pdf/Kavya_Agrawal_Academic_CV.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const requestUrl = new URL(event.request.url);
  const isCodeAsset = requestUrl.pathname.endsWith('.css') || requestUrl.pathname.endsWith('.js');
  if (isCodeAsset) {
    event.respondWith(fetch(event.request).then((response) => {
      if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }
  const acceptsHtml = event.request.headers.get('accept')?.includes('text/html');
  if (acceptsHtml) {
    event.respondWith(fetch(event.request).then((response) => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok) caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});
