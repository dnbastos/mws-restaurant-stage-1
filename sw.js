var staticCacheName = 'mws-v1';

/**
 * Cache our files after registration 
 */
self.addEventListener('install', event =>
  event.waitUntil(caches.open(staticCacheName).then(cache =>
    cache.addAll([
      '/index.html',
      '/restaurant.html',
      'js/main.js',
      'js/dbhelper.js',
      'js/restaurant_info.js',
      'js/initSw.js',
      'css/styles.css',
      'data/restaurants.json',
      'img/default_restaurant.jpg'
    ])
  ))
);

/**
 * Remove old cache from old versions
 */
self.addEventListener('activate', event =>
  event.waitUntil(caches.keys().then(cacheNames =>
    Promise.all(
      cacheNames.filter(cacheName => {
        return cacheName.startsWith('mws-') &&
          cacheName != staticCacheName;
      }).map(cacheName => {
        return caches.delete(cacheName);
      })
    )
  ))
);

/**
 * Respond with cache or request
 */
self.addEventListener('fetch', event => {
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
    caches.match(event.request).then(response => 
      response || fetch(event.request)
    )
  );
});
