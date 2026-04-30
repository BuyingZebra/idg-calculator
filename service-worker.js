/* ========================= */
/* CORE FILES (PRECACHE) */
/* ========================= */

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];

/* ========================= */
/* INSTALL (cache core app) */
/* ========================= */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("core").then(cache => {
      return cache.addAll(CORE_ASSETS);
    })
  );

  self.skipWaiting();
});

/* ========================= */
/* ACTIVATE */
/* ========================= */

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

/* ========================= */
/* FETCH */
/* ========================= */

self.addEventListener("fetch", event => {

  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(

    // 1. Try network first (for updates)
    fetch(event.request)
      .then(response => {

        // 2. Save latest version in cache
        const clone = response.clone();
        caches.open("runtime").then(cache => {
          cache.put(event.request, clone);
        });

        return response;
      })

      .catch(() => {

        // 3. If offline → try cache
        return caches.match(event.request)
          .then(cached => {
            if (cached) return cached;

            // fallback to core app shell
            return caches.match("./index.html");
          });

      })
  );

});