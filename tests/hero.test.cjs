/* Run with: node --test tests/hero.test.cjs
   These tests cover scroll/event behavior and tracking geometry without a browser. */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/hero.js'), 'utf8');

function fixture({ reduced = false, pinned = true } = {}) {
  const events = {};
  const frames = [];
  let heroTop = 0;
  let sceneTop = 700;
  const nodes = {};
  const ids = ['drone-path', 'satellite-path', 'drone-target', 'drone-body', 'radar-dish', 'radar-beam', 'radar-line', 'satellite', 'sar-beam', 'sar-footprint'];
  for (const id of ids) nodes[id] = { attrs: {}, setAttribute(key, value) { this.attrs[key] = value; } };
  // SVG path geometry is native to browsers; fixtures supply deterministic curved paths.
  nodes['drone-path'].getTotalLength = () => 100;
  nodes['drone-path'].getPointAtLength = length => ({ x: 80 + length * 4.4, y: 140 - Math.sin(length / 100 * Math.PI * 2) * 55 });
  nodes['satellite-path'].getTotalLength = () => 100;
  nodes['satellite-path'].getPointAtLength = length => ({ x: 300 - 230 * Math.cos(length / 100 * Math.PI), y: 183 - 123 * Math.sin(length / 100 * Math.PI) });
  const stage = { offsetHeight: 900 };
  const scene = { getBoundingClientRect: () => ({ top: sceneTop, height: 350 }) };
  const hero = {
    offsetHeight: 1550,
    getBoundingClientRect: () => ({ top: heroTop }),
    querySelector: selector => selector === '.hero-stage' ? stage : scene
  };
  const reducedQuery = { matches: reduced, addEventListener: (_, callback) => { events.motion = callback; } };
  const pinnedQuery = { matches: pinned, addEventListener: (_, callback) => { events.layout = callback; } };
  const window = {
    innerHeight: 900,
    matchMedia: query => query.includes('reduced-motion') ? reducedQuery : pinnedQuery,
    addEventListener: (event, callback) => { events[event] = callback; },
    requestAnimationFrame: callback => { frames.push(callback); return frames.length; }
  };
  vm.runInNewContext(source, { document: { querySelector: () => hero, getElementById: id => nodes[id] }, window });
  const flush = () => { while (frames.length) frames.shift()(); };
  return {
    nodes, frames, events, reducedQuery,
    scroll(progress) { heroTop = -650 * progress; events.scroll(); flush(); },
    mobileScroll(top) { sceneTop = top; events.scroll(); flush(); },
    flush,
    snapshot() { return JSON.stringify(Object.fromEntries(ids.map(id => [id, nodes[id].attrs]))); }
  };
}

function translate(node) {
  return node.attrs.transform.match(/translate\(([-\d.]+) ([-\d.]+)\)/).slice(1).map(Number);
}

test('drone follows its route, radar points to its exact position, and scrolling reverses', () => {
  const f = fixture();
  f.scroll(0.25);
  const first = f.snapshot();
  const [x, y] = translate(f.nodes['drone-target']);
  assert.equal(f.nodes['radar-line'].attrs.d, `M95.00 264.00 L${x.toFixed(2)} ${y.toFixed(2)}`);
  const angle = Number(f.nodes['radar-dish'].attrs.transform.match(/rotate\(([-\d.]+)\)/)[1]);
  assert.ok(Math.abs(angle - Math.atan2(y - 264, x - 95) * 180 / Math.PI) < 0.01);
  f.scroll(0.8);
  assert.notEqual(f.snapshot(), first);
  f.scroll(0.25);
  assert.equal(f.snapshot(), first);
});

test('satellite travels left to right and the SAR footprint remains on Earth', () => {
  const f = fixture();
  let previousX = -Infinity;
  for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
    f.scroll(progress);
    const [x] = translate(f.nodes.satellite);
    assert.ok(x > previousX);
    previousX = x;
    const [sx, sy, ex, ey] = f.nodes['sar-footprint'].attrs.d.match(/M([-\d.]+) ([-\d.]+) A103 103 0 0 1 ([-\d.]+) ([-\d.]+)/).slice(1).map(Number);
    for (const [px, py] of [[sx, sy], [ex, ey]]) assert.ok(Math.abs(Math.hypot(px - 300, py - 183) - 103) < 0.02);
  }
});

test('motion clamps outside the hero and coalesces scroll events into one frame', () => {
  const f = fixture();
  const start = f.snapshot();
  f.scroll(-2);
  assert.equal(f.snapshot(), start);
  f.scroll(1);
  const end = f.snapshot();
  f.scroll(3);
  assert.equal(f.snapshot(), end);
  f.events.scroll(); f.events.scroll(); f.events.resize();
  assert.equal(f.frames.length, 1);
  f.flush();
  assert.equal(f.frames.length, 0);
});

test('small-screen scenes animate and reverse without pinning', () => {
  const f = fixture({ pinned: false });
  f.mobileScroll(600);
  const first = f.snapshot();
  f.mobileScroll(100);
  assert.notEqual(f.snapshot(), first);
  f.mobileScroll(600);
  assert.equal(f.snapshot(), first);
});

test('reduced-motion preference keeps a static scene and responds to preference changes', () => {
  const f = fixture({ reduced: true });
  const first = f.snapshot();
  f.scroll(1);
  assert.equal(f.snapshot(), first);
  f.reducedQuery.matches = false;
  f.events.motion(); f.flush();
  assert.notEqual(f.snapshot(), first);
});

test('script is safe on pages without the hero', () => {
  assert.doesNotThrow(() => vm.runInNewContext(source, { document: { querySelector: () => null } }));
});
