import { useCallback, useEffect, useState } from "react"
import TopManga from "../components/TopManga/TopManga"
import axios from "axios";
import LazyLoading from "../components/LazyLoading/LazyLoading"
import RecomendationsManga from "../components/Recomendations/RecomendationsManga/RecomendationsManga";

const Manga = () => {
  const [mangaData, setMangaData] = useState([]);
  const [recomendationsManga, setRecomendationsManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const fetchMangaData = useCallback(async () => {
    const response = await axios.get('https://api.jikan.moe/v4/top/manga')
    setMangaData(response.data.data)
  }, [])
  const fetchRecomendationsManga = useCallback(async () => {
    const response = await axios.get('https://api.jikan.moe/v4/recommendations/manga')
    setRecomendationsManga(response.data.data)
  }, [])

  useEffect(() => {
    fetchMangaData();
    fetchRecomendationsManga()
    setIsLoading(false)
  }, []);

  return (
    <>
      {isLoading ? <LazyLoading /> : (
        <div>
          <TopManga mangaData={mangaData} />
          <RecomendationsManga recomendationsManga={recomendationsManga} />
        </div>
      )}
    </>
  );
}

export default Manga
