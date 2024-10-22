import { addClass, on } from 'utils/helpers';
import { handleMediaItems } from 'utils/galleryHelpers';
import { $, $$ } from 'select-dom';
import videoPlayer from 'modules/video-player';

export default function gallery(el) {
  const container = $('.js-gallery-container', el);
  const prevBtn = $('.js-gallery-prev', el);
  const nextBtn = $('.js-gallery-next', el);

  // Initialize the media items of the gallery
  let items = $$('.js-gallery-item', el);
  handleMediaItems(items);
  items = $$('.js-gallery-item', el);

  if (items.length > 1) {
    let curr = 0;

    addClass(prevBtn, 'active');
    addClass(nextBtn, 'active');
  
    // Function to show the current slide
    const showSlide = (index) =>  {
      items.forEach((item, i) => {
        item.style.display = i === index ? 'block' : 'none';
      });
    }
  
    // Event listener for previous button
    if (prevBtn) {
      on(prevBtn, 'click', () => {
        curr = (curr === 0) ? items.length - 1 : curr - 1;
        showSlide(curr);
      });
    }
  
    // Event listener for next button
    if (nextBtn) {
      on(nextBtn, 'click', () => {
        curr = (curr === items.length - 1) ? 0 : curr + 1;
        showSlide(curr);
      });
    }
  
    // Initialize slideshow with first slide
    showSlide(curr);
  }

  // Initialize the video players
  const players = $$('.js-video-player', el);

  if (players.length > 0) {
    players.forEach(player => videoPlayer(player));
  }
}
