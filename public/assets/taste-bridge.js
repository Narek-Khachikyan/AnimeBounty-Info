import './motion/motion.js';
import { mount, unmountAll } from './moments/moments.js';
const mountMoments = (event) => {
  const root = event?.detail || document;
  root.querySelectorAll('[data-moment]').forEach(element => {
    mount(element).then(api => {
      if (!element.isConnected) api.destroy?.();
    }).catch(error => {
      // The live text remains readable if the optional enhancement cannot load.
      element.classList.remove('is-live');
      console.warn('Catalogue motion unavailable', error);
    });
  });
};
window.addEventListener('taste:mount', mountMoments);
window.addEventListener('taste:unmount', event => unmountAll(event.detail));
mountMoments();
