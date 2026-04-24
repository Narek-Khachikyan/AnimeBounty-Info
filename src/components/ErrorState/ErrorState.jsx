import PropTypes from "prop-types";

const ErrorState = ({ message, onRetry, isRetrying = false }) => {
  return (
    <div className="text-center py-8">
      <p className="mb-4">{message}</p>
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
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
  isRetrying: PropTypes.bool,
};

export default ErrorState;
