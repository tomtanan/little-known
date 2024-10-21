/**
 * Wraps each word in a text node with a <span> element for animation purposes.
 * This function modifies the DOM by replacing the original text node with
 * individual <span> elements for each word and inserting spaces between them.
 * 
 * If a NodeList or array of nodes is passed, it will iterate over each element 
 * and apply the word splitting logic to all of them.
 *
 * @param {Node|NodeList|Array} elements - The DOM node(s) to process. This can be 
 * a single text or element node, a NodeList, or an array of nodes.
 * @throws {Error} Throws an error if the provided node is not a valid DOM node.
 */
export const wordSplit = (elements) => {
  // If 'elements' is a NodeList or an array, iterate through them
  if (NodeList.prototype.isPrototypeOf(elements) || Array.isArray(elements)) {
    elements.forEach((element) => wordSplit(element));
    return;
  }

  // Ensure node is valid and not already processed
  const node = elements;
  if (!node || !(node instanceof Node)) throw new Error('Expected a DOM Node.');

  // If it's a text node, split the words and wrap them in spans
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
    const fragment = document.createDocumentFragment();
    const words = node.textContent.trim().split(/\s+/);
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = word;
      fragment.appendChild(span);
      fragment.appendChild(document.createTextNode(' ')); // Add space after each word
    });
    node.replaceWith(fragment); // Replace the entire text node at once
    return; // Early return as we don't need to process further
  }

  // If it's an element node, process its children
  if (node.nodeType === Node.ELEMENT_NODE) {
    // If the node is an inline span but not already a 'word', apply the class and skip re-wrapping
    if (node.tagName.toLowerCase() === 'span' && !node.classList.contains('word')) {
      node.classList.add('word');
      return; // Don't process its children further
    }

    // Process only the text node children, leave already wrapped spans untouched
    Array.from(node.childNodes).forEach((childNode) => {
      if (childNode.nodeType === Node.TEXT_NODE || childNode.nodeType === Node.ELEMENT_NODE) {
        wordSplit(childNode);
      }
    });
  }
};

/**
 * Splits the text of a given DOM element, wrapping each letter
 * in an <i> element with the class 'letter'.
 *
 * @param {Node|NodeList|Array} elements - The DOM node(s) to process. This can be 
 * a single text or element node, a NodeList, or an array of nodes.
 */
export const letterSplit = (elements) => {
  elements.forEach((element) => {
    // Iterate over each element passed to the function
    Array.from(element.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const fragment = document.createDocumentFragment();
        const letters = Array.from(node.textContent); // Split text into individual letters
        letters.forEach((letter) => {
          const i = document.createElement('i');
          i.className = 'letter';
          i.textContent = letter;
          fragment.appendChild(i);
        });
        node.replaceWith(fragment); // Replace the original text node with the fragment
      }
    });
  });
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
