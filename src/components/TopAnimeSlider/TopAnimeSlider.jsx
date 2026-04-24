import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import "swiper/css/autoplay";
import "./topAnimeSlider.scss";
import { Link } from "react-router-dom";
import AnimeSliderCard from "../AnimeSliderCard/AnimeSliderCard";
import PropTypes from "prop-types";



const TopAnimeSlider = ({ data }) => {
  const animeItems = Array.isArray(data) ? data : [];

  return (
    <div data-aos="fade-up" className="AnimeSlide py-4">
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
        {animeItems.map((obj) => (
          <SwiperSlide key={obj.mal_id}>
            <Link to={`${obj.mal_id}`}>
              <AnimeSliderCard {...obj} />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

TopAnimeSlider.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default TopAnimeSlider;
