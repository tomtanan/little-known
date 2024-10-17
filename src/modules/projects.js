import { $, $$ } from 'select-dom';
import { isTouchDevice, addClass, removeClass } from 'utils/helpers';
import { initMouseHover } from 'components/MouseHoverController.js';
import { gsap } from 'gsap';

export default function projects(el) {
  const tabs = $$('.js-project-tab', el);
  const panes = $$('.js-project-pane', el);
  const videos = $$('.js-project-video', el);
  const details = $$('.js-project-details', el);
  const modal = $('.js-projects-modal', el);
  const closeBtn = $('.js-projects-details-close', el);
  const progressBar = $('.js-progress-bar', el);
  let currentProject = 0;
  let interval;

  // GSAP timeline for progress bar animation
  const animateProgressBar = (duration) => {
    try {
      gsap.killTweensOf(progressBar); // Kill any existing GSAP animation on the progress bar
      gsap.fromTo(
        progressBar,
        { width: '0%' },
        { width: '100%', duration, ease: 'linear' }
      );
    } catch (error) {
      console.error('Error animating progress bar:', error);
    }
  };

  // Pause all videos
  const pauseAllVideos = () => {
    try {
      videos.forEach((video) => {
        video.pause();
      });
    } catch (error) {
      console.error('Error pausing videos:', error);
    }
  };

  // Play video if available and animate progress bar based on its duration
  const playVideo = (video) => {
    try {
      if (video) {
        const playAndAnimate = () => {
          video.currentTime = 0;
          video
            .play()
            .then(() => {
              // Play succeeded
              animateProgressBar(video.duration || 8);
            })
            .catch((error) => {
              console.error('Error playing video:', error);
              animateProgressBar(8); // Fallback duration
            });
        };

        // If metadata is already loaded
        if (video.readyState >= 1) {
          playAndAnimate();
        } else {
          video.addEventListener('loadedmetadata', playAndAnimate, {
            once: true,
          });
        }
      } else {
        // No video, fallback
        animateProgressBar(8);
      }
    } catch (error) {
      console.error('Error in playVideo function:', error);
      animateProgressBar(8); // Fallback if any error occurs
    }
  };

  // Show a specific project (immediate transition)
  const showProject = (index) => {
    try {
      if (!tabs[index] || !panes[index]) {
        throw new Error(`Invalid project index: ${index}`);
      }

      const newPane = panes[index];
      const newVideo = $('video', newPane);

      pauseAllVideos(); // Pause all videos before switching

      // Remove active state from all tabs and panes
      tabs.forEach((tab) => removeClass(tab, 'active'));
      panes.forEach((pane) => removeClass(pane, 'active'));

      // Add active state to the selected tab and pane
      addClass(tabs[index], 'active');
      addClass(newPane, 'active');

      playVideo(newVideo); // Play the video for the new pane

      currentProject = index; // Update the current project index
    } catch (error) {
      console.error('Error showing project:', error);
    }
  };

  // Set the auto-rotate interval based on the duration (video duration or fallback)
  const setAutoRotateInterval = (duration) => {
    try {
      clearInterval(interval);
      interval = setInterval(autoRotateProjects, (duration || 8) * 1000);
    } catch (error) {
      console.error('Error setting auto-rotate interval:', error);
    }
  };

  // Auto rotate to the next project
  const autoRotateProjects = () => {
    try {
      currentProject = (currentProject + 1) % tabs.length;
      showProject(currentProject);
      const video = $('video', panes[currentProject]);
      setAutoRotateInterval(video ? video.duration : 8);
    } catch (error) {
      console.error('Error in auto-rotate:', error);
    }
  };

  // Add event listeners to project tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
      try {
        e.preventDefault();
        clearInterval(interval); // Stop auto rotation
        showProject(index); // Show the clicked project
        const video = $('video', panes[index]);
        setAutoRotateInterval(video ? video.duration : 8); // Restart auto-rotation based on video duration
      } catch (error) {
        console.error('Error on tab click:', error);
      }
    });
  });

  // Show projects modal
  const showProjectsModal = (index) => {
    // Pause auto rotation and video
    clearInterval(interval);
    pauseAllVideos();

    // Set the project details content
    details.forEach((item, idx) => {
      if (index === idx) {
        addClass(item, 'active'); // Show the corresponding project details
      } else {
        removeClass(item, 'active');
      }
    });

    // Prevent body scroll
    addClass(document.body, 'no-scroll');

    // Open projects modal with animation
    gsap.to(modal, {
      top: 0,
      duration: 0.4,
      ease: 'power1.in',
    });
  };

  // Close projects modal
  const closeProjectsModal = () => {
    // Resume auto rotation and video
    const video = $('video', panes[currentProject]);
    setAutoRotateInterval(video ? video.duration : 8);
    playVideo(video);

    // Allow body scroll again
    removeClass(document.body, 'no-scroll');

    // Close projects modal with animation
    gsap.to(modal, {
      top: '100vh',
      duration: 0.4,
      ease: 'power1.in',
    });
  };

  // Handle clicks on project panes
  panes.forEach((pane, index) => {
    pane.addEventListener('click', (e) => {
      e.preventDefault();
      showProjectsModal(index); // Open the projects modal
    });
  });

  // Handle closing of the projects modal
  closeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeProjectsModal();
  });

  // IntersectionObserver to detect when the user lands on the Projects section
  const animateTabs = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // GSAP animation for the project tabs
        gsap.fromTo(
          tabs,
          { opacity: 0, y: 20 }, // Start state
          { opacity: 0.5, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out' } // End state with stagger
        );
        // Unobserve the section after the animation is triggered
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(animateTabs, {
    root: null,
    threshold: 0.3, // Trigger when 30% of the section is visible
  });

  // Observe the Projects section
  observer.observe(el);

  // Initialize with the first project and auto-rotate
  try {
    const initialVideo = $('video', panes[0]);

    if (initialVideo) {
      // Add the preload attribute to the first video
      initialVideo.setAttribute('preload', 'auto');

      // Wait for the first video's metadata to load before showing the pane
      initialVideo.addEventListener('loadedmetadata', () => {
        showProject(0); // Show the first project once the video is ready
        setAutoRotateInterval(initialVideo.duration || 8); // Set auto-rotate based on video duration
      });
    } else {
      // Fallback if no video is found
      showProject(0);
      setAutoRotateInterval(8); // Set default auto-rotate duration
    }
  } catch (error) {
    console.error('Error during initialization:', error);
  }

  // Initialize text following the user mouse when hovering the Projects pane if it's not a touch device
  if (!isTouchDevice())
    initMouseHover(el, '.js-mouse-hover-projects', '.js-projects-content');
}
