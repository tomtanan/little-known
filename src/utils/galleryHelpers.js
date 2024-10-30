/**
 * Handle both video and image elements and append them to the gallery container
 * @param {NodeList} items - List of elements with either data-video-ids or data-image-src
 */
export const handleMediaItems = (items) => {
  if (!items.length) return;

  const parent = items[0].parentNode;
  const fragment = document.createDocumentFragment(); // Batch DOM updates for performance
  const newItems = [];

  items.forEach(item => {
    const videoId = item.getAttribute('data-video-id');
    const imageSrc = item.getAttribute('data-image-src');

    // Remove the original item from the DOM
    item.remove();

    // Handle video items
    if (videoId && videoId.trim() !== '') {
      const container = createGalleryItem('is-video');
      const player = document.createElement('div');
      player.className = 'gallery-video-wrapper video-player js-video-player';
      player.setAttribute('data-video-id', videoId); // Set the video ID as a data attribute
      container.appendChild(player);
      fragment.appendChild(container);
      newItems.push(container);
    }

    // Handle image items
    if (imageSrc && imageSrc.trim() !== '') {
      const container = createGalleryItem('is-image');
      const wrapper = document.createElement('div');
      wrapper.className = 'gallery-image-wrapper';
      const img = document.createElement('img');
      img.className = 'gallery-image';
      img.src = imageSrc; // Set the image source
      wrapper.appendChild(img);
      container.appendChild(wrapper);
      fragment.appendChild(container);
      newItems.push(container);
    }
  });

  parent.appendChild(fragment); // Append all elements (videos/images) in one go

  return newItems;
};

/**
 * Helper function to create a gallery item container
 * @param {String} - CSS Class
 * @returns {HTMLElement} - A newly created div element with the appropriate classes
 */
export const createGalleryItem = (cssClass) => {
  const container = document.createElement('div');
  container.className = `gallery-item js-gallery-item ${cssClass}`; // Standard class for gallery items
  return container;
};

/**
 * Helper function to create a dotted nav
 * @param {NodeList} wrapper - Element where to append the dotted nav
 * @param {NodeList} items - List of gallery items
 * @returns {HTMLElement} - A newly created dotted nav element
 */
export const createDottedNav = (wrapper, items) => {
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'gallery-dots js-gallery-dots';
  wrapper.appendChild(dotsContainer);

  const dots = items.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot';
    dot.setAttribute('data-index', index);
    dotsContainer.appendChild(dot);
    return dot;
  });

  return dots;
}