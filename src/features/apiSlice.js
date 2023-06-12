import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const topApi = createApi({
  reducerPath: "topApi",
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4/top' }),
  endpoints: (builder) => ({
    getTopAnime: builder.query({
      query: () => '/anime',
    }),
    getTopManga: builder.query({
      query: () => '/manga'
    }),
  })
})


export const recomendationApi = createApi({
  reducerPath: 'recomendationApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4/recommendations' }),
  endpoints: (builder) => ({
    getRecomendationAnime: builder.query({
      query: () => '/anime',
    }),
    getRecomendationManga: builder.query({
      query: () => '/manga'
    })
  }),
});



export const { useGetRecomendationAnimeQuery, useGetRecomendationMangaQuery } = recomendationApi;
export const { useGetTopAnimeQuery, useGetTopMangaQuery } = topApi
