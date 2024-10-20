import { $, $$ } from 'select-dom';
import { isTouchDevice, addClass, removeClass, on, debounce } from 'utils/helpers';
import { initMouseHover } from 'components/MouseHoverController.js';
import { gsap } from 'gsap';
import mitt from 'mitt';

const emitter = mitt();

export default function projects(el) {
  const tabs = $$('.js-project-tab', el);
  const panes = $$('.js-project-pane', el);
  const videos = $$('.js-project-video', el);
  const progressBar = $('.js-progress-bar', el);
  let currentProject = 0;
  let interval;

  // Cache video elements by project index for better performance
  const videoCache = panes.map(pane => $('video', pane));

  // GSAP timeline for progress bar animation
  const animateProgressBar = (duration = 8) => {
    gsap.killTweensOf(progressBar);
    gsap.fromTo(
      progressBar,
      { width: '0%' },
      { width: '100%', duration, ease: 'linear' }
    );
  };

  // Pause all videos
  const pauseAllVideos = () => {
    videos.forEach(video => video.pause());
  };

  // Play video and animate the progress bar
  const playVideo = (video) => {
    if (video) {
      const playAndAnimate = () => {
        video.currentTime = 0;
        video.play()
          .then(() => {
            animateProgressBar(video.duration || 8);
          })
          .catch(() => {
            animateProgressBar(8);
          });
      };

      if (video.readyState >= 1) {
        playAndAnimate();
      } else {
        on(video, 'loadedmetadata', playAndAnimate, { once: true });
      }
    } else {
      animateProgressBar(8);
    }
  };

  // Show a specific project
  const showProject = (index) => {
    if (!tabs[index] || !panes[index]) return;

    const newPane = panes[index];
    const newVideo = videoCache[index];

    pauseAllVideos();

    tabs.forEach(tab => removeClass(tab, 'active'));
    panes.forEach(pane => removeClass(pane, 'active'));

    addClass(tabs[index], 'active');
    addClass(newPane, 'active');

    playVideo(newVideo);

    currentProject = index;
  };

  // Throttle setting the auto-rotate interval to avoid frequent resets
  const setAutoRotateInterval = debounce((duration = 8) => {
    clearInterval(interval);
    interval = setInterval(autoRotateProjects, duration * 1000);
  }, 100);

  // Auto rotate to the next project
  const autoRotateProjects = () => {
    currentProject = (currentProject + 1) % tabs.length;
    showProject(currentProject);

    const video = videoCache[currentProject];
    setAutoRotateInterval(video ? video.duration : 8);
  };

  // Add event listeners to project tabs with debounced handling
  tabs.forEach((tab, index) => {
    on(tab, 'click', (e) => {
      e.preventDefault();
      clearInterval(interval);
      showProject(index);
      const video = videoCache[index];
      setAutoRotateInterval(video ? video.duration : 8);
    });
  });

  // Lazy load videos with IntersectionObserver
  const animateTabs = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.fromTo(
          tabs,
          { opacity: 0, y: 20 },
          { opacity: 0.5, y: 0, stagger: 0.2, duration: 1, ease: 'power3.out' }
        );
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(animateTabs, { root: null, threshold: 0.3 });
  observer.observe(el);

  // Handle modal events with efficient video pausing and resuming
  emitter.on('openModal', () => {
    pauseAllVideos();
    clearInterval(interval);
    gsap.killTweensOf(progressBar);
  });

  emitter.on('closeModal', () => {
    playVideo(videoCache[currentProject]);
    const currentVideo = videoCache[currentProject];
    if (currentVideo.readyState >= 1) {
      setAutoRotateInterval(currentVideo.duration || 8);
    } else {
      on(currentVideo, 'loadedmetadata', () => setAutoRotateInterval(currentVideo.duration || 8), { once: true });
    }
  });

  // Initialize the first project and set up auto-rotation
  const initialize = () => {
    const initialVideo = videoCache[0];

    if (initialVideo) {
      initialVideo.setAttribute('preload', 'auto');
      on(initialVideo, 'loadedmetadata', () => {
        showProject(0);
        setAutoRotateInterval(initialVideo.duration || 8);
      });
    } else {
      showProject(0);
      setAutoRotateInterval(8);
    }
  };

  // Only initialize mouse hover effect if the device is not a touch device
  if (!isTouchDevice()) {
    initMouseHover(el, '.js-mouse-hover-projects', '.js-projects-content');
  }

  initialize();
}
