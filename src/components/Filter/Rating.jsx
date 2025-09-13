import { useState } from "react";
import PropTypes from "prop-types";
import "./filter.scss";

const Rating = ({ setRating }) => {
  const [active, setActive] = useState(2);

  const ratingArr = [
    { id: 1, sortType: "pg", info: "PG - Children" },
    { id: 2, sortType: "pg13", info: "PG-13 - Teens 13 or older" },
    { id: 3, sortType: "r17", info: "R - 17+ (violence & profanity)" },
  ];

  const handleRatingClick = (sortType, id) => {
    setRating(sortType);
    setActive(id);
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {ratingArr.map((item) => (
        <button
          className={
            active === item.id
              ? "rating-btn active text-base sm:text-base md:text-xl lg:text-xl xl:text-xl"
              : "rating-btn text-base sm:text-base md:text-xl lg:text-xl xl:text-xl"
          }
          onClick={() => handleRatingClick(item.sortType, item.id)}
          key={item.id}
        >
          {item.sortType}
          <div className="info">
            <p className="info__item">{active === item.id && item.info}</p>
          </div>
        </button>
      ))}
    </div>
  );
};

Rating.propTypes = {
  setRating: PropTypes.func.isRequired,
};

export default Rating;
