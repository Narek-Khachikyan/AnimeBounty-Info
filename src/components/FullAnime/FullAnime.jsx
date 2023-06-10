import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/autoplay";
import ReviewCard from "../ReviewCard/ReviewCard";
import LazyLoading from "../LazyLoading/LazyLoading";
import playButton from "../../assets/images/playButton.svg";
import "./FullAnime.scss";

const FullAnime = () => {
  const [fullAnime, setFullAnime] = useState([]);
  const [animePictures, setAnimePictures] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isActiveReviews, setIsActiveReviews] = useState(true)
  const [isActiveCharacters, setIsActiveCharacters] = useState(true)
  const [isActiveEpisodes, setIsActiveEpisodes] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchFullAnime = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
      const animeData = response.data.data;
      const animeArray = [animeData];

      setFullAnime(animeArray);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchAnimePictures = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/pictures`);
      setAnimePictures(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchEpisodes = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/episodes`);
      setEpisodes(response.data.data);
      setIsActiveEpisodes(false)
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/reviews`);
      setReviews(response.data.data);
      setIsActiveReviews(false)
    } catch (error) {
      console.log(error);
    }
  }, [id]);
  const fetcCharacters = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/characters`);
      setCharacters(response.data.data);
      setIsActiveCharacters(false)
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchData = useCallback(async () => {
    try {
      const requests = [
        fetchFullAnime(),
        fetchAnimePictures(),
      ];

      await Promise.all(requests);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {isLoading ? (
          <LazyLoading />
        ) : (
          <>
            {fullAnime.map((obj) => (
              <div className="fullAnime__contnet flex flex-wrap gap-10 pt-10 sm:flex-wrap md:flex-nowrap" key={obj.mal_id}>
                <div className="fullAnime__img">
                  <img src={obj.images.webp.large_image_url} alt="" />
                  <p className="fullAnime__score bg-white text-black text-xl py-1 px-4">{obj.score}</p>
                </div>
                <div className="fullAnime__textWrapper">
                  <h3 className="fullAnime__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{obj.title_english ? obj.title_english : <b>registration</b>}</h3>
                  <p className="fullAnime__episodes mt-1 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Episodes: <b>{obj.episodes ? obj.episodes : <b>registration</b>}</b></p>
                  <p className="FullAnime__status my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Status: <b>{obj.status ? obj.status : <b>registration</b>}</b></p>
                  <p className="FullAnime__year text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Year: <b>{obj.year ? obj.year : <span>registration</span>}</b></p>
                  <p className="FullAnime__rating my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Rating: <b>{obj.rating ? obj.rating : <b>registration</b>}</b></p>
                  <p className="FullAnime__studio text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Studio:{" "}<b>{obj.studios ? obj.studios.map(studio => <span key={studio.mal_id}>{studio.name}</span>) : null}</b></p>
                </div>
              </div>
            ))}
            <div className="images">
              <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-8">Images:</p>
              <div className="images__content">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={50}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 20
                    },
                    425: {
                      slidesPerView: 2,
                      spaceBetween: 20
                    },
                    640: {
                      slidesPerView: 2,
                      spaceBetween: 20
                    },
                    768: {
                      slidesPerView: 3,
                      spaceBetween: 30
                    },
                    1024: {
                      slidesPerView: 5,
                      spaceBetween: 40
                    }
                  }}
                  slidesPerView={5}
                  autoplay={{ delay: 3000 }
                  }>
                  {animePictures.map((picture, index) => (
                    <SwiperSlide key={index}>
                      <img className="images__img" src={picture.webp.image_url} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            {fullAnime.map((obj) => (
              <div key={obj.mal_id} className="fullAnime__trailer mt-4">
                {obj.trailer ? (
                  <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">Trailer:</p>
                ) : (
                  <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">There is currently no trailer for this anime</p>
                )}
                <a className="trailer-imgWrapepr" href={obj.trailer.url}>
                  <div className="trailer-imgWrapper">
                    <img className="trailer-img" src={obj.trailer.images.maximum_image_url} alt="" />
                    <img className="playButton" width={50} height={50} src={playButton} alt="" />
                  </div>
                </a>
              </div>
            ))}
            <div className="episodes">
              <p className="episodes__text text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Episodes:</p>
              <div className="episodes__type flex gap-4 items-center">
                <p className="episode__canon canonEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Canon color</p>
                <p className="episode__filter fillerEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Filler color</p>
              </div>
              <button className={isActiveEpisodes ? "show-btn bg-black text-white py-2 px-3" : 'display-none'} onClick={() => fetchEpisodes()}>See all episodes</button>
              <div className="episodes__content">
                <ol className="episode__name">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode name</h3>
                  {episodes.map((episode) => (
                    <Link to={episode.url} key={episode.mal_id}>
                      <li className={episode.filler ? "fillerEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl" : "canonEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"}>
                        {episode.title}
                      </li>
                    </Link>
                  ))}
                </ol>
                <ul className="episode__score justify-self-end">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode Score</h3>
                  {episodes.map((episode) => (
                    <li key={episode.mal_id} className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                      {episode.score * 2}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="characters mt-8">
              <p className="characters__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Characters: </p>
              <button className={isActiveCharacters ? "show-btn bg-black text-white py-2 px-3" : 'display-none'} onClick={() => fetcCharacters()}>See all characters</button>
              <div className="characters__content grid gap-8 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
                {
                  characters.map(obj => (
                    <div key={obj.character.mal_id} className="Characters__card">
                      <img className="characters__card-img" src={obj.character.images.webp.image_url} alt="" />
                      <div className="characters__card-textWrapepr p-2">
                        <p className="characters__card-text">Name : <b>{obj.character.name}</b></p>
                        <p className="characters__card-subText">Role: <b>{obj.role}</b></p>
                        <p><b>Voice:</b></p>
                        {
                          obj.voice_actors.slice(0, 2).map(actor => (
                            <p key={actor.person.mal_id}>{actor.language} : <b>{actor.person.name}</b></p>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="reviews mt-5">
              <button className={isActiveReviews ? "show-btn bg-black text-white py-2 px-3" : 'display-none'} onClick={() => fetchReviews()}>See all reviews</button>
              <h3 className="review__title text-3xl mb-5">{reviews.length > 0 ? <span className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Review</span> : null}</h3>
              <div className="reviews__content grid grid-cols-1 grid-rows-1 gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.mal_id} {...review} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>


    </div >
  );
};

export default FullAnime;
