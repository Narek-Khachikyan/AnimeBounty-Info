import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useGetMangaGenresQuery, useGetMangaSearchQuery } from "../../features/apiSlice";
import useDebounce from "../../hooks/useDebounce";
import Filter from "../Filter/Filter";
import Sort from "../Filter/Sort";
import MangaCard from "../MangaCard/MangaCard.jsx";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import GenreChips from "../GenreChips/GenreChips";
import "./mangaSearch.scss";

const MangaSearch = ({ orderBy, setOrderBy, setSortBy, sortBy, showMediaToggle = true, deferUntilVisible = false, previewLimit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAll, setShowAll] = useState(false);
  const queryParam = searchParams.get("q") || "";
  const [queryManga, setQueryManga] = useState(queryParam);
  const [selectedGenreId, setSelectedGenreId] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(!deferUntilVisible);
  const sectionRef = useRef(null);
  const debouncedQuery = useDebounce(queryManga, 500);

  const {
    data: mangaSearch,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetMangaSearchQuery(
    { orderBy, sortBy, query: debouncedQuery, genreId: selectedGenreId },
    { skip: !shouldFetch }
  );
  const {
    data: mangaGenres,
    isFetching: mangaGenresFetching,
    isError: mangaGenresError,
    refetch: refetchMangaGenres,
  } = useGetMangaGenresQuery(undefined, { skip: !shouldFetch });
  const mangaSearchItems = mangaSearch?.data ?? [];

  useEffect(() => {
    setQueryManga(queryParam);
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

  const isUpdating = isFetching || queryManga !== debouncedQuery;
  const resetSearch = () => {
    setQueryManga("");
    setSelectedGenreId(null);
    setOrderBy("score");
    setSortBy("desc");
    if (searchParams.has("q")) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("q");
      setSearchParams(nextParams, { replace: true });
    }
  };

  const HeadingTag = showMediaToggle ? "h2" : "h1";

  return (
    <section id="manga" className="MangaSearch catalogue-search py-8" ref={sectionRef}>
      <div className="search-panel search-panel--manga">
        <div className="search-panel__copy">
          <p className="section-kicker">Manga catalogue</p>
          <HeadingTag>Explore manga</HeadingTag>
          <p className="search-panel__subtitle">Find a new read. Browse by genre, compare scores and build your shelf.</p>
        </div>
        <div className="search-panel__actions">
          {showMediaToggle ? (
            <div className="media-toggle" aria-label="Choose catalogue type">
              <a className="media-toggle__item" href="#anime">Anime</a>
              <span className="media-toggle__item media-toggle__item--active">Manga</span>
            </div>
          ) : null}
          <label className="catalogue-search-field" htmlFor="manga-search-input"><span>Search manga</span>
          <input id="manga-search-input" className="searchInput" placeholder="Search manga..." aria-label="Search manga" type="text" value={queryManga} onChange={event => setQueryManga(event.target.value)} /></label>
        </div>
      </div>
      <div className="catalogue-context"><p>{orderBy === "score" ? "Highest rated" : orderBy === "title" ? "By title" : `Ordered by ${orderBy}`} · {sortBy === "desc" ? "Descending" : "Ascending"} {selectedGenreId ? `· Genre: ${mangaGenres?.data?.find(genre => genre.mal_id === selectedGenreId)?.name || selectedGenreId}` : ""}</p><button type="button" onClick={resetSearch}>Reset filters</button></div>
      <details className="catalogue-options">
        <summary>Filters <span>Order and genres</span></summary>
      <div className="filter search-filters">
        <div className="search-filters__summary">
          <span>Current shelf</span>
          <strong>{orderBy} / {sortBy}{selectedGenreId ? " / genre" : ""}</strong>
        </div>
        <div className="search-filters__group">
          <p>Order by</p>
          <Filter orderBy={orderBy} setOrderBy={setOrderBy} />
        </div>
        <div className="search-filters__group">
          <p>Sort</p>
          <Sort sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <GenreChips
        title="Manga"
        genres={mangaGenres?.data ?? []}
        isError={mangaGenresError}
        isFetching={mangaGenresFetching}
        onRetry={refetchMangaGenres}
        selectedGenreId={selectedGenreId}
        onSelectGenre={setSelectedGenreId}
      />
      </details>
      {shouldFetch ? (
        <p className="search-results-status" role="status" aria-live="polite">
          {isUpdating ? "Updating manga matches…" : isError ? "" : `${previewLimit && !showAll && !queryManga ? Math.min(previewLimit, mangaSearchItems.length) : mangaSearchItems.length} manga titles shown`}
        </p>
      ) : null}
      <div className="search-content catalogue-grid" aria-busy={isUpdating}>
        {!shouldFetch || isLoading ? (
          <LazyLoading message="Loading manga matches..." count={8} />
        ) : isError ? (
          <ErrorState
            message="Manga search could not be loaded."
            onRetry={refetch}
            isRetrying={isFetching}
            role="alert"
          />
        ) : !isUpdating && mangaSearchItems.length === 0 ? (
          <div className="search-empty">
            <h3>No manga matches found</h3>
            <p>Try another title or clear your search and filters.</p>
            <button type="button" className="show-btn" onClick={resetSearch}>Reset manga search</button>
          </div>
        ) : (
          mangaSearchItems.slice(0, previewLimit && !showAll && !queryManga ? previewLimit : undefined).map(obj => (
            <Link key={obj.mal_id} to={`/manga/${obj.mal_id}`}>
              <MangaCard {...obj} />
            </Link>
          ))
        )}
      </div>
      {previewLimit ? <div className="catalogue-continuation">
        {mangaSearchItems.length > previewLimit && !queryManga ? <button className="catalogue-view-all" type="button" aria-expanded={showAll} onClick={() => setShowAll(value => !value)}>{showAll ? "Show fewer manga titles" : `Show all ${mangaSearchItems.length} manga titles`}<span aria-hidden="true">{showAll ? "−" : "+"}</span></button> : null}
        <Link className="catalogue-route-link" to="/manga">Open manga catalogue ↗</Link>
      </div> : null}
    </section>
  )
}

MangaSearch.propTypes = {
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
  setSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  showMediaToggle: PropTypes.bool,
  deferUntilVisible: PropTypes.bool,
  previewLimit: PropTypes.number,
};

export default MangaSearch;
