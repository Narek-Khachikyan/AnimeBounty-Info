import "./topAnimeSlider.scss"
import PropTypes from "prop-types";

const AnimeSliderCard = ({ images, score, title_english, title: originalTitle, episodes, status }) => {
  const title = title_english || originalTitle || "Untitled anime";
  const imageUrl = images?.webp?.large_image_url || images?.webp?.image_url;

  return (
    <div className="slide">
      <div className="slide__content p-2 pb-0">
        <div className="slide__img">
          {imageUrl ? <img src={imageUrl} alt={title} /> : null}
          {score ? (
            <p className="slide__score text-base bg-white text-black px-2 px1">
              {score}
            </p>
          ) : null}
        </div>
        <div className="slide__textWrapper p-1">
          <p className="slide__text text-base my-1">
            {title.length > 20 ? `${title.slice(0, 21)}...` : title}
          </p>
          <p className="slide__subText">
            Episodes : <span>{episodes || "Unknown"}</span>
          </p>
          <p className="slide__statusText">
            Status : <span>{status || "Unknown"}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

AnimeSliderCard.propTypes = {
  images: PropTypes.shape({
    webp: PropTypes.shape({
      large_image_url: PropTypes.string,
      image_url: PropTypes.string,
    }),
  }),
  score: PropTypes.number,
  title_english: PropTypes.string,
  title: PropTypes.string,
  episodes: PropTypes.number,
  status: PropTypes.string,
};

export default AnimeSliderCard
