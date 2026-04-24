import { useState } from 'react';
import "./reviewCard.scss";
import PropTypes from 'prop-types';




const ReviewCard = ({ user, review }) => {
  const [showFullReview, setShowFullReview] = useState(false);
  const reviewText = review || "";
  const userName = user?.username || "Unknown";
  const userImageUrl = user?.images?.webp?.image_url;

  const handleViewAll = () => {
    setShowFullReview(true);
  };

  return (
    <div className="review">
      <div className="review__content flex p-3 flex-col text-center gap-4 sm:grid sm:text-left">
        <div className="account">
          {userImageUrl ? <img src={userImageUrl} alt={userName} /> : null}
          <p className='text-sm'>{userName}</p>
        </div>
        <div className='review__textWrapper'>
          <p className="review__text text-sm">
            {showFullReview || reviewText.length <= 300
              ? reviewText
              : `${reviewText.slice(0, 200)}...`}
          </p>
          <div className="reactions text-sm flex flex-col gap-2 mt-2 sm:flex-row sm:text-left">
            {!showFullReview && reviewText.length > 300 && (
              <button className='review__button' onClick={handleViewAll}>View all</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
ReviewCard.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    images: PropTypes.shape({
      webp: PropTypes.shape({
        image_url: PropTypes.string,
      }),
    }),
  }),
  review: PropTypes.string,
};


export default ReviewCard;
