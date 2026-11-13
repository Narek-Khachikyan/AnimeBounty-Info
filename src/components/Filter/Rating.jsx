import PropTypes from "prop-types";
import "./filter.scss";

const Rating = ({ setRating, rating }) => {

  const ratingArr = [
    { id: 1, sortType: "pg", label: "PG", info: "Children" },
    { id: 2, sortType: "pg13", label: "PG-13", info: "Teens 13+" },
    { id: 3, sortType: "r17", label: "R-17", info: "17+" },
  ];

  return (
    <div className="filter-control filter-control--wrap" role="group" aria-label="Rating filter">
      {ratingArr.map((item) => (
        <button
          className={rating === item.sortType ? "rating-btn active" : "rating-btn"}
          onClick={() => setRating(item.sortType)}
          key={item.id}
          type="button"
          aria-pressed={rating === item.sortType}
        >
          <span>{item.label}</span>
          <span className="filter-btn__hint">{item.info}</span>
        </button>
      ))}
    </div>
  );
};

Rating.propTypes = {
  rating: PropTypes.string.isRequired,
  setRating: PropTypes.func.isRequired,
};

export default Rating;
