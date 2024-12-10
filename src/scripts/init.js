import about from '../modules/about.js';
import contact from '../modules/contact.js';
import gallery from '../modules/gallery.js';
import mosaic from '../modules/mosaic.js';
import modal from '../modules/modal.js';
import mouseAction from '../modules/mouse-action.js';
import projects from '../modules/projects.js';
import videoPlayer from '../modules/video-player.js';

// Mapping of data-module values to imported modules
const modulesMap = {
  'about': about,
  'contact': contact,
  'gallery': gallery,
  'modal': modal,
  'mosaic': mosaic,
  'mouse-action': mouseAction,
  'projects': projects,
  'video-player': videoPlayer
};

// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');
    const module = modulesMap[moduleName];

    if (module && typeof module === 'function') {
      module(element); // Initialize the module, passing in the element if necessary
    } else {
      console.error(`No module found for: ${moduleName}`);
    }
  });
});