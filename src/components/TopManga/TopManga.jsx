import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import 'swiper/css';
import "swiper/css/autoplay";
import "./TopManga.scss";
import TopMangaCard from "../TopMangaCard/TopMangaCard";
import PropTypes from "prop-types";

const TopManga = ({ data }) => {
  const mangaItems = Array.isArray(data) ? data : [];

  return (
    <div data-aos="fade-up" className="AnimeSlide py-4">
      <h2 className='TopManga__title text-4xl text-black mt-12 mb-6'>Top Manga</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={50}
        slidesPerView={5}
        breakpoints={{
          320: {
            slidesPerView: 1,
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
        autoplay={{ delay: 3000 }}
      >
        {mangaItems.map((obj) => (
          <SwiperSlide key={obj.mal_id}>
            <TopMangaCard {...obj} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

TopManga.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
};

export default TopManga;
