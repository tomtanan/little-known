import about from '../modules/about.js';
import projects from '../modules/projects.js';
import mosaic from '../modules/mosaic.js';

// Mapping of data-module values to imported modules
const modulesMap = {
  about: about,
  projects: projects,
  mosaic: mosaic,
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