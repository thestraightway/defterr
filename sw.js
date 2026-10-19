/* Дефтер: офлайн-оболочка. Версия 55274f3e4b */
const CACHE = 'defter-55274f3e4b';
const SHELL = ["./", "index.html", "legal.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon.svg", "fonts/body-400.woff", "fonts/body-500.woff", "fonts/body-600.woff", "fonts/body-700.woff", "fonts/display-500.woff", "fonts/display-600.woff"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin) return;
  if (r.mode === 'navigate') {
    const page = u.pathname.endsWith('legal.html') ? 'legal.html' : 'index.html';
    e.respondWith(fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(page, c)); } return res; }).catch(() => caches.match(page)));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); } return res; })));
});
