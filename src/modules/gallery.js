import { addClass, removeClass, on, getActiveModal } from 'utils/helpers';
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

    // Create and append dots container
    const dotsContainer = document.createElement('div');
    addClass(dotsContainer, 'gallery-dots js-gallery-dots');
    el.appendChild(dotsContainer);

    // Create dots for each item
    const dots = items.map((_, index) => {
      const dot = document.createElement('button');
      addClass(dot, 'gallery-dot');
      dot.setAttribute('data-index', index);
      on(dot, 'click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
      return dot;
    });

    function updateDots() {
      dots.forEach((dot, index) => {
        if (index === curr) {
          addClass(dot, 'active');
        } else {
          removeClass(dot, 'active');
        }
      });
    }

    // Initialize all slides to be off-screen except the first one
    const initSlides = (curr) => {
      items.forEach((item, index) => {
        gsap.set(item, { x: index === curr ? '0vw' : '100vw', scale: 1 });
        if (index === curr) addClass(item, 'active'); // Mark the first slide as active
      });
      updateDots(); // Initialize dots to show the first active
    };

    // Reusable function to animate slide transitions
    const animateSlide = (current, next, direction) => {
      const slideDirection = direction === 'next' ? '-100vw' : '100vw';
      const currentPlayer = $('.js-video-player', current);

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
            if (currentPlayer) emitter.emit('resetPlayers');
          },
        });

      // Update active class
      removeClass(current, 'active');
      addClass(next, 'active');
      updateDots(); // Update active dot on slide change
    };

    // Event listener function for next/prev navigation
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
      updateDots(); // Update dots after setting the new index
    };

    // Go to specific slide by index
    const goToSlide = (index) => {
      if (index !== curr) {
        const currentSlide = items[curr];
        const nextSlide = items[index];
        const direction = index > curr ? 'next' : 'prev';
        animateSlide(currentSlide, nextSlide, direction);
        curr = index;
        updateDots(); // Update dots after direct navigation to a slide
      }
    };

    // Function to reset the gallery to the first slide
    const resetGallery = () => {
      items.forEach((item, index) => {
        gsap.set(item, { x: index === 0 ? '0vw' : '100vw', scale: 1 });
        index === 0 ? addClass(item, 'active') : removeClass(item, 'active');
      });
      curr = 0;
      updateDots(); // Reset dots to reflect the first slide
    };

    // Initialize event listeners for buttons
    on(prevBtn, 'click', () => {
      handleNavigation('prev');
    });

    on(nextBtn, 'click', () => {
      handleNavigation('next');
    });

    on(document, 'keydown', (e) => {
      const activeGallery = $('.js-gallery', getActiveModal());

      // Check if the key is either ArrowLeft or ArrowRight and if the gallery is active
      if ((e.code === 'ArrowLeft' || e.code === 'ArrowRight') && activeGallery === el) {
        const direction = e.code === 'ArrowLeft' ? 'prev' : 'next';
        handleNavigation(direction);

        // Focus the correct button based on the direction
        const focusBtn = e.code === 'ArrowLeft' ? prevBtn : nextBtn;
        focusBtn.focus();
      }
    });

    // Initialize with the first slide (no auto-advance to next slide)
    initSlides(curr); // Show the first slide without advancing

    emitter.on('resetGallery', resetGallery);
  }

  // Initialize the video players
  const players = $$('.js-video-player', el);
  if (players.length > 0) {
    players.forEach(videoPlayer);
  }
}
