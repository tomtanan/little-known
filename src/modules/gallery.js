import { addClass, removeClass, on, getActiveModal } from 'utils/helpers';
import { createDottedNav, handleMediaItems } from 'utils/galleryHelpers';
import { $, $$ } from 'select-dom';
import { gsap } from 'gsap';
import emitter from 'utils/events';
import videoPlayer from 'modules/video-player';

export default function gallery(el) {
  const items = handleMediaItems($$('.js-gallery-item', el));
  const totalItems = items.length;
  const prevBtn = $('.js-gallery-prev', el);
  const nextBtn = $('.js-gallery-next', el);
  const dots = createDottedNav(el, items);
  const players = $$('.js-video-player', el);
  let curr = 0;
  let startX;

  const getPrevIndex = () => {
    return (curr - 1 + totalItems) % totalItems;
  };

  const getNextIndex = () => {
    return (curr + 1) % totalItems;
  };

  if (totalItems > 1) {
    const initSlides = (curr) => {
      items.forEach((item, index) => {
        gsap.set(item, { x: index === curr ? '0vw' : '100vw', scale: 1 });
        if (index === curr) addClass(item, 'active');
      });
      updateDots();
      addClass(prevBtn, 'active');
      addClass(nextBtn, 'active');
      emitter.on('resetGallery', resetGallery);
      if (players.length > 0) players.forEach(videoPlayer);
    };

    const updateDots = () => {
      dots.forEach((dot, index) => {
        index === curr ? addClass(dot, 'active') : removeClass(dot, 'active');
      });
    };

    const slideTo = (index) => {
      if (index !== curr) {
        const currentSlide = items[curr];
        const nextSlide = items[index];
        const currentPlayer = $('.js-video-player', currentSlide);
        const tl = gsap.timeline();

        gsap.set(nextSlide, {
          x: index > curr ? '100vw' : '-100vw',
          scale: 0.8,
        });
        tl.to(currentSlide, { scale: 0.8, duration: 0.5 })
          .to(currentSlide, {
            x: index > curr ? '-100vw' : '100vw',
            duration: 0.5,
          })
          .to(nextSlide, { x: '0vw', duration: 0.5 }, '-=0.5')
          .to(nextSlide, {
            scale: 1,
            duration: 0.5,
            onComplete: () => {
              if (currentPlayer) emitter.emit('resetPlayers');
            },
          });

        removeClass(currentSlide, 'active');
        addClass(nextSlide, 'active');
        curr = index;
        updateDots();
      }
    };

    const resetGallery = () => {
      items.forEach((item, index) => {
        gsap.set(item, { x: index === 0 ? '0vw' : '100vw', scale: 1 });
        index === 0 ? addClass(item, 'active') : removeClass(item, 'active');
      });
      curr = 0;
      updateDots();
    };

    dots.forEach((dot, index) => {
      on(dot, 'click', () => slideTo(index));
    });

    on(prevBtn, 'click', () => slideTo(getPrevIndex()));

    on(nextBtn, 'click', () => slideTo(getNextIndex()));

    on(document, 'keydown', (e) => {
      const activeGallery = $('.js-gallery', getActiveModal());
      if (
        (e.code === 'ArrowLeft' || e.code === 'ArrowRight') &&
        activeGallery === el
      ) {
        const index = e.code === 'ArrowLeft' ? getPrevIndex() : getNextIndex();
        (e.code === 'ArrowLeft' ? prevBtn : nextBtn).focus();
        slideTo(index);
      }
    });

    on(el, 'touchstart', (e) => {
      startX = e.touches[0].clientX;
    });

    on(el, 'touchend', (e) => {
      const endX = e.changedTouches[0].clientX;
      const deltaX = endX - startX;

      if (Math.abs(deltaX) > 50) {
        // Threshold for swipe distance
        const index = deltaX > 0 ? getPrevIndex() : getNextIndex();
        slideTo(index);
      }
    });

    initSlides(curr);
  }
}
