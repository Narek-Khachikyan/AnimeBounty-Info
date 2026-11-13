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

// Detail fixtures exercise the real Workbox runtime cache during hard offline loads.
Object.assign(jikanFixtures, {
  'https://api.jikan.moe/v4/anime/1': {
    data: {
      mal_id: 1, title: 'Cached Anime Detail', score: 8.2, episodes: 12,
      status: 'Finished Airing', year: 2026, rating: 'PG-13',
      studios: [{ mal_id: 1, name: 'Cached Studio' }],
      images: { webp: {} }, trailer: { images: {} },
    },
  },
  'https://api.jikan.moe/v4/anime/1/episodes': {
    data: [
      { mal_id: 1, title: 'Cached episode', score: 4, filler: false },
      { mal_id: 2, title: 'Cached sparse episode', score: null, url: null },
    ],
  },
  'https://api.jikan.moe/v4/anime/1/reviews': {
    data: [{ mal_id: 1, user: { username: 'Offline reader', images: { webp: {} } }, review: 'Cached anime community review' }],
  },
  'https://api.jikan.moe/v4/manga/2': {
    data: { mal_id: 2, title: 'Cached Manga Detail', images: {} },
  },
  'https://api.jikan.moe/v4/manga/2/reviews': {
    data: [{ mal_id: 2, user: null, review: 'Cached manga community review' }],
  },
});

for (const [media, id, panels] of [
  ['anime', 1, ['pictures', 'relations', 'streaming', 'videos']],
  ['manga', 2, ['pictures', 'relations']],
]) {
  for (const panel of panels) {
    jikanFixtures[`https://api.jikan.moe/v4/${media}/${id}/${panel}`] = { data: panel === 'videos' ? { promo: [] } : [] };
  }
}

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
  test.setTimeout(90_000);
  await page.goto('/about');
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
    await expect(page.getByRole('heading', { name: 'Cached Anime Detail', exact: true })).toBeVisible();
    await page.getByRole('heading', { name: 'Episodes', exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByText('Cached episode', { exact: true })).toBeVisible();
    await expect(page.locator('.episode__item').filter({ hasText: 'Cached sparse episode' })).toContainText('Unknown');
    await page.getByRole('button', { name: 'Read community reviews' }).click();
    await expect(page.getByText('Cached anime community review', { exact: true })).toBeVisible();

    // Characters are deliberately absent from the cache: the failure must end
    // visibly, while subsequent cached detail work remains usable.
    await page.getByRole('button', { name: 'Browse character list' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'Anime characters could not be loaded.' })).toBeVisible();
    await expect(page.getByText('Cached anime community review', { exact: true })).toBeVisible();

    await page.goto('/manga/2', { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: 'Cached Manga Detail', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Read community reviews' }).click();
    await expect(page.getByText('Cached manga community review', { exact: true })).toBeVisible();
    await expect(page.locator('.reviews').getByText('Unknown', { exact: true })).toBeVisible();
    await expect(page.locator('main#main-content')).toHaveCount(1);
  } finally {
    await context.setOffline(false);
  }
});
