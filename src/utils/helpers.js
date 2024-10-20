/**
 * Wraps each word in a text node with a <span> element for animation purposes.
 * This function modifies the DOM by replacing the original text node with
 * individual <span> elements for each word and inserting spaces between them.
 *
 * @param {Node} node - The DOM node to process. This can be a text node or an element node.
 * @throws {Error} Throws an error if the provided node is not a valid DOM node.
 */
export const wrapWords = (node) => {
  if (!(node instanceof Node)) throw new Error('Expected a DOM Node.');
  if (
    !node ||
    (node.nodeType !== Node.TEXT_NODE && node.nodeType !== Node.ELEMENT_NODE)
  )
    return;

  // Handle text nodes by wrapping each word in a <span>
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const fragment = document.createDocumentFragment();
    node.textContent
      .trim()
      .split(/\s+/)
      .forEach((word, index, words) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        fragment.appendChild(span);
        if (index < words.length - 1)
          fragment.appendChild(document.createTextNode(' '));
      });
    node.parentNode.replaceChild(fragment, node);

    // Handle element nodes and process children recursively
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    if (
      getComputedStyle(node).display === 'inline' &&
      node.tagName.toLowerCase() === 'span' &&
      !node.classList.contains('word')
    ) {
      node.classList.add('word');
    } else {
      Array.from(node.childNodes).forEach(wrapWords);
    }
  }
};

/**
 * Checks if the device is a touch device.
 *
 * @returns {boolean} True if the device is a touch device, false otherwise.
 */
export function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// Toggles the specified class on an element
export const toggleClass = (el, className) => el.classList.toggle(className);

// Adds one or more classes to an element, accepting both space-separated strings or multiple arguments
export const addClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' ')); // Split any space-separated strings into individual class names
  el.classList.add(...classes); // Add all classes
};

// Removes one or more classes from an element, accepting both space-separated strings or multiple arguments
export const removeClass = (el, ...classNames) => {
  const classes = classNames.flatMap(className => className.split(' ')); // Split any space-separated strings into individual class names
  el.classList.remove(...classes); // Remove all classes
};

/**
 * Attaches an event listener to a specified DOM element.
 * Supports optional event listener options like { once: true }.
 * @param {Element} element - The DOM element to attach the event listener to.
 * @param {string} event - The event to listen for (e.g., 'click', 'mouseover').
 * @param {Function} handler - The function to run when the event occurs.
 * @param {Object} [options] - Optional event listener options (e.g., { once: true }).
 */
export const on = (element, event, handler, options = {}) => {
  element.addEventListener(event, handler, options);
};

/**
 * Debounce function to limit the rate at which a function is executed.
 * 
 * @param {Function} handler - The function to be debounced.
 * @param {number} wait - The delay in milliseconds to wait before invoking the function.
 * @returns {Function} A debounced version of the original function.
 */
export const debounce = (handler, wait) => {
  let timeout;

  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      handler.apply(this, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
