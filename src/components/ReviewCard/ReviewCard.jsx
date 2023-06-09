import { useState } from 'react';
import "./reviewCard.scss";
import PropTypes from 'prop-types';




const ReviewCard = ({ user, review }) => {
  const [showFullReview, setShowFullReview] = useState(false);

  const handleViewAll = () => {
    setShowFullReview(true);
  };

  return (
    <div className="review">
      <div className="review__content flex p-3 flex-col text-center gap-4 sm:grid sm:text-left">
        <div className="account">
          <img src={user.images.webp.image_url} alt="" />
          <p className='text-sm'>{user.username}</p>
        </div>
        <div className='review__textWrapper'>
          <p className="review__text text-sm">
            {showFullReview || review.length <= 300
              ? review
              : `${review.slice(0, 200)}...`}
          </p>
          <div className="reactions text-sm flex flex-col gap-2 mt-2 sm:flex-row sm:text-left">
            {!showFullReview && review.length > 300 && (
              <button className='review__button' onClick={handleViewAll}>View all</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
ReviewCard.propTypes = {
  user: PropTypes.object.isRequired,
  review: PropTypes.string.isRequired,
  reactions: PropTypes.object.isRequired,
};


export default ReviewCard;
