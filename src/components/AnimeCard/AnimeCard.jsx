import "./AnimeCard.scss"

const AnimeCard = ({ title_english, images, score, episodes, genres, aired }) => {
  return (
    <div className="card">
      <div className="card__content p-3 pb-0">
        <div className="card__img">
          <img src={images.webp.image_url ? images.webp.image_url : null} alt="" />
          {score ? <p className="card__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">Name: <b>{
            title_english ? (
              title_english.length > 20
                ? `${title_english.slice(0, 21)}...`
                : title_english
            ) : <b>regisration</b>
          }</b></p>
          <p className="card__episodes">Episodes: <b>{episodes ? episodes : <b>registration</b>}</b></p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {
              genres ? (
                genres.map(gener => <p key={gener.mal_id}><b>{gener.name}</b></p>))
                : <b>registration</b>
            }
          </div>
          <p className="card__aired">Aired: <b>{aired.string}</b></p>
        </div>
      </div>
    </div>
  )
}

export default AnimeCard
