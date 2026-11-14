import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useGetAnimeGenresQuery, useGetAnimeSearchQuery } from "../../features/apiSlice";
import Filter from "../Filter/Filter";
import Rating from "../Filter/Rating";
import Sort from "../Filter/Sort";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import AnimeCard from "../AnimeCard/AnimeCard.jsx";
import GenreChips from "../GenreChips/GenreChips";
import "./animeSearch.scss";
import useDebounce from "../../hooks/useDebounce";

const AnimeSearch = ({ setOrderBy, setRating, setSortBy, orderBy, rating, sortBy, showMediaToggle = true, deferUntilVisible = false, previewLimit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAll, setShowAll] = useState(false);
  const queryParam = searchParams.get("q") || "";
  const [query, setQuery] = useState(queryParam);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(!deferUntilVisible);
  const sectionRef = useRef(null);
  const debouncedQuery = useDebounce(query, 500);
  const {
    data: animeSearch,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAnimeSearchQuery(
    { orderBy, rating, sortBy, query: debouncedQuery, genreId: selectedGenreId },
    { skip: !shouldFetch }
  );
  const {
    data: animeGenres,
    isFetching: animeGenresFetching,
    isError: animeGenresError,
    refetch: refetchAnimeGenres,
  } = useGetAnimeGenresQuery(undefined, { skip: !shouldFetch });
  const animeSearchItems = animeSearch?.data ?? [];

  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  useEffect(() => {
    if (!deferUntilVisible || shouldFetch) return undefined;
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldFetch(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldFetch(true);
        observer.disconnect();
      }
    }, { rootMargin: "240px 0px" });

    observer.observe(node);

    return () => observer.disconnect();
  }, [deferUntilVisible, shouldFetch]);

  const isUpdating = isFetching || query !== debouncedQuery;
  const resetSearch = () => {
    setQuery("");
    setSelectedGenreId(null);
    setOrderBy("score");
    setSortBy("desc");
    setRating("pg13");
    if (searchParams.has("q")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const HeadingTag = showMediaToggle ? "h2" : "h1";

  return (
    <section id="anime" className="animeSearch catalogue-search" ref={sectionRef}>
      <div className="search-panel">
        <div className="search-panel__copy">
          <p className="section-kicker">Anime catalogue</p>
          <HeadingTag>Explore anime</HeadingTag>
          <p className="search-panel__subtitle">Find a series or film. Compare ratings and save your next watch.</p>
        </div>
        <div className="search-panel__actions">
          {showMediaToggle ? (
            <div className="media-toggle" aria-label="Choose catalogue type">
              <span className="media-toggle__item media-toggle__item--active">Anime</span>
              <a className="media-toggle__item" href="#manga">Manga</a>
            </div>
          ) : null}
          <label className="catalogue-search-field" htmlFor="anime-search-input"><span>Search anime</span>
          <input id="anime-search-input" className="searchInput" placeholder="Search anime..." aria-label="Search anime" type="text" value={query} onChange={event => setQuery(event.target.value)} /></label>
        </div>
      </div>
      <div className="catalogue-context"><p>{orderBy === "score" ? "Highest rated" : orderBy === "title" ? "By title" : `Ordered by ${orderBy}`} · {sortBy === "desc" ? "Descending" : "Ascending"} · Rating: {({pg:"PG",pg13:"PG-13",r17:"R-17"}[rating] || rating)} {selectedGenreId ? `· Genre: ${animeGenres?.data?.find(genre => genre.mal_id === selectedGenreId)?.name || selectedGenreId}` : ""}</p><button type="button" onClick={resetSearch}>Reset filters</button></div>
      <details className="catalogue-options">
        <summary>Filters <span>Order, rating and genres</span></summary>
      <div className="filter search-filters">
        <div className="search-filters__summary">
          <span>Current shelf</span>
          <strong>{orderBy} / {rating} / {sortBy}{selectedGenreId ? " / genre" : ""}</strong>
        </div>
        <div className="search-filters__group">
          <p>Order by</p>
          <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        <div className="search-filters__group">
          <p>Rating</p>
          <Rating rating={rating} setRating={setRating} />
        </div>
        <div className="search-filters__group">
          <p>Sort</p>
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <GenreChips
        title="Anime"
        genres={animeGenres?.data ?? []}
        isError={animeGenresError}
        isFetching={animeGenresFetching}
        onRetry={refetchAnimeGenres}
        selectedGenreId={selectedGenreId}
        onSelectGenre={setSelectedGenreId}
      />
      </details>
      {shouldFetch ? (
        <p className="search-results-status" role="status" aria-live="polite">
          {isUpdating ? "Updating anime matches…" : isError ? "" : `${previewLimit && !showAll && !query ? Math.min(previewLimit, animeSearchItems.length) : animeSearchItems.length} anime titles shown`}
        </p>
      ) : null}
      <div className="search-content catalogue-grid" aria-busy={isUpdating}>
        {!shouldFetch || isLoading ? (
          <LazyLoading message="Loading anime matches..." count={6} />
        ) : isError ? (
          <ErrorState
            message="Anime search could not be loaded."
            onRetry={refetch}
            isRetrying={isFetching}
            role="alert"
          />
        ) : !isUpdating && animeSearchItems.length === 0 ? (
          <div className="search-empty">
            <h3>No anime matches found</h3>
            <p>Try another title or clear your search and filters.</p>
            <button type="button" className="show-btn" onClick={resetSearch}>Reset anime search</button>
          </div>
        ) : (
          animeSearchItems.slice(0, previewLimit && !showAll && !query ? previewLimit : undefined).map(obj => (
            <Link key={obj.mal_id} to={`/anime/${obj.mal_id}`}>
              <AnimeCard {...obj} />
            </Link>
          ))
        )}
      </div>
      {previewLimit ? <div className="catalogue-continuation">
        {animeSearchItems.length > previewLimit && !query ? <button className="catalogue-view-all" type="button" aria-expanded={showAll} onClick={() => setShowAll(value => !value)}>{showAll ? "Show fewer anime titles" : `Show all ${animeSearchItems.length} anime titles`}<span aria-hidden="true">{showAll ? "−" : "+"}</span></button> : null}
        <Link className="catalogue-route-link" to="/anime">Open anime catalogue ↗</Link>
      </div> : null}
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
  deferUntilVisible: PropTypes.bool,
  previewLimit: PropTypes.number,
};

export default AnimeSearch;
