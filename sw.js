var staticCacheName = 'mws-v1';

/**
 * Cache our files after registration 
 */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function (cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'js/initSw.js',
        'css/styles.css',
        'data/restaurants.json',
        'img/default_restaurant.jpg'
      ]);
    })
  );
});

/**
 * Remove old cache from old versions
 */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('mws-') &&
            cacheName != staticCacheName;
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

/**
 * Respond with cache or request
 */
self.addEventListener('fetch', function (event) {
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
  }

  if (event.request.destination === 'image') {
    event.respondWith(
      fetch(event.request)
      .catch(() => caches.match('img/default_restaurant.jpg'))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
