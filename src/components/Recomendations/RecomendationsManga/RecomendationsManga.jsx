import { Link } from "react-router-dom"
import "../recomendations.scss"

const RecomendationsManga = ({ recomendationsManga }) => {
  return (
    <div className='py-5 rec'>
      <h3 className="text-4xl rec__title mb-5">Recomendation</h3>
      <div className="rec__content grid grid-cols-4 grid-rows-3 gap-9">
        {
          recomendationsManga.map(recomendation => (
            <>
              {
                recomendation.entry.map(item => (
                  <Link key={item.mal_id} to={`manga/${item.mal_id}`}>
                    <div className="rec__card-content">
                      <img className=" w-full rec__card-img" src={item.images.webp.image_url} alt="" />
                      <p className="text-base text-center my-2">{item.title.length > 20
                        ? `${item.title.slice(0, 21)}...`
                        : item.title}</p>
                    </div>
                  </Link>
                ))
              }
            </>
          ))
        }
      </div>
    </div>
  )
}

export default RecomendationsManga
