import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FullAnime.scss"
import playButton from "../../assets/images/playButton.svg"

const FullAnime = () => {
  const [fullAnime, setFullAnime] = useState([]);
  const [animePictures, setAnimePictures] = useState([])
  const [statistics, setStatistics] = useState([])
  const { id } = useParams();

  const fetchFullAnime = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
      const animeData = response.data.data;
      const animeArray = [animeData];
      setFullAnime(animeArray);
    } catch (error) {
      console.log(error);
    }
  }
  const fetchAnimePictures = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/pictures`)
      setAnimePictures(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/statistics`)
      setStatistics(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(animePictures)
  console.log(fullAnime)

  useEffect(() => {
    fetchFullAnime();
    fetchAnimePictures()
    fetchStatistics()
  }, []);

  console.log(statistics)
  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {fullAnime.map(obj => <div className="fullAnime__contnet flex gap-10 pt-10" key={obj.mal_id}>
          <div className="fullAnime__img">
            <img src={obj.images.webp.large_image_url} alt="" />
            <p className="fullAnime__score bg-white text-black text-xl py-1 px-4">{obj.score}</p>
          </div>
          <div className="fullAnime__textWrapper">
            <h3 className="fullAnime__text text-4xl">{obj.title_english}</h3>
            <p className="fullAnime__episodes text-xl">Episodes : <span>{obj.episodes}</span></p>
            <p className="FullAnime__status text-xl">Status : <span>{obj.status}</span></p>
            <p className="FullAnime__year text-xl">Year : <span>{obj.year ? obj.year : <span>registration🥲</span>}</span></p>
            <p className="FullAnime__rating text-xl">Rating : <span>{obj.rating}</span></p>
            <p className="FullAnime__from text-xl">From : <span>{obj.aired.from}</span></p>
            <p className="FullAnime__to text-xl">To : <span>{obj.aired.to}</span></p>
            <p className="FullAnime__studio text-xl">Studio : <span>{obj.studios.map(studio => <span key={studio.mal_id}>{studio.name}</span>)}</span></p>
          </div>
        </div>)}
        <div className="animeImages">
          <p className="text-3xl my-8">Images:</p>
          <div className="animeImages__content flex flex-wrap gap-4">
            {animePictures.map((picture, index) => <img key={index} src={picture.webp.image_url} alt="" />)}
          </div>
        </div>
        {fullAnime.map(obj => <div key={obj.mal_id} className="fullAnime__trailer mt-4">
          {obj.trailer.length > 0 ? <p className="text-3xl mb-4">Trailer</p> : null}
          <a className="trailer-imgWrapepr" href={obj.trailer.url}>
            <div className="trailer-imgWrapper">
              <img className="trailer-img" src={obj.trailer.images.maximum_image_url} alt="" />
              <img className="playButton" width={50} height={50} src={playButton} alt="" />
            </div>
          </a>
        </div>)}

      </div>
    </div>
  );
}

export default FullAnime;
