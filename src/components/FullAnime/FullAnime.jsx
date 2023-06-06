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
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchReviews = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/reviews`);
      setReviews(response.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);
  const fetchData = useCallback(async () => {
    try {
      await Promise.all([
        fetchFullAnime(),
        fetchAnimePictures(),
        fetchEpisodes(),
        fetchReviews()
      ]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [fetchData]);

  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {isLoading ? (
          <LazyLoading />
        ) : (
          <>
            {fullAnime.map((obj) => (
              <div className="fullAnime__contnet flex gap-10 pt-10" key={obj.mal_id}>
                <div className="fullAnime__img">
                  <img src={obj.images.webp.large_image_url} alt="" />
                  <p className="fullAnime__score bg-white text-black text-xl py-1 px-4">{obj.score}</p>
                </div>
                <div className="fullAnime__textWrapper">
                  <h3 className="fullAnime__text text-4xl">{obj.title_english}</h3>
                  <p className="fullAnime__episodes text-xl">Episodes: <b>{obj.episodes}</b></p>
                  <p className="FullAnime__status text-xl">Status: <b>{obj.status}</b></p>
                  <p className="FullAnime__year text-xl">Year: <b>{obj.year ? obj.year : <span>registration🥲</span>}</b></p>
                  <p className="FullAnime__rating text-xl">Rating: <b>{obj.rating}</b></p>
                  <p className="FullAnime__from text-xl">From: <b>{obj.aired.from.slice(0, 10)}</b></p>
                  <p className="FullAnime__to text-xl">To: <b>{obj.aired.to.slice(0, 10)}</b></p>
                  <p className="FullAnime__studio text-xl">Studio:{" "}<b>{obj.studios.map(studio => <span key={studio.mal_id}>{studio.name}</span>)}</b></p>
                </div>
              </div>
            ))}
            <div className="animeImages">
              <p className="text-3xl my-8">Images:</p>
              <div className="animeImages__content">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={50}
                  slidesPerView={5}
                  autoplay={{ delay: 3000 }}
                >
                  {animePictures.map((picture, index) => (
                    <SwiperSlide key={index}>
                      <img className="animeImages__image" src={picture.webp.image_url} alt="" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            {fullAnime.map((obj) => (
              <div key={obj.mal_id} className="fullAnime__trailer mt-4">
                {obj.trailer.length > 0 ? (
                  <p className="text-3xl mb-4">Trailer</p>
                ) : (
                  <p className="text-3xl mb-4">There is currently no trailer for this anime</p>
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
              <p className="episodes__text text-3xl my-4">Episodes:</p>
              <div className="episodes__type flex gap-4 items-center">
                <p className="episode__canon canonEpisode text-2xl mb-5">Canon color</p>
                <p className="episode__filter fillerEpisode text-2xl mb-5">Filler color</p>
              </div>
              <div className="episodes__content">
                <ol className="episode__name">
                  <h3 className="text-2xl mb-3">Episode name</h3>
                  {episodes.map((episode) => (
                    <Link to={episode.url} key={episode.mal_id}>
                      <li className={episode.filler ? "fillerEpisode text-xl" : "canonEpisode text-xl"}>
                        {episode.title}
                      </li>
                    </Link>
                  ))}
                </ol>
                <ul className="episode__score justify-self-end">
                  <h3 className="text-2xl mb-3">Episode Score</h3>
                  {episodes.map((episode) => (
                    <li key={episode.mal_id} className="text-xl">
                      {episode.score * 2}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="reviews mt-5">
              <h3 className="review__title text-3xl mb-5">{reviews.length > 0 ? <span>Review</span> : null}</h3>
              <div className="reviews__content grid grid-cols-1 grid-rows-1 gap-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.mal_id} {...review} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>


    </div>
  );
};

export default FullAnime;
