import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGetMangaSearchQuery } from "../../features/apiSlice";
import useDebounce from "../../hooks/useDebounce";
import Filter from "../Filter/Filter";
import Sort from "../Filter/Sort";
import MangaCard from "../MangaCard/MangaCard.jsx";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import "./mangaSearch.scss";

const MangaSearch = ({ orderBy, setOrderBy, setSortBy, sortBy, showMediaToggle = true }) => {
  const [queryManga, setQueryManga] = useState("");
  const debouncedQuery = useDebounce(queryManga, 500);

  const {
    data: mangaSearch,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMangaSearchQuery({ orderBy, sortBy, query: debouncedQuery });
  const mangaSearchItems = mangaSearch?.data ?? [];

  return (
    <section id="manga" className="MangaSearch catalogue-search py-8">
      <div className="search-panel search-panel--manga">
        <div className="search-panel__copy">
          <p className="section-kicker">Manga catalogue</p>
          <h2>Browse the shelf before you commit.</h2>
          <p className="search-panel__subtitle">Move from popular series to quieter finds with the same simple search and sort rhythm.</p>
        </div>
        <div className="search-panel__actions">
          {showMediaToggle ? (
            <div className="media-toggle" aria-label="Choose catalogue type">
              <a className="media-toggle__item" href="#anime">Anime</a>
              <span className="media-toggle__item media-toggle__item--active">Manga</span>
            </div>
          ) : null}
          <input className="searchInput" placeholder="Search manga..." type="text" value={queryManga} onChange={event => setQueryManga(event.target.value)} />
        </div>
      </div>
      <div className="filter search-filters">
        <div className="search-filters__summary">
          <span>Current shelf</span>
          <strong>{orderBy} / {sortBy}</strong>
        </div>
        <div className="search-filters__group">
          <p>Order by</p>
          <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        <div className="search-filters__group">
          <p>Sort</p>
          <Sort setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-content catalogue-grid">
        {isLoading ? (
          <LazyLoading message="Loading manga matches..." count={8} />
        ) : isError ? (
          <ErrorState
            message="Manga search could not be loaded."
            onRetry={refetch}
            isRetrying={isFetching}
          />
        ) : (
          mangaSearchItems.map(obj => (
            <Link key={obj.mal_id} to={`/manga/${obj.mal_id}`}>
              <MangaCard {...obj} />
            </Link>
          ))
        )}
      </div>
    </section>
  )
}

MangaSearch.propTypes = {
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  showMediaToggle: PropTypes.bool,
};

export default MangaSearch;
