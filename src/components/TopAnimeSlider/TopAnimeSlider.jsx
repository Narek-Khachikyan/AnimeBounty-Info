import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import 'swiper/css';
import "swiper/css/autoplay";
import "./topAnimeSlider.scss";
import { Link } from "react-router-dom";

const TopAnimeSlider = ({ animeData }) => {
  return (
    <div className="AnimeSlide py-4">
      <h2 className='TopAnime__title text-4xl text-black mt-12 mb-6'>Top Anime</h2>
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
        autoplay={{ delay: 3000 }}
      >
        {animeData.map((obj) => (
          <SwiperSlide key={obj.mal_id}>
            <Link to={`anime/${obj.mal_id}`}>
              <div className="slide">
                <div className="slide__content p-3 pb-0">
                  <div className="slide__img">
                    <img src={obj.images.webp.large_image_url} alt="" />
                    <p className="slide__score text-base bg-white text-black px-2 px1">
                      {obj.score}
                    </p>
                  </div>
                  <div className="slide__textWrapper p-1">
                    <p className="slide__text text-base my-1">
                      {obj.title_english.length > 20
                        ? `${obj.title_english.slice(0, 21)}...`
                        : obj.title_english}
                    </p>
                    <p className="slide__subText">
                      Episodes : <span>{obj.episodes}</span>
                    </p>
                    <p className="slide__statusText">
                      Status : <span>{obj.status}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopAnimeSlider;
