import { useEffect, useState } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import LazyLoading from '../components/LazyLoading/LazyLoading';
import ErrorState from '../components/ErrorState/ErrorState';
import AOS from "aos";
import "aos/dist/aos.css";
import AnimeSearch from '../components/AnimeSearch/AnimeSearch';
import SeasonalSpotlight from '../components/SeasonalSpotlight/SeasonalSpotlight';

import RecomendationsAnime from "../components/Recomendations/RecomendationsAnime/RecomendationsAnime"
import { useGetRecomendationAnimeQuery, useGetTopAnimeQuery } from '../features/apiSlice';



const Anime = () => {
  const [orderBy, setOrderBy] = useState('score')
  const [sortBy, setSortBy] = useState('desc')
  const [rating, setRating] = useState('pg13')
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
    <main className="anime-page" id="main-content">
      <AnimeSearch
        sortBy={sortBy}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        setRating={setRating}
        rating={rating}
        orderBy={orderBy}
        showMediaToggle={false}
      />
      <SeasonalSpotlight />
      {topAnimeLoading ? (
        <LazyLoading message="Loading top anime..." count={5} />
      ) : topAnimeError ? (
        <ErrorState
          message="Top anime could not be loaded."
          onRetry={refetchTopAnime}
          isRetrying={topAnimeFetching}
          role="alert"
        />
      ) : <TopAnimeSlider data={topAnime?.data ?? []} />}
      {recomendationAnimeLoading ? (
        <LazyLoading message="Loading anime recommendations..." count={10} />
      ) : recomendationAnimeError ? (
        <ErrorState
          message="Anime recommendations could not be loaded."
          onRetry={refetchRecomendationAnime}
          isRetrying={recomendationAnimeFetching}
          role="alert"
        />
      ) : <RecomendationsAnime data={recomendationAnime?.data ?? []} />}

    </main>
  )
}

export default Anime
