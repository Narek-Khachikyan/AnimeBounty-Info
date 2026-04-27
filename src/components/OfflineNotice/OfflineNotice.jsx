import useOnlineStatus from '../../hooks/useOnlineStatus';
import './offlineNotice.scss';

const OfflineNotice = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-notice" role="status" aria-live="polite">
      <span className="offline-notice__label">Offline mode</span>
      <span className="offline-notice__message">
        Saved app screens and previously opened anime or manga data can still appear.
      </span>
    </div>
  );
};

export default OfflineNotice;
