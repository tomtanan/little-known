import { wrapWords } from 'utils/helpers';
import { gsap } from 'gsap';
import { $$ } from 'select-dom';
import 'intersection-observer';

export default function about(el) {
  const textElements = $$('.js-gsap-text');

  // Wrap words in text elements for animation
  textElements.forEach((text) => {
    Array.from(text.childNodes).forEach(wrapWords);
  });

  // Cache words to avoid querying DOM repeatedly
  const words = $$('.word', el);

  // IntersectionObserver for the about section
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start text animation when the section is in view
          gsap.fromTo(
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

          // Stop observing once the animation is triggered
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -10% 0px' } // Delays animation slightly
  );

  // Start observing the about section
  observer.observe(el);
}
