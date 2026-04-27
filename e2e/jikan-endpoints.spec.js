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
    const { pathname, searchParams } = requestUrl;
    let body = { data: [] };

    if (pathname === '/v4/top/anime') {
      body = { data: [animeItem(10, 'Top Anime Fixture')] };
    } else if (pathname === '/v4/recommendations/anime') {
      body = { data: [{ entry: [animeItem(11, 'Recommended Anime Fixture')] }] };
    } else if (pathname === '/v4/anime') {
      body = {
        data: [
          animeItem(
            searchParams.get('genres') === '2' ? 12 : 13,
            searchParams.get('genres') === '2' ? 'Adventure Anime Pick' : 'Search Anime Fixture'
          ),
        ],
      };
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
    } else if (pathname === '/v4/manga') {
      body = {
        data: [
          mangaItem(
            searchParams.get('genres') === '8' ? 22 : 23,
            searchParams.get('genres') === '8' ? 'Drama Manga Pick' : 'Search Manga Fixture'
          ),
        ],
      };
    } else if (pathname === '/v4/genres/manga') {
      body = { data: [{ mal_id: 8, name: 'Drama', count: 180 }] };
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
      body = {
        data: [
          {
            role: 'Main',
            character: {
              mal_id: 777,
              name: 'Profile Character',
              images: { webp: {} },
            },
            voice_actors: [],
          },
        ],
      };
    } else if (pathname === '/v4/anime/1/relations') {
      body = {
        data: [
          {
            relation: 'Sequel',
            entry: [{ mal_id: 9, type: 'anime', name: 'Relation Anime Fixture', url: 'https://myanimelist.net/anime/9' }],
          },
        ],
      };
    } else if (pathname === '/v4/anime/1/streaming') {
      body = { data: [{ name: 'Crunchyroll Fixture', url: 'https://example.com/stream' }] };
    } else if (pathname === '/v4/anime/1/videos') {
      body = {
        data: {
          promo: [
            {
              title: 'Promo Fixture',
              trailer: {
                url: 'https://example.com/video',
                images: { image_url: null },
              },
            },
          ],
        },
      };
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
      body = {
        data: [
          {
            role: 'Main',
            character: {
              mal_id: 777,
              name: 'Profile Character',
              images: { webp: {} },
            },
          },
        ],
      };
    } else if (pathname === '/v4/manga/2/relations') {
      body = {
        data: [
          {
            relation: 'Adaptation',
            entry: [{ mal_id: 1, type: 'anime', name: 'Manga Relation Anime', url: 'https://myanimelist.net/anime/1' }],
          },
        ],
      };
    } else if (pathname === '/v4/characters/777') {
      body = {
        data: {
          mal_id: 777,
          name: 'Profile Character',
          name_kanji: 'プロフィール',
          favorites: 1234,
          about: 'A short mocked character biography.',
          images: { webp: {} },
        },
      };
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify(body),
    });
  });
};

test.beforeEach(async ({ page }) => {
  await routeJikan(page);
});

test('anime page lazy-loads seasonal spotlight and filters search by genre', async ({ page }) => {
  await page.goto('/anime');

  await expect(page.getByRole('heading', { name: 'Seasonal spotlight' })).toBeVisible();
  await expect(page.getByText('Season Now Pick')).toHaveCount(0);

  await page.getByRole('button', { name: 'Open seasonal spotlight' }).click();
  await expect(page.getByText('Season Now Pick')).toBeVisible();

  await page.getByRole('button', { name: 'Schedule' }).click();
  await expect(page.getByText('Monday Schedule Pick')).toBeVisible();

  await page.getByRole('button', { name: 'Adventure' }).click();
  await expect(page.getByText('Adventure Anime Pick')).toBeVisible();
});

test('manga page filters search by manga genre', async ({ page }) => {
  await page.goto('/manga');

  await page.getByRole('button', { name: 'Drama' }).click();
  await expect(page.getByText('Drama Manga Pick')).toBeVisible();
});

test('anime details expose relations, streaming, videos, and character profile on demand', async ({ page }) => {
  await page.goto('/anime/1');

  await page.getByRole('button', { name: 'Explore relations' }).click();
  await expect(page.getByText('Relation Anime Fixture')).toBeVisible();

  await page.getByRole('button', { name: 'Find streams' }).click();
  await expect(page.getByRole('link', { name: 'Crunchyroll Fixture' })).toBeVisible();

  await page.getByRole('button', { name: 'Watch videos' }).click();
  await expect(page.getByRole('link', { name: 'Promo Fixture' })).toBeVisible();

  await page.getByRole('button', { name: 'Browse character list' }).click();
  await page.getByRole('button', { name: 'Open profile for Profile Character' }).click();
  await expect(page.getByRole('heading', { name: 'Profile Character' })).toBeVisible();
  await expect(page.getByText('A short mocked character biography.')).toBeVisible();
});

test('manga details expose relations and character profile on demand', async ({ page }) => {
  await page.goto('/manga/2');

  await page.getByRole('button', { name: 'Explore relations' }).click();
  await expect(page.getByText('Manga Relation Anime')).toBeVisible();

  await page.getByRole('button', { name: 'Browse character list' }).click();
  await page.getByRole('button', { name: 'Open profile for Profile Character' }).click();
  await expect(page.getByRole('heading', { name: 'Profile Character' })).toBeVisible();
});
