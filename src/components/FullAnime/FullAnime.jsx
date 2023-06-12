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
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetAnimeEpisodesQuery, useGetAnimePicturesQuery, useGetFullAnimeQuery } from "../../features/apiSlice";


const FullAnime = () => {
  const [isActiveReviews, setIsActiveReviews] = useState(true)
  const [isActiveCharacters, setIsActiveCharacters] = useState(true)
  const [isActiveEpisodes, setIsActiveEpisodes] = useState(true)
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();


  const { data: fullAnimeData } = useGetFullAnimeQuery(id)
  const { data: animePictures } = useGetAnimePicturesQuery(id)
  const { data: animeEpisodes } = useGetAnimeEpisodesQuery(id)
  animePictures && console.log(fullAnimeData)


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

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {fullAnimeData ? (
          <>
            <div data-aos="fade-up" className="fullAnime__contnet flex flex-wrap gap-10 pt-10 sm:flex-wrap md:flex-nowrap" key={fullAnimeData.data.mal_id}>
              <div className="fullAnime__img">
                <img src={fullAnimeData.data.images.webp.large_image_url} alt="" />
                <p className="fullAnime__score bg-white text-black text-xl py-1 px-4">{fullAnimeData.data.score}</p>
              </div>
              <div className="fullAnime__textWrapper">
                <h3 className="fullAnime__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{fullAnimeData.data.title_english ? fullAnimeData.data.title_english : <b>registration</b>}</h3>
                <p className="fullAnime__episodes mt-1 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Episodes: <b>{fullAnimeData.data.episodes ? fullAnimeData.data.episodes : <b>registration</b>}</b></p>
                <p className="FullAnime__status my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Status: <b>{fullAnimeData.data.status ? fullAnimeData.data.status : <b>registration</b>}</b></p>
                <p className="FullAnime__year text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Year: <b>{fullAnimeData.data.year ? fullAnimeData.data.year : <span>registration</span>}</b></p>
                <p className="FullAnime__rating my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Rating: <b>{fullAnimeData.data.rating ? fullAnimeData.data.rating : <b>registration</b>}</b></p>
                <p className="FullAnime__studio text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Studio:{" "}<b>{fullAnimeData.data.studios ? fullAnimeData.data.studios.map(studio => <span key={studio.mal_id}>{studio.name}</span>) : null}</b></p>
              </div>
            </div>
            <div className="images" data-aos="fade-up">
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
                  {animePictures ? animePictures.data.map((picture, index) => (
                    <SwiperSlide key={index}>
                      <img className="images__img" src={picture.webp.image_url} alt="" />
                    </SwiperSlide>
                  )) : <LazyLoading />} :
                </Swiper>
              </div>
            </div>
            <div key={fullAnimeData.data.mal_id} data-aos="fade-up" className="fullAnime__trailer mt-4">
              {fullAnimeData.data.trailer ? (
                <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">Trailer:</p>
              ) : (
                <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">There is currently no trailer for this anime</p>
              )}
              <a className="trailer-imgWrapepr" href={fullAnimeData.data.trailer.url}>
                <div className="trailer-imgWrapper">
                  <img className="trailer-img" src={fullAnimeData.data.trailer.images.maximum_image_url} alt="" />
                  <img className="playButton" width={50} height={50} src={playButton} alt="" />
                </div>
              </a>
            </div>
            <div className="episodes">
              <p className="episodes__text text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Episodes:</p>
              <div className="episodes__type flex gap-4 items-center">
                <p className="episode__canon canonEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Canon color</p>
                <p className="episode__filter fillerEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Filler color</p>
              </div>
              <div className="episodes__content">
                <ol className="episode__name">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode name</h3>
                  {animeEpisodes && animeEpisodes.data.map((episode) => (
                    <Link to={episode.url} key={episode.mal_id}>
                      <li className={episode.filler ? "fillerEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl" : "canonEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"}>
                        {episode.title}
                      </li>
                    </Link>
                  ))}
                </ol>
                <ul className="episode__score justify-self-end">
                  <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode Score</h3>
                  {animeEpisodes && animeEpisodes.data.map((episode) => (
                    <li key={episode.mal_id} className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                      {episode.score * 2}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        ) : <LazyLoading />}
      </div>


    </div>
  );
};

export default FullAnime;
