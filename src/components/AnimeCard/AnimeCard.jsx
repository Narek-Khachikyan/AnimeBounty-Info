import PropTypes from "prop-types";
import "./AnimeCard.scss";

const AnimeCard = ({ title_english, images, score, episodes, genres, aired }) => {
  const imageUrl = images?.webp?.image_url;
  const title = title_english || "No title";
  const animeGenres = Array.isArray(genres) ? genres : [];

  return (
    <div className="card">
      <div className="card__content p-3 pb-0">
        <div className="card__img">
          {imageUrl ? <img src={imageUrl} alt={title} /> : null}
          {score ? <p className="card__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">
            Name: <strong>{title.length > 20 ? `${title.slice(0, 21)}...` : title}</strong>
          </p>
          <p className="card__episodes">
            Episodes: <strong>{episodes || "Unknown"}</strong>
          </p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {animeGenres.length > 0 ? (
              animeGenres.map((gener) => (
                <p key={gener.mal_id}>
                  <strong>{gener.name}</strong>
                </p>
              ))
            ) : (
              <strong>Unknown</strong>
            )}
          </div>
          <p className="card__aired">Aired: <strong>{aired?.string || "Unknown"}</strong></p>
        </div>
      </div>
    </div>
  );
};

AnimeCard.propTypes = {
  title_english: PropTypes.string,
  images: PropTypes.shape({
    webp: PropTypes.shape({
      image_url: PropTypes.string,
    }),
  }),
  score: PropTypes.number,
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
