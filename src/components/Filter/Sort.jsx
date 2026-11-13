import PropTypes from "prop-types";
import "./filter.scss";

const Sort = ({ setSortBy, sortBy }) => {

  const sort = [
    { id: 1, sortType: "asc", label: "Ascending" },
    { id: 2, sortType: "desc", label: "Descending" },
  ];

  return (
    <div className="filter-control" role="group" aria-label="Sort direction">
      {sort.map((item) => (
        <button
          className={sortBy === item.sortType ? "sort-btn active" : "sort-btn"}
          onClick={() => setSortBy(item.sortType)}
          key={item.id}
          type="button"
          aria-pressed={sortBy === item.sortType}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

Sort.propTypes = {
  sortBy: PropTypes.string.isRequired,
  setSortBy: PropTypes.func.isRequired,
};

export default Sort
