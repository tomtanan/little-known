/**
 * ScrollSnapController class enables smooth scrolling through different sections of a webpage.
 * It supports both mouse wheel and touch events for seamless navigation.
 */
export class ScrollSnapController {
  /**
   * Creates an instance of ScrollSnapController.
   *
   * @param {string} scrollContainerSelector - A CSS selector string to select the scrollable container.
   *
   * @throws {Error} Throws an error if the scroll container is not found or if there are no sections to scroll through.
   */
  constructor(scrollContainerSelector) {
    this.scrollContainer = document.querySelector(scrollContainerSelector);

    if (!this.scrollContainer) {
      throw new Error(
        `Scroll container not found for selector: "${scrollContainerSelector}"`
      );
    }

    this.sections = document.querySelectorAll('.js-section');

    if (!this.sections.length) {
      throw new Error('No sections found to scroll through.');
    }

    this.currentSectionIndex = 0;
    this.init();
  }

  /**
   * Initializes the controller by setting up event listeners.
   */
  init() {
    this.bindEvents();
  }

  /**
   * Smoothly scrolls to the target section.
   *
   * @param {HTMLElement} target - The section to scroll to.
   */
  easeInScroll(target) {
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

    const debounceScroll = (event) => {
      if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
          this.handleScroll(event.deltaY);
          isScrolling = false;
        }, 150);
      }
    };

    // Mouse wheel event
    this.scrollContainer.addEventListener('wheel', (event) => {
      event.preventDefault();
      debounceScroll(event);
    });

    // Touch events
    this.scrollContainer.addEventListener('touchstart', (event) => {
      this.startY = event.touches[0].clientY;
    });

    this.scrollContainer.addEventListener('touchmove', (event) => {
      const deltaY = this.startY - event.touches[0].clientY;
      if (Math.abs(deltaY) > 30) {
        event.preventDefault();
        debounceScroll({ deltaY });
      }
    });
  }

  /**
   * Handles scrolling to the next or previous section based on scroll direction.
   *
   * @param {number} deltaY - The scroll distance in the Y direction (positive or negative).
   */
  handleScroll(deltaY) {
    const direction = deltaY > 0 ? 1 : -1;

    this.currentSectionIndex = Math.min(
      Math.max(this.currentSectionIndex + direction, 0),
      this.sections.length - 1
    );

    this.easeInScroll(this.sections[this.currentSectionIndex]);
  }
}
