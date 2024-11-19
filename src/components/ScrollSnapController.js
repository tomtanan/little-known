import { $, $$ } from 'select-dom';
import { on, debounce } from 'utils/helpers';

/**
 * Enables smooth, section-by-section scrolling within a container,
 * except for touch devices.
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

    // Check if the device is a touch device
    if (this.isTouchDevice()) {
      console.log('ScrollSnapController is disabled for touch devices.');
      return; // Skip initialization for touch devices
    }

    this.init();
  }

  /** Checks if the current device is a touch device. */
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  /** Sets up event listeners for scrolling. */
  init() {
    this.bindEvents();
  }

  /**
   * Smoothly scrolls to a target section using requestAnimationFrame.
   * @param {HTMLElement} target - The target section.
   */
  smoothScrollTo(target) {
    const targetPosition = target.offsetTop;
    const startPosition = this.scrollContainer.scrollTop;
    const distance = targetPosition - startPosition;
    const duration = 600; // 600ms for smooth scrolling
    let startTime = null;

    const animation = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      this.scrollContainer.scrollTop =
        startPosition + distance * this.easeInOutQuad(progress);

      if (progress < 1) {
        requestAnimationFrame(animation);
      }
    };

    requestAnimationFrame(animation);
  }

  /**
   * Ease-in-out quadratic function.
   * @param {number} t - Progress (0 to 1).
   * @returns {number} Eased progress.
   */
  easeInOutQuad(t) {
    return t < 0.5
      ? Math.pow(t, 2) * 2 // Slower start
      : 1 - Math.pow(-2 * t + 2, 2) / 2; // Smooth deceleration
  }

  /** Binds wheel and click events to enable scrolling. */
  bindEvents() {
    // Trackpad: direct response with no debounce
    on(this.scrollContainer, 'wheel', (event) => {
      event.preventDefault();
      this.handleScroll(event.deltaY, true);
    });

    // Scroll buttons for direct section navigation
    this.scrollBtns.forEach((btn) => {
      const targetId = btn.getAttribute('data-snap-scroll-to');
      const targetSection = $(`#${targetId}`, this.scrollContainer);

      if (targetSection) {
        on(btn, 'click', (e) => {
          e.preventDefault();
          this.smoothScrollTo(targetSection);
        });
      } else {
        console.error(`No section found with ID: ${targetId}`);
      }
    });
  }

  /**
   * Scrolls to the next or previous section based on scroll direction.
   * @param {number} deltaY - Scroll amount in the Y direction.
   * @param {boolean} isTrackpad - True for trackpad, false otherwise.
   */
  handleScroll(deltaY, isTrackpad) {
    if (this.isScrolling) return; // Prevent rapid scrolls

    const threshold = isTrackpad ? 5 : 20; // Adjusted thresholds
    if (Math.abs(deltaY) < threshold) return;

    this.isScrolling = true; // Lock scrolling during animation

    const direction = deltaY > 0 ? 1 : -1;
    this.currentSectionIndex = Math.min(
      Math.max(this.currentSectionIndex + direction, 0),
      this.sections.length - 1
    );

    this.smoothScrollTo(this.sections[this.currentSectionIndex]);

    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 700); // Matches animation duration
  }
}

/**
 * Initializes ScrollSnapController for the specified container.
 * @param {HTMLElement} container - The scrollable container.
 */
export function initScrollSnap(container) {
  new ScrollSnapController(container);
}
