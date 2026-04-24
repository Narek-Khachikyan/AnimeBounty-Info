import { useState } from "react";
import PropTypes from "prop-types";
import "./filter.scss";

const Filter = ({ setOrderBy }) => {
  const [active, setActive] = useState(2);

  const order = [
    { id: 1, sortType: "title", label: "Title" },
    { id: 2, sortType: "score", label: "Score" },
    { id: 3, sortType: "popularity", label: "Popularity" },
  ];

  const handleOrderClick = (sortType, id) => {
    setOrderBy(sortType);
    setActive(id);
  };

  return (
    <div className="filter-control" role="group" aria-label="Order results by">
      {order.map((item) => (
        <button
          className={active === item.id ? "filter-btn active" : "filter-btn"}
          onClick={() => handleOrderClick(item.sortType, item.id)}
          key={item.id}
          type="button"
          aria-pressed={active === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
Filter.propTypes = {
  setOrderBy: PropTypes.func.isRequired,
};

export default Filter;

