import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGetAnimeSearchQuery } from "../../features/apiSlice";
import Filter from "../Filter/Filter";
import Rating from "../Filter/Rating";
import Sort from "../Filter/Sort";
import LazyLoading from "../LazyLoading/LazyLoading";
import AnimeCard from "../AnimeCard/AnimeCard.jsx";
import "./animeSearch.scss";
import useDebounce from "../../hooks/useDebounce";

const AnimeSearch = ({ setOrderBy, setRating, setSortBy, orderBy, rating, sortBy }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const { data: animeSearch } = useGetAnimeSearchQuery({ orderBy, rating, sortBy, query: debouncedQuery });



  return (
    <div className="animeSearch">
      <div className="searchInput-wrapper flex flex-col gap-3 my-5 sm:flex-col sm:gap-3 md:flex-row md:justify-between md:items-center">
        <p className='text-base sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Search your <span className="font-bold">anime</span> or <span className="font-bold">manga</span>!</p>
        <input className='searchInput' placeholder='Search Anime...' type="text" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      <div className="filter mb-8 sm:flex sm:flex-col sm:gap-3 md:flex md:justify-between md:items-center md:flex-row">
        <div className="orderedBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Ordered By:</p>
          <Filter setOrderBy={setOrderBy} />
        </div>
        <div className="rating">
          <p className='text-base mt-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl'>Rating:</p>
          <Rating setRating={setRating} />
        </div>
        <div className="sortBy">
          <p className='text-base mb-2 sm:text-base md:text-xl lg:text-2xl xl:text-2xl '>Sort By:</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-3 xl:grid-rows-2">
        {animeSearch ? (
          animeSearch.data.map(obj => (
            <Link key={obj.mal_id} to={`anime/${obj.mal_id}`}>
              <AnimeCard {...obj} />
            </Link>
          ))
        ) : (
          <>
            <p className="text-center">If the content does not load for a long time, then reload the page or go back</p>
            <LazyLoading />
          </>
        )}
      </div>
    </div>
  )
}

AnimeSearch.propTypes = {
  setOrderBy: PropTypes.func.isRequired,
  setRating: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
  orderBy: PropTypes.string.isRequired,
  rating: PropTypes.string.isRequired,
  sortBy: PropTypes.string.isRequired,
};

export default AnimeSearch;
