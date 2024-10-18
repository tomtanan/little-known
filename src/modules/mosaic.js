import { gsap } from 'gsap';
import { $$ } from 'select-dom';
import 'intersection-observer';

export default function mosaic(el) {
  const images = $$('.js-mosaic-image', el);
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  const segment = (windowWidth * 1.2) / images.length;

  // Function to animate the images
  const animateImages = () => {
    images.forEach((img, index) => {
      // Calculate the x value within a segment for better distribution
      const min = index * segment;
      const max = (index + 1) * segment;
      const x = Math.random() * (max - min) + min;

      const targetX = x - 400;
      const targetY = -300;
      const speed = 20 * (Math.random() * 0.3 + 0.7);
      const delay = index * (Math.random() * 2 + 1);
      const width = Math.random() * 150 + 150;

      // Apply initial and animated properties
      gsap.set(img, { width: `${width}px`, x, y: windowHeight });

      // Create the animation (regular pace)
      const animation = gsap.to(img, {
        x: targetX,
        y: targetY,
        duration: speed,
        ease: 'none',
        repeat: -1,
        delay,
      });

      // Fast forward the animation for the first 1.5 seconds
      animation.timeScale(15); // 15x speed for fast forward

      // After 1.5 second, slow down to normal speed
      setTimeout(() => {
        animation.timeScale(1); // Return to normal speed
      }, 1500); // After 1.5 seconds
    });
  };

  // IntersectionObserver for the mosaic section
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Start image animations when the section is in view
          animateImages();

          // Stop observing once the animation is triggered
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the section is visible
  );

  // Start observing the mosaic section
  observer.observe(el);
}
