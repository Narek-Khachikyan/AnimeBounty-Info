import { useEffect } from "react"
import TopManga from "../components/TopManga/TopManga"
import LazyLoading from "../components/LazyLoading/LazyLoading"
import RecomendationsManga from "../components/Recomendations/RecomendationsManga/RecomendationsManga";
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetRecomendationMangaQuery, useGetTopMangaQuery } from "../features/apiSlice";

const Manga = () => {
  const { data: topManga, isLoading: topMangaLoading } = useGetTopMangaQuery()
  const { data: recomendationManga, isLoading: recomendationMangaLoading } = useGetRecomendationMangaQuery()

  useEffect(() => {
    AOS.init()
    AOS.refresh();
  }, []);

  return (
    <>
      {topMangaLoading ? <LazyLoading /> : <TopManga {...topManga} />}
      {recomendationMangaLoading ? <LazyLoading /> : <RecomendationsManga {...recomendationManga} />}
    </>
  );
}

export default Manga
