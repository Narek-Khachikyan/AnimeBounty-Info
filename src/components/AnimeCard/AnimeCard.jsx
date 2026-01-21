import PropTypes from "prop-types";
import "./AnimeCard.scss";

const AnimeCard = ({ title_english, images, score, episodes, genres, aired }) => {
  return (
    <div className="card">
      <div className="card__content p-3 pb-0">
        <div className="card__img">
          <img src={images.webp.image_url ? images.webp.image_url : null} alt="" />
          {score ? <p className="card__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">
            Name: <strong>{title_english ? (title_english.length > 20 ? `${title_english.slice(0, 21)}...` : title_english) : "registration"}</strong>
          </p>
          <p className="card__episodes">
            Episodes: <strong>{episodes ? episodes : "registration"}</strong>
          </p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {genres ? (
              genres.map((gener) => (
                <p key={gener.mal_id}>
                  <strong>{gener.name}</strong>
                </p>
              ))
            ) : (
              <strong>registration</strong>
            )}
          </div>
          <p className="card__aired">Aired: <strong>{aired.string}</strong></p>
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
    }).isRequired,
  }).isRequired,
  score: PropTypes.number,
  episodes: PropTypes.number,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  aired: PropTypes.shape({
    string: PropTypes.string.isRequired,
  }).isRequired,
};

export default AnimeCard;

