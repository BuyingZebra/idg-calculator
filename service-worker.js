const CACHE_NAME = "idg-training-v88";
const PRECACHE_URLS = [
  "./",
  "./PROJECT_STRUCTURE.md",
  "./app/navigation.js",
  "./app/state.js",
  "./assets/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf",
  "./assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  "./assets/fonts/Inter/OFL.txt",
  "./assets/fonts/Inter/README.txt",
  "./assets/fonts/Noto_Sans/NotoSans-Italic-VariableFont_wdth,wght.ttf",
  "./assets/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf",
  "./assets/fonts/Noto_Sans/OFL.txt",
  "./assets/fonts/Noto_Sans/README.txt",
  "./assets/icons/activity.svg",
  "./assets/icons/app-192.png",
  "./assets/icons/app-512.png",
  "./assets/icons/grading.svg",
  "./assets/icons/inspection.svg",
  "./data/travel/README.md",
  "./data/travel/locations.json",
  "./data/travel/travel-matrix.json",
  "./index.html",
  "./manifest.webmanifest",
  "./modules/activity-slip/activity-slip.js",
  "./modules/inspection-detail/inspection-detail.js",
  "./modules/inspection-detail/inspection-detail.math.js",
  "./modules/inspection-summary/inspection-summary.js",
  "./modules/inspection-summary/inspection-summary.math.js",
  "./services/storage.js",
  "./services/time.js",
  "./services/travel.js",
  "./ui/animations.css",
  "./ui/formula-helper.js",
  "./ui/icons.js",
  "./ui/modules.css",
  "./ui/navigation.css",
  "./ui/shell.css",
  "./version.json"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === "opaque") return response;
        const copy=response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request,copy));
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") return caches.match("./index.html");
        return Response.error();
      });
    })
  );
});
