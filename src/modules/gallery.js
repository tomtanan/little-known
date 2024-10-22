import { addClass, removeClass, on } from 'utils/helpers';
import { handleMediaItems } from 'utils/galleryHelpers';
import emitter from 'utils/events';
import { $, $$ } from 'select-dom';
import videoPlayer from 'modules/video-player';
import gsap from 'gsap';

export default function gallery(el) {
  const prevBtn = $('.js-gallery-prev', el);
  const nextBtn = $('.js-gallery-next', el);

  // Initialize the media items of the gallery
  let items = $$('.js-gallery-item', el);
  handleMediaItems(items);
  items = $$('.js-gallery-item', el);

  const totalItems = items.length;
  let curr = 0;

  if (totalItems > 1) {
    addClass(prevBtn, 'active');
    addClass(nextBtn, 'active');

    // Initialize all slides to be off-screen except the first one
    const initSlides = () => {
      items.forEach((item, index) => {
        gsap.set(item, { x: index === curr ? '0vw' : '100vw', scale: 1 });
        if (index === curr) {
          addClass(item, 'active'); // Mark the first slide as active
        }
      });
    };

    // Reusable function to animate slide transitions
    const animateSlide = (current, next, direction) => {
      const slideDirection = direction === 'next' ? '-100vw' : '100vw';

      // Set the position of the next slide immediately off-screen
      gsap.set(next, {
        x: direction === 'next' ? '100vw' : '-100vw',
        scale: 0.8,
      });

      // Create a single GSAP timeline for exit and entry animations
      const tl = gsap.timeline();

      // Zoom out and slide out the current slide
      tl.to(current, { scale: 0.8, duration: 0.5 })
        .to(current, { x: slideDirection, duration: 0.5 })
        .to(next, { x: '0vw', duration: 0.5 }, '-=0.5')
        .to(next, {
          scale: 1,
          duration: 0.5,
          onComplete: () => {
            emitter.emit('resetPlayer');
          },
        });

      // Update active class
      removeClass(current, 'active');
      addClass(next, 'active');
    };

    // Event listener function
    const handleNavigation = (direction) => {
      const newIndex =
        direction === 'next'
          ? curr === totalItems - 1
            ? 0
            : curr + 1
          : curr === 0
          ? totalItems - 1
          : curr - 1;

      const currentSlide = items[curr];
      const nextSlide = items[newIndex];

      animateSlide(currentSlide, nextSlide, direction);
      curr = newIndex;
    };

    // Initialize event listeners
    on(prevBtn, 'click', () => {
      handleNavigation('prev');
    });

    on(nextBtn, 'click', () => {
      handleNavigation('next');
    });

    // Initialize with the first slide (no auto-advance to next slide)
    initSlides(); // Show the first slide without advancing
  }

  // Initialize the video players
  const players = $$('.js-video-player', el);
  if (players.length > 0) {
    players.forEach(videoPlayer);
  }
}
