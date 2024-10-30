import { addClass, removeClass, on } from 'utils/helpers';
import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';
import 'intersection-observer';

export default function contact(el) {
  const triggerBtn = $('[data-contact-trigger');
  const closeBtn = $('[data-contact-close');

  // Cache words to avoid querying DOM repeatedly
  const words = $$('.word', el);

  // Store the animation instance to control it later
  let animation;

  on(triggerBtn, 'click', () => {
    addClass(el, 'active');
    // If animation hasn't started yet, create it and play
    if (!animation) {
      animation = gsap.fromTo(
        words,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: { amount: 1, from: 'start', overlap: 0.5 },
        }
      );
    }
  });

  on(closeBtn, 'click', () => {
    removeClass(el, 'active');
  });
}
