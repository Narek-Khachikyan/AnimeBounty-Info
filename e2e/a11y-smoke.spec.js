import { expect, test } from '@playwright/test';

const animeItem = (malId, title) => ({
  mal_id: malId,
  title,
  score: 8.4,
  episodes: 12,
  aired: { string: 'Apr 2026' },
  images: { webp: {} },
  genres: [{ mal_id: 2, name: 'Adventure' }],
});

const mangaItem = (malId, title) => ({
  mal_id: malId,
  title,
  score: 8.1,
  chapters: 48,
  images: { webp: {} },
  genres: [{ mal_id: 8, name: 'Drama' }],
});

const routeJikan = async (page) => {
  await page.route('https://api.jikan.moe/v4/**', async (route) => {
    const requestUrl = new URL(route.request().url());
    const { pathname } = requestUrl;
    let body = { data: [] };

    if (pathname === '/v4/top/anime') {
      body = { data: [animeItem(10, 'Top Anime Fixture')] };
    } else if (pathname === '/v4/recommendations/anime') {
      body = { data: [{ entry: [animeItem(11, 'Recommended Anime Fixture')] }] };
    } else if (pathname === '/v4/seasons/now') {
      body = { data: [animeItem(14, 'Season Now Pick')] };
    } else if (pathname === '/v4/seasons/upcoming') {
      body = { data: [animeItem(15, 'Upcoming Season Pick')] };
    } else if (pathname === '/v4/schedules') {
      body = { data: [animeItem(16, 'Monday Schedule Pick')] };
    } else if (pathname === '/v4/genres/anime') {
      body = { data: [{ mal_id: 2, name: 'Adventure', count: 200 }] };
    } else if (pathname === '/v4/top/manga') {
      body = { data: [mangaItem(20, 'Top Manga Fixture')] };
    } else if (pathname === '/v4/recommendations/manga') {
      body = { data: [{ entry: [mangaItem(21, 'Recommended Manga Fixture')] }] };
    } else if (pathname === '/v4/genres/manga') {
      body = { data: [{ mal_id: 8, name: 'Drama', count: 180 }] };
    } else if (pathname === '/v4/anime') {
      body = { data: [animeItem(13, 'Search Anime Fixture')] };
    } else if (pathname === '/v4/manga') {
      body = { data: [mangaItem(23, 'Search Manga Fixture')] };
    } else if (pathname === '/v4/anime/1') {
      body = {
        data: {
          ...animeItem(1, 'Detail Anime Fixture'),
          title_english: 'Detail Anime Fixture',
          status: 'Finished Airing',
          year: 2026,
          rating: 'PG-13',
          studios: [{ mal_id: 1, name: 'Studio Fixture' }],
          trailer: { url: null, images: {} },
        },
      };
    } else if (pathname === '/v4/anime/1/pictures' || pathname === '/v4/anime/1/episodes') {
      body = { data: [] };
    } else if (pathname === '/v4/anime/1/characters') {
      body = { data: [] };
    } else if (pathname === '/v4/anime/1/relations') {
      body = { data: [] };
    } else if (pathname === '/v4/anime/1/streaming') {
      body = { data: [] };
    } else if (pathname === '/v4/anime/1/videos') {
      body = { data: { promo: [] } };
    } else if (pathname === '/v4/manga/2') {
      body = {
        data: {
          ...mangaItem(2, 'Detail Manga Fixture'),
          title_english: 'Detail Manga Fixture',
          status: 'Publishing',
          published: { string: '2026' },
          authors: [{ mal_id: 1, name: 'Author Fixture' }],
        },
      };
    } else if (pathname === '/v4/manga/2/pictures') {
      body = { data: [] };
    } else if (pathname === '/v4/manga/2/characters') {
      body = { data: [] };
    } else if (pathname === '/v4/manga/2/relations') {
      body = { data: [] };
    } else if (pathname === '/v4/characters/777/full') {
      body = {
        data: {
          mal_id: 777,
          name: 'Profile Character',
          name_kanji: 'プロフィール',
          favorites: 1234,
          about: 'A short mocked character biography.',
          images: { webp: { image_url: 'https://example.com/profile-character.webp' } },
          anime: [],
          manga: [],
        },
      };
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(body),
      status: 200,
    });
  });
};

test.beforeEach(async ({ page }) => {
  await routeJikan(page);
});

test.describe('Accessibility Smoke Tests', () => {
  test('skip link is present, receives focus on tab, and activates #main-content', async ({ page }) => {
    await page.goto('/');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();

    // Tab once to focus the skip link
    await page.keyboard.press('Tab');
    await expect(skipLink).toBeFocused();

    // Press Enter to activate the anchor
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*#main-content/);
  });

  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Anime list', path: '/anime' },
    { name: 'Manga list', path: '/manga' },
    { name: 'Library', path: '/library' },
    { name: 'About', path: '/about' },
    { name: 'Anime Details', path: '/anime/1' },
    { name: 'Manga Details', path: '/manga/2' },
    { name: 'Character Profile', path: '/character/777' },
  ];

  for (const r of routes) {
    test(`route ${r.name} (${r.path}) has exactly one main landmark with id="main-content"`, async ({ page }) => {
      await page.goto(r.path);

      // Verify exactly one element with id="main-content" exists in the DOM
      const mainContent = page.locator('#main-content');
      await expect(mainContent).toHaveCount(1);

      // Verify it's a <main> element
      const tag = await mainContent.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('main');
    });
  }
});
