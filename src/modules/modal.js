import { $ } from 'select-dom';
import { addClass, removeClass } from 'utils/helpers';
import { gsap } from 'gsap';

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
    addClass(modal, 'active');
    addClass(document.body, 'no-scroll');
    gsap.to(modal, { top: 0, duration: 0.4, ease: 'power1.in' });
  };

  // Close the modal
  const closeModal = () => {
    removeClass(modal, 'active');
    removeClass(document.body, 'no-scroll');
    gsap.to(modal, { top: '100vh', duration: 0.4, ease: 'power1.in' });
  };

  // Attach the event to open the modal on the provided `el` element
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showModal();
  });

  // Attach the event to close the modal
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  });
}
