/**
 * Handle both video and image elements and append them to the gallery container
 * @param {NodeList} items - List of elements with either data-video-ids or data-image-src
 */
export const handleMediaItems = (items) => {
  if (!items.length) return;

  const parent = items[0].parentNode;
  const fragment = document.createDocumentFragment(); // Batch DOM updates for performance

  items.forEach(item => {
    const videoIds = item.getAttribute('data-video-ids');
    const imageSrc = item.getAttribute('data-image-src');

    // Remove the original item from the DOM
    item.remove();

    // Handle video items
    if (videoIds && videoIds.trim() !== '') {
      const videoIdArray = videoIds.split(',').map(id => id.trim());
      videoIdArray.forEach(id => {
        const container = createGalleryItem();
        const player = document.createElement('div');
        player.className = 'video-player js-video-player';
        player.setAttribute('data-video-id', id); // Set the video ID as a data attribute
        container.appendChild(player);
        fragment.appendChild(container);
      });
    }

    // Handle image items
    if (imageSrc && imageSrc.trim() !== '') {
      const container = createGalleryItem();
      const newImg = document.createElement('img');
      newImg.className = 'gallery-image';
      newImg.src = imageSrc; // Set the image source
      container.appendChild(newImg);
      fragment.appendChild(container);
    }
  });

  parent.appendChild(fragment); // Append all elements (videos/images) in one go
};

/**
 * Helper function to create a gallery item container
 * @returns {HTMLElement} - A newly created div element with the appropriate classes
 */
export const createGalleryItem = () => {
  const container = document.createElement('div');
  container.className = 'gallery-item js-gallery-item'; // Standard class for gallery items
  return container;
};