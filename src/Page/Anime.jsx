import { useEffect } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import LazyLoading from '../components/LazyLoading/LazyLoading';
import AOS from "aos";
import "aos/dist/aos.css";

import RecomendationsAnime from "../components/Recomendations/RecomendationsAnime/RecomendationsAnime"
import { useGetRecomendationAnimeQuery, useGetTopAnimeQuery } from '../features/apiSlice';



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
