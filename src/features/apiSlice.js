import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const recomendationApi = createApi({
  reducerPath: 'recomendationApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.jikan.moe/v4/recommendations' }),
  endpoints: (builder) => ({
    getRecomendationAnime: builder.query({
      query: () => '/anime',
    }),
  }),
});

// Экспортируем хуки для использования в компонентах
export const { useGetRecomendationAnimeQuery } = recomendationApi;

export default recomendationApi;
