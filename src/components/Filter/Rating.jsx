import { useState } from "react";
import PropTypes from "prop-types";
import "./filter.scss";

const Rating = ({ setRating }) => {
  const [active, setActive] = useState(2);

  const ratingArr = [
    { id: 1, sortType: "pg", label: "PG", info: "Children" },
    { id: 2, sortType: "pg13", label: "PG-13", info: "Teens 13+" },
    { id: 3, sortType: "r17", label: "R-17", info: "17+" },
  ];

  const handleRatingClick = (sortType, id) => {
    setRating(sortType);
    setActive(id);
  };

  return (
    <div className="filter-control filter-control--wrap" role="group" aria-label="Rating filter">
      {ratingArr.map((item) => (
        <button
          className={active === item.id ? "rating-btn active" : "rating-btn"}
          onClick={() => handleRatingClick(item.sortType, item.id)}
          key={item.id}
          type="button"
          aria-pressed={active === item.id}
        >
          <span>{item.label}</span>
          <span className="filter-btn__hint">{item.info}</span>
        </button>
      ))}
    </div>
  );
};

Rating.propTypes = {
  setRating: PropTypes.func.isRequired,
};

export default Rating;
