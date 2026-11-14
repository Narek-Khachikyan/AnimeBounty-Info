import PropTypes from "prop-types";
import "../AnimeCard/AnimeCard.scss";

const MangaCard = ({ title_english, title: originalTitle, chapters, images, score, type, genres }) => {
  const imageUrl = images?.webp?.image_url;
  const title = title_english || originalTitle || "Untitled manga";
  const mangaGenres = Array.isArray(genres) ? genres : [];

  return (
    <article className="mangaCard">
      <div className="mangaCard__content">
        <div className="mangaCard__img">
          {imageUrl ? <img src={imageUrl} alt={title} loading="lazy" decoding="async" width="200" height="280" /> : <span className="poster-placeholder">Artwork unavailable</span>}
          {score ? <p className="mangaCard__score">{score}</p> : null}
        </div>
        <div className="card__textWrapper">
          <p className="card__eyebrow">Manga</p>
          <h3 className="card__title">{title}</h3>
          <div className="card__meta">
            {type ? <strong>{type} ·</strong> : null}
            <span>Chapters</span>
            <strong>{chapters || "Unknown"}</strong>
          </div>
          <div className="card__genresWrapper">
            <span>Genres</span>
            <div className="card__genresList">
            {mangaGenres.length > 0 ? (
              mangaGenres.slice(0, 3).map((gener) => (
                <strong key={gener.mal_id}>{gener.name}</strong>
              ))
            ) : (
              <strong>Unknown</strong>
            )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

MangaCard.propTypes = {
  title_english: PropTypes.string,
  title: PropTypes.string,
  chapters: PropTypes.number,
  images: PropTypes.shape({
    webp: PropTypes.shape({
      image_url: PropTypes.string,
    }),
  }),
  score: PropTypes.number,
  type: PropTypes.string,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default MangaCard;
