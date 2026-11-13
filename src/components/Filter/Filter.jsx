import PropTypes from "prop-types";
import "./filter.scss";

const Filter = ({ setOrderBy, orderBy }) => {

  const order = [
    { id: 1, sortType: "title", label: "Title" },
    { id: 2, sortType: "score", label: "Score" },
    { id: 3, sortType: "popularity", label: "Popularity" },
  ];

  return (
    <div className="filter-control" role="group" aria-label="Order results by">
      {order.map((item) => (
        <button
          className={orderBy === item.sortType ? "filter-btn active" : "filter-btn"}
          onClick={() => setOrderBy(item.sortType)}
          key={item.id}
          type="button"
          aria-pressed={orderBy === item.sortType}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
Filter.propTypes = {
  orderBy: PropTypes.string.isRequired,
  setOrderBy: PropTypes.func.isRequired,
};

export default Filter;

