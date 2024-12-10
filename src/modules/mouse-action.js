import { $$ } from 'select-dom';
import { gsap } from 'gsap';
import { isTouchDevice, on } from 'utils/helpers';

const mouseAction = (el) => {
  const sections = $$('.js-project-pane'); 

  if (isTouchDevice()) {
    gsap.set(el, { top: 0, left: 0, opacity: 0 }); // Hide by default
    return;
  }

  const onMouseMove = (e) => {
    const { clientX, clientY } = e;

    // Set the initial position of the element near the mouse cursor
    const offsetX = 20;
    const offsetY = 20;

    // Smoothly animate the element to follow the mouse with offset
    gsap.to(el, {
      x: clientX + offsetX,
      y: clientY + offsetY,
      duration: 0.8,
      ease: 'power2.out',
    });
  };

  const onMouseEnter = (e) => {
    const { clientX, clientY } = e;

    // Set the initial position of the element near the mouse cursor
    const offsetX = 20;
    const offsetY = 20;

    gsap.set(el, {
      x: clientX + offsetX,
      y: clientY + offsetY,
    });

    // Fade in the element
    gsap.to(el, { opacity: 1, duration: 0.3, ease: 'power1.inOut' });
  };

  const onMouseLeave = (e) => {
    // Fade out the element
    gsap.to(el, { opacity: 0, duration: 0.3, ease: 'power1.inOut' });
  };

  // Attach event listeners for each section
  sections.forEach((section) => {
    on(section, 'mousemove', onMouseMove);
    on(section, 'mouseenter', onMouseEnter);
    on(section, 'mouseleave', onMouseLeave);
  });
};

export default mouseAction;