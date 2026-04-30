/* ========================= */
/* INSTALL */
/* ========================= */
self.addEventListener("install", event => {
  self.skipWaiting(); // activate immediately
});

/* ========================= */
/* ACTIVATE */
/* ========================= */
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

/* ========================= */
/* FETCH (NETWORK FIRST) */
/* ========================= */
self.addEventListener("fetch", event => {

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // cache latest version
        const clone = response.clone();
        caches.open("runtime").then(cache => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => {
        // fallback to cache when offline
        return caches.match(event.request);
      })
  );

});