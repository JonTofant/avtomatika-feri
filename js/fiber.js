/* A schematic draw tower. Scroll drives the feed, rollers and take-up reel.
   All moving parts share one clock, so reversing the page reverses the process. */
(() => {
  'use strict';
  const section = document.querySelector('.photonics');
  if (!section) return;
  const stage = section.querySelector('.photonics-stage');
  const scene = document.getElementById('fiber-world');
  const preform = document.getElementById('fiber-preform');
  const flow = document.getElementById('fiber-flow');
  const reel = document.getElementById('fiber-reel');
  const winding = document.getElementById('fiber-winding');
  const rollers = [...section.querySelectorAll('[data-fiber-roller]')];
  const bar = section.querySelector('.fiber-progress span');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinned = window.matchMedia('(min-width: 1000px) and (min-height: 900px)');
  const clamp = n => Math.max(0, Math.min(1, n));
  let frame = 0;

  function render() {
    frame = 0;
    const rect = scene.getBoundingClientRect();
    const progress = reduced.matches ? .45 : pinned.matches
      ? clamp(-section.getBoundingClientRect().top / Math.max(1, section.offsetHeight - stage.offsetHeight))
      : clamp((window.innerHeight * .85 - rect.top) / (rect.height + window.innerHeight * .55));
    const drawn = progress * 720;
    // Feed marks descend inside the glass; the heated neck stays in the furnace.
    preform.setAttribute('transform', `translate(0 ${(progress * 24).toFixed(2)})`);
    flow.setAttribute('stroke-dashoffset', (-drawn).toFixed(2));
    reel.setAttribute('transform', `rotate(${(drawn / 52 * 180 / Math.PI).toFixed(2)} 465 430)`);
    winding.setAttribute('stroke-width', (5 + progress * 11).toFixed(2));
    rollers.forEach(roller => {
      const direction = Number(roller.dataset.fiberRoller);
      roller.setAttribute('transform', `rotate(${(direction * drawn / 18 * 180 / Math.PI).toFixed(2)})`);
    });
    bar.style.transform = `scaleX(${progress})`;
  }

  function schedule() { if (!frame) frame = window.requestAnimationFrame(render); }
  section.classList.add('is-ready');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  [reduced, pinned].forEach(query => query.addEventListener('change', schedule));
  render();
})();
