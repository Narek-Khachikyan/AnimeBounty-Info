import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../recomendations.scss";
import LazyLoading from "../../LazyLoading/LazyLoading";
import PropTypes from "prop-types";

const RecomendationsAnime = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);
  const animeRecommendations = Array.isArray(data) ? data : [];
  const hasMoreItems = visibleItems < animeRecommendations.length;

  useEffect(() => {
    const loadMoreNode = loadMoreRef.current;
    if (!loadMoreNode || !hasMoreItems) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItems(prevVisibleItems => Math.min(prevVisibleItems + 6, animeRecommendations.length));
          setIsLoading(false);
        }, 600);
      }
    });

    observer.observe(loadMoreNode);

    return () => {
      observer.disconnect();
    };
  }, [animeRecommendations.length, hasMoreItems, isLoading]);

  return (
    <div data-aos="fade-up" className="py-5 rec">
      <h3 className="text-4xl rec__title mb-5">Recomendation</h3>
      <div className="rec__content grid gap-9 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
        {animeRecommendations.slice(0, visibleItems).map(obj =>
          (Array.isArray(obj.entry) ? obj.entry : []).map(item => {
            const title = item.title || "No title";
            const imageUrl = item.images?.webp?.image_url;

            return (
            <Link key={item.mal_id} to={`${item.mal_id}`}>
              <div className="rec__card-content p-3 pb-0">
                {imageUrl ? (
                  <img
                    className="w-full rec__card-img"
                    src={imageUrl}
                    alt={title}
                  />
                ) : null}
                <p className="text-base text-center my-2">
                  {title.length > 20 ? `${title.slice(0, 21)}...` : title}
                </p>
              </div>
            </Link>
            );
          })
        )}
      </div>
      <div ref={loadMoreRef} />
      {isLoading &&
        <LazyLoading message="Loading more anime recommendations..." count={5} />
      }
    </div>
  );
};

RecomendationsAnime.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      entry: PropTypes.arrayOf(
        PropTypes.shape({
          mal_id: PropTypes.number,
          title: PropTypes.string,
          images: PropTypes.shape({
            webp: PropTypes.shape({
              image_url: PropTypes.string,
            }),
          }),
        })
      ),
    })
  ),
};

export default RecomendationsAnime;
