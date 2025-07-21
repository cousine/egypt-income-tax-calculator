const CACHE_NAME = 'egy-salary-calc-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
  'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
  'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2',
  'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle exchange rate API requests with network-first strategy
  if (event.request.url.includes('exchangerate-api.com')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If network request succeeds, cache the response
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For all other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(fetchResponse => {
          // Cache successful responses
          if (fetchResponse.status === 200) {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return fetchResponse;
        });
      })
      .catch(() => {
        // If both cache and network fail, return a basic offline page
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Background sync for exchange rate updates
self.addEventListener('sync', event => {
  if (event.tag === 'exchange-rate-sync') {
    event.waitUntil(
      fetch('https://api.exchangerate-api.com/v4/latest/USD')
        .then(response => response.json())
        .then(data => {
          // Store updated exchange rate in cache
          return caches.open(CACHE_NAME).then(cache => {
            return cache.put('exchange-rate-data', new Response(JSON.stringify(data)));
          });
        })
        .catch(error => {
          console.log('Background sync failed:', error);
        })
    );
  }
});

// Push notification event (for future tax law updates)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Egyptian tax rates have been updated!',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Calculator',
        icon: '/icons/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Egyptian Salary Calculator', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});