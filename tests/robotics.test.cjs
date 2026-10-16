const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../js/robotics.js'), 'utf8');

function fixture({ reduced = false, compact = false } = {}) {
  const events = {}, frames = [];
  let top = 0;
  const node = () => ({ attrs: {}, style: {}, setAttribute(k, v) { this.attrs[k] = v; } });
  const ids = ['robot-wheeled', 'robot-biped', 'robot-quadruped', 'biped-body', 'wheeled-body', 'quad-body', 'biped-arm'];
  const nodes = Object.fromEntries(ids.map(id => [id, node()]));
  const legs = ['biped-front', 'biped-back', 'quad-back', 'quad-front', 'quad-back-far', 'quad-front-far'].map(name => {
    const parts = { '.robot-link': node(), '.robot-joint': node(), '.robot-foot': node() };
    return { name, parts, dataset: { leg: name }, querySelector: key => parts[key] };
  });
  const wheels = [node(), node()];
  nodes['robotics-world'] = { ...node(), getBoundingClientRect: () => ({ top, height: 370 }) };
  const bar = node();
  const section = {
    offsetHeight: 1800, classList: { add() {} }, getBoundingClientRect: () => ({ top }),
    querySelector: s => s === '.robotics-stage' ? { offsetHeight: 900 } : bar,
    querySelectorAll: s => s === '.robot-wheel' ? wheels : legs
  };
  const motion = { matches: reduced, addEventListener: (_, f) => { events.motion = f; } };
  const layout = { matches: !compact, addEventListener() {} };
  const phone = { matches: compact, addEventListener() {} };
  vm.runInNewContext(source, {
    document: { querySelector: () => section, getElementById: id => nodes[id] },
    window: {
      innerHeight: 900,
      matchMedia: q => q.includes('reduced-motion') ? motion : q.includes('max-width') ? phone : layout,
      addEventListener: (e, f) => { events[e] = f; },
      requestAnimationFrame: f => { frames.push(f); return frames.length; }
    }
  });
  const flush = () => { while (frames.length) frames.shift()(); };
  return {
    nodes, legs, frames, events, motion, flush,
    scroll(p) { top = compact ? 900 * .85 - p * (900 * .55 + 370) : -900 * p; events.scroll(); flush(); },
    snapshot: () => JSON.stringify([nodes, wheels, legs.map(l => l.parts), bar])
  };
}
const numbers = s => s.match(/-?\d+(?:\.\d+)?/g).map(Number);

test('travel, gait and wheel rotation reverse exactly with scroll', () => {
  const f = fixture();
  f.scroll(.1); const before = f.snapshot();
  f.scroll(.7); assert.notEqual(f.snapshot(), before);
  f.scroll(.1); assert.equal(f.snapshot(), before);
  f.scroll(1); const end = f.snapshot();
  f.scroll(2); assert.equal(f.snapshot(), end);
});

test('stance feet stay planted in world coordinates as the body advances', () => {
  const f = fixture();
  const positions = p => {
    f.scroll(p);
    return ['biped-front', 'quad-front'].map(name => {
      const leg = f.legs.find(l => l.name === name);
      const actor = name.startsWith('biped') ? 'robot-biped' : 'robot-quadruped';
      const x = numbers(f.nodes[actor].attrs.transform)[0];
      const foot = numbers(leg.parts['.robot-link'].attrs.d).slice(-2);
      assert.equal(foot[1], -5);
      return x + foot[0];
    });
  };
  const a = positions(.01), b = positions(.02);
  a.forEach((x, i) => assert(Math.abs(x - b[i]) < .02));
});

test('leg lengths remain fixed and feet never pass through the floor', () => {
  const f = fixture();
  for (let i = 0; i <= 40; i++) {
    f.scroll(i / 40);
    for (const leg of f.legs) {
      const [hx, hy, kx, ky, fx, fy] = numbers(leg.parts['.robot-link'].attrs.d);
      const length = leg.name.startsWith('biped') ? 60 : 53;
      assert(Math.abs(Math.hypot(hx - kx, hy - ky) - length) < .02);
      assert(Math.abs(Math.hypot(fx - kx, fy - ky) - length) < .02);
      assert(fy <= -5);
    }
  }
});

test('mobile keeps all three actors on screen and reverses', () => {
  const f = fixture({ compact: true });
  for (const p of [0, .5, 1]) {
    f.scroll(p);
    for (const id of ['robot-wheeled', 'robot-biped', 'robot-quadruped']) {
      const x = numbers(f.nodes[id].attrs.transform)[0];
      assert(x >= 65 && x <= 525);
    }
  }
  f.scroll(.2); const before = f.snapshot();
  f.scroll(.7); f.scroll(.2); assert.equal(f.snapshot(), before);
});

test('reduced motion stays static and scroll events coalesce', () => {
  const f = fixture({ reduced: true });
  const before = f.snapshot();
  f.scroll(.8); assert.equal(f.snapshot(), before);
  f.motion.matches = false; f.events.motion(); f.flush();
  assert.notEqual(f.snapshot(), before);
  f.events.scroll(); f.events.resize(); f.events.scroll();
  assert.equal(f.frames.length, 1);
});

test('safe on pages without the robotics section', () => {
  assert.doesNotThrow(() => vm.runInNewContext(source, { document: { querySelector: () => null } }));
});


test('all three complete robot silhouettes stay on stage for the entire scroll', () => {
  for (const compact of [false, true]) {
    const f = fixture({ compact });
    const width = compact ? 600 : 1200;
    const scale = compact ? .82 : 1;
    // Conservative half-widths include wheels, feet, swinging arms and the lidar body.
    const halfWidths = [62, 62, 96];
    for (let i = 0; i <= 100; i++) {
      f.scroll(i / 100);
      ['robot-wheeled', 'robot-biped', 'robot-quadruped'].forEach((id, n) => {
        const x = numbers(f.nodes[id].attrs.transform)[0];
        assert(x - halfWidths[n] * scale >= 0, `${id} left stage at ${i}%`);
        assert(x + halfWidths[n] * scale <= width, `${id} right stage at ${i}%`);
      });
    }
  }
});
