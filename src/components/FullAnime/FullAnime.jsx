import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import ReviewCard from "../ReviewCard/ReviewCard";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import playButton from "../../assets/images/playButton.svg";
import "./FullAnime.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetAnimeCharactersQuery, useGetAnimeEpisodesQuery, useGetAnimePicturesQuery, useGetAnimeReviewsQuery, useGetFullAnimeQuery } from "../../features/apiSlice";

const swiperBreakpoints = {
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
};

const FullAnime = () => {
  const { id } = useParams();
  const [isActiveCharacters, setIsActiveCharacters] = useState(false)
  const [isActiveReviews, setIsActiveReviews] = useState(false)
  const {
    data: fullAnimeData,
    isLoading: fullAnimeLoading,
    isFetching: fullAnimeFetching,
    isError: fullAnimeError,
    refetch: refetchFullAnime,
  } = useGetFullAnimeQuery(id)
  const {
    data: animePictures,
    isLoading: animePicturesLoading,
    isFetching: animePicturesFetching,
    isError: animePicturesError,
    refetch: refetchAnimePictures,
  } = useGetAnimePicturesQuery(id)
  const {
    data: animeEpisodes,
    isLoading: animeEpisodesLoading,
    isFetching: animeEpisodesFetching,
    isError: animeEpisodesError,
    refetch: refetchAnimeEpisodes,
  } = useGetAnimeEpisodesQuery(id)
  const {
    data: animeCharacters,
    isLoading: animeCharactersLoading,
    isFetching: animeCharactersFetching,
    isError: animeCharactersError,
    refetch: refetchAnimeCharacters,
  } = useGetAnimeCharactersQuery(id)
  const {
    data: animeReviews,
    isLoading: animeReviewsLoading,
    isFetching: animeReviewsFetching,
    isError: animeReviewsError,
    refetch: refetchAnimeReviews,
  } = useGetAnimeReviewsQuery(id)

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    window.scrollTo(0, 0);
  }, []);

  const anime = fullAnimeData?.data;
  const animeTitle = anime?.title_english || anime?.title || "No title";
  const animeImageUrl = anime?.images?.webp?.large_image_url || anime?.images?.webp?.image_url;
  const studios = Array.isArray(anime?.studios) ? anime.studios : [];
  const pictures = Array.isArray(animePictures?.data) ? animePictures.data : [];
  const episodes = Array.isArray(animeEpisodes?.data) ? animeEpisodes.data : [];
  const characters = Array.isArray(animeCharacters?.data) ? animeCharacters.data : [];
  const reviews = Array.isArray(animeReviews?.data) ? animeReviews.data : [];
  const trailerUrl = anime?.trailer?.url;
  const trailerImageUrl = anime?.trailer?.images?.maximum_image_url;

  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {fullAnimeLoading ? (
          <>
            <p className="text-center">If the content does not load for a long time, then reload the page or go back</p>
            <LazyLoading />
          </>
        ) : fullAnimeError ? (
          <ErrorState
            message="Anime details could not be loaded."
            onRetry={refetchFullAnime}
            isRetrying={fullAnimeFetching}
          />
        ) : anime ? (
          <>
            <div data-aos="fade-up" className="fullAnime__contnet flex flex-wrap gap-10 pt-10 sm:flex-wrap md:flex-nowrap" key={anime.mal_id}>
              <div className="fullAnime__img">
                {animeImageUrl ? <img src={animeImageUrl} alt={animeTitle} /> : null}
                {anime.score ? <p className="fullAnime__score bg-white text-black text-xl py-1 px-4">{anime.score}</p> : null}
              </div>
              <div className="fullAnime__textWrapper">
                <h3 className="fullAnime__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{animeTitle}</h3>
                <p className="fullAnime__episodes mt-1 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Episodes: <b>{anime.episodes || "Unknown"}</b></p>
                <p className="FullAnime__status my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Status: <b>{anime.status || "Unknown"}</b></p>
                <p className="FullAnime__year text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Year: <b>{anime.year || "Unknown"}</b></p>
                <p className="FullAnime__rating my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Rating: <b>{anime.rating || "Unknown"}</b></p>
                <p className="FullAnime__studio text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Studio:{" "}
                  <b>
                    {studios.length > 0 ? studios.map(studio => <span key={studio.mal_id}>{studio.name}</span>) : "Unknown"}
                  </b>
                </p>
              </div>
            </div>
            <div className="images" data-aos="fade-up">
              <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-8">Images:</p>
              <div className="images__content">
                {animePicturesLoading ? <LazyLoading /> : animePicturesError ? (
                  <ErrorState
                    message="Anime images could not be loaded."
                    onRetry={refetchAnimePictures}
                    isRetrying={animePicturesFetching}
                  />
                ) : pictures.length > 0 ? (
                  <Swiper
                    modules={[Autoplay]}
                    spaceBetween={50}
                    breakpoints={swiperBreakpoints}
                    slidesPerView={5}
                    autoplay={{ delay: 3000 }}
                  >
                    {pictures.map((picture, index) => {
                      const imageUrl = picture?.webp?.image_url;

                      return imageUrl ? (
                        <SwiperSlide key={index}>
                          <img className="images__img" src={imageUrl} alt="" />
                        </SwiperSlide>
                      ) : null;
                    })}
                  </Swiper>
                ) : <p>There are currently no images for this anime.</p>}
              </div>
            </div>
            <div data-aos="fade-up" className="fullAnime__trailer mt-4">
              {trailerUrl && trailerImageUrl ? (
                <>
                  <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">Trailer:</p>
                  <a className="trailer-imgWrapepr" href={trailerUrl}>
                    <div className="trailer-imgWrapper">
                      <img className="trailer-img" src={trailerImageUrl} alt={`${animeTitle} trailer`} />
                      <img className="playButton" width={50} height={50} src={playButton} alt="" />
                    </div>
                  </a>
                </>
              ) : (
                <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">There is currently no trailer for this anime</p>
              )}
            </div>
            <div className="episodes">
              <p className="episodes__text text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Episodes:</p>
              <div className="episodes__type flex gap-4 items-center">
                <p className="episode__canon canonEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Canon color</p>
                <p className="episode__filter fillerEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Filler color</p>
              </div>
              {animeEpisodesLoading ? <LazyLoading /> : animeEpisodesError ? (
                <ErrorState
                  message="Anime episodes could not be loaded."
                  onRetry={refetchAnimeEpisodes}
                  isRetrying={animeEpisodesFetching}
                />
              ) : episodes.length > 0 ? (
                <div className="episodes__content">
                  <ol className="episode__name">
                    <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode name</h3>
                    {episodes.map((episode) => (
                      <Link to={episode.url || "#"} key={episode.mal_id}>
                        <li className={episode.filler ? "fillerEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl" : "canonEpisode text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"}>
                          {episode.title || "No title"}
                        </li>
                      </Link>
                    ))}
                  </ol>
                  <ul className="episode__score justify-self-end">
                    <h3 className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Episode Score</h3>
                    {episodes.map((episode) => (
                      <li key={episode.mal_id} className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">
                        {episode.score ? episode.score * 2 : "Unknown"}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : <p>There are currently no episodes for this anime.</p>}
            </div>
            <div className="characters mt-8">
              <p className="characters__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Characters: </p>
              <button className={isActiveCharacters ? "display-none" : 'show-btn bg-black text-white py-2 px-3'} onClick={() => setIsActiveCharacters(true)}>See all characters</button>
              {animeCharactersLoading && isActiveCharacters ? <LazyLoading /> : animeCharactersError && isActiveCharacters ? (
                <ErrorState
                  message="Anime characters could not be loaded."
                  onRetry={refetchAnimeCharacters}
                  isRetrying={animeCharactersFetching}
                />
              ) : (
                <div className="characters__content grid gap-8 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-4 xl:grid-rows-3">
                  {isActiveCharacters && characters.map(obj => {
                    const character = obj.character;
                    const characterName = character?.name || "Unknown";
                    const characterImageUrl = character?.images?.webp?.image_url;
                    const voiceActors = Array.isArray(obj.voice_actors) ? obj.voice_actors : [];

                    return (
                      <div key={character?.mal_id || characterName} className="Characters__card">
                        {characterImageUrl ? <img className="characters__card-img" src={characterImageUrl} alt={characterName} /> : null}
                        <div className="characters__card-textWrapepr p-2">
                          <p className="characters__card-text">Name : <b>{characterName}</b></p>
                          <p className="characters__card-subText">Role: <b>{obj.role || "Unknown"}</b></p>
                          <p><b>Voice:</b></p>
                          {voiceActors.slice(0, 2).map(actor => (
                            <p key={actor.person?.mal_id || `${actor.language}-${actor.person?.name}`}>{actor.language || "Unknown"} : <b>{actor.person?.name || "Unknown"}</b></p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="reviews mt-5">
              <button className={isActiveReviews ? "display-none" : 'show-btn bg-black text-white py-2 px-3'} onClick={() => setIsActiveReviews(true)}>See all reviews</button>
              {animeReviewsLoading && isActiveReviews ? <LazyLoading /> : animeReviewsError && isActiveReviews ? (
                <ErrorState
                  message="Anime reviews could not be loaded."
                  onRetry={refetchAnimeReviews}
                  isRetrying={animeReviewsFetching}
                />
              ) : isActiveReviews && (
                <>
                  <h3 className="review__title text-3xl mb-5">{reviews.length > 0 ? <span className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Review</span> : null}</h3>
                  <div className="reviews__content grid grid-cols-1 grid-rows-1 gap-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.mal_id} {...review} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <ErrorState message="Anime details are empty." />
        )}
      </div>
    </div>
  );
};

export default FullAnime;
