import { $, $$ } from 'select-dom';
import { addClass, removeClass, on, debounce } from 'utils/helpers';
import { gsap } from 'gsap';
import emitter from 'utils/events';

const projects = (el) => {
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
            const adjustedDuration = (video.duration || 8) - 0.5;
            animateProgressBar(video.duration || 8);
            setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
          })
          .catch(() => {
            animateProgressBar(8);
            setAutoRotateInterval(8);
          });
      };

      if (video.readyState >= 1) {
        playAndAnimate();
      } else {
        on(video, 'loadedmetadata', playAndAnimate, { once: true });
      }
    } else {
      animateProgressBar(8);
      setAutoRotateInterval(8);
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
    const adjustedDuration = video ? video.duration - 0.5 : 8;
    setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
  };

  // Add event listeners to project tabs with debounced handling
  tabs.forEach((tab, index) => {
    on(tab, 'click', (e) => {
      e.preventDefault();
      clearInterval(interval);
      showProject(index);
      const video = videoCache[index];
      const adjustedDuration = video ? video.duration - 0.5 : 8;
      setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
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
      const adjustedDuration = currentVideo.duration - 0.5;
      setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
    } else {
      on(currentVideo, 'loadedmetadata', () => {
        const adjustedDuration = currentVideo.duration - 0.5;
        setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
      }, { once: true });
    }
  });

  // Initialize the first project and set up auto-rotation
  const initialize = () => {
    const initialVideo = videoCache[0];

    if (initialVideo) {
      initialVideo.setAttribute('preload', 'auto');
      on(initialVideo, 'loadedmetadata', () => {
        showProject(0);
        const adjustedDuration = initialVideo.duration - 0.5;
        setAutoRotateInterval(adjustedDuration > 0 ? adjustedDuration : 8);
      });
    } else {
      showProject(0);
      setAutoRotateInterval(8);
    }
  };

  initialize();
};

export default projects;