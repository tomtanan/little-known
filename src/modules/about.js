import { addClass, removeClass, wrapWords } from 'utils/helpers';
import { gsap } from 'gsap';
import { $, $$ } from 'select-dom';
import 'intersection-observer';

export default function about(el) {
  const nav = $('#nav');
  const textElements = $$('.js-about-text');

  // Wrap words in text elements for animation
  textElements.forEach((text) => {
    Array.from(text.childNodes).forEach(wrapWords);
  });

  // Cache words to avoid querying DOM repeatedly
  const words = $$('.word', el);

  // Store the animation instance to control it later
  let animation;

  // IntersectionObserver for the about section
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
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
            addClass(nav, 'black');
          } else {
            // Resume the animation if it exists and was paused
            animation.resume();
            addClass(nav, 'black');
          }
        } else {
          // Pause the animation when the section goes out of view
          if (animation) {
            animation.pause();
            removeClass(nav, 'black');
          }
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' } // Delays animation slightly
  );

  // Start observing the about section
  observer.observe(el);
}
