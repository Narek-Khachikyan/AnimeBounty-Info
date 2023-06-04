import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import 'swiper/css';
import "swiper/css/autoplay";
import "./topAnimeSlider.scss";
import { Link } from "react-router-dom";

const TopAnimeSlider = () => {
  const [animeData, setAnimeData] = useState([]);

  const fetchAnimeData = useCallback(async () => {
    try {
      const cachedData = localStorage.getItem("animeData");

      if (cachedData) {
        setAnimeData(JSON.parse(cachedData));
      } else {
        const response = await axios.get("https://api.jikan.moe/v4/top/anime");
        const newData = response.data.data;

        localStorage.setItem("animeData", JSON.stringify(newData));
        setAnimeData(newData);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchAnimeData();
  }, [fetchAnimeData]);

  return (
    <div className="AnimeSlide py-4">
      <h2 className='TopAnime__title text-4xl text-black mt-12 mb-6'>Top Anime</h2>
      <Swiper
        modules={[Autoplay]}
        spaceBetween={50}
        slidesPerView={5}
        autoplay={{ delay: 3000 }}
      >
        {animeData.map((obj) => (
          <SwiperSlide key={obj.mal_id}>
            <div className="slide">
              <div className="slide__content">
                <div className="slide__img">
                  <Link to={`anime/${obj.mal_id}`}>
                    <img src={obj.images.webp.large_image_url} alt="" />
                  </Link>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TopAnimeSlider;
