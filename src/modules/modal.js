import { $, $$ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import { gsap } from 'gsap';
import emitter from 'utils/events';
import gallery from 'modules/gallery';

export default function modal(el) {
  const modalName = el.getAttribute('data-modal');
  const modal = $(`[data-modal-target="${modalName}"]`);
  const galleryElement = $('.js-gallery', modal);

  if (!modal) {
    console.error(`No modal found with data-modal-target="${modalName}"`);
    return;
  }

  const closeBtn = $('.js-modal-close', modal);

  // Initialize gallery
  gallery(galleryElement);

  // Show the modal with animation
  const showModal = () => {
    emitter.emit('autoPlay', modal);
    addClass(modal, 'active');
    addClass(document.body, 'no-scroll');
    gsap.to(modal, { top: 0, duration: 0.5, ease: 'power1.in' });
  };

  // Close the modal with animation
  const closeModal = () => {
    removeClass(modal, 'active');
    removeClass(document.body, 'no-scroll');
    gsap.to(modal, {
      height: '0px',
      duration: 0.5,
      ease: 'power1.in',
      onComplete: () => {
        gsap.set(modal, { height: '100vh', top: '100vh' });
        emitter.emit('resetPlayers');
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
}
