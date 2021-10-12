const version = "V0.05";
const CACHE_NAME = version + "staticfiles";
// const urlsToCache = ["/", "/js/app.js", "/js/chunk-vendors.js"];

// self.addEventListener("install", installEvent => {
//   // Perform install steps
//   /* eslint-disable-next-line no-undef */
//   skipWaiting();
//   installEvent.waitUntil(
//     caches.open(CACHE_NAME).then(function(cache) {
//       console.log("Opened cache");
//       return cache.addAll(urlsToCache);
//     }),
//   );
// });

addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName != CACHE_NAME) {
              console.log("Delete unused cache. Version now:", version);
              return caches.delete(cacheName);
            } // end if
          }), // end map
        ); // end return Promise.all
      }) // end keys then
      .then(() => {
        /* eslint-disable-next-line no-undef */
        return clients.claim();
      }), // end then
  ); // end waitUntil
}); // end addEventListener

// self.addEventListener("fetch", fetchEvent => {
//   const request = fetchEvent.request;
//   fetchEvent.respondWith(
//     caches.match(request).then(response => {
//       // Cache hit - return response
//       if (response) {
//         return response;
//       }
//       return fetch(request);
//     }),
//   );
// });

// self.addEventListener("fetch", fetchEvent => {
//   console.log("Service worker: Fetch Event");

//   const request = fetchEvent.request;
//   fetchEvent.respondWith(
//     fetch(request)
//       .then(response => {
//         console.log("Fetch request successful. Put in cache");
//         console.log("request", request);
//         console.log("response", response);

//         caches.open(CACHE_NAME).then(cache => {
//           cache.put(request, response);
//         });
//       })
//       .catch(error => {
//         console.log("Fetch request NOT successful. Try to get from cache");
//         console.log("request", request);
//         console.log("error", error);

//         caches.match(request).then(response => {
//           console.log("Found a cached request, return it");

//           return response;
//         });
//       }),
//   );
// });

// check book for useless catch

addEventListener("fetch", fetchEvent => {
  const request = fetchEvent.request;
  console.log("fetch event request", request.url);
  fetchEvent.respondWith(
    caches.match(request).then(response => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(request).then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          console.log("do not cache this", request.url);
          console.log("response", response);
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    }),
  );
});
