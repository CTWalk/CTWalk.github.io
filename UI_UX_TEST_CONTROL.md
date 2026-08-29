# UI/UX Deterministic Test Control

Issue: #7  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`

## Purpose

This file documents the test-only browser control exposed by `ui-ux-test-control.js`.

The control exists so later Playwright tests can ask for semantic UI states instead of hard-coding page-level scroll pixels or duplicating the portfolio timeline constants.

It is not a production UI feature and it does not own any animation implementation.

## Activation

The test control is loaded only when the page URL contains:

```text
?uiux-test=1
```

Example:

```text
http://127.0.0.1:4173/?uiux-test=1
```

Without that query parameter, `site-bootstrap.js` does not request `ui-ux-test-control.js` and `window.__portfolioTest` is not created.

The control is loaded after the existing production runtimes:

```text
social-runtime.js
commerce-integrated.js
outro-heatmap.js
typography-runtime.js
evidence-readability.js
experience-pacing.js
ui-ux-test-control.js   <- test mode only
```

This ordering is intentional. The test layer observes the final effective UI rather than competing with runtime initialization.

## Browser-owned setup

The Playwright caller remains responsible for configuration that must exist before page JavaScript runs:

- viewport size;
- `prefers-reduced-motion` media preference;
- browser/context settings.

The page control owns semantic navigation after load.

Example Playwright context intent:

```js
const page = await context.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.emulateMedia({ reducedMotion: 'no-preference' });
await page.goto(`${baseUrl}/?uiux-test=1`);
```

For reduced motion:

```js
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${baseUrl}/?uiux-test=1`);
```

Do not switch reduced-motion preference after the page has initialized and assume every runtime will reconstruct itself. Create/navigate the page with the intended media preference first.

## Readiness

Wait for the API to exist, then call `ready()`:

```js
await page.waitForFunction(() => Boolean(window.__portfolioTest));

const state = await page.evaluate(() => window.__portfolioTest.ready());
```

`ready()` waits for document fonts, checks visible image readiness, flushes animation frames, and returns the current test state.

A result with `assetsReady: false` is not suitable for approving a visual baseline.

`waitForAssets()` is also available independently if a test intentionally changes state and wants to re-check evidence loading before capture.

## Locale

```js
await page.evaluate(() => window.__portfolioTest.setLanguage('en'));
await page.evaluate(() => window.__portfolioTest.setLanguage('zh-TW'));
```

The control uses the portfolio's existing language mechanism. It does not rewrite copy, line breaks, or typography rules.

Both EN and zh-TW must use the same checkpoint IDs for equivalent baseline coverage.

## Scene navigation

Supported semantic scene IDs:

```text
intro
commerce
nocode
social
cuesheet
dca
outro
```

### Representative scene position

```js
await page.evaluate(() => window.__portfolioTest.goToScene('social'));
```

### Normalized visible-scene progress

```js
await page.evaluate(() => window.__portfolioTest.setSceneProgress('commerce', 0.35));
```

The normalized value is relative to the scene's discovered visible range. It is not a copied production timeline phase and must not be treated as a permanent motion specification.

Use semantic checkpoints for golden visual tests whenever one exists.

## Semantic checkpoints

The current API exposes the checkpoint IDs defined by the baseline program, including:

```text
intro.settled

commerce.checkout-event
commerce.quiet-after-checkout
commerce.expired-promo
commerce.unavailable
commerce.final-settled
commerce.reduced

nocode.yaml-readable
nocode.execution
nocode.result-hold
nocode.reduced

social.product
social.database
social.web
social.final-phone
social.reduced

cuesheet.workspace
cuesheet.conflict
cuesheet.review
cuesheet.reduced

dca.early-contribution
dca.phrased-hold
dca.late-contribution
dca.scanner-handoff
dca.pass
dca.reduced

outro.settled
outro.reduced
```

Query the runtime list rather than maintaining another test-side copy when practical:

```js
const checkpointIds = await page.evaluate(
  () => window.__portfolioTest.checkpointIds
);
```

Navigate with:

```js
const result = await page.evaluate(
  () => window.__portfolioTest.goToCheckpoint('social.database')
);
```

For normal-motion checkpoints, the control:

1. discovers the scene's actual visible range from the running production controller;
2. searches only the relevant part of that range;
3. scores observable rendered state such as phone/image/label/result visibility;
4. includes parent scene visibility in scoring so a child cannot win while the scene is fading away;
5. leaves the page at the best semantic state;
6. waits for stable computed visual state.

The test harness does not contain the production `durations` array.

## Reduced-motion checkpoints

Reduced checkpoint IDs require the page to have been initialized with `prefers-reduced-motion: reduce`.

Example:

```js
await page.emulateMedia({ reducedMotion: 'reduce' });
await page.goto(`${baseUrl}/?uiux-test=1`);
await page.waitForFunction(() => Boolean(window.__portfolioTest));
await page.evaluate(() => window.__portfolioTest.ready());
await page.evaluate(() => window.__portfolioTest.goToCheckpoint('social.reduced'));
```

Calling a `.reduced` checkpoint in normal-motion mode throws intentionally.

## Visual settling

```js
const settle = await page.evaluate(
  () => window.__portfolioTest.waitForVisualSettle('cuesheet')
);
```

The settle detector observes computed styles on the relevant scene nodes across animation frames. It requires repeated stable signatures rather than relying on a fixed sleep as its primary synchronization mechanism.

The default bounded timeout is a failure guard, not the definition of readiness.

A visual test should treat `settled: false` as a harness/test failure rather than capturing anyway.

## State inspection

```js
const state = await page.evaluate(() => window.__portfolioTest.getState());
```

Useful fields include:

```text
enabled
reducedMotion
locale
viewport
documentProgress
sceneOpacities
checkpoints
scrollBehaviorOverride
```

This is diagnostic metadata. Tests should assert user-visible behavior rather than overfitting to these internal numbers.

## Production invariants

#7 must preserve all of the following:

- no visible debug panel;
- no new production animation writer;
- no rewritten EN or zh-TW content;
- no new language-specific wrap rule;
- no change to accepted motion timing/curves;
- no test-control network request in ordinary navigation;
- no dependency on GitHub Actions.

The only production bootstrap change is the conditional loader guarded by `?uiux-test=1`.

## Relationship to #4 Stage 2

The current control discovers production scene bounds and semantic state because the existing site still has multiple timeline/RAF owners.

If #4 Stage 2 later produces a canonical timeline/state API, #7 should be simplified to consume that API. The semantic checkpoint IDs and consumer-facing test calls should remain stable even if the internal discovery implementation is replaced.

## Relationship to #8

#8 should consume this API rather than build its own navigation math.

A typical visual test flow should be:

```text
create browser context with viewport/motion preference
-> navigate with ?uiux-test=1
-> ready()
-> setLanguage(locale)
-> goToCheckpoint(checkpointId)
-> verify settle/assets
-> capture/compare screenshot
```

No CI requirement is implied here. CI integration belongs to #10 after the local verification model is stable.
