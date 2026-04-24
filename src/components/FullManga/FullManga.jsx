import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "./FullManga.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import LazyLoading from "../LazyLoading/LazyLoading";
import ErrorState from "../ErrorState/ErrorState";
import ReviewCard from "../ReviewCard/ReviewCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetFullMangaQuery, useGetMangaCharactersQuery, useGetMangaPicturesQuery, useGetMangaReviewsQuery } from "../../features/apiSlice";

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

const FullManga = () => {
  const [isActiveCharacters, setIsActiveCharacters] = useState(false);
  const [isActiveReviews, setIsActiveReviews] = useState(false)
  const { id } = useParams();

  const {
    data: fullMangaData,
    isLoading: fullMangaLoading,
    isFetching: fullMangaFetching,
    isError: fullMangaError,
    refetch: refetchFullManga,
  } = useGetFullMangaQuery(id)
  const {
    data: mangaPictures,
    isLoading: mangaPicturesLoading,
    isFetching: mangaPicturesFetching,
    isError: mangaPicturesError,
    refetch: refetchMangaPictures,
  } = useGetMangaPicturesQuery(id)
  const {
    data: mangaCharacters,
    isLoading: mangaCharactersLoading,
    isFetching: mangaCharactersFetching,
    isError: mangaCharactersError,
    refetch: refetchMangaCharacters,
  } = useGetMangaCharactersQuery(id)
  const {
    data: mangaReviews,
    isLoading: mangaReviewsLoading,
    isFetching: mangaReviewsFetching,
    isError: mangaReviewsError,
    refetch: refetchMangaReviews,
  } = useGetMangaReviewsQuery(id)

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    window.scrollTo(0, 0);
  }, []);

  const manga = fullMangaData?.data;
  const mangaTitle = manga?.title_english || manga?.title || "No title";
  const mangaImageUrl = manga?.images?.webp?.large_image_url || manga?.images?.webp?.image_url;
  const authors = Array.isArray(manga?.authors) ? manga.authors : [];
  const pictures = Array.isArray(mangaPictures?.data) ? mangaPictures.data : [];
  const characters = Array.isArray(mangaCharacters?.data) ? mangaCharacters.data : [];
  const reviews = Array.isArray(mangaReviews?.data) ? mangaReviews.data : [];

  return (
    <div className="fullManga__wrapper pb-10">
      {fullMangaLoading ? (
        <LazyLoading message="Loading manga details..." count={6} />
      ) : fullMangaError ? (
        <ErrorState
          message="Manga details could not be loaded."
          onRetry={refetchFullManga}
          isRetrying={fullMangaFetching}
        />
      ) : manga ? (
        <>
          <div data-aos="fade-up" className="fullManga__content flex flex-wrap gap-10 pt-10 sm:flex-wrap md:flex-nowrap">
            <div className="fullManga__img">
              {mangaImageUrl ? <img src={mangaImageUrl} alt={mangaTitle} /> : null}
              {manga.score ? <p className="fullManga__score bg-white text-black text-xl py-1 px-4">{manga.score}</p> : null}
            </div>
            <div className="fullManga__textWrapper">
              <p className="section-kicker">Manga profile</p>
              <h1 className="fullManga__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{mangaTitle}</h1>
              <p className="fullManga__subtext mt-1 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Chapters: <b>{manga.chapters || "Unknown"}</b></p>
              <p className="fullManga__subtext my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Status: <b>{manga.status || "Unknown"}</b></p>
              <p className="fullManga__subtext text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-2">Published: <b>{manga.published?.string || "Unknown"}</b></p>
              <div className="authors__textWrapper flex gap-2" >
                <p className="text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Authors:</p>
                {authors.length > 0 ? (
                  authors.map(author => (
                    <p key={author.mal_id} className="text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"><b>{author.name}</b></p>
                  ))) : <b>Unknown</b>
                }
              </div>
            </div>
          </div>
          <div data-aos="fade-up" className="fullManga__descr mt-3">
            <h2 className="fullManga__descr-title detail-section__title text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl my-4">Description</h2>
            <p className="fullManga__descr-text text-base sm:text-sm md:text-base">
              {manga.background || manga.synopsis || "No description available."}
            </p>
          </div>
          <div data-aos="fade-up" className="mangaImages">
            <h2 className="detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-8">Poster gallery</h2>
            <div className="animeImages__content">
              {mangaPicturesLoading ? <LazyLoading message="Loading manga images..." count={5} /> : mangaPicturesError ? (
                <ErrorState
                  message="Manga images could not be loaded."
                  onRetry={refetchMangaPictures}
                  isRetrying={mangaPicturesFetching}
                />
              ) : pictures.length > 0 ? (
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={50}
                  slidesPerView={5}
                  autoplay={{ delay: 3000 }}
                  breakpoints={swiperBreakpoints}
                >
                  {pictures.map((picture, index) => {
                    const imageUrl = picture?.webp?.image_url;

                    return imageUrl ? (
                      <SwiperSlide key={index}>
                        <img className="mangaImages__image" src={imageUrl} alt="" />
                      </SwiperSlide>
                    ) : null;
                  })}
                </Swiper>
              ) : <p>There are currently no images for this manga.</p>}
            </div>
          </div>
          <div className="mangaCharacters mt-8">
            <h2 className="mangaCharacters__title detail-section__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Characters</h2>
            <button className={isActiveCharacters ? "display-none " : 'show-btn bg-black text-white py-2 px-3'} onClick={() => setIsActiveCharacters(true)}>Browse character list</button>
            {mangaCharactersLoading && isActiveCharacters ? <LazyLoading message="Loading manga characters..." count={8} /> : mangaCharactersError && isActiveCharacters ? (
              <ErrorState
                message="Manga characters could not be loaded."
                onRetry={refetchMangaCharacters}
                isRetrying={mangaCharactersFetching}
              />
            ) : (
              <div className="mangaCharacters__content  grid gap-8 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
                {isActiveCharacters && characters.map(obj => {
                  const character = obj.character;
                  const characterName = character?.name || "Unknown";
                  const characterImageUrl = character?.images?.webp?.image_url;

                  return (
                    <div key={character?.mal_id || characterName} className="mangaCharacters__card">
                      {characterImageUrl ? <img className="mangaCharacters__card-img" src={characterImageUrl} alt={characterName} /> : null}
                      <div className="mangaCharacters__card-textWrapepr p-2">
                        <p className="mangaCharacters__card-text">Name : <b>{characterName}</b></p>
                        <p className="mangaCharacters__card-subText">Role: <b>{obj.role || "Unknown"}</b></p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="reviews mt-5">
            <button className={isActiveReviews ? "display-none" : 'show-btn bg-black text-white py-2 px-3'} onClick={() => setIsActiveReviews(true)}>Read community reviews</button>
            {mangaReviewsLoading && isActiveReviews ? <LazyLoading message="Loading manga reviews..." count={4} /> : mangaReviewsError && isActiveReviews ? (
              <ErrorState
                message="Manga reviews could not be loaded."
                onRetry={refetchMangaReviews}
                isRetrying={mangaReviewsFetching}
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
        <ErrorState message="Manga details are empty." />
      )}
    </div>
  );
};

export default FullManga;
