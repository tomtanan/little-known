import Player from '@vimeo/player';
import { addClass, removeClass, toggleClass, on, getActivePlayer, isTouchDevice } from 'utils/helpers';
import { $ } from 'select-dom';
import emitter from 'utils/events';

export default function videoPlayer(el) {
  const vimeoId = el.getAttribute('data-video-id');

  el.innerHTML = `
    <div class="video-screen">
      <iframe class="video-iframe js-iframe" src="https://player.vimeo.com/video/${vimeoId}?controls=0&amp;dnt=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" data-ready="true"></iframe>
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
      <div class="sound-settings js-sound-settings">
        ${!isTouchDevice() ? '<input type="range" class="volume-slider js-volume-slider" min="0" max="1" step="0.01" value="0.5">' : ''}
      </div>
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

  const iframe = $('.js-iframe', el);
  const player = new Player(iframe);

  const playBtn = $('.js-play', el);
  const fullscreenBtn = $('.js-fullscreen', el);
  const overlay = $('.js-overlay', el);
  const timeline = $('.js-timeline', el);
  const timelineProgress = $('.js-timeline-prog', el);
  const soundBtn = $('.js-sound', el);
  const soundSettings = $('.js-sound-settings', el);
  const volumeSlider = $('.js-volume-slider', el);

  player.setVolume(0.5);

  const togglePlay = () => {
    player.getPaused().then((paused) => {
      paused ? player.play() : player.pause();
      toggleButtonClass(playBtn, paused);
    });
  };

  const resetPlayer = () => {
    player.pause();
    player.setCurrentTime(0);
    player.setVolume(0.5);
    removeClass(playBtn, 'active');
  };

  const updateSoundButtonClass = (button, volume) => {
    removeClass(button, 'set-0 set-50');
    if (volume === 0) {
      addClass(button, 'set-0');
    } else if (volume === 0.5) {
      addClass(button, 'set-50');
    }
  }

  on(playBtn, 'click', togglePlay);
  on(overlay, 'click', togglePlay);
  on(document, 'keydown', (e) => {
    if (e.code === 'Space' && getActivePlayer() === el) {
      e.preventDefault();
      playBtn.focus();
      togglePlay();
    }
  });

  // Volume control: slider for desktop, toggle for mobile
  if (isTouchDevice()) {
    let volumeState = 0.5;
    updateSoundButtonClass(soundBtn, volumeState);

    on(soundBtn, 'click', () => {
      volumeState = volumeState === 1 ? 0 : volumeState === 0.5 ? 1 : 0.5;
      player.setVolume(volumeState);
      updateSoundButtonClass(soundBtn, volumeState);
    });
  } else {
    // Show slider and adjust volume in real-time for desktop
    on(soundBtn, 'click', () => {
      toggleClass(soundSettings, 'active');
    });
    
    on(volumeSlider, 'input', () => {
      player.setVolume(volumeSlider.value);
    });

    // Update volume in real-time as the slider is adjusted
    on(volumeSlider, 'input', () => {
      player.setVolume(volumeSlider.value);
      const value = volumeSlider.value * 100;
      console.log(value);
      if (value === 0) {
        removeClass(soundBtn, 'set-50');
        addClass(soundBtn, 'set-0');
      } else if (value > 0 && value < 50) {
        removeClass(soundBtn, 'set-0');
        addClass(soundBtn, 'set-50');
      } else {
        removeClass(soundBtn, 'set-0 set-50');
      }
    });
  }

  // Hide volume slider when clicking outside (for desktop)
  document.addEventListener('click', (e) => {
    if (!soundBtn.contains(e.target) && !soundSettings.contains(e.target)) {
      removeClass(soundSettings, 'active');
    }
  });

  on(fullscreenBtn, 'click', () => {
    if (!document.fullscreenElement) {
      if (isTouchDevice()) {
        player.requestFullscreen();
      } else {
        el.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  });

  on(document, 'fullscreenchange', () => {
    if (getActivePlayer() === el) {
      const isFullscreen = !!document.fullscreenElement;
      const action = isFullscreen ? addClass : removeClass;

      action(fullscreenBtn, 'active');
      action(el, 'is-fullscreen');
    }
  });

  player.on('timeupdate', (data) => {
    const progressPercent = (data.seconds / data.duration) * 100;
    timelineProgress.style.width = `${progressPercent}%`;
  });

  on(timeline, 'click', (e) => {
    const rect = timeline.getBoundingClientRect();
    const percent = (e.pageX - rect.left) / rect.width;
    player
      .getDuration()
      .then((duration) => player.setCurrentTime(duration * percent));
  });

  player.on('ended', () => {
    removeClass(playBtn, 'active');
  });

  emitter.on('resetPlayers', resetPlayer);

  const toggleButtonClass = (button, paused) => {
    if (paused) {
      addClass(button, 'active');
    } else {
      removeClass(button, 'active');
    }
  }
}