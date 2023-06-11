import { useCallback, useEffect, useState } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import axios from 'axios';
import LazyLoading from '../components/LazyLoading/LazyLoading';
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetRecomendationAnimeQuery } from '../features/apiSlice';
import RecomendationsAnime from "../components/Recomendations/RecomendationsAnime/RecomendationsAnime"



const Anime = () => {
  const [animeData, setAnimeData] = useState([]);
  const [recomendations, setRecomendations] = useState([])
  const [isLoading, setIsloading] = useState(true)
  const { data } = useGetRecomendationAnimeQuery()

  console.log(data.data)

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

  // const fetchRecomendations = () => {
  //   setRecomendations(data.data)
  // }

  useEffect(() => {
    fetchAnimeData();
    // fetchRecomendations()
    AOS.init()
    AOS.refresh();
    setIsloading(false)
  }, []);


  return (
    <>
      {isLoading ? <LazyLoading /> : (
        <>
          <TopAnimeSlider animeData={animeData} />
          {/* <RecomendationsAnime recomendations={data.data} /> */}
        </>
      )}

    </>
  )
}

export default Anime
