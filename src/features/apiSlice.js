import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createJikanBaseQuery } from './jikanScheduler';
import { createOwnedQueryHook, createOwnedLazyQueryHook } from './ownedQueryHooks';

export const buildSearchQuery = (resource, params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `${resource}?${queryString}` : resource;
};

const scheduledBaseQuery = createJikanBaseQuery(fetchBaseQuery({
  baseUrl: 'https://api.tenrai.org/v1',
  timeout: 15000,
}));

export const fetchDataApi = createApi({
  reducerPath: "fetchDataApi",
  baseQuery: scheduledBaseQuery,
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getTopAnime: builder.query({
      query: () => '/top/anime',
    }),
    getTopManga: builder.query({
      query: () => '/top/manga'
    }),

    getRecomendationAnime: builder.query({
      query: () => '/recommendations/anime',
    }),
    getRecomendationManga: builder.query({
      query: () => '/recommendations/manga'
    }),

    getFullAnime: builder.query({
      query: (id) => `/anime/${id}`,
    }),
    getFullManga: builder.query({
      query: (id) => `/manga/${id}`,
    }),

    getAnimePictures: builder.query({
      query: (id) => `/anime/${id}/pictures`,
    }),
    getMangaPictures: builder.query({
      query: (id) => `/manga/${id}/pictures`,
    }),

    getAnimeEpisodes: builder.query({
      query: (id) => `/anime/${id}/episodes`,
    }),

    getAnimeCharacters: builder.query({
      query: (id) => `/anime/${id}/characters`,
    }),
    getMangaCharacters: builder.query({
      query: (id) => `/manga/${id}/characters`,
    }),


    getAnimeReviews: builder.query({
      query: (id) => `/anime/${id}/reviews`,
    }),
    getMangaReviews: builder.query({
      query: (id) => `/manga/${id}/reviews`,
    }),

    getAnimeSearch: builder.query({
      query: ({ orderBy, rating, sortBy, query, genreId }) => buildSearchQuery("anime", {
        order_by: orderBy,
        rating,
        sort: sortBy,
        q: query,
        genres: genreId,
      }),
    }),

    getMangaSearch: builder.query({
      query: ({ orderBy, sortBy, query, genreId }) => buildSearchQuery("manga", {
        order_by: orderBy,
        sort: sortBy,
        q: query,
        genres: genreId,
      }),
    }),

    getSeasonNow: builder.query({
      query: () => '/seasons/now',
    }),
    getSeasonUpcoming: builder.query({
      query: () => '/seasons/upcoming',
    }),
    getSchedules: builder.query({
      query: ({ filter } = {}) => buildSearchQuery("schedules", { filter }),
    }),

    getAnimeGenres: builder.query({
      query: () => '/genres/anime',
    }),
    getMangaGenres: builder.query({
      query: () => '/genres/manga',
    }),

    getAnimeRelations: builder.query({
      query: (id) => `/anime/${id}/relations`,
    }),
    getAnimeStreaming: builder.query({
      query: (id) => `/anime/${id}/streaming`,
    }),
    getAnimeVideos: builder.query({
      query: (id) => `/anime/${id}/videos`,
    }),
    getMangaRelations: builder.query({
      query: (id) => `/manga/${id}/relations`,
    }),
    getCharacterFull: builder.query({
      query: (id) => `/characters/${id}/full`,
    }),

  })
})



export const {
  useGetRecomendationAnimeQuery,
  useGetRecomendationMangaQuery,

  useGetTopAnimeQuery,
  useGetTopMangaQuery,

  useGetAnimeSearchQuery,
  useGetMangaSearchQuery,
  useLazyGetAnimeSearchQuery,
  useLazyGetMangaSearchQuery,

  useLazyGetSeasonNowQuery,
  useLazyGetSeasonUpcomingQuery,
  useLazyGetSchedulesQuery,

  useGetAnimeGenresQuery,
  useGetMangaGenresQuery,

  useGetCharacterFullQuery,
  useLazyGetCharacterFullQuery,
} = fetchDataApi;

export const useGetFullAnimeQuery = createOwnedQueryHook(fetchDataApi, 'getFullAnime');
export const useGetFullMangaQuery = createOwnedQueryHook(fetchDataApi, 'getFullManga');
export const useGetAnimePicturesQuery = createOwnedQueryHook(fetchDataApi, 'getAnimePictures');
export const useGetMangaPicturesQuery = createOwnedQueryHook(fetchDataApi, 'getMangaPictures');
export const useGetAnimeEpisodesQuery = createOwnedQueryHook(fetchDataApi, 'getAnimeEpisodes');
export const useGetAnimeCharactersQuery = createOwnedQueryHook(fetchDataApi, 'getAnimeCharacters');
export const useLazyGetAnimeCharactersQuery = createOwnedLazyQueryHook(fetchDataApi, 'getAnimeCharacters');
export const useGetMangaCharactersQuery = createOwnedQueryHook(fetchDataApi, 'getMangaCharacters');
export const useLazyGetMangaCharactersQuery = createOwnedLazyQueryHook(fetchDataApi, 'getMangaCharacters');
export const useGetAnimeReviewsQuery = createOwnedQueryHook(fetchDataApi, 'getAnimeReviews');
export const useLazyGetAnimeReviewsQuery = createOwnedLazyQueryHook(fetchDataApi, 'getAnimeReviews');
export const useGetMangaReviewsQuery = createOwnedQueryHook(fetchDataApi, 'getMangaReviews');
export const useLazyGetMangaReviewsQuery = createOwnedLazyQueryHook(fetchDataApi, 'getMangaReviews');
export const useLazyGetAnimeRelationsQuery = createOwnedLazyQueryHook(fetchDataApi, 'getAnimeRelations');
export const useLazyGetMangaRelationsQuery = createOwnedLazyQueryHook(fetchDataApi, 'getMangaRelations');
export const useLazyGetAnimeStreamingQuery = createOwnedLazyQueryHook(fetchDataApi, 'getAnimeStreaming');
export const useLazyGetAnimeVideosQuery = createOwnedLazyQueryHook(fetchDataApi, 'getAnimeVideos');
