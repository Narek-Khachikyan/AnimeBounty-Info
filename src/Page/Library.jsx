import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useUserLibrary } from "../features/userLibrary";
import "./Library.scss";

const typeFilters = [
  { value: "all", label: "All" },
  { value: "anime", label: "Anime" },
  { value: "manga", label: "Manga" },
];

const statusFilters = [
  { value: "all", label: "All statuses" },
  { value: "watching", label: "Watching / Reading" },
  { value: "planning", label: "Planned" },
  { value: "completed", label: "Completed" },
  { value: "dropped", label: "Dropped" },
];

const statusLabels = {
  anime: {
    watching: "Watching",
    planning: "Plan to watch",
    completed: "Completed",
    dropped: "Dropped",
  },
  manga: {
    watching: "Reading",
    planning: "Plan to read",
    completed: "Completed",
    dropped: "Dropped",
  },
};

const Library = () => {
  const { items } = useUserLibrary();
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const filteredItems = useMemo(() => (
    items
      .filter((item) => typeFilter === "all" || item.type === typeFilter)
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .filter((item) => !favoritesOnly || item.favorite)
      .sort((firstItem, secondItem) => new Date(secondItem.updatedAt) - new Date(firstItem.updatedAt))
  ), [favoritesOnly, items, statusFilter, typeFilter]);

  return (
    <main className="library-page">
      <section className="library-hero">
        <div>
          <p className="section-kicker">Offline shelf</p>
          <h1>Your library</h1>
          <p>Saved anime and manga stay on this device, so the PWA can show your shelf even without a network connection.</p>
        </div>
      </section>

      <section className="library-filters" aria-label="Library filters">
        <div className="library-filters__group" aria-label="Filter by media type">
          {typeFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              className={typeFilter === filter.value ? "library-filter library-filter--active" : "library-filter"}
              aria-pressed={typeFilter === filter.value}
              onClick={() => setTypeFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <label className="library-filters__select">
          <span>Status</span>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>{filter.label}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className={favoritesOnly ? "library-filter library-filter--active" : "library-filter"}
          aria-pressed={favoritesOnly}
          onClick={() => setFavoritesOnly((value) => !value)}
        >
          Favorites only
        </button>
      </section>

      {filteredItems.length > 0 ? (
        <section className="library-grid" aria-label="Saved library items">
          {filteredItems.map((item) => {
            const label = statusLabels[item.type][item.status];

            return (
              <Link className="library-card" key={`${item.type}-${item.id}`} to={item.route}>
                <div className="library-card__image">
                  {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>{item.type}</span>}
                </div>
                <div className="library-card__body">
                  <p className="library-card__type">{item.type}</p>
                  <h2>{item.title}</h2>
                  <div className="library-card__meta">
                    <span>{label}</span>
                    {item.score ? <span>Score {item.score}</span> : null}
                    {item.favorite ? <strong>Favorite</strong> : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="library-empty">
          <p className="section-kicker">No saved titles</p>
          <h2>Your shelf is empty.</h2>
          <p>Open an anime or manga detail page and save it here for quick local access.</p>
          <div className="library-empty__actions">
            <Link to="/anime">Browse anime</Link>
            <Link to="/manga">Browse manga</Link>
          </div>
        </section>
      )}
    </main>
  );
};

export default Library;
