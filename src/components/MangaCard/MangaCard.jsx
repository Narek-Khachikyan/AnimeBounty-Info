import "./mangaCard.scss"

const MangaCard = ({ title_english, chapters, images, score, genres }) => {
  return (
    <div className="mangaCard">
      <div className="mangaCard__content">
        <div className="mangaCard__img">
          <img src={images.webp.image_url} alt="" />
          {score ? <p className="mangaCard__score bg-white text-black text-base py-1 px-4">{score}</p> : null}
        </div>
        <div className="card__textWrapper p-3">
          <p className="card__text">Name: <b>{
            title_english ? (
              title_english.length > 20
                ? `${title_english.slice(0, 21)}...`
                : title_english
            ) : <b>regisration</b>
          }</b></p>
          <p className="card__episodes">Chapters: <b>{chapters ? chapters : <b>registration🥲</b>}</b></p>
          <div className="card__generesWrapper flex flex-wrap gap-1">
            <p className="card__generes mb-1">Generes:</p>
            {
              genres.map(gener => <p key={gener.mal_id}><b>{gener.name}</b></p>)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default MangaCard
