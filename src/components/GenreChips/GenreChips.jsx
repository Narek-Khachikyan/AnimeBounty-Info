import PropTypes from "prop-types";
import ErrorState from "../ErrorState/ErrorState";
import "./genreChips.scss";

const GenreChips = ({ genres, isError, isFetching, onRetry, selectedGenreId, onSelectGenre, title }) => {
  const genreItems = Array.isArray(genres) ? genres : [];

  if (isError) {
    return (
      <div className="genre-chips">
        <ErrorState
          message={`${title} genres could not be loaded.`}
          onRetry={onRetry}
          isRetrying={isFetching}
        />
      </div>
    );
  }

  if (genreItems.length === 0) {
    return null;
  }

  return (
    <div className="genre-chips" aria-label={`${title} genres`}>
      <div className="genre-chips__header">
        <span>Browse by genre</span>
        {selectedGenreId ? (
          <button type="button" onClick={() => onSelectGenre(null)}>
            Clear
          </button>
        ) : null}
      </div>
      <div className="genre-chips__list">
        {genreItems.slice(0, 14).map((genre) => (
          <button
            type="button"
            key={genre.mal_id}
            className={selectedGenreId === genre.mal_id ? "genre-chip genre-chip--active" : "genre-chip"}
            onClick={() => onSelectGenre(genre.mal_id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  );
};

GenreChips.propTypes = {
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  isError: PropTypes.bool,
  isFetching: PropTypes.bool,
  onRetry: PropTypes.func,
  selectedGenreId: PropTypes.number,
  onSelectGenre: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default GenreChips;
