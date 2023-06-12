import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "swiper/css";
import "swiper/css/autoplay";
import "./FullManga.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import LazyLoading from "../LazyLoading/LazyLoading";
import ReviewCard from "../ReviewCard/ReviewCard";
import AOS from "aos";
import "aos/dist/aos.css";
import { useGetFullMangaQuery, useGetMangaCharactersQuery, useGetMangaPicturesQuery, useGetMangaReviewsQuery } from "../../features/apiSlice";


const FullManga = () => {
  const [isActiveCharacters, setIsActiveCharacters] = useState(true);
  const [isActiveReviews, setIsActiveReviews] = useState(true)
  const { id } = useParams();

  const { data: fullMangaData, isLoading: fullMangaDataLoading } = useGetFullMangaQuery(id)
  const { data: magnaPictures } = useGetMangaPicturesQuery(id)
  const { data: mangaCharacters } = useGetMangaCharactersQuery(id)
  const { data: mangaReviews } = useGetMangaReviewsQuery(id)

  useEffect(() => {
    AOS.init()
    AOS.refresh();
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fullManga__wrapper pb-10">
      {
        fullMangaData ? (
          <>
            <div data-aos="fade-up" className="fullManga__content flex flex-wrap gap-10 pt-10 sm:flex-wrap md:flex-nowrap">
              <div className="fullManga__img">
                <img src={fullMangaData.data.images.webp.large_image_url ? fullMangaData.data.images.webp.large_image_url : <b>registration</b>} alt="" />
                <p className="fullManga__score bg-white text-black text-xl py-1 px-4">{fullMangaData.data.score}</p>
              </div>
              <div className="fullManga__textWrapper">
                <p className="fullManga__text text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl">{fullMangaData.data.title_english ? fullMangaData.data.title_english : <b>registration</b>}</p>
                <p className="fullManga__subtext mt-1 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Chapters: <b>{fullMangaData.data.chapters ? fullMangaData.data.chapters : <b>registration</b>}</b></p>
                <p className="fullManga__subtext my-2 text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Status: <b>{fullMangaData.data.status ? fullMangaData.data.status : <b>registration</b>}</b></p>
                <p className="fullManga__subtext text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-2">Published: <b>{fullMangaData.data.published.string ? fullMangaData.data.published.string : <b>registration</b>}</b></p>
                <div className="authors__textWrapper flex gap-2" >
                  <p className="text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl">Authors:</p>
                  {
                    fullMangaData.data.authors ? (
                      fullMangaData.data.authors.map(author => (
                        <p key={author.mal_id} className="text-base sm:text-xl md:text-xl lg:text-2xl xl:text-2xl"><b>{author.name}</b></p>
                      ))) : <b>registration</b>
                  }
                </div>
              </div>
            </div>
            <div data-aos="fade-up" className="fullManga__descr mt-3">
              <p className="fullManga__descr-title text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl my-4"><b>Description</b></p>
              <p className="fullManga__descr-text text-base sm:text-sm md:text-base">
                {fullMangaData.data.background ? fullMangaData.data.background : <b>registration</b>}
              </p>
            </div>
            {
              magnaPictures ? (
                <div data-aos="fade-up" className="mangaImages">
                  <p className="text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl my-8">Images:</p>
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
                      {magnaPictures.data.map((picture, index) => (
                        <SwiperSlide key={index}>
                          <img key={index} className="mangaImages__image" src={picture.webp.image_url} alt="" />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>) : <LazyLoading />
            }
            <div className="mangaCharacters mt-8">
              <p className="mangaCharacters__title text-xl sm:text-xl md:text-xl lg:text-2xl xl:text-2xl mb-3">Characters: </p>
              <button className={isActive ? "show-btn bg-black text-white py-2 px-3" : 'display-none'} onClick={() => setIsActive(false)}>See all characters</button>
              <div className="mangaCharacters__content  grid gap-8 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
                {
                  mangaCharacters ? (
                    mangaCharacters.data.map(obj => (
                      <div key={obj.character.mal_id} className="mangaCharacters__card">
                        <img className="mangaCharacters__card-img" src={obj.character.images.webp.image_url} alt="" />
                        <div className="mangaCharacters__card-textWrapepr p-2">
                          <p className="mangaCharacters__card-text">Name : <b>{obj.character.name}</b></p>
                          <p className="mangaCharacters__card-subText">Role: <b>{obj.role}</b></p>
                        </div>
                      </div>
                    ))) : <b>registration</b>
                }
              </div>
            </div>
          </>
        ) : <LazyLoading />
      }
    </div>
  );
};

export default FullManga;
