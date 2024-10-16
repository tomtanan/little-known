import { $ } from 'select-dom';
import gsap from 'gsap';

/**
 * MouseHoverController class enables a hover element to follow the mouse on hover.
 */
export class MouseHoverController {
  /**
   * Creates an instance of MouseHoverController.
   *
   * @param {HTMLElement} container - The DOM element that contains the hover text.
   * @param {string} selector - The selector (class, ID, or other) for the hover text element.
   * @param {string} targetSelector - The selector (class, ID, or other) for the section to trigger the hover effect.
   *
   * @throws {Error} Throws an error if the container, target, or hover text element is not found.
   */
  constructor(container, selector, targetSelector) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Invalid DOM element passed to MouseHoverController.');
    }

    this.container = container;
    this.target = $(targetSelector); // Target the section to trigger hover effect
    this.hoverElement = $(selector, this.container);

    if (!this.hoverElement) {
      throw new Error(
        `Element with selector "${selector}" not found inside the container.`
      );
    }

    if (!this.target) {
      throw new Error(`Target with selector "${targetSelector}" not found.`);
    }

    this.mouseX = 0;
    this.mouseY = 0;
    this.offsetX = 15; // Horizontal offset from the mouse
    this.offsetY = 10; // Vertical offset from the mouse
    this.isMouseMoving = false; // For debouncing mousemove

    this.init();
  }

  /**
   * Initializes the mouse hover events by binding event listeners.
   */
  init() {
    // Set the initial position of the hover element in the bottom-right corner of the container
    this.setInitialPosition();

    // Always make the text follow the mouse inside the container
    this.bindContainerEvents();

    // Control opacity based on the target section hover
    this.bindTargetEvents();

    // Check if the mouse is already over the target on page load
    this.checkInitialHover();
  }

  /**
   * Sets the initial position of the hover element in the bottom-right corner.
   */
  setInitialPosition() {
    const containerRect = this.container.getBoundingClientRect();
    const initialX = containerRect.width - this.hoverElement.offsetWidth - 10; // 10px from the right
    const initialY = containerRect.height - this.hoverElement.offsetHeight - 10; // 10px from the bottom

    gsap.set(this.hoverElement, {
      x: initialX,
      y: initialY,
      opacity: 0, // Start hidden
    });
  }

  /**
   * Debounced function to handle mouse movement events.
   * This reduces the frequency of updates, improving performance.
   */
  handleMouseMove(e) {
    if (this.isMouseMoving) return;
    this.isMouseMoving = true;

    const rect = this.container.getBoundingClientRect();
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;

    // Before moving the element, set 'bottom' and 'right' to 'auto'
    gsap.set(this.hoverElement, { bottom: 'auto', right: 'auto' });

    // Calculate position and move the hover element
    gsap.to(this.hoverElement, {
      x: this.mouseX + this.offsetX,
      y: this.mouseY + this.offsetY,
      duration: 0.2,
      ease: 'power1.inOut',
    });

    setTimeout(() => {
      this.isMouseMoving = false;
    }, 16); // ~60fps (16ms)
  }

  /**
   * Binds mouse movement events to make the hover element follow the mouse inside the container.
   */
  bindContainerEvents() {
    this.container.addEventListener('mousemove', (e) =>
      this.handleMouseMove(e)
    );
  }

  /**
   * Binds hover events to the target section to control the hover text opacity.
   */
  bindTargetEvents() {
    this.target.addEventListener('mouseenter', () => {
      gsap.to(this.hoverElement, {
        opacity: 1,
        duration: 0.2,
        ease: 'power1.inOut',
      }); // Fade in when hovering the target
    });

    this.target.addEventListener('mouseleave', () => {
      gsap.to(this.hoverElement, {
        opacity: 0,
        duration: 0.2,
        ease: 'power1.inOut',
      }); // Fade out when leaving the target
    });
  }

  /**
   * Checks if the mouse is already inside the target section on page load.
   */
  checkInitialHover() {
    const rect = this.target.getBoundingClientRect();
    const mouseX = window.innerWidth / 2; // Use the center of the screen as a more reliable check
    const mouseY = window.innerHeight / 2;

    // Check if the mouse is within the target's boundaries
    if (
      mouseX >= rect.left &&
      mouseX <= rect.right &&
      mouseY >= rect.top &&
      mouseY <= rect.bottom
    ) {
      gsap.to(this.hoverElement, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }
}

/**
 * Initializes MouseHoverController for a given DOM element, hover text selector, and target selector.
 *
 * @param {HTMLElement} element - The DOM element where the mouse hover effect should be applied.
 * @param {string} selector - The selector (class, ID, or other) for the hover text element.
 * @param {string} targetSelector - The selector for the section where the hover effect should be active.
 */
export function initMouseHover(element, selector, targetSelector) {
  new MouseHoverController(element, selector, targetSelector);
}
