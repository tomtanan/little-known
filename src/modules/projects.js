import { $, $$ } from 'select-dom';
import { addClass, removeClass } from 'utils/helpers';
import gsap from 'gsap';

export default function projects(el) {
  const tabs = $$('.js-project-tab', el);
  const panes = $$('.js-project-pane', el);
  const progressBar = $('.js-progress-bar', el);
  const videos = $$('video', el); // Cache all videos at the start
  let currentProject = 0;
  let interval;

  // GSAP timeline for progress bar animation
  const animateProgressBar = (duration) => {
    gsap.killTweensOf(progressBar); // Kill any existing GSAP animation on the progress bar
    gsap.fromTo(
      progressBar,
      { width: '0%' },
      { width: '100%', duration, ease: 'linear' }
    );
  };

  // Pause all videos
  const pauseAllVideos = () => videos.forEach((video) => video.pause());

  // Play video if available and animate progress bar based on its duration
  const playVideo = (video) => {
    if (video) {
      const playAndAnimate = () => {
        video.currentTime = 0;
        video.play();
        animateProgressBar(video.duration || 8);
      };

      // Check if metadata is already loaded
      if (video.readyState >= 1) {
        playAndAnimate();
      } else {
        video.addEventListener('loadedmetadata', playAndAnimate, {
          once: true,
        });
      }
    } else {
      // No video, animate the progress bar with fallback duration
      animateProgressBar(8);
    }
  };

  // Show a specific project (immediate transition)
  const showProject = (index) => {
    if (!tabs[index] || !panes[index])
      return console.error('Invalid project index:', index);

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
  };

  // Set the auto-rotate interval based on the duration (video duration or fallback)
  const setAutoRotateInterval = (duration) => {
    clearInterval(interval);
    interval = setInterval(autoRotateProjects, (duration || 8) * 1000);
  };

  // Auto rotate to the next project
  const autoRotateProjects = () => {
    currentProject = (currentProject + 1) % tabs.length;
    showProject(currentProject);
    const video = $('video', panes[currentProject]);
    setAutoRotateInterval(video ? video.duration : 8);
  };

  // Add event listeners to project tabs
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      clearInterval(interval); // Stop auto rotation
      showProject(index); // Show the clicked project
      const video = $('video', panes[index]);
      setAutoRotateInterval(video ? video.duration : 8); // Restart auto-rotation based on video duration
    });
  });

  // Initialize with the first project and auto-rotate
  showProject(0);
  const initialVideo = $('video', panes[0]);
  setAutoRotateInterval(initialVideo ? initialVideo.duration : 8);
}
