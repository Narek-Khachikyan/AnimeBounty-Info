import { useCallback, useEffect, useState } from 'react';
import TopAnimeSlider from '../components/TopAnimeSlider/TopAnimeSlider'
import axios from 'axios';
import LazyLoading from '../components/LazyLoading/LazyLoading';

const Anime = () => {
  const [animeData, setAnimeData] = useState([]);
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
  useEffect(() => {
    fetchAnimeData();
    setIsloading(false)
  }, [fetchAnimeData]);

  return (
    <>
      {isLoading ? <LazyLoading /> : (
        <TopAnimeSlider animeData={animeData} />
      )}

    </>
  )
}

export default Anime
