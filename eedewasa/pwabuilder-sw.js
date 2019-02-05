const cache = 'eedewasa-v1';
const runtime = 'runtime';
const staticAssets = [
'./',
'./index.html',
'./logo.png',
'./manifest.json',
'./manup.js',
'./swregister.js',
'Build/eedewasa.data.unityweb',
'Build/eedewasa.json',
'Build/eedewasa.wasm.code.unityweb',
'Build/eedewasa.wasm.framework.unityweb',
'Build/UnityLoader.js'
];

//Install stage sets up the offline page in the cache and opens a new cache
//self.addEventListener('install', function(event) {
//  var offlinePage = new Request('offline.html');
//  event.waitUntil(
//    fetch(offlinePage).then(function(response) {
//      return caches.open('pwabuilder-offline').then(function(cache) {
//        console.log('[PWA Builder] Cached offline page during Install'+ response.url);
 //       return cache.put(offlinePage, response);
 //     });
//  }));
//});

//If any fetch fails, it will show the offline page.
//Maybe this should be limited to HTML documents?
//self.addEventListener('fetch', function(event) {
//  event.respondWith(
//    fetch(event.request).catch(function(error) {
//      console.error( '[PWA Builder] Network request Failed. Serving offline page ' + error );
//      return caches.open('pwabuilder-offline').then(function(cache) {
//        return cache.match('offline.html');
//      });
//    }
//  ));
//});

//This is a event that can be fired from your page to tell the SW to update the offline page
//self.addEventListener('refreshOffline', function(response) {
//  return caches.open('pwabuilder-offline').then(function(cache) {
//    console.log('[PWA Builder] Offline page updated from refreshOffline event: '+ response.url);
//    return cache.put(offlinePage, response);
//  });
//});


// New
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cache)
            .then(cache => cache.addAll(staticAssets))
            .then(self.skipWaiting())
    );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {
    const currentCaches = [cache, runtime];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
    // Skip cross-origin requests, like those for Google Analytics.
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request, {ignoreSearch: true}).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(runtime).then(cache => {
                    return fetch(event.request).then(response => {
                        // Put a copy of the response in the runtime cache.
                        return cache.put(event.request, response.clone()).then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});