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

[
  ['vite.config.js', viteConfig, 'VitePWA'],
  ['vite.config.js', viteConfig, 'registerType'],
  ['vite.config.js', viteConfig, 'cleanupOutdatedCaches'],
  ['vite.config.js', viteConfig, 'navigateFallback'],
  ['index.html', indexHtml, 'apple-mobile-web-app-capable'],
  ['index.html', indexHtml, 'apple-touch-icon'],
  ['src/layouts/MainLayout.jsx', mainLayout, 'OfflineNotice'],
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
