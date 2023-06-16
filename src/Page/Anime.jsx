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
      {topAnimeLoading ? (
        <>
          <p className="text-center">If the content does not load for a long time, then reload the page or go back</p>
          <LazyLoading />
        </>
      ) : <TopAnimeSlider {...topAnime} />}
      {recomendationAnimeLoading ? (
        <>
          <p className="text-center">If the content does not load for a long time, then reload the page or go back</p>
          <LazyLoading />
        </>
      ) : <RecomendationsAnime {...recomendationAnime} />}

    </>
  )
}

export default Anime
