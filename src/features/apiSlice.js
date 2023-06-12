import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const fetchDataApi = createApi({
  reducerPath: "fetchDataApi",
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4' }),
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
    getMangaEpisodes: builder.query({
      query: (id) => `/manga/${id}/episodes`,
    }),

    getAnimeReviews: builder.query({
      query: (id) => `/anime/${id}/reviews`,
    }),
    getMangaReviews: builder.query({
      query: (id) => `/anime/${id}/reviews`,
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
  useGetMangaEpisodesQuery,
  useGetAnimeReviewsQuery,
  useGetMangaReviewsQuery
} = fetchDataApi;



