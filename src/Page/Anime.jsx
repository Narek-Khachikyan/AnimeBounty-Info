import { useCallback, useEffect, useState } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import axios from 'axios';
import LazyLoading from '../components/LazyLoading/LazyLoading';
import RecomendationsAnime from '../components/Recomendations/RecomendationsAnime/RecomendationsAnime';
import AOS from "aos";
import "aos/dist/aos.css";



const Anime = () => {
  const [animeData, setAnimeData] = useState([]);
  const [recomendations, setRecomendations] = useState([])
  const [isLoading, setIsloading] = useState(true)

  const fetchAnimeData = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem("animeData");
      if (cachedData) {
        setAnimeData(JSON.parse(cachedData));
      } else {
        const response = await axios.get("https://api.jikan.moe/v4/top/anime");
        const newData = response.data.data;

        localStorage.setItem("animeData", JSON.stringify(newData));
        setAnimeData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchRecomendations = async () => {
    try {
      const response = await axios.get('https://api.jikan.moe/v4/recommendations/anime')
      setRecomendations(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchAnimeData();
    fetchRecomendations()
    AOS.init()
    AOS.refresh();
    setIsloading(false)
  }, []);


  return (
    <>
      {isLoading ? <LazyLoading /> : (
        <>
          <TopAnimeSlider animeData={animeData} />
          <RecomendationsAnime recomendations={recomendations} />
        </>
      )}

    </>
  )
}

export default Anime
