import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import ReviewCard from "../ReviewCard/ReviewCard";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import {
  CharacterProfilePanel,
  RelationsPanel,
  StreamingPanel,
  VideosPanel,
} from "../JikanDetailExtras/JikanDetailExtras";
import playButton from "../../assets/images/playButton.svg";
import "./FullAnime.scss";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  useGetAnimeEpisodesQuery,
  useGetAnimePicturesQuery,
  useGetFullAnimeQuery,
  useLazyGetAnimeRelationsQuery,
  useLazyGetAnimeCharactersQuery,
  useLazyGetAnimeStreamingQuery,
  useLazyGetAnimeVideosQuery,
  useLazyGetCharacterFullQuery,
  useLazyGetAnimeReviewsQuery,
} from "../../features/apiSlice";

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
  const [isActiveRelations, setIsActiveRelations] = useState(false)
  const [isActiveStreaming, setIsActiveStreaming] = useState(false)
  const [isActiveVideos, setIsActiveVideos] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const {
    data: fullAnimeData,
    isLoading: fullAnimeLoading,
    isFetching: fullAnimeFetching,
    isError: fullAnimeError,
    refetch: refetchFullAnime,
  } = useGetFullAnimeQuery(id)
  const anime = fullAnimeData?.data;
  const canLoadAnimeSecondary = Boolean(id && anime);
  const {
    data: animePictures,
    isLoading: animePicturesLoading,
    isFetching: animePicturesFetching,
    isError: animePicturesError,
    refetch: refetchAnimePictures,
  } = useGetAnimePicturesQuery(id, { skip: !canLoadAnimeSecondary })
  const {
    data: animeEpisodes,
    isLoading: animeEpisodesLoading,
    isFetching: animeEpisodesFetching,
    isError: animeEpisodesError,
    refetch: refetchAnimeEpisodes,
  } = useGetAnimeEpisodesQuery(id, { skip: !canLoadAnimeSecondary })
  const [
    triggerAnimeCharacters,
    {
      data: animeCharacters,
      isLoading: animeCharactersLoading,
      isFetching: animeCharactersFetching,
      isUninitialized: animeCharactersUninitialized,
      isError: animeCharactersError,
    },
  ] = useLazyGetAnimeCharactersQuery()
  const [
    triggerAnimeRelations,
    {
      data: animeRelations,
      isLoading: animeRelationsLoading,
      isFetching: animeRelationsFetching,
      isError: animeRelationsError,
    },
  ] = useLazyGetAnimeRelationsQuery()
  const [
    triggerAnimeStreaming,
    {
      data: animeStreaming,
      isLoading: animeStreamingLoading,
      isFetching: animeStreamingFetching,
      isError: animeStreamingError,
    },
  ] = useLazyGetAnimeStreamingQuery()
  const [
    triggerAnimeVideos,
    {
      data: animeVideos,
      isLoading: animeVideosLoading,
      isFetching: animeVideosFetching,
      isError: animeVideosError,
    },
  ] = useLazyGetAnimeVideosQuery()
  const [
    triggerCharacterFull,
    {
      data: characterFull,
      isLoading: characterFullLoading,
      isFetching: characterFullFetching,
      isError: characterFullError,
    },
  ] = useLazyGetCharacterFullQuery()
  const [
    triggerAnimeReviews,
    {
      data: animeReviews,
      isLoading: animeReviewsLoading,
      isFetching: animeReviewsFetching,
      isUninitialized: animeReviewsUninitialized,
      isError: animeReviewsError,
    },
  ] = useLazyGetAnimeReviewsQuery()

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    window.scrollTo(0, 0);
  }, []);

  const animeTitle = anime?.title_english || anime?.title || "No title";
  const animeImageUrl = anime?.images?.webp?.large_image_url || anime?.images?.webp?.image_url;
  const studios = Array.isArray(anime?.studios) ? anime.studios : [];
  const pictures = Array.isArray(animePictures?.data) ? animePictures.data : [];
  const episodes = Array.isArray(animeEpisodes?.data) ? animeEpisodes.data : [];
  const characters = Array.isArray(animeCharacters?.data) ? animeCharacters.data : [];
  const relations = Array.isArray(animeRelations?.data) ? animeRelations.data : [];
  const streaming = Array.isArray(animeStreaming?.data) ? animeStreaming.data : [];
  const videos = animeVideos?.data ?? {};
  const reviews = Array.isArray(animeReviews?.data) ? animeReviews.data : [];
  const trailerUrl = anime?.trailer?.url;
  const trailerImageUrl = anime?.trailer?.images?.maximum_image_url;
  const showAnimeCharactersLoader = isActiveCharacters && (
    animeCharactersUninitialized ||
    animeCharactersLoading ||
    animeCharactersFetching
  );
  const showAnimeReviewsLoader = isActiveReviews && (
    animeReviewsUninitialized ||
    animeReviewsLoading ||
    animeReviewsFetching
  );
  const handleShowAnimeCharacters = () => {
    setIsActiveCharacters(true);

    if (id) {
      triggerAnimeCharacters(id, true);
    }
  };
  const handleShowAnimeReviews = () => {
    setIsActiveReviews(true);

    if (id) {
      triggerAnimeReviews(id, true);
    }
  };
  const handleShowAnimeRelations = () => {
    setIsActiveRelations(true);

    if (id) {
      triggerAnimeRelations(id, true);
    }
  };
  const handleShowAnimeStreaming = () => {
    setIsActiveStreaming(true);

    if (id) {
      triggerAnimeStreaming(id, true);
    }
  };
  const handleShowAnimeVideos = () => {
    setIsActiveVideos(true);

    if (id) {
      triggerAnimeVideos(id, true);
    }
  };
  const handleShowCharacterProfile = (character) => {
    const characterId = character?.mal_id;

    if (!characterId) {
      return;
    }

    setSelectedCharacter({
      id: characterId,
      name: character?.name || "Unknown",
    });
    triggerCharacterFull(characterId, true);
  };

  return (
    <div className="fullAnime__wrapper pb-10">
      <div className="container">
        {fullAnimeLoading ? (
          <LazyLoading message="Loading anime details..." count={6} />
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
                <p className="section-kicker">Anime profile</p>
                <h1 className="fullAnime__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{animeTitle}</h1>
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
              <h2 className="detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-8">Poster gallery</h2>
              <div className="images__content">
                {animePicturesLoading ? <LazyLoading message="Loading anime images..." count={5} /> : animePicturesError ? (
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
                  <h2 className="detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">Trailer</h2>
                  <a className="trailer-imgWrapepr" href={trailerUrl}>
                    <div className="trailer-imgWrapper">
                      <img className="trailer-img" src={trailerImageUrl} alt={`${animeTitle} trailer`} />
                      <img className="playButton" width={50} height={50} src={playButton} alt="" />
                    </div>
                  </a>
                </>
              ) : (
                <p className="detail-empty text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-4">No trailer is available for this anime yet.</p>
              )}
            </div>
            <RelationsPanel
              isActive={isActiveRelations}
              isError={animeRelationsError}
              isFetching={animeRelationsFetching}
              isLoading={animeRelationsLoading}
              items={relations}
              onOpen={handleShowAnimeRelations}
              onRetry={() => triggerAnimeRelations(id, false)}
            />
            <StreamingPanel
              isActive={isActiveStreaming}
              isError={animeStreamingError}
              isFetching={animeStreamingFetching}
              isLoading={animeStreamingLoading}
              items={streaming}
              onOpen={handleShowAnimeStreaming}
              onRetry={() => triggerAnimeStreaming(id, false)}
            />
            <VideosPanel
              isActive={isActiveVideos}
              isError={animeVideosError}
              isFetching={animeVideosFetching}
              isLoading={animeVideosLoading}
              items={videos}
              onOpen={handleShowAnimeVideos}
              onRetry={() => triggerAnimeVideos(id, false)}
            />
            <div className="episodes">
              <h2 className="episodes__text detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Episodes</h2>
              <div className="episodes__type flex gap-4 items-center">
                <p className="episode__canon canonEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Canon color</p>
                <p className="episode__filter fillerEpisode text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-5">Filler color</p>
              </div>
              {animeEpisodesLoading ? <LazyLoading message="Loading episodes..." count={4} /> : animeEpisodesError ? (
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
              <h2 className="characters__title detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Characters</h2>
              <button className={isActiveCharacters ? "display-none" : 'show-btn bg-black text-white py-2 px-3'} onClick={handleShowAnimeCharacters}>Browse character list</button>
              {showAnimeCharactersLoader ? <LazyLoading message="Loading characters..." count={8} /> : animeCharactersError && isActiveCharacters ? (
                <ErrorState
                  message="Anime characters could not be loaded."
                  onRetry={() => triggerAnimeCharacters(id, false)}
                  isRetrying={animeCharactersFetching}
                />
              ) : isActiveCharacters && characters.length > 0 ? (
                <div className="characters__content grid gap-8 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-4 xl:grid-rows-3">
                  {characters.map(obj => {
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
                          <button
                            type="button"
                            className="character-profile-button"
                            onClick={() => handleShowCharacterProfile(character)}
                          >
                            Open profile for {characterName}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : isActiveCharacters ? <p>There are currently no characters for this anime.</p> : null}
              <CharacterProfilePanel
                characterName={selectedCharacter?.name}
                data={characterFull}
                isError={characterFullError}
                isFetching={characterFullFetching}
                isLoading={characterFullLoading}
                onRetry={() => triggerCharacterFull(selectedCharacter?.id, false)}
              />
            </div>
            <div className="reviews mt-5">
              <button className={isActiveReviews ? "display-none" : 'show-btn bg-black text-white py-2 px-3'} onClick={handleShowAnimeReviews}>Read community reviews</button>
              {showAnimeReviewsLoader ? <LazyLoading message="Loading reviews..." count={4} /> : animeReviewsError && isActiveReviews ? (
                <ErrorState
                  message="Anime reviews could not be loaded."
                  onRetry={() => triggerAnimeReviews(id, false)}
                  isRetrying={animeReviewsFetching}
                />
              ) : isActiveReviews && reviews.length > 0 ? (
                <>
                  <h3 className="review__title text-3xl mb-5"><span className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-4">Review</span></h3>
                  <div className="reviews__content grid grid-cols-1 grid-rows-1 gap-4">
                    {reviews.map((review) => (
                      <ReviewCard key={review.mal_id} {...review} />
                    ))}
                  </div>
                </>
              ) : isActiveReviews ? <p>There are currently no reviews for this anime.</p> : null}
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
