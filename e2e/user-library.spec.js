import { expect, test } from '@playwright/test';

const routeJikanDetail = async (page) => {
  await page.route('https://api.jikan.moe/v4/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const { pathname } = requestUrl;
    let body = { data: [] };

    if (pathname === '/v4/anime/1') {
      body = {
        data: {
          mal_id: 1,
          title: 'Library Anime Fixture',
          score: 9.2,
          episodes: 12,
          status: 'Finished Airing',
          year: 2026,
          rating: 'PG-13',
          studios: [{ mal_id: 1, name: 'Library Studio' }],
          images: { webp: {} },
          trailer: { url: null, images: {} },
        },
      };
    } else if (pathname === '/v4/anime/1/pictures' || pathname === '/v4/anime/1/episodes') {
      body = { data: [] };
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
};

test.beforeEach(async ({ page }) => {
  await routeJikanDetail(page);
});

test('saved anime persists in the local library and renders offline', async ({ page, context }) => {
  await page.goto('/anime/1');

  await expect(page.getByRole('heading', { name: 'Library Anime Fixture' })).toBeVisible();
  await page.getByRole('button', { name: 'Save to library' }).click();
  await page.getByLabel('Library status').selectOption('completed');
  await page.getByRole('button', { name: 'Mark as favorite' }).click();

  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page.getByRole('heading', { name: 'Your library' })).toBeVisible();
  const savedCard = page.getByRole('link', { name: /Library Anime Fixture/i });
  await expect(savedCard).toBeVisible();
  await expect(savedCard.getByText('Completed')).toBeVisible();
  await expect(savedCard.getByText('Favorite')).toBeVisible();

  await page.reload();
  await expect(page.getByRole('link', { name: /Library Anime Fixture/i })).toBeVisible();

  await context.setOffline(true);

  try {
    await page.goto('/library');
    await expect(page.getByRole('link', { name: /Library Anime Fixture/i })).toBeVisible();
    await page.getByRole('button', { name: 'Favorites only' }).click();
    await expect(page.getByRole('link', { name: /Library Anime Fixture/i })).toBeVisible();
  } finally {
    await context.setOffline(false);
  }
});
