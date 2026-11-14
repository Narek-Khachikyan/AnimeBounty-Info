import PropTypes from "prop-types";
import "./AnimeCard.scss";

const AnimeCard = ({ title_english, title: originalTitle, images, score, type, episodes, genres, aired }) => {
  const imageUrl = images?.webp?.image_url;
  const title = title_english || originalTitle || "Untitled anime";
  const animeGenres = Array.isArray(genres) ? genres : [];

  return (
    <article className="card">
      <div className="card__content">
        <div className="card__img">
          {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" decoding="async" width="200" height="280" /> : <span className="poster-placeholder">Artwork unavailable</span>}
          {score ? <p className="card__score">{score}</p> : null}
        </div>
        <div className="card__textWrapper">
          <p className="card__eyebrow">Anime</p>
          <h3 className="card__title">{title}</h3>
          <div className="card__meta">
            {type ? <strong>{type} ·</strong> : null}
            <span>Episodes</span>
            <strong>{episodes || "Unknown"}</strong>
          </div>
          <div className="card__genresWrapper">
            <span>Genres</span>
            <div className="card__genresList">
            {animeGenres.length > 0 ? (
              animeGenres.slice(0, 3).map((gener) => (
                <strong key={gener.mal_id}>{gener.name}</strong>
              ))
            ) : (
              <strong>Unknown</strong>
            )}
            </div>
          </div>
          <div className="card__meta">
            <span>Aired</span>
            <strong>{aired?.string || "Unknown"}</strong>
          </div>
        </div>
      </div>
    </article>
  );
};

AnimeCard.propTypes = {
  title_english: PropTypes.string,
  title: PropTypes.string,
  images: PropTypes.shape({
    webp: PropTypes.shape({
      image_url: PropTypes.string,
    }),
  }),
  score: PropTypes.number,
  type: PropTypes.string,
  episodes: PropTypes.number,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  aired: PropTypes.shape({
    string: PropTypes.string,
  }),
};

export default AnimeCard;
