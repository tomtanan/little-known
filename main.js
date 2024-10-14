/*
 * Helper Functions
 */
function wrapWords(node) {
  if (!node) return; // Exit if node is null or undefined

  // Case 1: Handling TEXT_NODEs
  if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
    const words = node.textContent.trim().split(/\s+/); // Split text into words

    words.forEach((word, index) => {
      const wordContainer = document.createElement('span');
      wordContainer.classList.add('word'); // Add class for animation
      wordContainer.textContent = word; // Set the word content

      node.parentNode.insertBefore(wordContainer, node); // Insert new word container

      // Add space between words, but only if not the last word
      if (index < words.length - 1) {
        node.parentNode.insertBefore(document.createTextNode(' '), node); // Add space between words
      }
    });

    node.remove(); // Remove the original text node after processing

  // Case 2: Handling ELEMENT_NODEs
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    // Check if it's an inline element (like <a> or <span>)
    if (getComputedStyle(node).display === 'inline') {
      // If it's a <span> and doesn't already have 'word-container' class
      if (node.tagName.toLowerCase() === 'span') {
        if (!node.classList.contains('word')) {
          node.classList.add('word'); // Add 'word-container' to existing span
        }
        return; // Exit to avoid further processing
      } else if (node.tagName.toLowerCase() === 'a') {
        node.parentNode.insertBefore(document.createTextNode(' '), node);
      }
    }

    // Recursively process child nodes of the element
    Array.from(node.childNodes).forEach(child => wrapWords(child));
  }
}

class VisibilityWatcher {
  /**
   * VisibilityWatcher Class
   * 
   * This class observes specified elements and executes defined functions
   * when they enter or exit the viewport.
   * 
   * Parameters:
   * - targetSelector (String): CSS selector for the target element(s)
   * - onEnter (Function): Function to execute when the element enters the viewport
   * - onExit (Function): Function to execute when the element exits the viewport
   * - threshold (Number): Visibility threshold (0.0 to 1.0, default: 0)
   */
  constructor(targetSelector, onEnter, onExit, threshold = 0) {
    if (typeof targetSelector !== 'string' || !targetSelector) {
      return; // Exit if the selector is invalid
    }

    this.targets = document.querySelectorAll(targetSelector); // Select target elements

    // Validate onEnter and onExit functions
    if (typeof onEnter !== 'function' || typeof onExit !== 'function') {
      return; // Exit if functions are not valid
    }

    this.onEnter = onEnter; // Function to call when the element is in view
    this.onExit = onExit; // Function to call when the element is out of view
    this.threshold = threshold; // Visibility threshold

    if (this.targets.length === 0) {
      console.warn(`No elements found for the selector: ${targetSelector}`);
      return; // Exit if no elements are found
    }

    this.initObserver(); // Initialize the observer
  }

  /**
   * Initializes the Intersection Observer to monitor visibility changes.
   */
  initObserver() {
    const options = {
      root: null, // Use the viewport as the container
      threshold: this.threshold, // Set the visibility threshold
    };

    // Create a new Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.onEnter(entry.target); // Call the enter function
        } else {
          this.onExit(entry.target); // Call the exit function
        }
      });
    }, options);

    // Observe each target element
    this.targets.forEach((target) => {
      this.observer.observe(target);
    });
  }
}

class ScrollSnapController {
  /**
   * ScrollSnapController Class
   * This class enables smooth scrolling through different sections of a webpage. 
   * Supports both mouse wheel and touch events.
   */
  constructor(scrollContainerSelector) {
    this.scrollContainer = document.querySelector(scrollContainerSelector); // The container that holds all sections

    if (!this.scrollContainer) return; // Check if container exists
    this.sections = document.querySelectorAll('.js-section'); // All sections that will be scrolled between
    if (!this.sections.length) return; // Check if sections exist

    this.currentSectionIndex = 0; // Tracks the currently visible section
    this.init(); // Calls the initialization function to set up event listeners
  }

  // Initialize the controller
  init() {
    this.bindEvents(); // Sets up event listeners for scroll and touch
  }

  // Smoothly scroll to the target section using ease-in behavior
  easeInScroll(target) {
    const targetPosition = target.offsetTop; // Get the top offset position of the target section

    // Scroll the container smoothly to the target position
    this.scrollContainer.scrollTo({
      top: targetPosition,
      behavior: 'smooth',
    });
  }

  // Bind mouse wheel and touch events for scrolling with debounce
  bindEvents() {
    let isScrolling = false;

    // Debounce scroll events
    const debounceScroll = (event) => {
      if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
          this.handleScroll(event.deltaY); // Pass the scroll amount (deltaY) to handleScroll function
          isScrolling = false;
        }, 150); // Delay of 150ms for debouncing
      }
    };

    // Listen to mouse wheel events
    this.scrollContainer.addEventListener('wheel', (event) => {
      event.preventDefault(); // Prevent default scroll behavior
      debounceScroll(event); // Debounced scroll handling
    });

    // Touch event listeners for mobile devices
    this.scrollContainer.addEventListener('touchstart', (event) => {
      this.startY = event.touches[0].clientY; // Get the Y position of the initial touch
    });

    this.scrollContainer.addEventListener('touchmove', (event) => {
      const deltaY = this.startY - event.touches[0].clientY; // Calculate swipe distance
      if (Math.abs(deltaY) > 30) { // Trigger scroll if swipe distance exceeds threshold
        event.preventDefault();
        debounceScroll({ deltaY }); // Use same debounce method for touch events
      }
    });
  }

  // Handles scrolling to the next or previous section
  handleScroll(deltaY) {
    const direction = deltaY > 0 ? 1 : -1; // Determine scroll direction
    // Update the current section index within bounds (between 0 and total number of sections)
    this.currentSectionIndex = Math.min(Math.max(this.currentSectionIndex + direction, 0), this.sections.length - 1);
    this.easeInScroll(this.sections[this.currentSectionIndex]); // Smoothly scroll to the new section
  }
}

class VideoTabController {
  /**
   * VideoTabController Class
   * Manages a tabbed interface where each tab is associated with a video.
   */
  constructor(tabSelector = '.js-tab', paneSelector = '.js-pane', progressBarSelector = '.js-progress-bar', duration = 8000) {
    this.duration = duration; // Duration each tab remains active (8 seconds default)
    this.tabTimeout = null; // Timeout for tab switching
    this.videoTimeout = null; // Timeout for video starting delay
    this.tabs = document.querySelectorAll(tabSelector); // Select all tabs
    this.panes = document.querySelectorAll(paneSelector); // Select all panes containing videos
    this.progressBar = document.querySelector(progressBarSelector); // Select the progress bar

    if (!this.panes.length || !this.tabs.length || !this.progressBar) return; // Ensure required elements exist

    this.init(); // Initialize the controller
  }

  // Initialize by starting the first video and setting up events
  init() {
    this.startVideo(this.panes[0]); // Start the first video in the first pane
    this.loopTabs(); // Start automatic tab switching loop
    this.attachTabClickListeners(); // Attach click event listeners to each tab
  }

  // Starts the video in the given pane and resets other videos
  startVideo(parent) {
    const video = parent.querySelector('.js-video'); // Get the video element inside the pane
    const delay = 200; // Delay before starting the video (200ms)

    if (!video) return; // Check if video exists

    const playVideo = () => {
      this.resetVideos(parent); // Reset all other videos except the current one
      video.play(); // Play the current video
      this.restartProgressBar(); // Restart the progress bar animation
    };

    clearTimeout(this.videoTimeout); // Clear any previous video timeout
    this.videoTimeout = setTimeout(playVideo, delay); // Start video after the delay
  }

  // Reset all videos that aren't part of the active tab (parent pane)
  resetVideos(activeParent) {
    const videos = document.querySelectorAll('video.js-video'); // Select all video elements
    videos.forEach(video => {
      if (video.parentElement !== activeParent) { // If the video isn't in the current active tab
        video.pause(); // Pause the video
        video.currentTime = 0; // Reset the video time to the beginning
      }
    });
  }

  // Restarts the progress bar for the active video
  restartProgressBar() {
    this.progressBar.classList.remove('progress-bar--active'); // Reset animation
    void this.progressBar.offsetWidth; // Force reflow to restart the animation
    this.progressBar.classList.add('progress-bar--active'); // Restart animation
  }

  // Automatically loop through tabs
  loopTabs() {
    clearTimeout(this.tabTimeout); // Clear the previous tab switching timeout
    this.tabTimeout = setTimeout(() => {
      const currentTab = document.querySelector('.js-tabs-group .w--current'); // Get the current active tab
      const nextTab = currentTab?.nextElementSibling || document.querySelector('.js-tab:first-child'); // Get the next tab or loop to the first tab

      if (!document.querySelector('.menu-button.w--open')) nextTab.click(); // Switch to the next tab if menu isn't open
      this.loopTabs(); // Continue loop
    }, this.duration); // Repeat after the set duration
  }

  // Add click event listeners to each tab for manual switching
  attachTabClickListeners() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        clearTimeout(this.tabTimeout); // Clear tab loop timeout when a tab is clicked
        this.startVideo(this.panes[index]); // Start the video of the clicked tab
        this.loopTabs(); // Restart the tab loop
      });
    });
  }
}

// Initialize the ScrollSnapController and AutoRotatingSlideshow when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.js-nav-link');
  const textElements = document.querySelectorAll('.js-gsap-text');
  let aboutTextLoaded = false;
  
  textElements.forEach((text) => {
    Array.from(text.childNodes).forEach(child => wrapWords(child));
  });
  
  new ScrollSnapController('.js-section-wrapper');
  new VisibilityWatcher(
    '.js-about',
    (el) => {
      navLinks.forEach((link) => {
        link.classList.add('c-black');
      });
      
      if (!aboutTextLoaded) {
        gsap.fromTo('.word', {
          opacity: 0,
          y: 30
        }, {
          opacity: 1,
          y: 0,
          duration: 1, 
          ease: 'power3.out',
          stagger: {
            amount: 1, 
            from: 'start', 
            overlap: 0.5
          }
        });
        
        aboutTextLoaded = true;
      }
    },
    (el) => {
      navLinks.forEach((link) => {
        link.classList.remove('c-black');
      });
    },
    1
  );
});

// Initialize the VideoTabController when the window loads
window.addEventListener('load', () => {
  new VideoTabController('.js-tab', '.js-pane', '.js-progress-bar');
});
