import { isTouchDevice } from 'utils/helpers';
import { $$ } from 'select-dom';
import { gsap } from 'gsap';
import 'intersection-observer';

const mosaic = (el) => {
  const images = $$('.js-mosaic-image', el);
  const options = {
    speed: 20,
    delay: 5,
    startOffsetY: 100,
    breakpoints: [
      { minWidth: 1920, widths: [200, 250, 300], targetOffsetX: 800 },
      { minWidth: 1440, widths: [150, 180, 220], targetOffsetX: 600 },
      { minWidth: 1024, widths: [140, 170, 200], targetOffsetX: 400 },
      { minWidth: 0, widths: [100, 140, 180], targetOffsetX: 200 },
    ],
  };

  // Function to determine which images to use based on conditions
  const filterImages = () => {
    if (isTouchDevice() && images.length > 8) {
      images.slice(8).forEach(img => img.remove());
      return images.slice(0, 8);
    } else if (!isTouchDevice() && window.innerWidth < 1024 && images.length > 8) {
      images.forEach((img, index) => img.style.display = index < 8 ? 'block' : 'none');
      return images.slice(0, 8);
    } else {
      images.forEach(img => img.style.display = 'block');
      return images;
    }
  }; 

  const runAnimation = (images, options) => {
    const filteredImages = filterImages(images);
    const windowWidth = window.innerWidth * 1.15;
    const windowHeight = window.innerHeight;
    const startOffsetX = windowWidth / filteredImages.length;

    // Select configuration based on current window width
    const config = options.breakpoints.find((bp) => window.innerWidth >= bp.minWidth) || options.breakpoints[3];

    filteredImages.forEach((img, index) => {
      const delay = (index % 4) * options.delay;
      const width = config.widths[index % 3];
      const startX = index * startOffsetX;
      const startY = windowHeight + options.startOffsetY;
      const targetX = startX - config.targetOffsetX;
      const targetY = -(width * 2);

      // Set initial properties and kill previous animations
      gsap.killTweensOf(img); // Stop any previous animations on this image
      gsap.set(img, { opacity: 0, width: `${width}px`, x: startX, y: startY, scale: 1 });

      // Create a timeline for both movement and scaling
      const timeline = gsap.timeline({ repeat: -1, delay });

      // Fade in the image and start moving
      timeline.to(img, { opacity: 1, duration: 3, ease: 'power1.out' }, 0);

      // Scale up to 1.1 during the first half, then scale back to 1 in the second half
      timeline.to(img, { x: targetX, y: targetY, duration: options.speed, ease: 'none' }, 0);

      // Fast-forward initial animation for a dynamic start
      timeline.timeScale(15);
      setTimeout(() => gsap.to(timeline, { timeScale: 1, duration: 2 }), 1000);
    });
  };

  // Initialize the observer to trigger animation when in view
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAnimation(images, options);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(el);

  // Handle resize: kill animations, reset opacity, and restart animation
  const handleResize = () => {
    gsap.killTweensOf(images); // Kill all existing animations for images
    gsap.to(images, { opacity: 0, duration: 0.2, onComplete: () => runAnimation(images, options) });
  };

  window.addEventListener('resize', handleResize);
};

export default mosaic;