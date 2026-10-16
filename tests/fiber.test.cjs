const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/fiber.js'), 'utf8');

function fixture({ reduced = false, pinned = true } = {}) {
  const events = {}, frames = [];
  let top = 0;
  const node = () => ({ attrs: {}, style: {}, setAttribute(k, v) { this.attrs[k] = v; } });
  const nodes = Object.fromEntries(['fiber-preform', 'fiber-flow', 'fiber-reel', 'fiber-winding'].map(id => [id, node()]));
  nodes['fiber-world'] = { ...node(), getBoundingClientRect: () => ({ top, height: 560 }) };
  const rollers = [1, -1].map(direction => ({ ...node(), dataset: { fiberRoller: String(direction) } }));
  const bar = node();
  const section = {
    offsetHeight: 1500, classList: { add() {} }, getBoundingClientRect: () => ({ top }),
    querySelector: s => s === '.photonics-stage' ? { offsetHeight: 900 } : bar,
    querySelectorAll: () => rollers
  };
  const motion = { matches: reduced, addEventListener: (_, f) => { events.motion = f; } };
  const layout = { matches: pinned, addEventListener: (_, f) => { events.layout = f; } };
  vm.runInNewContext(source, {
    document: { querySelector: () => section, getElementById: id => nodes[id] },
    window: { innerHeight: 900, matchMedia: q => q.includes('reduced-motion') ? motion : layout,
      addEventListener: (e, f) => { events[e] = f; },
      requestAnimationFrame: f => { frames.push(f); return frames.length; }
    }
  });
  const flush = () => { while (frames.length) frames.shift()(); };
  return { nodes, rollers, motion, events, frames, flush,
    scroll(p) { top = pinned ? -600 * p : 900 * .85 - p * (560 + 900 * .55); events.scroll(); flush(); },
    snapshot: () => JSON.stringify([nodes, rollers, bar])
  };
}
const angle = node => Number(node.attrs.transform.match(/rotate\((-?[\d.]+)/)[1]);

test('feed, fiber and reel reverse together and clamp at the ends on both layouts', () => {
  for (const pinned of [true, false]) {
    const f = fixture({ pinned });
    f.scroll(0); const start = f.snapshot();
    f.scroll(-1); assert.equal(f.snapshot(), start);
    f.scroll(.25); const quarter = f.snapshot();
    f.scroll(.75); assert.notEqual(f.snapshot(), quarter);
    f.scroll(.25); assert.equal(f.snapshot(), quarter);
    f.scroll(1); const end = f.snapshot();
    f.scroll(2); assert.equal(f.snapshot(), end);
  }
});

test('traction rollers counter-rotate, take-up turns forward, and winding builds', () => {
  const f = fixture();
  f.scroll(.2);
  const start = angle(f.nodes['fiber-reel']);
  const width = Number(f.nodes['fiber-winding'].attrs['stroke-width']);
  f.scroll(.8);
  assert(angle(f.rollers[0]) > 0);
  assert.equal(angle(f.rollers[0]), -angle(f.rollers[1]));
  assert(angle(f.nodes['fiber-reel']) > start);
  assert(Number(f.nodes['fiber-winding'].attrs['stroke-width']) > width);
  assert(Number(f.nodes['fiber-flow'].attrs['stroke-dashoffset']) < 0);
});

test('reduced motion remains still, reacts to preference changes, and batches events', () => {
  const f = fixture({ reduced: true });
  const before = f.snapshot();
  f.scroll(.9); assert.equal(f.snapshot(), before);
  f.motion.matches = false; f.events.motion(); f.flush();
  assert.notEqual(f.snapshot(), before);
  f.events.scroll(); f.events.resize(); f.events.pageshow();
  assert.equal(f.frames.length, 1);
});

test('safe when the LEOSS section is absent', () => {
  assert.doesNotThrow(() => vm.runInNewContext(source, { document: { querySelector: () => null } }));
});
