import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "./FullManga.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import LazyLoading from "../LazyLoading/LazyLoading";
import ReviewCardManga from "../ReviewCard/ReviewCardManga";


const FullManga = () => {
  const [fullManga, setFullManga] = useState({});
  const [mangaPictures, setMangaPictures] = useState([]);
  const [mangaReviews, setMangaReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const fetchFullManga = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}`);
      setFullManga(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFullMangaPictures = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/pictures`);
      setMangaPictures(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMangaReviews = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/reviews`);
      setMangaReviews(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchMangaData = async () => {
    try {
      await Promise.all([fetchFullManga(), fetchFullMangaPictures(), fetchMangaReviews()]);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchMangaData();
    window.scrollTo(0, 0);
  }, []);

  console.log(mangaReviews)
  return (
    <div className="fullManga__wrapper pb-10">
      {isLoading ? (
        <LazyLoading />
      ) : (
        <>
          <div className="fullManga__content pt-10 flex gap-10">
            <div className="fullManga__img">
              <img src={fullManga.images.webp.large_image_url} alt="" />
              <p className="fullManga__score bg-white text-black text-xl py-1 px-4">{fullManga.score}</p>
            </div>
            <div className="fullManga__textWrapper">
              <p className="fullManga__text text-4xl">{fullManga.title_english}</p>
              <p className="fullManga__subtext text-xl">Chapters: <b>{fullManga.chapters}</b></p>
              <p className="fullManga__subtext text-xl">Status: <b>{fullManga.status}</b></p>
              <p className="fullManga__subtext text-xl">Published: <b>{fullManga.published.string}</b></p>
              {
                fullManga.authors.map(author => <p key={author.mal_id} className="text-xl">Author: <b>{author.name}</b></p>)
              }
            </div>
          </div>
          <div className="fullManga__descr mt-3">
            <p className="fullManga__descr-title text-3xl my-4"><b>Description</b></p>
            <p className="fullManga__descr-text text-base">
              {fullManga.background}
            </p>
          </div>
          <div className="mangaImages">
            <p className="text-3xl my-8">Images:</p>
            <div className="animeImages__content">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={50}
                slidesPerView={5}
                autoplay={{ delay: 3000 }}
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
              >
                {mangaPictures.map((picture, index) => (
                  <SwiperSlide key={index}>
                    <img key={index} className="mangaImages__image" src={picture.webp.image_url} alt="" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="reviews mt-5">
            <h3 className="review__title text-3xl mb-5">{mangaReviews.length > 0 ? <span>Review</span> : null}</h3>
            <div className="reviews__content grid grid-cols-1 grid-rows-1 gap-4">
              {mangaReviews.map((review) => (
                <ReviewCardManga key={review.mal_id} {...review} />
              ))}
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default FullManga;
