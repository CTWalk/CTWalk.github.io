import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const mobileFallbackPath = resolve(repoRoot, 'assets', 'js', 'mobile-fallback.js');
const source = readFileSync(mobileFallbackPath, 'utf8');

function cssBlock(selector) {
  const start = source.indexOf(selector);
  assert.notEqual(start, -1, `Expected CSS selector ${selector} in mobile-fallback.js`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  assert.notEqual(open, -1, `Expected opening brace for ${selector}`);
  assert.notEqual(close, -1, `Expected closing brace for ${selector}`);
  return source.slice(open + 1, close);
}

function functionBody(name) {
  const marker = `function ${name}`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `Expected ${marker} in mobile-fallback.js`);
  const open = source.indexOf('{', start);
  assert.notEqual(open, -1, `Expected opening brace for ${name}`);

  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(open + 1, index);
    }
  }

  assert.fail(`Could not find closing brace for ${name}`);
}

test('normal-motion copy is mounted in a hidden pre-animation state', () => {
  const block = cssBlock('.mobile-copy-line');

  assert.match(block, /opacity\s*:\s*0\s*;/, 'copy must start invisible before the first paint');
  assert.match(block, /filter\s*:\s*blur\(8px\)\s*;/, 'copy must start soft before the first paint');
  assert.match(block, /transform\s*:\s*translateY\(7px\)\s*;/, 'copy must start slightly displaced before the first paint');
  assert.doesNotMatch(
    block,
    /animation\s*:/,
    'base .mobile-copy-line must not auto-start the entrance during DOM insertion; animation ownership belongs to the armed state'
  );
});

test('animation is owned by an explicit armed state', () => {
  const block = cssBlock('.mobile-fallback.copy-enter .mobile-copy-line');

  assert.match(
    block,
    /animation\s*:\s*mobileCopyLineIn\s+1\.08s/,
    'the existing mobileCopyLineIn timing must begin only after .copy-enter is armed'
  );
});

test('armed state still waits for two animation frames before starting copy entrance', () => {
  const body = functionBody('armCopyEntrance');
  const firstFrame = body.indexOf('requestAnimationFrame');
  assert.notEqual(firstFrame, -1, 'armCopyEntrance must wait for a first requestAnimationFrame');

  const secondFrame = body.indexOf('requestAnimationFrame', firstFrame + 1);
  assert.notEqual(secondFrame, -1, 'armCopyEntrance must wait for a second requestAnimationFrame so the hidden state has a paint opportunity');

  const arm = body.indexOf("fallback.classList.add('copy-enter')");
  assert.notEqual(arm, -1, "armCopyEntrance must explicitly add 'copy-enter'");
  assert.ok(secondFrame < arm, "'copy-enter' must be added only after both requestAnimationFrame boundaries");
});

test('initial landing waits for a page-presentation boundary before arming', () => {
  const body = functionBody('scheduleInitialCopyEntrance');

  assert.match(
    body,
    /document\.readyState\s*===\s*'complete'/,
    'late-loaded runtime must detect when the page is already complete and presented'
  );
  assert.match(
    body,
    /'onpagereveal'\s+in\s+window/,
    'modern browsers must prefer the pagereveal presentation boundary when available'
  );
  assert.match(
    body,
    /addEventListener\('pagereveal'/,
    'supported browsers must wait for pagereveal before initial entrance arming'
  );
  assert.match(
    body,
    /addEventListener\('pageshow'/,
    'pageshow must remain as the non-missable fallback when pagereveal is unavailable or already passed'
  );

  const ready = body.indexOf('copyPresentationReady=true');
  const arm = body.indexOf('armCopyEntrance()');
  assert.notEqual(ready, -1, 'presentation readiness must be recorded explicitly');
  assert.notEqual(arm, -1, 'the presentation boundary must eventually arm copy entrance');
  assert.ok(ready < arm, 'presentation readiness must be established before armCopyEntrance runs');
});

test('startup renders localized lines then schedules presentation-gated entrance', () => {
  assert.match(
    source,
    /syncLanguage\(\);\s*scheduleInitialCopyEntrance\(\);/,
    'startup must render localized hidden lines before scheduling the presentation-gated entrance'
  );
  assert.doesNotMatch(
    source,
    /syncLanguage\(\);\s*armCopyEntrance\(\);\s*const languageObserver/,
    'startup must not directly arm the entrance during document construction'
  );
});

test('language changes cannot bypass the initial presentation gate', () => {
  assert.match(
    source,
    /const languageObserver=new MutationObserver\(\(\)=>\{\s*syncLanguage\(\);\s*if\(copyPresentationReady\)armCopyEntrance\(\);/,
    'language changes may replay the entrance only after the initial page-presentation boundary has been crossed'
  );
});

test('reduced-motion and uiux-test mode remain settled instead of entering', () => {
  assert.match(
    source,
    /if\s*\(reducedMotion\s*\|\|\s*testMode\)\s*fallback\.classList\.add\('copy-static'\)/,
    'static modes must keep their existing settled-copy bypass'
  );

  const armBody = functionBody('armCopyEntrance');
  assert.match(
    armBody,
    /if\s*\(reducedMotion\s*\|\|\s*testMode\)\s*return/,
    'armCopyEntrance must not animate in reduced-motion or deterministic test mode'
  );

  const scheduleBody = functionBody('scheduleInitialCopyEntrance');
  assert.match(
    scheduleBody,
    /if\s*\(reducedMotion\s*\|\|\s*testMode\)\s*return/,
    'static modes must not register presentation-trigger listeners for copy entrance'
  );
});
