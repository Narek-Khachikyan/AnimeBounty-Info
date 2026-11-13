import { expect, test } from '@playwright/test';

const records = [
  {
    mal_id: 901,
    title: 'The Lantern Journey',
    title_english: 'The Lantern Journey',
    score: 8.7,
    episodes: 12,
    chapters: 42,
    genres: [{ mal_id: 2, name: 'Adventure' }],
    aired: { string: 'Apr 2025 to Jun 2025' },
    images: { webp: { image_url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="280"%3E%3Crect width="200" height="280" fill="%23665a91"/%3E%3C/svg%3E' } },
  },
  { mal_id: 902, title: 'A Quiet Orbit', images: null, genres: null },
];

for (const media of ['anime', 'manga']) {
  test(`${media} search explains pending and empty results and recovers after reset`, async ({ page }) => {
    let finishEmpty;
    const emptyResponse = new Promise((resolve) => { finishEmpty = resolve; });
    await page.route('https://api.jikan.moe/v4/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname === `/v4/${media}`) {
        const empty = url.searchParams.get('q') === 'no-match';
        if (empty) await emptyResponse;
        await route.fulfill({ json: { data: empty ? [] : records } });
      } else {
        await route.fulfill({ json: { data: [] } });
      }
    });
    await page.goto(`/${media}`);
    const section = page.locator(`#${media}`);
    await expect(section.getByRole('heading', { name: 'The Lantern Journey', exact: true })).toBeVisible();
    await section.getByRole('textbox', { name: `Search ${media}`, exact: true }).fill('no-match');
    await expect(section.getByRole('status')).toHaveText(`Updating ${media} matches…`);
    await expect(section.getByRole('heading', { name: `No ${media} matches found` })).toHaveCount(0);
    finishEmpty();
    await expect(section.getByRole('heading', { name: `No ${media} matches found` })).toBeVisible();
    await section.getByRole('button', { name: `Reset ${media} search` }).click();
    await expect(section.getByRole('textbox', { name: `Search ${media}`, exact: true })).toHaveValue('');
    await expect(section.getByRole('heading', { name: 'The Lantern Journey', exact: true })).toBeVisible();
    await section.locator('summary').click();
    await expect(section.getByRole('button', { name: 'Score', exact: true })).toHaveAttribute('aria-pressed', 'true');
  });
}

test('home filter highlights follow effective values in both catalogues', async ({ page }) => {
  await page.route('https://api.jikan.moe/v4/**', async (route) => {
    const url = new URL(route.request().url());
    const isCatalogue = ['/v4/anime', '/v4/manga'].includes(url.pathname);
    const title = url.searchParams.get('order_by') === 'title' ? 'Title ordered result' : 'Score ordered result';
    await route.fulfill({ json: { data: isCatalogue ? [{ ...records[0], title, title_english: title }] : [] } });
  });
  await page.goto('/');
  const anime = page.locator('#anime');
  const manga = page.locator('#manga');
  await expect(anime.getByRole('heading', { name: 'Score ordered result' })).toBeVisible();
  await anime.locator('summary').click();
  await manga.locator('summary').click();
  await anime.getByRole('button', { name: 'Title', exact: true }).click();
  await anime.getByRole('button', { name: 'Ascending', exact: true }).click();
  await manga.scrollIntoViewIfNeeded();
  // Shared home settings must be represented by both sets of controls.
  for (const section of [anime, manga]) {
    await expect(section.getByRole('button', { name: 'Title', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(section.getByRole('button', { name: 'Ascending', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(section.getByRole('heading', { name: 'Title ordered result' })).toBeVisible();
  }
});

test('library distinguishes a filter miss from an empty shelf', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('animebounty:user-library:v1', JSON.stringify([{
      id: 901, type: 'anime', title: 'Saved Lantern', status: 'planning',
      favorite: false, route: '/anime/901', updatedAt: '2026-11-13T00:00:00Z',
    }]));
  });
  await page.goto('/library');
  await expect(page.getByRole('link', { name: /Saved Lantern/ })).toBeVisible();
  await page.getByRole('button', { name: 'Favorites only' }).click();
  await expect(page.getByRole('heading', { name: 'No titles match these filters.' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your shelf is empty.' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Clear library filters' }).click();
  await expect(page.getByRole('link', { name: /Saved Lantern/ })).toBeVisible();
});
