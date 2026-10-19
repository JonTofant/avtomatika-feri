const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/scroll-scene.js'), 'utf8');

test('measured sizing handles content reflow and does not rewrite unchanged styles', () => {
  const window = { innerHeight: 768 };
  vm.runInNewContext(source, { window });
  const values = {}; let writes = 0;
  const section = { style: { setProperty(k, v) { values[k] = v; writes++; } } };
  const stage = { offsetHeight: 850 };
  assert.equal(window.ScrollScene.measure(section, stage), -82);
  assert.equal(values['--stage-height'], '850px');
  window.ScrollScene.measure(section, stage);
  assert.equal(writes, 2);
  stage.offsetHeight = 950;
  assert.equal(window.ScrollScene.measure(section, stage), -182);
  window.innerHeight = 1080;
  assert.equal(window.ScrollScene.measure(section, stage), 0);
  assert.equal(values['--sticky-top'], '0px');
});

test('stage resize observations schedule a fresh frame when layout changes', () => {
  let callback, observed, scheduled = 0;
  const window = { ResizeObserver: class {
    constructor(fn) { callback = fn; }
    observe(stage) { observed = stage; }
  } };
  vm.runInNewContext(source, { window });
  const stage = {};
  window.ScrollScene.observe(stage, () => scheduled++);
  assert.equal(observed, stage);
  callback(); assert.equal(scheduled, 1);
  delete window.ResizeObserver;
  assert.doesNotThrow(() => window.ScrollScene.observe(stage, () => {}));
});

test('media changes work with both modern and older Safari listeners', () => {
  const window = {};
  vm.runInNewContext(source, { window });
  let modern, legacy;
  const schedule = () => {};
  window.ScrollScene.listen({ addEventListener(event, fn) { assert.equal(event, 'change'); modern = fn; } }, schedule);
  window.ScrollScene.listen({ addListener(fn) { legacy = fn; } }, schedule);
  assert.equal(modern, schedule); assert.equal(legacy, schedule);
});

test('all scenes share a width-only breakpoint and include a viewport-height fallback', () => {
  const css = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
  for (const name of ['hero', 'robotics', 'fiber']) {
    const js = fs.readFileSync(path.join(__dirname, `../js/${name}.js`), 'utf8');
    assert(js.includes("matchMedia('(min-width: 900px)')"));
    assert(!js.includes('min-height: 900px'));
  }
  assert(!css.includes('100svh'));
  assert(!css.includes('min-height: 900px'));
  assert.equal((css.match(/@media \(min-width: 900px\) \{/g) || []).length, 3);
  for (const selector of ['.hero.is-ready', '.robotics.is-ready', '.photonics.is-ready']) {
    assert(css.includes(`${selector} { height: calc(var(--stage-height, 100vh)`));
    assert(css.includes(`${selector} { height: auto; }`), 'reduced motion removes pinning');
  }
});
