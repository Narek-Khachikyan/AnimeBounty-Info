import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';

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

const isTransientJikanError = (error) => {
  const status = error?.status;

  return (
    status === 429 ||
    status === "FETCH_ERROR" ||
    status === "TIMEOUT_ERROR" ||
    (typeof status === "number" && status >= 500)
  );
};

const staggeredBaseQuery = retry(
  fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
  {
    maxRetries: 2,
    retryCondition: (error) => isTransientJikanError(error),
  }
);

export const fetchDataApi = createApi({
  reducerPath: "fetchDataApi",
  baseQuery: staggeredBaseQuery,
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
      query: ({ orderBy, rating, sortBy, query }) => buildSearchQuery("anime", {
        order_by: orderBy,
        rating,
        sort: sortBy,
        q: query,
      }),
    }),

    getMangaSearch: builder.query({
      query: ({ orderBy, sortBy, query }) => buildSearchQuery("manga", {
        order_by: orderBy,
        sort: sortBy,
        q: query,
      }),
    }),

  })
})



export const {
  useGetRecomendationAnimeQuery,
  useGetRecomendationMangaQuery,

  useGetTopAnimeQuery,
  useGetTopMangaQuery,

  useGetFullAnimeQuery,
  useGetFullMangaQuery,

  useGetAnimePicturesQuery,
  useGetMangaPicturesQuery,

  useGetAnimeEpisodesQuery,

  useGetAnimeCharactersQuery,
  useGetMangaCharactersQuery,
  useLazyGetAnimeCharactersQuery,
  useLazyGetMangaCharactersQuery,

  useGetAnimeReviewsQuery,
  useGetMangaReviewsQuery,
  useLazyGetAnimeReviewsQuery,
  useLazyGetMangaReviewsQuery,

  useGetAnimeSearchQuery,
  useGetMangaSearchQuery,
} = fetchDataApi;
