/* SmartScore service worker — keeps the app usable offline after the first visit.
 * - app shell: network first (so updates arrive), cache fallback when offline
 * - CDN libraries (Tailwind, Tesseract core/worker/language data, html2pdf): cache first
 * Only active when the page is served over http(s); it is not used when index.html is opened as a local file.
 */
const CACHE = 'smartscore-v3';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];
const CDN_HOSTS = ['cdn.tailwindcss.com', 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com', 'tessdata.projectnaptha.com', 'unpkg.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === self.location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
    );
    return;
  }

  if (CDN_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
  // everything else (e.g. the Gemini API) goes straight to the network
});
