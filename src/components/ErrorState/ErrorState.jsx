import PropTypes from "prop-types";

const ErrorState = ({ eyebrow = "Section unavailable", message, onRetry, isRetrying = false, role }) => {
  return (
    <div className="error-state text-center py-8" role={role}>
      <p className="error-state__eyebrow">{eyebrow}</p>
      <p className="error-state__message mb-4">{message}</p>
      {onRetry ? (
        <button
          className="show-btn bg-black text-white py-2 px-3"
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
        >
          {isRetrying ? "Retrying..." : "Try again"}
        </button>
      ) : null}
    </div>
  );
};

ErrorState.propTypes = {
  eyebrow: PropTypes.string,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  isRetrying: PropTypes.bool,
  role: PropTypes.string,
};

export default ErrorState;
