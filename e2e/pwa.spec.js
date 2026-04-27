import { expect, test } from '@playwright/test';

const jikanFixtures = {
  'https://api.jikan.moe/v4/top/anime': {
    data: [
      {
        mal_id: 1,
        title: 'Cached Anime',
        score: 9.7,
        episodes: 12,
        status: 'Finished Airing',
        images: { webp: {} },
      },
    ],
  },
  'https://api.jikan.moe/v4/anime?order_by=score&rating=pg13&sort=desc': {
    data: [
      {
        mal_id: 5,
        title: 'Cached Anime Search',
        score: 9.1,
        episodes: 24,
        images: { webp: {} },
      },
    ],
  },
  'https://api.jikan.moe/v4/genres/anime': {
    data: [{ mal_id: 2, name: 'Adventure' }],
  },
  'https://api.jikan.moe/v4/top/manga': {
    data: [
      {
        mal_id: 2,
        title: 'Cached Manga',
        score: 9.5,
        chapters: 42,
        images: { webp: {} },
      },
    ],
  },
  'https://api.jikan.moe/v4/manga?order_by=score&sort=desc': {
    data: [
      {
        mal_id: 6,
        title: 'Cached Manga Search',
        score: 8.9,
        chapters: 51,
        images: { webp: {} },
      },
    ],
  },
  'https://api.jikan.moe/v4/genres/manga': {
    data: [{ mal_id: 8, name: 'Drama' }],
  },
  'https://api.jikan.moe/v4/recommendations/anime': {
    data: [
      {
        entry: [
          {
            mal_id: 3,
            title: 'Cached Anime Match',
            images: { webp: {} },
          },
        ],
      },
    ],
  },
  'https://api.jikan.moe/v4/recommendations/manga': {
    data: [
      {
        entry: [
          {
            mal_id: 4,
            title: 'Cached Manga Match',
            images: { webp: {} },
          },
        ],
      },
    ],
  },
};

const activateServiceWorker = async (page) => {
  await page.waitForFunction(async () => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    return Boolean(registration.active);
  });

  const hasController = await page.evaluate(() => Boolean(navigator.serviceWorker.controller));

  if (!hasController) {
    await page.reload({ waitUntil: 'networkidle' });
  }

  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
};

const seedJikanCache = async (page) => {
  const cachedEntryCount = await page.evaluate(async (fixtures) => {
    const cache = await caches.open('jikan-api-cache');

    await Promise.all(
      Object.entries(fixtures).map(([url, body]) =>
        cache.put(
          url,
          new Response(JSON.stringify(body), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
          })
        )
      )
    );

    const keys = await cache.keys();

    return keys.length;
  }, jikanFixtures);

  expect(cachedEntryCount).toBeGreaterThanOrEqual(Object.keys(jikanFixtures).length);
};

test('PWA serves the app shell and cached Jikan data offline', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'AnimeBounty-Info' })).toBeVisible();

  await activateServiceWorker(page);
  await seedJikanCache(page);

  await context.setOffline(true);

  try {
    await page.goto('/anime', { waitUntil: 'networkidle' });
    await expect(page.getByText('Offline mode')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Top Anime' })).toBeVisible();
    await expect(page.locator('.slide__text').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recommended anime' })).toBeVisible();
    await expect(page.locator('.rec__card-content').first()).toBeVisible();
    await expect(page.getByText(/anime .* could not be loaded/i)).toHaveCount(0);

    await page.goto('/manga', { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { name: 'Top Manga' })).toBeVisible();
    await expect(page.locator('.slide__text').first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Recommended manga' })).toBeVisible();
    await expect(page.locator('.rec__card-content').first()).toBeVisible();
    await expect(page.getByText(/manga .* could not be loaded/i)).toHaveCount(0);

    await page.goto('/anime/1', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('button', { name: 'AnimeBounty-Info' })).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
