/* Scroll illustrations. Edit the SVG paths in index.html to change the routes.
   No animation library, timer, scroll interception or continuous render loop. */
(() => {
  'use strict';

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const stage = hero.querySelector('.hero-stage');
  const droneScene = hero.querySelector('[data-scene="drone"]');
  const satelliteScene = hero.querySelector('[data-scene="satellite"]');
  const dronePath = document.getElementById('drone-path');
  const satellitePath = document.getElementById('satellite-path');
  const drone = document.getElementById('drone-target');
  const droneBody = document.getElementById('drone-body');
  const radarDish = document.getElementById('radar-dish');
  const radarBeam = document.getElementById('radar-beam');
  const radarLine = document.getElementById('radar-line');
  const satellite = document.getElementById('satellite');
  const sarBeam = document.getElementById('sar-beam');
  const sarFootprint = document.getElementById('sar-footprint');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pinnedLayout = window.matchMedia('(min-width: 900px)');

  const RADAR = { x: 95, y: 264 };
  const EARTH = { x: 300, y: 183, radius: 103 };
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
  const degrees = radians => radians * 180 / Math.PI;
  const point = p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
  const droneLength = dronePath.getTotalLength();
  const satelliteLength = satellitePath.getTotalLength();
  let pendingFrame = 0;
  let stickyTop = 0;

  function progressFor(scene) {
    if (reducedMotion.matches) return 0.48;
    if (pinnedLayout.matches) {
      const travel = hero.offsetHeight - stage.offsetHeight;
      return clamp((stickyTop - hero.getBoundingClientRect().top) / Math.max(1, travel));
    }
    // On smaller screens each illustration follows its own passage through the viewport.
    const rect = scene.getBoundingClientRect();
    return clamp((window.innerHeight * 0.85 - rect.top) / (rect.height + window.innerHeight * 0.55));
  }

  function drawDrone(progress) {
    const distance = progress * droneLength;
    const position = dronePath.getPointAtLength(distance);
    const before = dronePath.getPointAtLength(Math.max(0, distance - 2));
    const after = dronePath.getPointAtLength(Math.min(droneLength, distance + 2));
    const bank = clamp(degrees(Math.atan2(after.y - before.y, after.x - before.x)) * 0.2, -14, 14);
    drone.setAttribute('transform', `translate(${point(position)})`);
    droneBody.setAttribute('transform', `rotate(${bank.toFixed(2)})`);

    const angle = Math.atan2(position.y - RADAR.y, position.x - RADAR.x);
    const normal = { x: -Math.sin(angle) * 20, y: Math.cos(angle) * 20 };
    const left = { x: position.x + normal.x, y: position.y + normal.y };
    const right = { x: position.x - normal.x, y: position.y - normal.y };
    radarDish.setAttribute('transform', `translate(${point(RADAR)}) rotate(${degrees(angle).toFixed(2)})`);
    radarBeam.setAttribute('d', `M${point(RADAR)} L${point(left)} L${point(right)} Z`);
    radarLine.setAttribute('d', `M${point(RADAR)} L${point(position)}`);
  }

  function drawSatellite(progress) {
    const position = satellitePath.getPointAtLength(progress * satelliteLength);
    const radialAngle = Math.atan2(position.y - EARTH.y, position.x - EARTH.x);
    // A small angular offset illustrates side-looking SAR, rather than a nadir beam.
    const lookAngle = radialAngle + 0.25;
    const onEarth = angle => ({
      x: EARTH.x + EARTH.radius * Math.cos(angle),
      y: EARTH.y + EARTH.radius * Math.sin(angle)
    });
    const start = onEarth(lookAngle - 0.1);
    const end = onEarth(lookAngle + 0.1);
    const target = onEarth(lookAngle);
    const orientation = degrees(Math.atan2(target.y - position.y, target.x - position.x)) - 90;
    satellite.setAttribute('transform', `translate(${point(position)}) rotate(${orientation.toFixed(2)})`);
    sarBeam.setAttribute('d', `M${point(position)} L${point(start)} A103 103 0 0 1 ${point(end)} Z`);
    sarFootprint.setAttribute('d', `M${point(start)} A103 103 0 0 1 ${point(end)}`);
  }

  function render() {
    pendingFrame = 0;
    stickyTop = window.ScrollScene.measure(hero, stage);
    drawDrone(progressFor(droneScene));
    drawSatellite(progressFor(satelliteScene));
  }

  function scheduleRender() {
    if (!pendingFrame) pendingFrame = window.requestAnimationFrame(render);
  }

  hero.classList.add('is-ready');
  window.ScrollScene.observe(stage, scheduleRender);
  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', scheduleRender);
  window.addEventListener('pageshow', scheduleRender);
  window.ScrollScene.listen(reducedMotion, scheduleRender);
  window.ScrollScene.listen(pinnedLayout, scheduleRender);
  render();
})();
