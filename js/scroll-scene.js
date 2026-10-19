/* Shared sizing for sticky scenes. Content taller than the viewport scrolls
   into view first, then pins at its bottom edge for the full animation distance. */
(() => {
  'use strict';
  const sizes = new WeakMap();
  window.ScrollScene = {
    measure(section, stage) {
      const height = stage.offsetHeight;
      const top = Math.min(0, window.innerHeight - height);
      const previous = sizes.get(section);
      if (!previous || previous.height !== height || previous.top !== top) {
        section.style.setProperty('--stage-height', `${height}px`);
        section.style.setProperty('--sticky-top', `${top}px`);
        sizes.set(section, { height, top });
      }
      return top;
    },
    observe(stage, schedule) {
      // Fonts, zoom and responsive reflow can change a stage without a scroll event.
      if (window.ResizeObserver) new window.ResizeObserver(schedule).observe(stage);
    },
    listen(query, schedule) {
      if (query.addEventListener) query.addEventListener('change', schedule);
      else query.addListener(schedule); // Older Safari MediaQueryList API.
    }
  };
})();
