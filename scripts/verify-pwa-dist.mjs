import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const failures = [];
const distFiles = existsSync(join(root, 'dist')) ? readdirSync(join(root, 'dist')) : [];
const distAssetFiles = existsSync(join(root, 'dist/assets'))
  ? readdirSync(join(root, 'dist/assets'))
  : [];

const requiredDistFiles = [
  'dist/manifest.webmanifest',
  'dist/sw.js',
  'dist/apple-touch-icon.png',
  'dist/pwa-192x192.png',
  'dist/pwa-512x512.png',
  'dist/pwa-maskable-512x512.png',
  'dist/_redirects',
];

requiredDistFiles.forEach((file) => {
  if (!existsSync(join(root, file))) {
    failures.push(`Missing ${file}`);
  }
});

if (!distFiles.some((file) => /^workbox-.+\.js$/.test(file))) {
  failures.push('Missing generated Workbox runtime file');
}

if (existsSync(join(root, 'dist/index.html'))) {
  const indexHtml = readFileSync(join(root, 'dist/index.html'), 'utf8');

  [
    '<link rel="manifest" href="/manifest.webmanifest">',
    'rel="apple-touch-icon"',
  ].forEach((needle) => {
    if (!indexHtml.includes(needle)) {
      failures.push(`dist/index.html does not include ${needle}`);
    }
  });
} else {
  failures.push('Missing dist/index.html');
}

if (existsSync(join(root, 'dist/manifest.webmanifest'))) {
  const manifest = JSON.parse(
    readFileSync(join(root, 'dist/manifest.webmanifest'), 'utf8')
  );

  if (manifest.display !== 'standalone') {
    failures.push('manifest display is not standalone');
  }

  if (!manifest.icons?.some((icon) => icon.purpose === 'maskable')) {
    failures.push('manifest does not include a maskable icon');
  }
}

if (existsSync(join(root, 'dist/sw.js'))) {
  const sw = readFileSync(join(root, 'dist/sw.js'), 'utf8');

  const swChecks = [
    ['jikan-api-cache', /jikan-api-cache/],
    ['NetworkFirst', /NetworkFirst/],
    ['api.jikan.moe route', /api\\\.jikan\\\.moe/],
    ['ExpirationPlugin', /ExpirationPlugin/],
    ['CacheableResponsePlugin', /CacheableResponsePlugin/],
    ['maxEntries 80', /maxEntries:80/],
    ['maxAgeSeconds 7 days', /maxAgeSeconds:604800/],
    ['networkTimeoutSeconds 5', /networkTimeoutSeconds:5/],
  ];

  swChecks.forEach(([label, pattern]) => {
    if (!pattern.test(sw)) {
      failures.push(`dist/sw.js does not include ${label}`);
    }
  });
}

const distJs = distAssetFiles
  .filter((file) => file.endsWith('.js'))
  .map((file) => readFileSync(join(root, 'dist/assets', file), 'utf8'))
  .join('\n');

[
  'A new version is available.',
  'Offline ready',
  'Previously opened anime and manga data can now be shown offline.',
].forEach((needle) => {
  if (!distJs.includes(needle)) {
    failures.push(`dist assets do not include ${needle}`);
  }
});

if (failures.length > 0) {
  console.error('PWA dist verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('PWA dist verification passed.');
