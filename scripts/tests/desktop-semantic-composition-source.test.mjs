import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');

test('approved English headlines keep their authored semantic breaks', () => {
  const source = read('english-copy.js');
  const expected = [
    "introTitle: 'I test software\\nFrom UI to DB'",
    "commerceTitle: 'One flow\\nChecked all the way through'",
    "nocodeTitle: 'Readable tests\\nMaintainable locators'",
    "socialTitle: 'One release path\\nEvidence at every layer'",
    "cueTitle: 'Replan the rehearsal\\nKeep it stable'",
    "recentTitle: 'Same QA questions\\nNewer kind of system'",
    "outroTitle: 'More of my work is on GitHub'"
  ];

  expected.forEach(text => assert.ok(source.includes(text), `missing approved copy: ${text}`));
});

test('desktop typography turns authored breaks into indivisible visual lines', () => {
  const source = read('assets/js/typography-runtime.js');

  assert.match(source, /data-semantic-lines="true"/);
  assert.match(source, /semantic-title-line/);
  assert.match(source, /white-space:nowrap/);
  assert.match(source, /raw\.split\('\\n'\)/);
  assert.match(source, /button\.addEventListener\('click', syncSemanticHeadlineLines\)/);
});

test('CueSheet keeps the historical layered evidence geometry and continuous focus transfer', () => {
  const source = read('assets/js/evidence-readability.js');

  assert.ok(source.includes('width:min(64vw,880px)'));
  assert.ok(source.includes('height:min(74vh,710px)'));
  assert.ok(source.includes('cueFocus = damp(cueFocus, cueTarget, 9.5, dt)'));
  assert.ok(source.includes('cueContextYield = damp(cueContextYield, contextTarget, 10.5, dt)'));
  assert.ok(!source.includes('width:min(53vw,740px)'));
  assert.ok(!source.includes('width:min(390px'));
});
