import { useRegisterSW } from 'virtual:pwa-register/react';
import './serviceWorkerUpdateNotice.scss';

const updateCheckIntervalMs = 60 * 60 * 1000;

const ServiceWorkerUpdateNotice = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) {
        return;
      }

      setInterval(() => {
        registration.update();
      }, updateCheckIntervalMs);
    },
  });

  if (!offlineReady && !needRefresh) {
    return null;
  }

  const closeNotice = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  return (
    <div className="service-worker-notice" role="status" aria-live="polite">
      <span className="service-worker-notice__label">
        {needRefresh ? 'New version' : 'Offline ready'}
      </span>
      <span className="service-worker-notice__message">
        {needRefresh
          ? 'A new version is available.'
          : 'Previously opened anime and manga data can now be shown offline.'}
      </span>
      <div className="service-worker-notice__actions">
        {needRefresh ? (
          <button
            className="service-worker-notice__button service-worker-notice__button--primary"
            type="button"
            onClick={() => updateServiceWorker(true)}
          >
            Update
          </button>
        ) : null}
        <button
          className="service-worker-notice__button"
          type="button"
          onClick={closeNotice}
        >
          {needRefresh ? 'Later' : 'Got it'}
        </button>
      </div>
    </div>
  );
};

export default ServiceWorkerUpdateNotice;
