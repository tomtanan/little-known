import { $ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import { gsap } from 'gsap';
import emitter from 'utils/events';
import gallery from 'modules/gallery';

const modal = (el) => {
  const modalName = el.getAttribute('data-modal');
  const modal = $(`[data-modal-target="${modalName}"]`);
  let firstTime = true;

  if (!modal) {
    console.error(`No modal found with data-modal-target="${modalName}"`);
    return;
  }

  const closeBtn = $('.js-modal-close', modal);

  // Show the modal with animation
  const showModal = () => {
    if (firstTime) {
      // Initialize gallery on first modal opening.
      const galleryElement = $('.js-gallery', modal);
      gallery(galleryElement);
      firstTime = false;
    }
    emitter.emit('openModal');
    addClass(document.body, 'scroll-lock');
    addClass(modal, 'active');
    gsap.to(modal, {
      top: 0,
      duration: 0.7,
      ease: 'power1.inOut',
    });
  };

  // Close the modal with animation
  const closeModal = () => {
    emitter.emit('closeModal');
    removeClass(document.body, 'scroll-lock');

    gsap.to(modal, {
      height: '0px',
      duration: 0.7,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.set(modal, { height: '100vh', top: '100vh' });
        emitter.emit('resetPlayers');
        emitter.emit('resetGallery');
        removeClass(modal, 'active');
      },
    });
  };

  // Event listeners
  on(el, 'click', (e) => {
    e.preventDefault();
    showModal();
  });

  on(closeBtn, 'click', (e) => {
    e.preventDefault();
    closeModal();
  });
};

export default modal;
