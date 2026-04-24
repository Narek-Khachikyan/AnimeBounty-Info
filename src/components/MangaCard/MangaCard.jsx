import PropTypes from "prop-types";
import "./mangaCard.scss";

const MangaCard = ({ title_english, chapters, images, score, genres }) => {
  const imageUrl = images?.webp?.image_url;
  const title = title_english || "No title";
  const mangaGenres = Array.isArray(genres) ? genres : [];

  return (
    <div className="mangaCard">
      <div className="mangaCard__content p-3 pb-0">
        <div className="mangaCard__img">
          {imageUrl ? <img src={imageUrl} alt={title} /> : null}
          {score ? <p className="mangaCard__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">
            Name: <strong>{title.length > 20 ? `${title.slice(0, 21)}...` : title}</strong>
          </p>
          <p className="card__episodes">
            Chapters: <strong>{chapters || "Unknown"}</strong>
          </p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {mangaGenres.length > 0 ? (
              mangaGenres.map((gener) => (
                <p key={gener.mal_id}>
                  <strong>{gener.name}</strong>
                </p>
              ))
            ) : (
              <strong>Unknown</strong>
            )}
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
    }),
  }),
  score: PropTypes.number,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      mal_id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
};

export default MangaCard;
