const CACHE_NAME = "rp-calculator-cache-v1.1";
const urlsToCache = [
  "/",
  "/infinia.html",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192x192.png", // Replace with your icon paths
  "/icons/icon-512x512.png",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Caching files...");
      return cache.addAll(urlsToCache);
    }).catch((error) => {
      console.error("Service Worker: Failed to cache files:", error);
    })
  );
});

// Fetch Requests
self.addEventListener("fetch", (event) => {
  console.log("Service Worker: Fetching", event.request.url);

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Serve from cache if available
      if (response) {
        console.log("Service Worker: Serving from cache:", event.request.url);
        return response;
      }

      // Otherwise, fetch from the network
      return fetch(event.request).then((networkResponse) => {
        // Cache the new resource
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          console.log("Service Worker: Resource cached:", event.request.url);
          return networkResponse;
        });
      });
    }).catch((error) => {
      console.error("Service Worker: Fetch failed:", error);
      // Optionally, serve a fallback response (e.g., offline page)
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Service Worker: Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
