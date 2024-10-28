import { gsap } from 'gsap';
import { $$ } from 'select-dom';
import 'intersection-observer';

export default function mosaic(el) {
  const images = $$('.js-mosaic-image', el);
  const windowWidth = window.innerWidth * 1.15; // Slightly increased effective width for wider spacing
  const windowHeight = window.innerHeight;

  const baseSpeed = 15; // Consistent base speed for animation
  const baseDelayIncrement = 0.7; // Consistent delay increment for cascading effect
  const xOffset = windowWidth / images.length; // Horizontal spacing per image
  const yStep = 50; // Vertical offset increment for initial Y position

  // Breakpoint configurations for responsive widths and dynamic targetY
  const breakpoints = [
    { minWidth: 1600, widths: [200, 250, 300], targetXOffset: 400, timeScale: 15 },
    { minWidth: 1440, widths: [150, 200, 250], targetXOffset: 400, timeScale: 15 },
    { minWidth: 1024, widths: [100, 150, 200], targetXOffset: 400, timeScale: 10 },
    { minWidth: 0, widths: [100, 150, 200], targetXOffset: 0, timeScale: 5 }
  ];

  // Select configuration based on current window width or default to smallest
  const config = breakpoints.find(bp => window.innerWidth >= bp.minWidth) || breakpoints[3];

  const animateImages = () => {
    images.forEach((img, index) => {
      // Calculate starting X and Y positions with even spacing
      const x = index * xOffset;
      const initialY = windowHeight + 100 + (index * yStep); // Each image starts slightly lower than the previous

      // Speed with slight variation for a dynamic effect
      const speed = baseSpeed * (1 + (index % 5) * 0.1);

      // Progressive delay based on image index for cascading animation
      const delay = index * baseDelayIncrement;

      // Width cycles every 3 images, and targetY is the negative of width
      const width = config.widths[index % 3];
      const targetY = -width;

      // Set initial properties and start animation
      gsap.set(img, { opacity: 1, width: `${width}px`, x, y: initialY });

      const animation = gsap.to(img, {
        x: x - config.targetXOffset, // Target X position off the screen to the left
        y: targetY, // Target Y position based on the negative width
        duration: speed,
        ease: 'none',
        repeat: -1,
        delay,
      });

      // Initial fast-forward effect with smooth slowdown to normal speed
      animation.timeScale(config.timeScale); // Fast-forward initial animation
      setTimeout(() => gsap.to(animation, { timeScale: 1, duration: 2 }), 1500); // Smoothly slow down over 2 seconds
    });
  };

  // Set up IntersectionObserver to trigger animation when element is in view
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateImages();
          observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(el);
}
