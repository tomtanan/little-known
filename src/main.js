import { ScrollSnapController } from 'components/ScrollSnapController';
// import { VideoTabController } from 'components/VideoTabController.js';
import 'scripts/init'; 
import 'styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  // Scroll snapping
  new ScrollSnapController('.js-section-wrapper');
});

// window.addEventListener('load', () => {
//   new VideoTabController('.js-tab', '.js-pane', '.js-progress-bar');
// });
