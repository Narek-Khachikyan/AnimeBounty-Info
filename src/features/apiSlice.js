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
      query: (id) => `/anime/${id}/reviews`,
    }),

    getAnimeSearch: builder.query({
      query: ({ orderBy, raiting, sortBy, query }) => `anime?order_by=${orderBy}&rating=${raiting}&sort=${sortBy}&q=${query ? query : ''}`,
    }),

    getMangaSearch: builder.query({
      query: (queryManga) => `https://api.jikan.moe/v4/manga?q=${queryManga}`,
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

  useGetAnimeCharactersQuery,
  useGetMangaCharactersQuery,

  useGetAnimeReviewsQuery,
  useGetMangaReviewsQuery,

  useGetAnimeSearchQuery,
  useGetMangaSearchQuery,
} = fetchDataApi;



