import { $ } from 'select-dom';
import { addClass, removeClass, on } from 'utils/helpers';
import { gsap } from 'gsap';
import emitter from 'utils/events';

export default function modal(el) {
  const modalName = el.getAttribute('data-modal');
  const modal = $(`[data-modal-target="${modalName}"]`);
  const closeBtn = $('.js-modal-close', modal);

  if (!modal) {
    console.error(`No modal found with data-modal-target="${modalName}"`);
    return;
  }

  // Show the modal
  const showModal = () => {
    emitter.emit('openModal', { modalName });
    addClass(modal, 'active');
    addClass(document.body, 'no-scroll');
    gsap.to(modal, { top: 0, duration: 0.4, ease: 'power1.in' });
  };

  // Close the modal
  const closeModal = () => {
    emitter.emit('closeModal', { modalName });
    removeClass(modal, 'active');
    removeClass(document.body, 'no-scroll');
    gsap.to(modal, { top: '100vh', duration: 0.4, ease: 'power1.in' });
  };

  // Attach the event to open the modal on the provided `el` element
  on(el, 'click', (e) => {
    e.preventDefault();
    showModal();
  });

  // Attach the event to close the modal
  on(closeBtn, 'click', (e) => {
    e.preventDefault();
    closeModal();
  });
}
