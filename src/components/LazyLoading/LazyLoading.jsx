import "./lazyLoading.scss"
import PropTypes from "prop-types";

const LazyLoading = ({ count = 6, message = "Loading catalogue..." }) => {
  const skeletons = Array.from({ length: count }, (_, index) => index);

  return (
    <div className="loader" role="status" aria-live="polite">
      <p className="loader__message">{message}</p>
      <div className="loader__grid">
        {skeletons.map((item) => (
          <div className="skeleton-card" key={item}>
            <div className="skeleton-card__poster" />
            <div className="skeleton-card__line skeleton-card__line--wide" />
            <div className="skeleton-card__line" />
            <div className="skeleton-card__chips">
              <span />
              <span />
              <span />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

LazyLoading.propTypes = {
  count: PropTypes.number,
  message: PropTypes.string,
};

export default LazyLoading
