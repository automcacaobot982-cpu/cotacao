/* Service Worker · Portal de Cotações Belt
   - Precache do "casco" do app (funciona offline para abrir a tela)
   - Navegação: network-first (sempre busca a versão nova; offline cai no cache)
   - Estáticos same-origin: cache-first
   - NUNCA intercepta POST (gravações) nem requisições ao Google/CDN (dados sempre frescos)
   Ao publicar uma atualização, altere o número da versão abaixo. */
const CACHE = 'cotacoes-belt-v3';

const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './favicon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      // Cacheia arquivo por arquivo: se algum faltar, a instalação NÃO falha.
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Só GET. POST (gravações no Apps Script) nunca é interceptado.
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Deixa passar direto tudo que não é do próprio site:
  // planilha (docs.google.com), Apps Script (script.google.com),
  // fontes (fonts.g*) e o Chart.js (cdn.jsdelivr.net). Dados sempre frescos.
  if (url.origin !== self.location.origin) return;

  // Navegação (abrir/recarregar a página): busca a versão nova; se offline, usa o cache.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Estáticos do próprio site (ícones, manifest): cache-first.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      });
    })
  );
});

// Clique na notificação: foca a aba do portal (ou abre, se estiver fechada).
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) return w.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
