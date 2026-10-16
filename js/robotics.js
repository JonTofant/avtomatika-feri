/* Scroll position is the single clock: travel, wheels and feet reverse together. */
(() => {
  'use strict';
  const section = document.querySelector('.robotics');
  if (!section) return;
  const stage = section.querySelector('.robotics-stage');
  const world = document.getElementById('robotics-world');
  const actors = ['robot-wheeled', 'robot-biped', 'robot-quadruped'].map(id => document.getElementById(id));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinned = window.matchMedia('(min-width: 1000px) and (min-height: 900px)');
  const compact = window.matchMedia('(max-width: 700px)');
  const progressBar = section.querySelector('.robotics-progress span');
  const wheels = [...section.querySelectorAll('.robot-wheel')];
  const body = document.getElementById('biped-body');
  const wheelBody = document.getElementById('wheeled-body');
  const quadBody = document.getElementById('quad-body');
  const arm = document.getElementById('biped-arm');
  const legs = [...section.querySelectorAll('[data-leg]')].map(group => ({
    name: group.dataset.leg,
    path: group.querySelector('.robot-link'),
    knee: group.querySelector('.robot-joint'),
    foot: group.querySelector('.robot-foot')
  }));
  const clamp = n => Math.max(0, Math.min(1, n));
  const point = (x, y) => `${x.toFixed(2)} ${y.toFixed(2)}`;
  let frame = 0;

  function legPose(leg, cycle, bob) {
    const biped = leg.name.startsWith('biped');
    const front = leg.name.includes('front');
    const far = leg.name.includes('far');
    // Diagonal pairs share a phase; the two biped legs alternate.
    const offset = biped ? (front ? 0 : .5) : (front !== far ? 0 : .5);
    const phase = ((cycle + offset) % 1 + 1) % 1;
    const hipX = biped ? 0 : (front ? 49 : -49);
    const hipY = (biped ? -100 : -88) + bob;
    const stride = biped ? 60 : 48;
    const swing = phase >= .5;
    const t = swing ? (phase - .5) * 2 : phase * 2;
    // During stance, the foot moves backwards relative to the body at road speed.
    const footX = hipX + (swing ? -stride / 2 + stride * t : stride / 2 - stride * t);
    const footY = -5 - (swing ? Math.sin(t * Math.PI) * (biped ? 24 : 19) : 0);
    const dx = footX - hipX, dy = footY - hipY;
    const distance = Math.hypot(dx, dy);
    const length = biped ? 60 : 53;
    const bend = Math.sqrt(Math.max(0, length * length - distance * distance / 4));
    const direction = biped || !front ? 1 : -1;
    const kneeX = (hipX + footX) / 2 + direction * dy / distance * bend;
    const kneeY = (hipY + footY) / 2 - direction * dx / distance * bend;
    leg.path.setAttribute('d', `M${point(hipX, hipY)} L${point(kneeX, kneeY)} L${point(footX, footY)}`);
    leg.knee.setAttribute('cx', kneeX.toFixed(2));
    leg.knee.setAttribute('cy', kneeY.toFixed(2));
    leg.foot.setAttribute('d', `M${point(footX - 8, footY)} L${point(footX + (biped ? 15 : 8), footY)}`);
  }

  function render() {
    frame = 0;
    const width = compact.matches ? 600 : 1200;
    const scale = compact.matches ? .82 : 1;
    world.setAttribute('viewBox', `0 0 ${width} 370`);
    const rect = section.getBoundingClientRect();
    const sceneRect = world.getBoundingClientRect();
    const progress = reduced.matches ? 0 : pinned.matches
      ? clamp(-rect.top / Math.max(1, section.offsetHeight - stage.offsetHeight))
      : clamp((window.innerHeight * .85 - sceneRect.top) / (window.innerHeight * .55 + sceneRect.height));
    // A short, bounded journey keeps every robot visible for the entire scene.
    const travelRange = compact.matches ? 70 : 160;
    const travel = progress * travelRange;
    const cycle = travel / scale / 120;
    const bipedBob = -2 * Math.cos(cycle * Math.PI * 4);
    const quadCycle = travel / scale / 96;
    const quadBob = -1.5 * Math.cos(quadCycle * Math.PI * 4);
    actors.forEach((actor, i) => {
      const initial = width * (compact.matches ? .18 + i * .31 : (i + .5) / 3);
      const x = initial + (reduced.matches ? 0 : travel - travelRange / 2);
      actor.setAttribute('transform', `translate(${point(x, 305)}) scale(${scale})`);
    });
    wheels.forEach(wheel => wheel.setAttribute('transform', `rotate(${(travel / scale / 27 * 180 / Math.PI).toFixed(2)})`));
    wheelBody.setAttribute('transform', `rotate(${(Math.sin(cycle * Math.PI * 2) * 3).toFixed(2)} 0 -27)`);
    body.setAttribute('transform', `translate(0 ${bipedBob.toFixed(2)})`);
    quadBody.setAttribute('transform', `translate(0 ${quadBob.toFixed(2)})`);
    arm.setAttribute('transform', `rotate(${(Math.sin(cycle * Math.PI * 2) * 18).toFixed(2)} 21 -153)`);
    legs.forEach(leg => legPose(leg, leg.name.startsWith('biped') ? cycle : quadCycle, leg.name.startsWith('biped') ? bipedBob : quadBob));
    progressBar.style.transform = `scaleX(${progress})`;
  }
  function schedule() { if (!frame) frame = window.requestAnimationFrame(render); }
  section.classList.add('is-ready');
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('pageshow', schedule);
  [reduced, pinned, compact].forEach(query => query.addEventListener('change', schedule));
  render();
})();
