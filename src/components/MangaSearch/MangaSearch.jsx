import { useState } from "react"
import { useGetMangaSearchQuery } from "../../features/apiSlice"
import useDebounce from "../../hooks/useDebounce"
import Filter from "../Filter/Filter"
import Sort from "../Filter/Sort"
import MangaCard from "../MangaCard/MangaCard.jsx"
import LazyLoading from "../LazyLoading/LazyLoading"
import { Link } from "react-router-dom"


const MangaSearch = ({ orderBy, setOrderBy, setSortBy, sortBy }) => {
  const [queryManga, setQueryManga] = useState("")
  const debouncedQuery = useDebounce(queryManga, 500)

  const { data: mangaSearch } = useGetMangaSearchQuery({ orderBy, sortBy, query: debouncedQuery })
  return (
    <div id='manga' className="MangaSearch pt-8">
      <div className="searchInputManga-wrapper flex flex-col gap-3  my-5 sm:flex-col sm:gap-3 md:flex-row md:justify-between md:items-center" >
        <p className='text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Search your manga or <a onClick={() => scrollTo(0, 0)}><b className=' cursor-pointer'>anime</b>
        </a>!</p>
        <input className='searchInput' placeholder='Search Manga...' type="text" value={queryManga} onChange={event => setQueryManga(event.target.value)} />
      </div>
      <div className="filter mb-8 sm:flex sm:flex-col sm:gap-3 md:flex md:justify-between md:items-center md:flex-row">
        <div className="orderedBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Ordered By:</p>
          <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        <div className="sortBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl '>Sort By:</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-4 xl:grid-rows-3">
        {mangaSearch ? (
          mangaSearch.data.map(obj => (
            <Link key={obj.mal_id} to={`manga/manga/${obj.mal_id}`}>
              <MangaCard {...obj} />
            </Link>
          ))
        ) : (
          <LazyLoading />
        )}
      </div>
    </div>
  )
}

export default MangaSearch
