import "./topAnimeSlider.scss"

const AnimeSliderCard = ({ images, score, title_english, episodes, status }) => {
  return (
    <div className="slide">
      <div className="slide__content p-2 pb-0">
        <div className="slide__img">
          <img src={images.webp.large_image_url} alt="" />
          <p className="slide__score text-base bg-white text-black px-2 px1">
            {score}
          </p>
        </div>
        <div className="slide__textWrapper p-1">
          <p className="slide__text text-base my-1">
            {title_english.length > 20
              ? `${title_english.slice(0, 21)}...`
              : title_english}
          </p>
          <p className="slide__subText">
            Episodes : <span>{episodes}</span>
          </p>
          <p className="slide__statusText">
            Status : <span>{status}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AnimeSliderCard
