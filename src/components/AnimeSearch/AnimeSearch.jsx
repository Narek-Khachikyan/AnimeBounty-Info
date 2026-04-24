import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGetAnimeSearchQuery } from "../../features/apiSlice";
import Filter from "../Filter/Filter";
import Rating from "../Filter/Rating";
import Sort from "../Filter/Sort";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import AnimeCard from "../AnimeCard/AnimeCard.jsx";
import "./animeSearch.scss";
import useDebounce from "../../hooks/useDebounce";

const AnimeSearch = ({ setOrderBy, setRating, setSortBy, orderBy, rating, sortBy }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: animeSearch,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAnimeSearchQuery({ orderBy, rating, sortBy, query: debouncedQuery });
  const animeSearchItems = animeSearch?.data ?? [];



  return (
    <section id="anime" className="animeSearch catalogue-search">
      <div className="search-panel">
        <div className="search-panel__copy">
          <p className="section-kicker">Anime catalogue</p>
          <h1>Find your next watch in seconds.</h1>
          <p className="search-panel__subtitle">Search the anime library, tune the rating, and sort by score, popularity, or title.</p>
        </div>
        <div className="search-panel__actions">
          <div className="media-toggle" aria-label="Choose catalogue type">
            <span className="media-toggle__item media-toggle__item--active">Anime</span>
            <a className="media-toggle__item" href="#manga">Manga</a>
          </div>
          <input className="searchInput" placeholder="Search anime..." type="text" value={query} onChange={event => setQuery(event.target.value)} />
        </div>
      </div>
      <div className="filter search-filters">
        <div className="search-filters__group">
          <p>Order by</p>
          <Filter setOrderBy={setOrderBy} />
        </div>
        <div className="search-filters__group">
          <p>Rating</p>
          <Rating setRating={setRating} />
        </div>
        <div className="search-filters__group">
          <p>Sort</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content grid gap-4 sm:grid-cols-1 md:grid-cols-2 md:grid-rows-1 lg:grid-cols-3 lg:grid-rows-2 xl:grid-cols-3 xl:grid-rows-2">
        {isLoading ? (
          <LazyLoading message="Loading anime matches..." count={6} />
        ) : isError ? (
          <ErrorState
            message="Anime search could not be loaded."
            onRetry={refetch}
            isRetrying={isFetching}
          />
        ) : (
          animeSearchItems.map(obj => (
            <Link key={obj.mal_id} to={`anime/${obj.mal_id}`}>
              <AnimeCard {...obj} />
            </Link>
          ))
        )}
      </div>
    </section>
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
