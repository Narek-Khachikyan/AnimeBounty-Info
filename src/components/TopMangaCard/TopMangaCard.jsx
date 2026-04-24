import { Link } from "react-router-dom"
import "./topMangaCard.scss"
import PropTypes from "prop-types";

const TopMangaCard = ({ mal_id, images, title_english, title: originalTitle, chapters, score }) => {
  const title = title_english || originalTitle || "Untitled manga";
  const imageUrl = images?.webp?.large_image_url || images?.webp?.image_url;

  return (
    <div className="slide">
      <div className="slide__content p-3 pb-0">
        <div className="slide__img">
          <Link to={`${mal_id}`}>
            {imageUrl ? <img src={imageUrl} alt={title} /> : null}
            {score ? (
              <p className="slide__score text-base bg-white text-black px-2 px1">
                {score}
              </p>
            ) : null}
          </Link>
        </div>
        <div className="slide__textWrapper p-1">
          <p className="slide__text text-base my-1">
            {title.length > 20 ? `${title.slice(0, 21)}...` : title}
          </p>
          <p className="slide__chapters">Chapters: {chapters || "Unknown"}</p>
        </div>
      </div>
    </div>
  )
}

TopMangaCard.propTypes = {
  mal_id: PropTypes.number.isRequired,
  images: PropTypes.shape({
    webp: PropTypes.shape({
      large_image_url: PropTypes.string,
      image_url: PropTypes.string,
    }),
  }),
  title_english: PropTypes.string,
  title: PropTypes.string,
  chapters: PropTypes.number,
  score: PropTypes.number,
};

export default TopMangaCard
