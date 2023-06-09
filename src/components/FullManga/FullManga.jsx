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
  const [mangaCharacters, setMangaCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(true);
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

  const fetchMangaCharacters = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/manga/${id}/characters`);
      setMangaCharacters(response.data.data);
      setIsActive(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMangaData = async () => {
    try {
      const requests = [
        fetchFullManga(),
        fetchFullMangaPictures(),
        fetchMangaReviews(),
      ];

      await Promise.all(requests);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMangaData();
    window.scrollTo(0, 0);
  }, []);

  console.log(mangaCharacters)
  return (
    <div className="fullManga__wrapper pb-10">
      {isLoading ? (
        <LazyLoading />
      ) : (
        <>
          <div className="fullManga__content pt-10 flex gap-10">
            <div className="fullManga__img">
              <img src={fullManga.images.webp.large_image_url ? fullManga.images.webp.large_image_url : null} alt="" />
              <p className="fullManga__score bg-white text-black text-xl py-1 px-4">{fullManga.score}</p>
            </div>
            <div className="fullManga__textWrapper">
              <p className="fullManga__text text-4xl">{fullManga.title_english ? fullManga.title_english : <b>registration🥲</b>}</p>
              <p className="fullManga__subtext text-xl mt-1">Chapters: <b>{fullManga.chapters ? fullManga.chapters : <b>registration🥲</b>}</b></p>
              <p className="fullManga__subtext text-xl my-2">Status: <b>{fullManga.status ? fullManga.status : <b>registration🥲</b>}</b></p>
              <p className="fullManga__subtext text-xl mb-2">Published: <b>{fullManga.published.string ? fullManga.published.string : <b>registration🥲</b>}</b></p>
              <div className="authors__textWrapper flex gap-2" >
                <p className="text-xl">Authors:</p>
                {
                  fullManga.authors ? (
                    fullManga.authors.map(author => (
                      <p key={author.mal_id} className="text-xl"><b>{author.name}</b></p>
                    ))) : <b>registration🥲</b>
                }
              </div>
            </div>
          </div>
          <div className="fullManga__descr mt-3">
            <p className="fullManga__descr-title text-3xl my-4"><b>Description</b></p>
            <p className="fullManga__descr-text text-base">
              {fullManga.background ? fullManga.background : <b>registration🥲</b>}
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
          <div className="mangaCharacters mt-8">
            <p className="mangaCharacters__title text-3xl mb-3">Characters: </p>
            <button className={isActive ? "show-btn bg-black text-white py-2 px-3" : 'display-none'} onClick={() => fetchMangaCharacters()}>See all characters</button>
            <div className="mangaCharacters__content grid grid-cols-4 grid-rows-3 gap-8">
              {
                mangaCharacters ? (
                  mangaCharacters.map(obj => (
                    <div key={obj.character.mal_id} className="mangaCharacters__card">
                      <img className="mangaCharacters__card-img" src={obj.character.images.webp.image_url} alt="" />
                      <div className="mangaCharacters__card-textWrapepr p-2">
                        <p className="mangaCharacters__card-text">Name : <b>{obj.character.name}</b></p>
                        <p className="mangaCharacters__card-subText">Role: <b>{obj.role}</b></p>
                      </div>
                    </div>
                  ))) : <b>registration🥲</b>
              }
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
