/* Темп: офлайн-оболочка. Версия 442e80da */
const CACHE = 'temp-442e80da';
const SHELL = ["./", "index.html", "legal.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon.svg"];
// главное: index.html. Остальное по возможности, чтобы одна пропавшая иконка не ломала обновление
self.addEventListener('install', e => { e.waitUntil((async () => {
  const c = await caches.open(CACHE);
  await c.add(new Request('index.html', { cache: 'reload' }));
  await Promise.all(SHELL.filter(u => u !== 'index.html').map(u => c.add(new Request(u, { cache: 'reload' })).catch(() => {})));
  await self.skipWaiting();
})()); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('notificationclick', e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow('./'))); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url); if (u.origin !== location.origin || u.pathname.endsWith('version.json')) return;
  if (r.mode === 'navigate') {
    const page = u.pathname.endsWith('legal.html') ? 'legal.html' : 'index.html';
    // сначала из кэша: мгновенный старт и полный офлайн. Новая версия приходит через обновление sw.js
    e.respondWith(caches.match(page).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(page, c)); } return res; })).catch(() => caches.match(page)));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(ch => ch.put(r, c)); } return res; })));
});
