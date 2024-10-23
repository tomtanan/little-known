import Player from '@vimeo/player';
import { addClass, removeClass, on } from 'utils/helpers';
import { $, $$ } from 'select-dom';
import emitter from 'utils/events';

export default function videoPlayer(el) {
  const vimeoId = el.getAttribute('data-video-id');

  el.innerHTML = `
    <div class="video-screen">
      <iframe class="video-iframe js-iframe" src="https://player.vimeo.com/video/${vimeoId}?controls=0&amp;dnt=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen="" data-ready="true"></iframe>
      <div class="video-overlay js-overlay"></div>
    </div>
    <div class="video-controls">
      <button class="play-btn js-play">
        <svg class="ico-play" width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 10 .5 19V1L15 10Z" stroke="#fff"></path>
        </svg>
        <svg class="ico-pause" width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 14.5V0m8 14.5V0" stroke="#fff"></path>
        </svg>
      </button>
      <button class="sound-btn js-sound">
        <svg class="ico-sound ico-mute" width="23" height="19" viewBox="0 0 23 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="ico-sound-0" d="M14 18L7.25926 13.2353H1V9V5.23529H7.25926L14 1V9V18Z" stroke="#fff"></path>
          <path class="ico-sound-50" d="M17 5C18.203 6.17009 18.9647 7.90305 18.9647 9.83696C18.9647 11.7709 18.203 13.5038 17 14.6739" stroke="#fff"></path>
          <path class="ico-sound-100" d="M18 2C20.406 3.85471 21.9294 6.60162 21.9294 9.66707C21.9294 12.7325 20.406 15.4794 18 17.3341" stroke="#fff"></path>
        </svg>
      </button>
      <div class="timeline js-timeline">
        <div class="timeline-progress js-timeline-prog"></div>
      </div>
      <button class="fullscreen-btn js-fullscreen">
        <svg class="ico-fullscreen" width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 10v5.5h6.5M19 10v5.5h-6.5M1 6.5V1h6.5M19 6.5V1h-6.5" stroke="#fff"></path>
        </svg>
        <svg class="ico-resize" width="18" height="19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 18.5V12H0" stroke="#fff"></path>
          <path d="M11.5 18.5V12H18" stroke="#fff"></path>
          <path d="M6.5 0v6.5H0" stroke="#fff"></path>
          <path d="M11.5 0v6.5H18" stroke="#fff"></path>
        </svg>
      </button>
    </div>
  `;

  // Step 5: Initialize the Vimeo Player API and event listeners for each player
  const iframe = $('.js-iframe', el);
  const player = new Player(iframe);

  const playBtn = $('.js-play', el);
  const soundBtn = $('.js-sound', el);
  const fullscreenBtn = $('.js-fullscreen', el);
  const overlay = $('.js-overlay', el);
  const timeline = $('.js-timeline', el);
  const timelineProgress = $('.js-timeline-prog', el);

  // Play/Pause functionality
  const togglePlay = () => {
    player.getPaused().then((paused) => {
      paused ? player.play() : player.pause();
      paused ? addClass(playBtn, 'active') : removeClass(playBtn, 'active');
    });
  };

  const resetPlayer = () => {
    player.pause();
    player.setCurrentTime(0);
    player.setVolume(0.5);
    removeClass(playBtn, 'active');
    addClass(soundBtn, 'active set-50');
  };

  on(playBtn, 'click', togglePlay);
  on(overlay, 'click', togglePlay);

  // Volume functionality
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
      addClass(fullscreenBtn, 'active');
    } else {
      document.exitFullscreen();
      removeClass(fullscreenBtn, 'active');
    }
  });

  // Timeline progress
  player.on('timeupdate', (data) => {
    const progressPercent = (data.seconds / data.duration) * 100;
    timelineProgress.style.width = `${progressPercent}%`;
  });

  // Seeking functionality
  on(timeline, 'click', (e) => {
    const rect = timeline.getBoundingClientRect();
    const percent = (e.pageX - rect.left) / rect.width;
    player.getDuration().then((duration) => {
      player.setCurrentTime(duration * percent);
    });
  });

  // Video end handling
  player.on('ended', () => {
    removeClass(playBtn, 'active');
  });

  emitter.on('resetPlayers', resetPlayer);
  emitter.on('autoPlay', (modal) => {
    const firstPlayer = $$('.js-video-player', modal)[0];
    if (firstPlayer === el) togglePlay();
  });
  emitter.on('playNext', (nextPlayer) => {
    const nextPlayerId = nextPlayer.getAttribute('data-video-id');
    if (nextPlayerId === vimeoId) togglePlay();
  });
}
