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

  // IntersectionObserver for the about section
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start text animation when the section is in view
          gsap.fromTo(
            '.word',
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
    { threshold: 0.1 } // Trigger when 10% of the section is visible
  );

  // Start observing the about section
  observer.observe(el);
}
