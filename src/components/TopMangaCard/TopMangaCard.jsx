import { Link } from "react-router-dom"
import "./topMangaCard.scss"

const TopMangaCard = ({ mal_id, images, title_english, chapters, score }) => {
  return (
    <div className="slide">
      <div className="slide__content p-3 pb-0">
        <div className="slide__img">
          <Link to={`${mal_id}`}>
            <img src={images.webp.large_image_url} alt="" />
            <p className="slide__score text-base bg-white text-black px-2 px1">
              {score}
            </p>
          </Link>
        </div>
        <div className="slide__textWrapper p-1">
          <p className="slide__text text-base my-1">
            {title_english ? (title_english.length > 20
              ? `${title_english.slice(0, 21)}...`
              : title_english) : <span>Registration</span>}
          </p>
          <p className="slide__chapters">Chapters: {chapters ? chapters : <span>Registration</span>}</p>
        </div>
      </div>
    </div>
  )
}

export default TopMangaCard
