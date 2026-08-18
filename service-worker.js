const APP_VERSION = "221.0.0";
const CACHE_NAME = `idg-training-${APP_VERSION}`;
const PRECACHE_URLS = [
  "./index.html",
  "./manifest.webmanifest",
  "./version.json",
  "./app/config.js",
  "./app/state.js",
  "./app/navigation.js",
  "./assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf",
  "./assets/fonts/Noto_Sans/NotoSans-VariableFont_wdth,wght.ttf",
  "./assets/icons/activity.svg",
  "./assets/icons/complete.svg",
  "./assets/icons/incomplete.svg",
  "./assets/icons/fisheries-notification.svg",
  "./assets/icons/app-192.png",
  "./assets/icons/app-512.png",
  "./assets/icons/grading.svg",
  "./assets/icons/inspection.svg",
  "./data/travel/travel-matrix.json",
  "./modules/activity-slip/activity-slip.js",
  "./modules/inspection-detail/inspection-detail.js",
  "./modules/inspection-detail/inspection-detail.math.js",
  "./modules/inspection-summary/inspection-summary.js",
  "./modules/inspection-summary/inspection-summary.math.js",
  "./ui/animations.css",
  "./ui/formula-helper.js",
  "./ui/icons.js",
  "./ui/modules.css",
  "./ui/navigation.css",
  "./ui/shell.css",
  "./assets/icons/receipt.svg",
  "./assets/icons/anchor.svg",
  "./assets/icons/info.svg"
];

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const results = await Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url)));
    const failures = results
      .map((result, index) => ({ result, url: PRECACHE_URLS[index] }))
      .filter(item => item.result.status === "rejected");
    if(failures.length){
      await caches.delete(CACHE_NAME);
      console.error("IDG precache failed:", failures);
      throw new Error(`Unable to precache ${failures.length} required asset(s).`);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith("idg-training-") && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;
  event.respondWith((async () => {
    const cached = await caches.match(event.request);
    if(cached) return cached;
    try {
      const response = await fetch(event.request);
      if(response && response.status === 200 && response.type !== "opaque" &&
         new URL(event.request.url).origin === self.location.origin){
        const cache = await caches.open(CACHE_NAME);
        cache.put(event.request, response.clone());
      }
      return response;
    } catch(error) {
      if(event.request.mode === "navigate"){
        const fallback = await caches.match("./index.html");
        if(fallback) return fallback;
      }
      throw error;
    }
  })());
});
