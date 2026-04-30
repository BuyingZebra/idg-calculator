const CACHE_NAME = "idg-calculator-v2";

/* Files to cache */
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json"
];

/* ========================= */
/* INSTALL */
/* ========================= */
self.addEventListener("install", event => {
  console.log("Service Worker installing...");

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Caching app shell...");
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

/* ========================= */
/* ACTIVATE */
/* ========================= */
self.addEventListener("activate", event => {
  console.log("Service Worker activating...");

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

/* ========================= */
/* FETCH */
/* ========================= */
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then(networkResponse => {
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});