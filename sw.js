/* Atme Deutsch: guarda o app no aparelho para abrir sem internet.
   Ao atualizar o index.html, troque a versão abaixo (atme-v2, atme-v3...) para o celular baixar a nova. */
const CACHE = "atme-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  /* só apaga versões antigas do próprio Atme, sem mexer no cache de outros apps do mesmo site */
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("atme-") && k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
