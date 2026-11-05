// Service worker for the NolMart Scents web app.
// Network first: visitors always get the latest prices and pages when online.
// Every page, picture and 3D bottle that has been opened is kept, so the app
// still opens (and shows what was already seen) without a connection.

const CACHE = 'nolmart-scents-v2';
const SHELL = [
    './',
    'index.html',
    'products.html',
    'product.html',
    'contact.html',
    'css/style.css',
    'manifest.webmanifest',
    'img/logo-light.png',
    'img/icon-192.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE)
            .then((cache) => cache.addAll(SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    const sameOrigin = url.origin === self.location.origin;
    const fonts = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    if (!sameOrigin && !fonts) return; // WhatsApp, social links etc. go straight to the network

    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res.ok || res.type === 'opaque') {
                    const copy = res.clone();
                    caches.open(CACHE).then((cache) => cache.put(req, copy));
                }
                return res;
            })
            .catch(async () => {
                const cached = await caches.match(req, { ignoreSearch: req.mode === 'navigate' });
                if (cached) return cached;
                if (req.mode === 'navigate') return caches.match('index.html');
                return Response.error();
            })
    );
});
