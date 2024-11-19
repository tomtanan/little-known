import { $, $$ } from 'select-dom';
import { on, debounce } from 'utils/helpers';

/**
 * Enables smooth, section-by-section scrolling within a container.
 */
export class ScrollSnapController {
  /**
   * @param {HTMLElement} container - The scrollable container.
   * @throws {Error} If no valid container or sections are found.
   */
  constructor(container) {
    this.scrollContainer = container;

    if (!this.scrollContainer) throw new Error('Scroll container is not valid.');

    this.sections = $$('.js-section', this.scrollContainer);
    this.scrollBtns = $$('[data-snap-scroll-to]', document.body);

    if (!this.sections.length) throw new Error('No sections to scroll through.');

    this.currentSectionIndex = 0;
    this.isScrolling = false; // Prevents rapid scrolls on touch devices
    this.init();
  }

  /** Sets up event listeners for scrolling. */
  init() {
    this.bindEvents();
  }

  /**
   * Smoothly scrolls to a target section.
   * @param {HTMLElement} target - The target section.
   */
  easeInScroll(target) {
    const targetPosition = target.offsetTop;
    this.scrollContainer.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }

  /** Binds wheel and touch events to enable scrolling. */
  bindEvents() {
    // Trackpad: direct response with no debounce
    on(this.scrollContainer, 'wheel', (event) => {
      event.preventDefault();
      this.handleScroll(event.deltaY, true);
    });

    // Touch devices: start tracking touch position
    on(this.scrollContainer, 'touchstart', (event) => {
      this.startY = event.touches[0].clientY;
    });

    // Touch devices: use debounce for swipe scrolling
    const debouncedHandleScroll = debounce((deltaY) => {
      this.handleScroll(deltaY, false);
    }, 150);

    on(
      this.scrollContainer,
      'touchmove',
      (event) => {
        const deltaY = this.startY - event.touches[0].clientY;
        if (Math.abs(deltaY) > 30) {
          event.preventDefault(); // Prevent scroll chaining
          debouncedHandleScroll(deltaY);
        }
      },
      { passive: false } // Required for iOS to allow preventDefault
    );

    // Scroll buttons for direct section navigation
    this.scrollBtns.forEach((btn) => {
      const targetId = btn.getAttribute('data-snap-scroll-to');
      const targetSection = $(`#${targetId}`, this.scrollContainer);

      if (targetSection) {
        on(btn, 'click', (e) => {
          e.preventDefault();
          this.easeInScroll(targetSection);
        });
      } else {
        console.error(`No section found with ID: ${targetId}`);
      }
    });
  }

  /**
   * Scrolls to the next or previous section based on scroll direction.
   * @param {number} deltaY - Scroll amount in the Y direction.
   * @param {boolean} isTrackpad - True for trackpad, false for touch.
   */
  handleScroll(deltaY, isTrackpad) {
    // Check if the body has scroll-lock; if yes, exit the function
    if (document.body.classList.contains('scroll-lock')) return;

    const threshold = isTrackpad ? 3 : 15; // Lower threshold for trackpad

    if (Math.abs(deltaY) < threshold) return;

    // Prevent multiple rapid scrolls for touch devices
    if (!isTrackpad && this.isScrolling) return;
    this.isScrolling = !isTrackpad;

    const direction = deltaY > 0 ? 1 : -1;
    this.currentSectionIndex = Math.min(
      Math.max(this.currentSectionIndex + direction, 0),
      this.sections.length - 1
    );

    this.easeInScroll(this.sections[this.currentSectionIndex]);

    // Reset scrolling flag after scroll completes (only for touch)
    if (!isTrackpad) {
      setTimeout(() => {
        this.isScrolling = false;
      }, 500);
    }
  }
}

/**
 * Initializes ScrollSnapController for the specified container.
 * @param {HTMLElement} container - The scrollable container.
 */
export function initScrollSnap(container) {
  new ScrollSnapController(container);
}
