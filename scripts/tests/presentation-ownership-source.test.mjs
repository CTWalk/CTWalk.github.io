import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');
const read = (...parts) => readFileSync(resolve(repoRoot, ...parts), 'utf8');

const indexSource = read('index.html');
const bootstrapSource = read('site-bootstrap.js');
const mobileSource = read('assets', 'js', 'mobile-fallback.js');
const evidenceSource = read('assets', 'js', 'evidence-readability.js');
const commerceSource = read('assets', 'js', 'commerce-integrated.js');

function assertInOrder(source, tokens, message) {
  let cursor = -1;
  for (const token of tokens) {
    const next = source.indexOf(token, cursor + 1);
    assert.notEqual(next, -1, `${message}: missing ${token}`);
    assert.ok(next > cursor, `${message}: ${token} is out of order`);
    cursor = next;
  }
}

test('760px is the single presentation ownership breakpoint', () => {
  assert.match(bootstrapSource, /const MOBILE_QUERY = '\(max-width: 760px\)'/);
  assert.match(indexSource, /const desktopPresentation=!window\.matchMedia\('\(max-width: 760px\)'\)\.matches/);
  assert.match(mobileSource, /if \(!window\.matchMedia\('\(max-width: 760px\)'\)\.matches\) return;/);
});

test('mobile CSS hides the desktop experience before runtime ownership settles', () => {
  assert.match(
    indexSource,
    /@media\(max-width:760px\)\{[\s\S]*?\.experience\{display:none!important\}/,
    'mobile first paint must not expose the desktop experience'
  );
  assert.match(indexSource, /html,body\{background:#050609\}/);
});

test('desktop evidence is deferred on mobile and hydrated only for desktop presentation', () => {
  const deferredAssets = indexSource.match(/data-desktop-src=/g) || [];
  assert.ok(deferredAssets.length >= 10, 'expected desktop evidence assets to be deferred through data-desktop-src');
  assert.match(
    indexSource,
    /if\(desktopPresentation\)\{\s*document\.querySelectorAll\('#experience img\[data-desktop-src\]'\)\.forEach\(image=>\{image\.src=image\.dataset\.desktopSrc\}\);/,
    'desktop assets must hydrate only inside the desktop ownership guard'
  );
});

test('desktop scene controller starts only inside the desktop ownership guard', () => {
  assert.match(
    indexSource,
    /const desktopPresentation=!window\.matchMedia\('\(max-width: 760px\)'\)\.matches;\s*if\(desktopPresentation\)\{[\s\S]*?requestAnimationFrame\(renderExperience\)[\s\S]*?\}/,
    'desktop RAF/controller startup must be guarded by desktopPresentation'
  );
});

test('mobile bootstrap no longer needs to cancel an already-running desktop controller', () => {
  assert.equal(bootstrapSource.includes('unable to stop desktop scene frame'), false);
  assert.equal(bootstrapSource.includes('stopImmediatePropagation'), false);
  assert.match(bootstrapSource, /html\.dataset\.presentation = 'mobile-fallback'/);
  assert.match(bootstrapSource, /experience\.hidden = true/);
  assert.match(bootstrapSource, /experience\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(bootstrapSource, /webgl\.removeAttribute\('id'\)/);
  assert.match(bootstrapSource, /loadSafely\('\.\/assets\/js\/mobile-fallback\.js'\)/);
  assert.match(bootstrapSource, /loadSafely\('\.\/scripts\/controls\/ui-ux-mobile-test-control\.js'\)/);
});

test('breakpoint crossing reloads to rebuild presentation ownership cleanly', () => {
  assert.match(
    bootstrapSource,
    /mobileQuery\.addEventListener\('change', event => \{[\s\S]*?if \(nextPresentation !== presentationAtLoad\) window\.location\.reload\(\);[\s\S]*?\}\);/
  );
});

test('desktop runtime initialization order remains the approved ff06 order', () => {
  assertInOrder(
    bootstrapSource,
    [
      "html.dataset.presentation = 'desktop'",
      "loadSafely('./assets/js/social-runtime.js')",
      "loadSafely('./assets/js/commerce-integrated.js')",
      "loadSafely('./assets/js/outro-heatmap.js')",
      "loadSafely('./assets/js/typography-runtime.js')",
      "loadSafely('./assets/js/evidence-readability.js')",
      "loadSafely('./assets/js/experience-pacing.js')",
      "loadSafely('./scripts/controls/ui-ux-test-control.js')"
    ],
    'desktop runtime order'
  );
});

test('accepted ff06 CueSheet desktop geometry stays anchored', () => {
  assert.match(evidenceSource, /width:min\(53vw,740px\)/);
  assert.equal(evidenceSource.includes('width:min(51vw,720px)'), false);
});

test('Commerce reduced-motion representative image selector keeps the specificity fix', () => {
  assert.match(
    commerceSource,
    /\.commerce-phone-screen img\.commerce-phone-expired\{opacity:1!important\}/
  );
});
