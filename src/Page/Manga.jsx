import { useEffect, useState } from "react"
import TopManga from "../components/TopManga/TopManga"
import LazyLoading from "../components/LazyLoading/LazyLoading"
import ErrorState from "../components/ErrorState/ErrorState"
import RecomendationsManga from "../components/Recomendations/RecomendationsManga/RecomendationsManga";
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetRecomendationMangaQuery, useGetTopMangaQuery } from "../features/apiSlice";
import MangaSearch from "../components/MangaSearch/MangaSearch";

const Manga = () => {
  const [orderBy, setOrderBy] = useState('score')
  const [sortBy, setSortBy] = useState('desc')
  const {
    data: topManga,
    isLoading: topMangaLoading,
    isFetching: topMangaFetching,
    isError: topMangaError,
    refetch: refetchTopManga,
  } = useGetTopMangaQuery()
  const {
    data: recomendationManga,
    isLoading: recomendationMangaLoading,
    isFetching: recomendationMangaFetching,
    isError: recomendationMangaError,
    refetch: refetchRecomendationManga,
  } = useGetRecomendationMangaQuery()

  useEffect(() => {
    AOS.init()
    AOS.refresh();
  }, []);

  return (
    <>
      <MangaSearch
        sortBy={sortBy}
        orderBy={orderBy}
        setOrderBy={setOrderBy}
        setSortBy={setSortBy}
        showMediaToggle={false}
      />
      {topMangaLoading ? <LazyLoading message="Loading top manga..." count={5} /> : topMangaError ? (
        <ErrorState
          message="Top manga could not be loaded."
          onRetry={refetchTopManga}
          isRetrying={topMangaFetching}
        />
      ) : <TopManga data={topManga?.data ?? []} />}
      {recomendationMangaLoading ? <LazyLoading message="Loading manga recommendations..." count={10} /> : recomendationMangaError ? (
        <ErrorState
          message="Manga recommendations could not be loaded."
          onRetry={refetchRecomendationManga}
          isRetrying={recomendationMangaFetching}
        />
      ) : <RecomendationsManga data={recomendationManga?.data ?? []} />}
    </>
  );
}

export default Manga
