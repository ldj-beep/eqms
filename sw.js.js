// PWA 필수 서비스 워커 (앱 설치 조건 충족 및 백그라운드 캐싱)
const CACHE_NAME = 'eqms-pwa-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json'
];

// 서비스 워커 설치 시 핵심 파일 캐싱
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// 이전 버전 캐시 정리 및 신규 버전 활성화
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// 네트워크 우선 조회 후 오프라인일 때 캐시 제공
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});