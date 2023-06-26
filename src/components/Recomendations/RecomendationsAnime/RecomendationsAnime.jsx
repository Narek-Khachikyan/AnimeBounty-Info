import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../recomendations.scss";
import LazyLoading from "../../LazyLoading/LazyLoading";

const RecomendationsAnime = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight
    ) {
      if (!isLoading) {
        setIsLoading(true);
        loadMoreData();
      }
    }
  };

  const loadMoreData = () => {
    setTimeout(() => {
      setVisibleItems(prevVisibleItems => prevVisibleItems + 6);
      setIsLoading(false);
    }, 600);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div data-aos="fade-up" className="py-5 rec">
      <h3 className="text-4xl rec__title mb-5">Recomendation</h3>
      <div className="rec__content grid gap-9 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
        {data.slice(0, visibleItems).map(obj =>
          obj.entry.map(item => (
            <Link key={item.mal_id} to={`${item.mal_id}`}>
              <div className="rec__card-content p-3 pb-0">
                <img
                  className="w-full rec__card-img"
                  src={item.images.webp.image_url}
                  alt=""
                />
                <p className="text-base text-center my-2">
                  {item.title.length > 20 ? `${item.title.slice(0, 21)}...` : item.title}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
      {isLoading &&
        <>
          <p className="text-center">If the content does not load for a long time, then reload the page or go back</p>
          <LazyLoading />
        </>
      }
    </div>
  );
};

export default RecomendationsAnime;
