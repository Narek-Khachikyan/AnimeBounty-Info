import { useEffect } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import LazyLoading from '../components/LazyLoading/LazyLoading';
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetRecomendationAnimeQuery, useGetTopAnimeQuery } from '../features/apiSlice';
import RecomendationsAnime from "../components/Recomendations/RecomendationsAnime/RecomendationsAnime"

const Anime = () => {
  const { data: topAnime, isLoading: topAnimeLoading } = useGetTopAnimeQuery()
  const { data: recomendationAnime, isLoading: recomendationAnimeLoading } = useGetRecomendationAnimeQuery()

  useEffect(() => {
    AOS.init()
    AOS.refresh();
  }, []);

  return (
    <>
      {topAnimeLoading ? <LazyLoading /> : <TopAnimeSlider {...topAnime} />}
      {recomendationAnimeLoading ? <LazyLoading /> : <RecomendationsAnime {...recomendationAnime} />}

    </>
  )
}

export default Anime
