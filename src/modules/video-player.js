import Player from '@vimeo/player';
import { addClass, removeClass, on } from 'utils/helpers';
import { $ } from 'select-dom';
import emitter from 'utils/events';

let initModalListener = false;

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
  const togglePlay = () => {
    player.getPaused().then((paused) => {
      paused ? player.play() : player.pause(); // Ternary for play/pause logic
      paused ? addClass(playBtn, 'active') : removeClass(playBtn, 'active'); // Update class accordingly
    });
  }

  on(playBtn, 'click', togglePlay);
  on(overlay, 'click', togglePlay);

  // Volume switch functionality
  on(soundBtn, 'click', () => {
    player.getVolume().then((volume) => {
      if (volume === 1) {
        player.setVolume(0);
        addClass(soundBtn, 'active set-0');
      } else if (volume === 0.5) {
        player.setVolume(1);
        removeClass(soundBtn, 'active set-50');
      } else {
        player.setVolume(0.5);
        removeClass(soundBtn, 'set-0');
        addClass(soundBtn, 'set-50');
      }
    });
  });

  // Fullscreen functionality
  on(fullscreenBtn, 'click', () => {
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
  on(timeline, 'click', (e) => {
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

  emitter.on('openModal', ({ modalName }) => {
    if (el.getAttribute('data-video-id') === modalName) {
      player.setCurrentTime(0);
      player.setVolume(0.5);
      addClass(soundBtn, 'set-50');
    }
  });

  emitter.on('closeModal', ({ modalName }) => {
    if (el.getAttribute('data-video-id') === modalName) {
      player.pause();
      player.setVolume(0);
      removeClass(playBtn, 'active');
      removeClass(soundBtn, 'active set-50');
      addClass(soundBtn, 'active set-0');
    }
  });
}
