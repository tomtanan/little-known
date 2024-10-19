import Player from '@vimeo/player';
import { addClass, removeClass } from 'utils/helpers';
import { $ } from 'select-dom';

export default function videoPlayer(el) {
  const iframe = $('.js-iframe', el); // Select the existing iframe
  const player = new Player(iframe); // Initialize the Vimeo player API

  // Select controls
  const overlay = $('.js-overlay', el);
  const playBtn = $('.js-play', el);
  const soundBtn = $('.js-sound', el);
  const fullscreenBtn = $('.js-fullscreen', el);
  const timeline = $('.js-timeline', el);
  const timelineProgress = $('.js-timeline-prog', el);

  // Helper function to toggle play/pause
  function togglePlay() {
    player.getPaused().then((paused) => {
      paused ? player.play() : player.pause(); // Ternary for play/pause logic
      paused ? addClass(playBtn, 'active') : removeClass(playBtn, 'active'); // Update class accordingly
    });
  }

  playBtn.addEventListener('click', togglePlay);
  overlay.addEventListener('click', togglePlay);

  // Volume switch functionality
  soundBtn.addEventListener('click', () => {
    player.getVolume().then((volume) => {
      if (volume === 1) {
        player.setVolume(0);
        addClass(soundBtn, 'active');
        addClass(soundBtn, 'set-0');
      } else if (volume === 0.5) {
        player.setVolume(1);
        removeClass(soundBtn, 'active');
        removeClass(soundBtn, 'set-50');
      } else {
        player.setVolume(0.5);
        removeClass(soundBtn, 'set-0');
        addClass(soundBtn, 'set-50');
      }
    });
  });

  // Fullscreen functionality
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Update the timeline based on video's current time
  player.on('timeupdate', (data) => {
    const progressPercent = (data.seconds / data.duration) * 100;
    timelineProgress.style.width = `${progressPercent}%`;
  });

  // Seek video when the timeline is clicked
  timeline.addEventListener('click', (e) => {
    const rect = timeline.getBoundingClientRect();
    const percent = (e.pageX - rect.left) / rect.width;
    player.getDuration().then((duration) => {
      player.setCurrentTime(duration * percent); // Seek to the clicked time
    });
  });

  // Handle video end: remove 'active' class from play button
  player.on('ended', () => {
    removeClass(playBtn, 'active');
  });

  // Initialize the player with 50% volume and add the relevant class
  player.setVolume(0.5);
  addClass(soundBtn, 'set-50');
}
