import { wrapWords } from 'utils/helpers';
import { gsap } from 'gsap';
import { $, $$ } from 'select-dom';
import 'intersection-observer';

export default function about() {
  const images = $$('.slideshow-image');
  const textElements = $$('.js-gsap-text');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Wrap words in text elements for animation
  textElements.forEach((text) => {
    Array.from(text.childNodes).forEach(wrapWords);
  });

  // Animate slideshow images
  images.forEach((img, index) => {
    const x = (index > 3 ? 0.3 : 0.2) * (index + 1) * windowWidth;
    const targetX = x - 400;
    const targetY = -300;
    const speed = 20 * (Math.random() * 0.3 + 0.7);
    const delay = index * (Math.random() * 2 + 1);

    gsap.set(img, { x, y: windowHeight });
    gsap.to(img, {
      x: targetX,
      y: targetY,
      duration: speed,
      ease: 'none',
      repeat: -1,
      delay,
    });
  });

	// IntersectionObserver for the about section
	const observer = new IntersectionObserver(
		(entries, observer) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
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
		{ threshold: 0.1 }
	);

	// Start observing the about section
	observer.observe($('.js-about'));
}
