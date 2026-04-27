import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'public/favicon.svg',
  'public/apple-touch-icon.png',
  'public/pwa-192x192.png',
  'public/pwa-512x512.png',
  'public/pwa-maskable-512x512.png',
];

const failures = [];

requiredFiles.forEach((file) => {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing ${file}`);
  }
});

const viteConfig = readFileSync(join(root, 'vite.config.js'), 'utf8');
const indexHtml = readFileSync(join(root, 'index.html'), 'utf8');
const mainLayout = readFileSync(join(root, 'src/layouts/MainLayout.jsx'), 'utf8');
const serviceWorkerNotice = readFileSync(
  join(root, 'src/components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice.jsx'),
  'utf8'
);
const offlineNotice = readFileSync(
  join(root, 'src/components/OfflineNotice/OfflineNotice.jsx'),
  'utf8'
);

[
  ['vite.config.js', viteConfig, 'VitePWA'],
  ['vite.config.js', viteConfig, 'registerType'],
  ['vite.config.js', viteConfig, "registerType: 'prompt'"],
  ['vite.config.js', viteConfig, 'cleanupOutdatedCaches'],
  ['vite.config.js', viteConfig, 'navigateFallback'],
  ['vite.config.js', viteConfig, 'runtimeCaching'],
  ['vite.config.js', viteConfig, 'api\\.jikan\\.moe'],
  ['vite.config.js', viteConfig, "handler: 'NetworkFirst'"],
  ['vite.config.js', viteConfig, "method: 'GET'"],
  ['vite.config.js', viteConfig, "cacheName: 'jikan-api-cache'"],
  ['vite.config.js', viteConfig, 'maxEntries: 80'],
  ['vite.config.js', viteConfig, 'maxAgeSeconds: 60 * 60 * 24 * 7'],
  ['vite.config.js', viteConfig, 'networkTimeoutSeconds: 5'],
  ['vite.config.js', viteConfig, 'statuses: [200]'],
  ['index.html', indexHtml, 'apple-mobile-web-app-capable'],
  ['index.html', indexHtml, 'apple-touch-icon'],
  ['src/layouts/MainLayout.jsx', mainLayout, 'OfflineNotice'],
  ['src/layouts/MainLayout.jsx', mainLayout, 'ServiceWorkerUpdateNotice'],
  [
    'src/components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice.jsx',
    serviceWorkerNotice,
    "from 'virtual:pwa-register/react'",
  ],
  [
    'src/components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice.jsx',
    serviceWorkerNotice,
    'needRefresh',
  ],
  [
    'src/components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice.jsx',
    serviceWorkerNotice,
    'offlineReady',
  ],
  [
    'src/components/ServiceWorkerUpdateNotice/ServiceWorkerUpdateNotice.jsx',
    serviceWorkerNotice,
    'updateServiceWorker(true)',
  ],
  [
    'src/components/OfflineNotice/OfflineNotice.jsx',
    offlineNotice,
    'previously opened anime or manga data',
  ],
].forEach(([file, contents, needle]) => {
  if (!contents.includes(needle)) {
    failures.push(`${file} does not include ${needle}`);
  }
});

if (failures.length > 0) {
  console.error('PWA verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('PWA verification passed.');
