/* Scoring checks for the readiness check. Run: node tests/scoring.test.js */
const assert = require('assert');
global.window = {};
require('../assets/js/calculator-data.js');
const F = window.FMR, D = F.DIMENSIONS;

const fill = v => { const a = {}; D.forEach(d => { a[d.key+'-0'] = v; a[d.key+'-1'] = v; }); return a; };
const keys = D.flatMap(d => [d.key+'-0', d.key+'-1']);
const rnd = (n => () => (n = (n * 1664525 + 1013904223) >>> 0) / 2 ** 32)(42);
let checks = 0;

function verify(a) {
  const r = F.score(a), goal = 'Test goal';
  const hand = D.reduce((s, d) => s + ((a[d.key+'-0'] + a[d.key+'-1']) / 2 / 10) * d.weight, 0);
  assert(Math.abs(r.exact - hand) < 1e-9, 'total matches the published formula');
  assert(Number.isInteger(r.total) && r.total >= 0 && r.total <= 100, 'whole number 0-100');
  assert.strictEqual(r.total + r.resistance, 100, 'score + resistance = 100');
  const band = F.BANDS.find(b => r.total >= b.min);
  assert.strictEqual(r.band.name, band.name, 'band follows the displayed score');
  if (r.blocker) r.dims.forEach(d => assert(d.lost <= r.blocker.lost, 'blocker has the largest drag'));
  if (r.strongest) r.dims.forEach(d => assert(d.score <= r.strongest.score, 'strongest has the top score'));
  const composite = r.composites.reduce((s, c) => s + c.weight, 0);
  assert.strictEqual(composite, 100, 'five areas cover all 100 points');
  // identical input, identical output
  assert.deepStrictEqual(F.score({ ...a }), r);
  assert.deepStrictEqual(F.reading({ ...a }, goal), F.reading(a, goal));
  assert.strictEqual(F.reportText({ ...a }, goal, 'd'), F.reportText(a, goal, 'd'));
  const text = F.reading(a, goal).join(' ') + F.nextActions(r).map(x => x.text).join(' ');
  assert(!/undefined|NaN|null/.test(text), 'no broken text');
  assert(!/probability of|you will (definitely )?achieve|guarantee/i.test(F.reading(a, goal).join(' ')), 'no predictive wording');
  checks++;
}

assert.strictEqual(F.totalWeight, 100);

// all answers the same, at every value
for (let v = 0; v <= 10; v++) verify(fill(v));

// every value on every single question, others at each flat level
for (let base = 0; base <= 10; base++)
  for (const k of keys) for (let v = 0; v <= 10; v++) verify({ ...fill(base), [k]: v });

// every pair of answers across every pair of dimensions
for (let i = 0; i < D.length; i++) for (let j = i + 1; j < D.length; j++)
  for (let x = 0; x <= 20; x++) for (let y = 0; y <= 20; y++) {
    const a = fill(5);
    a[D[i].key+'-0'] = Math.floor(x/2); a[D[i].key+'-1'] = Math.ceil(x/2);
    a[D[j].key+'-0'] = Math.floor(y/2); a[D[j].key+'-1'] = Math.ceil(y/2);
    verify(a);
  }

// a large random sample of whole forms
for (let n = 0; n < 500000; n++) {
  const a = {}; keys.forEach(k => { a[k] = Math.floor(rnd() * 11); }); verify(a);
}

// known answers
assert.strictEqual(F.score(fill(0)).total, 0);
assert.strictEqual(F.score(fill(10)).total, 100);
assert.strictEqual(F.score(fill(5)).total, 50);
assert.strictEqual(F.score(fill(0)).blocker.name, 'Action');
assert.strictEqual(F.score(fill(0)).strongest, null);
assert.strictEqual(F.score(fill(10)).blocker, null);

// edge wording
assert(F.reading(fill(10), 'g')[0].includes('top of the scale'));
assert(F.reading(fill(0), 'g')[0].includes('bottom of the scale'));
assert(F.score(fill(5)).flat);

// incomplete forms are recognised
const partial = fill(5); delete partial['belief-1'];
assert.strictEqual(F.isComplete(partial), false);
assert.strictEqual(F.isComplete(fill(5)), true);
assert.strictEqual(F.isComplete({ ...fill(5), 'focus-0': 11 }), false);

console.log('All scoring checks passed:', checks.toLocaleString(), 'answer sets');
