import { useGetAnimeSearchQuery } from "../../features/apiSlice"
import Filter from "../Filter/Filter"
import Raiting from "../Filter/Raiting"
import Sort from "../Filter/Sort"
import LazyLoading from "../LazyLoading/LazyLoading"
import AnimeCard from "../AnimeCard/AnimeCard.jsx"
import { Link, useLocation } from "react-router-dom"
import "./animeSearch.scss"
import useDebounce from "../../hooks/useDebounce"
import { useState } from "react"

const AnimeSearch = ({ setOrderBy, setRaiting, setSortBy, orderBy, raiting, sortBy }) => {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 500)
  const { data: animeSearch } = useGetAnimeSearchQuery({ orderBy, raiting, sortBy, query: debouncedQuery });
  console.log(debouncedQuery)



  return (
    <div className="animeSearch">
      <div className="searchInput-wrapper flex flex-col gap-3 my-5 sm:flex-col sm:gap-3 md:flex-row md:justify-between md:items-center">
        <p className='text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Search your <a>anime</a> or <a href="#manga"><b>manga</b></a>!</p>
        <input className='searchInput' placeholder='Search Anime...' type="text" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      <div className="filter mb-8 sm:flex sm:flex-col sm:gap-3 md:flex md:justify-between md:items-center md:flex-row">
        <div className="orderedBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Ordered By:</p>
          <Filter setOrderBy={setOrderBy} />
        </div>
        <div className="raiting">
          <p className='text-base mt-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Raiting:</p>
          <Raiting setRaiting={setRaiting} />
        </div>
        <div className="sortBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl '>Sort By:</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-3 xl:grid-rows-2">
        {animeSearch ? (
          animeSearch.data.map(obj => (
            <Link key={obj.mal_id} to={`anime/anime/${obj.mal_id}`}>
              <AnimeCard {...obj} />
            </Link>
          ))
        ) : (
          <LazyLoading />
        )}
      </div>
    </div>
  )
}

export default AnimeSearch
