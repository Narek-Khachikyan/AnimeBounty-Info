import { useEffect } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import LazyLoading from '../components/LazyLoading/LazyLoading';
import ErrorState from '../components/ErrorState/ErrorState';
import AOS from "aos";
import "aos/dist/aos.css";

import RecomendationsAnime from "../components/Recomendations/RecomendationsAnime/RecomendationsAnime"
import { useGetRecomendationAnimeQuery, useGetTopAnimeQuery } from '../features/apiSlice';



const Anime = () => {
  const {
    data: topAnime,
    isLoading: topAnimeLoading,
    isFetching: topAnimeFetching,
    isError: topAnimeError,
    refetch: refetchTopAnime,
  } = useGetTopAnimeQuery()
  const {
    data: recomendationAnime,
    isLoading: recomendationAnimeLoading,
    isFetching: recomendationAnimeFetching,
    isError: recomendationAnimeError,
    refetch: refetchRecomendationAnime,
  } = useGetRecomendationAnimeQuery()

  useEffect(() => {
    AOS.init()
    AOS.refresh();
  }, []);

  return (
    <>
      {topAnimeLoading ? (
        <LazyLoading message="Loading top anime..." count={5} />
      ) : topAnimeError ? (
        <ErrorState
          message="Top anime could not be loaded."
          onRetry={refetchTopAnime}
          isRetrying={topAnimeFetching}
        />
      ) : <TopAnimeSlider data={topAnime?.data ?? []} />}
      {recomendationAnimeLoading ? (
        <LazyLoading message="Loading anime recommendations..." count={10} />
      ) : recomendationAnimeError ? (
        <ErrorState
          message="Anime recommendations could not be loaded."
          onRetry={refetchRecomendationAnime}
          isRetrying={recomendationAnimeFetching}
        />
      ) : <RecomendationsAnime data={recomendationAnime?.data ?? []} />}

    </>
  )
}

export default Anime
