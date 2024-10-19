import Player from '@vimeo/player';
import { $ } from 'select-dom';

export default function videoPlayer(el) {
  const iframe = $('iframe', el); // Select the existing iframe
  const player = new Player(iframe); // Initialize the Vimeo player API

  // Select controls
  const playPauseButton = $('.play-pause', el);
  const fullscreenButton = $('.fullscreen', el);
  const timeline = $('.timeline', el);
  const timelineProgress = $('.timeline-progress', el);

  // Toggle play/pause button
  playPauseButton.addEventListener('click', () => {
    player.getPaused().then((paused) => {
      if (paused) {
        player.play();
        playPauseButton.textContent = 'pause';
      } else {
        player.pause(); 
        playPauseButton.textContent = 'play';
      }
    });
  });

  // Fullscreen functionality
  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      el.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  });

  // Update the timeline (previously progress bar) based on video's current time
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
}
