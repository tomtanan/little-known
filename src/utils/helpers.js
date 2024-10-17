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

// Adds one or more classes to an element
export const addClass = (el, ...classNames) => el.classList.add(...classNames);

// Removes one or more classes from an element
export const removeClass = (el, ...classNames) => el.classList.remove(...classNames);