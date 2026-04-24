import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../recomendations.scss";
import LazyLoading from "../../LazyLoading/LazyLoading";
import PropTypes from "prop-types";


const RecomendationsManga = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);
  const mangaRecommendations = Array.isArray(data) ? data : [];
  const hasMoreItems = visibleItems < mangaRecommendations.length;

  useEffect(() => {
    const loadMoreNode = loadMoreRef.current;
    if (!loadMoreNode || !hasMoreItems) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleItems(prevVisibleItems => Math.min(prevVisibleItems + 6, mangaRecommendations.length));
          setIsLoading(false);
        }, 600);
      }
    });

    observer.observe(loadMoreNode);

    return () => {
      observer.disconnect();
    };
  }, [hasMoreItems, isLoading, mangaRecommendations.length]);

  return (
    <section data-aos="fade-up" className="py-5 rec" aria-labelledby="manga-recommendations-title">
      <div className="section-heading">
        <p className="section-kicker">Adjacent shelves</p>
        <h3 id="manga-recommendations-title" className="text-4xl rec__title mb-5">Recommended manga</h3>
      </div>
      <div className="rec__content grid gap-9 sm:grid-cols-1 sm:grid-rows-1 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 xl:grid-cols-5 xl:grid-rows-4">
        {mangaRecommendations.slice(0, visibleItems).map(recomendation =>
          (Array.isArray(recomendation.entry) ? recomendation.entry : []).map(item => {
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
      {isLoading && <LazyLoading message="Loading more manga recommendations..." count={5} />}
    </section>
  );
};

RecomendationsManga.propTypes = {
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

export default RecomendationsManga;
