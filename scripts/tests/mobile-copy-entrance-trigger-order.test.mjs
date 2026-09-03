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

test('normal-motion copy owns the accepted line entrance directly', () => {
  const block = cssBlock('.mobile-copy-line');

  assert.match(block, /opacity\s*:\s*0\s*;/, 'copy must start dim/invisible');
  assert.match(block, /filter\s*:\s*blur\(8px\)\s*;/, 'copy must start soft');
  assert.match(block, /transform\s*:\s*translateY\(7px\)\s*;/, 'copy must start slightly displaced');
  assert.match(
    block,
    /animation\s*:\s*mobileCopyLineIn\s+1\.08s\s+cubic-bezier\(\.22,\.72,\.24,1\)\s+var\(--line-delay,0ms\)\s+both\s*;/,
    'normal-motion lines must own the accepted mobileCopyLineIn animation without a separate arming state'
  );
});

test('accepted keyframe texture remains unchanged', () => {
  assert.match(
    source,
    /@keyframes mobileCopyLineIn\{\s*0%\{opacity:0;filter:blur\(8px\);transform:translateY\(7px\)\}\s*46%\{opacity:\.38;filter:blur\(3\.5px\);transform:translateY\(3px\)\}\s*100%\{opacity:1;filter:blur\(0\);transform:translateY\(0\)\}\s*\}/,
    'the accepted opacity/blur/vertical-travel keyframes must remain intact'
  );
});

test('reduced-motion and uiux-test mode settle copy immediately', () => {
  assert.match(
    source,
    /if\s*\(reducedMotion\s*\|\|\s*testMode\)\s*fallback\.classList\.add\('copy-static'\)/,
    'reduced-motion and deterministic test mode must apply copy-static before copy lines are rendered'
  );

  const block = cssBlock('.mobile-fallback.copy-static .mobile-copy-line');
  assert.match(block, /opacity\s*:\s*1\s*;/, 'static copy must be fully visible');
  assert.match(block, /filter\s*:\s*none\s*;/, 'static copy must not remain blurred');
  assert.match(block, /transform\s*:\s*none\s*;/, 'static copy must not remain displaced');
  assert.match(block, /animation\s*:\s*none\s*;/, 'static copy must not animate');
});

test('line rendering preserves the accepted stagger values', () => {
  const renderBody = functionBody('renderLines');
  assert.match(renderBody, /node\.replaceChildren\(\)/, 'language rendering must replace old line nodes');
  assert.match(renderBody, /span\.className=`mobile-copy-line \$\{lineClass\}`/, 'each rendered line must receive the animation class');
  assert.match(
    renderBody,
    /--line-delay[^\n]*startDelay\+index\*stepDelay/,
    'each rendered line must receive its staggered delay'
  );

  const syncBody = functionBody('syncLanguage');
  assert.match(syncBody, /renderLines\(title,strings\.titleLines,120,145,'mobile-title-line'\)/, 'title stagger must remain 120ms + 145ms per line');
  assert.match(syncBody, /renderLines\(message,strings\.messageLines,760,135,'mobile-message-line'\)/, 'guidance stagger must remain 760ms + 135ms per line');
});

test('language switching replays by replacing the animated line elements', () => {
  assert.match(
    source,
    /syncLanguage\(\);\s*const languageObserver=new MutationObserver\(syncLanguage\);\s*languageObserver\.observe\(html,\{attributes:true,attributeFilter:\['lang'\]\}\)/,
    'startup must render once and language mutations must replace the line nodes through syncLanguage'
  );
});

test('disproven presentation-gating machinery is not part of the contract', () => {
  for (const legacyToken of [
    'scheduleInitialCopyEntrance',
    'copyPresentationReady',
    "addEventListener('pagereveal'",
    "addEventListener('pageshow'",
    'armCopyEntrance',
    "classList.add('copy-enter')",
    'copyEntranceFrame1',
    'copyEntranceFrame2'
  ]) {
    assert.equal(source.includes(legacyToken), false, `Legacy entrance trigger token must stay removed: ${legacyToken}`);
  }
});
