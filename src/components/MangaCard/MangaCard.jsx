import PropTypes from "prop-types";
import "./mangaCard.scss";

const MangaCard = ({ title_english, chapters, images, score, genres }) => {
  return (
    <div className="mangaCard">
      <div className="mangaCard__content p-3 pb-0">
        <div className="mangaCard__img">
          <img src={images.webp.image_url} alt="" />
          {score ? <p className="mangaCard__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">
            Name: <strong>{title_english ? (title_english.length > 20 ? `${title_english.slice(0, 21)}...` : title_english) : "registration"}</strong>
          </p>
          <p className="card__episodes">
            Chapters: <strong>{chapters ? chapters : "registration"}</strong>
          </p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {genres.map((gener) => (
              <p key={gener.mal_id}>
                <strong>{gener.name}</strong>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

MangaCard.propTypes = {
  title_english: PropTypes.string,
  chapters: PropTypes.number,
  images: PropTypes.shape({
    webp: PropTypes.shape({
      image_url: PropTypes.string,
    }).isRequired,
  }).isRequired,
  score: PropTypes.number,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default MangaCard;

