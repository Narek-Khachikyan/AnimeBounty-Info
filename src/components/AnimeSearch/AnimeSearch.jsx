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

const AnimeSearch = ({ setOrderBy, setRating, setSortBy, orderBy, rating, sortBy, showMediaToggle = true }) => {
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
          <h1>Find a title that fits tonight.</h1>
          <p className="search-panel__subtitle">A cleaner shelf for top-rated series, films, and comfort rewatches. Search first, then tune the list by rating and mood.</p>
        </div>
        <div className="search-panel__actions">
          {showMediaToggle ? (
            <div className="media-toggle" aria-label="Choose catalogue type">
              <span className="media-toggle__item media-toggle__item--active">Anime</span>
              <a className="media-toggle__item" href="#manga">Manga</a>
            </div>
          ) : null}
          <input className="searchInput" placeholder="Search anime..." type="text" value={query} onChange={event => setQuery(event.target.value)} />
        </div>
      </div>
      <div className="filter search-filters">
        <div className="search-filters__summary">
          <span>Current shelf</span>
          <strong>{orderBy} / {rating} / {sortBy}</strong>
        </div>
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
      <div className="search-content catalogue-grid">
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
            <Link key={obj.mal_id} to={`/anime/${obj.mal_id}`}>
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
  showMediaToggle: PropTypes.bool,
};

export default AnimeSearch;
