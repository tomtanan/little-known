import { $, $$ } from 'select-dom';

/**
 * ScrollSnapController class enables smooth scrolling through different sections of a webpage.
 */
export class ScrollSnapController {
  /**
   * Creates an instance of ScrollSnapController.
   *
   * @param {HTMLElement} container - A DOM element that represents the scrollable container.
   *
   * @throws {Error} Throws an error if the scroll container or the sections inside it are not found.
   */
  constructor(container) {
    // Directly assign the container element passed to the constructor
    this.scrollContainer = container;

    // Error handling: if the container element is not valid, throw an error
    if (!this.scrollContainer) {
      throw new Error('Scroll container element is not valid.');
    }

    // Use $$ from select-dom to select all sections inside the container
    this.sections = $$('.js-section', this.scrollContainer);

    // Error handling: if no sections found, throw an error
    if (!this.sections.length) {
      throw new Error('No sections found to scroll through.');
    }

    // Set the initial section index
    this.currentSectionIndex = 0;

    // Initialize the scroll events
    this.init();
  }

  /**
   * Initializes the controller by binding event listeners for scrolling.
   */
  init() {
    this.bindEvents();
  }

  /**
   * Smoothly scrolls to the specified target section.
   *
   * @param {HTMLElement} target - The target section to scroll to.
   */
  easeInScroll(target) {
    // Get the top position of the target section and scroll to it
    const targetPosition = target.offsetTop;

    this.scrollContainer.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }

  /**
   * Binds mouse wheel and touch events to the scroll container.
   */
  bindEvents() {
    let isScrolling = false;

    // Debounce function to limit how often scrolling occurs
    const debounceScroll = (event) => {
      if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
          this.handleScroll(event.deltaY);
          isScrolling = false;
        }, 150);
      }
    };

    // Bind mouse wheel event
    this.scrollContainer.addEventListener('wheel', (event) => {
      event.preventDefault();
      debounceScroll(event);
    });

    // Track the initial Y position for touch start
    this.scrollContainer.addEventListener('touchstart', (event) => {
      this.startY = event.touches[0].clientY;
    });

    // Handle touch move events for swipe-based scrolling
    this.scrollContainer.addEventListener('touchmove', (event) => {
      const deltaY = this.startY - event.touches[0].clientY;
      if (Math.abs(deltaY) > 30) {
        event.preventDefault();
        debounceScroll({ deltaY });
      }
    });
  }

  /**
   * Handles scrolling to the next or previous section based on the scroll direction.
   *
   * @param {number} deltaY - The amount of scroll in the Y direction (positive or negative).
   */
  handleScroll(deltaY) {
    // Determine direction (1 for down, -1 for up)
    const direction = deltaY > 0 ? 1 : -1;

    // Update the current section index, keeping it within bounds
    this.currentSectionIndex = Math.min(
      Math.max(this.currentSectionIndex + direction, 0),
      this.sections.length - 1
    );

    // Smoothly scroll to the updated section
    this.easeInScroll(this.sections[this.currentSectionIndex]);
  }
}

/**
 * Initializes ScrollSnapController for the given container element.
 *
 * @param {HTMLElement} container - The DOM element of the scrollable container.
 */
export function initScrollSnap(container) {
  new ScrollSnapController(container);
}
