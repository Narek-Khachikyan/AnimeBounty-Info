import PropTypes from "prop-types";
import {
  createLibrarySnapshot,
  useUserLibrary,
} from "../../features/userLibrary";
import "./libraryControls.scss";

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

const LibraryControls = ({ item, type }) => {
  const { getItem, removeItem, saveItem, toggleFavorite, updateStatus } = useUserLibrary();
  const itemId = item?.mal_id;
  const savedItem = getItem(type, itemId);
  const currentStatus = savedItem?.status ?? "planning";
  const labels = statusLabels[type];
  const snapshot = createLibrarySnapshot(item, type);

  const handleSave = () => {
    saveItem(snapshot, {
      status: currentStatus,
      favorite: savedItem?.favorite ?? false,
    });
  };

  const handleRemove = () => {
    removeItem(type, itemId);
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;

    if (savedItem) {
      updateStatus(type, itemId, nextStatus);
      return;
    }

    saveItem(snapshot, {
      status: nextStatus,
      favorite: false,
    });
  };

  const handleFavoriteToggle = () => {
    if (savedItem) {
      toggleFavorite(type, itemId);
      return;
    }

    saveItem(snapshot, {
      status: currentStatus,
      favorite: true,
    });
  };

  return (
    <section className="library-controls" aria-label="Library controls">
      <div className="library-controls__header">
        <p className="section-kicker">Personal shelf</p>
        <strong>{savedItem ? "Saved locally" : "Save for offline"}</strong>
      </div>
      <div className="library-controls__actions">
        <button
          className={savedItem ? "library-controls__button library-controls__button--muted" : "library-controls__button"}
          type="button"
          onClick={savedItem ? handleRemove : handleSave}
        >
          {savedItem ? "Remove from library" : "Save to library"}
        </button>
        <button
          className={savedItem?.favorite ? "library-controls__favorite library-controls__favorite--active" : "library-controls__favorite"}
          type="button"
          aria-pressed={Boolean(savedItem?.favorite)}
          onClick={handleFavoriteToggle}
        >
          {savedItem?.favorite ? "Unmark favorite" : "Mark as favorite"}
        </button>
      </div>
      <label className="library-controls__status">
        <span>Status</span>
        <select aria-label="Library status" value={currentStatus} onChange={handleStatusChange}>
          {Object.entries(labels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
    </section>
  );
};

LibraryControls.propTypes = {
  item: PropTypes.shape({
    mal_id: PropTypes.number,
  }).isRequired,
  type: PropTypes.oneOf(["anime", "manga"]).isRequired,
};

export default LibraryControls;
