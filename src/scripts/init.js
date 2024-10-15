// Automatically initialize sections based on the data-module attribute
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-module]').forEach((element) => {
    const moduleName = element.getAttribute('data-module');

    // Dynamically import the corresponding module based on the data-module value
    import(`../modules/${moduleName}.js`)
      .then((module) => {
        if (module && typeof module.default === 'function') {
          module.default(element);
        }
      })
      .catch((error) => {
        console.error(`Failed to load module: ${moduleName}`, error);
      });
  });
});
