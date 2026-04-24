import { useState } from "react";
import PropTypes from "prop-types";
import "./filter.scss";

const Sort = ({ setSortBy }) => {
  const [active, setActive] = useState(2);

  const sort = [
    { id: 1, sortType: "asc", label: "Ascending" },
    { id: 2, sortType: "desc", label: "Descending" },
  ];

  const handleSortClick = (sortType, id) => {
    setSortBy(sortType);
    setActive(id);
  };


  return (
    <div className="filter-control" role="group" aria-label="Sort direction">
      {sort.map((item) => (
        <button
          className={active === item.id ? "sort-btn active" : "sort-btn"}
          onClick={() => handleSortClick(item.sortType, item.id)}
          key={item.id}
          type="button"
          aria-pressed={active === item.id}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

Sort.propTypes = {
  setSortBy: PropTypes.func.isRequired,
};

export default Sort
