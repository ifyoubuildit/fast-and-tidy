// Service Worker for Fast & Tidy PWA
const CACHE_NAME = 'fast-and-tidy-v1.0.0';
const STATIC_CACHE_NAME = 'fast-and-tidy-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'fast-and-tidy-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/game.js',
    '/js/utils.js',
    '/js/audio.js',
    '/js/storage.js',
    '/js/rooms.js',
    '/manifest.json'
];

// Files to cache on first request
const DYNAMIC_FILES = [
    '/icons/',
    '/images/',
    '/audio/'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Service Worker: Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && 
                            cacheName !== DYNAMIC_CACHE_NAME &&
                            cacheName.startsWith('fast-and-tidy-')) {
                            console.log('Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    // Return cached version
                    return cachedResponse;
                }
                
                // Not in cache, fetch from network
                return fetch(request)
                    .then(networkResponse => {
                        // Don't cache if not successful
                        if (!networkResponse || networkResponse.status !== 200) {
                            return networkResponse;
                        }
                        
                        // Clone the response
                        const responseToCache = networkResponse.clone();
                        
                        // Determine which cache to use
                        const cacheName = isStaticFile(request.url) ? 
                            STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;
                        
                        // Cache the response
                        caches.open(cacheName)
                            .then(cache => {
                                cache.put(request, responseToCache);
                            })
                            .catch(error => {
                                console.warn('Service Worker: Error caching response:', error);
                            });
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        console.warn('Service Worker: Network request failed:', error);
                        
                        // Return offline fallback for HTML requests
                        if (request.headers.get('accept').includes('text/html')) {
                            return caches.match('/index.html');
                        }
                        
                        // For other requests, just fail
                        throw error;
                    });
            })
    );
});

// Background sync for game data
self.addEventListener('sync', event => {
    console.log('Service Worker: Background sync triggered:', event.tag);
    
    if (event.tag === 'game-data-sync') {
        event.waitUntil(syncGameData());
    }
});

// Push notifications (for daily reminders)
self.addEventListener('push', event => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: 'Time to clean today\'s messy room! 🧹',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: 'daily-reminder',
        requireInteraction: false,
        actions: [
            {
                action: 'play',
                title: 'Play Now',
                icon: '/icons/icon-96x96.png'
            },
            {
                action: 'later',
                title: 'Remind Later'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Fast & Tidy', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked:', event.action);
    
    event.notification.close();
    
    if (event.action === 'play') {
        // Open the game
        event.waitUntil(
            clients.openWindow('/?action=play')
        );
    } else if (event.action === 'later') {
        // Schedule another reminder in 2 hours
        scheduleReminder(2 * 60 * 60 * 1000);
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    console.log('Service Worker: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
        scheduleReminder(event.data.delay || 24 * 60 * 60 * 1000); // Default 24 hours
    }
    
    if (event.data && event.data.type === 'SYNC_GAME_DATA') {
        event.waitUntil(syncGameData());
    }
});

// Helper functions
function isStaticFile(url) {
    return STATIC_FILES.some(staticFile => url.endsWith(staticFile));
}

function syncGameData() {
    // This would sync game data with Firebase or other backend
    // For now, just a placeholder
    return new Promise((resolve) => {
        console.log('Service Worker: Syncing game data...');
        // Simulate sync operation
        setTimeout(() => {
            console.log('Service Worker: Game data synced');
            resolve();
        }, 1000);
    });
}

function scheduleReminder(delay) {
    // Schedule a reminder notification
    setTimeout(() => {
        const options = {
            body: 'Don\'t forget to clean today\'s room! 🏠',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
            tag: 'reminder',
            requireInteraction: true
        };
        
        self.registration.showNotification('Fast & Tidy Reminder', options);
    }, delay);
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    console.log('Service Worker: Periodic sync triggered:', event.tag);
    
    if (event.tag === 'daily-check') {
        event.waitUntil(checkDailyChallenge());
    }
});

function checkDailyChallenge() {
    // Check if user has completed today's challenge
    // Send notification if not completed by evening
    return new Promise((resolve) => {
        const now = new Date();
        const hour = now.getHours();
        
        // Only send reminder in the evening (after 6 PM)
        if (hour >= 18) {
            // Check local storage for today's completion
            // This is a simplified check - in a real app you'd check more thoroughly
            const today = now.toISOString().split('T')[0];
            
            // For now, just resolve - in a real implementation you'd check completion status
            console.log('Service Worker: Checking daily challenge completion for', today);
        }
        
        resolve();
    });
}

// Handle errors
self.addEventListener('error', event => {
    console.error('Service Worker: Error occurred:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker: Unhandled promise rejection:', event.reason);
});

console.log('Service Worker: Script loaded');