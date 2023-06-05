import { useCallback, useEffect, useState } from "react"
import TopManga from "../components/TopManga/TopManga"
import axios from "axios";
import LazyLoading from "../components/LazyLoading/LazyLoading"

const Manga = () => {
  const [mangaData, setMangaData] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  const fetchMangaData = useCallback(async () => {
    const response = await axios.get('https://api.jikan.moe/v4/top/manga')
    setMangaData(response.data.data)
  }, [])

  useEffect(() => {
    fetchMangaData();
    setIsLoading(false)
  }, []);

  return (
    <>
      {isLoading ? <LazyLoading /> : (
        <TopManga mangaData={mangaData} />
      )}
    </>
  )
}

export default Manga
