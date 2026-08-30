# UI/UX Deterministic Test Control

Issue: #7  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`  
Mobile presentation: #20  
Specification precedence: `UI_UX_SPEC_PRECEDENCE.md`

## Purpose

The test-only control lets Playwright request semantic rendered states without hard-coding page scroll pixels or duplicating production timeline constants.

The public browser contract remains:

```js
window.__portfolioTest
```

The implementation behind that API depends on the active presentation mode.

Where older documentation uses `Canvas` as shorthand for the mobile effect, the active production rendering contract is the WebGL perimeter-wave effect defined by `UI_UX_MOBILE_FALLBACK_VISUAL_AMENDMENT.md`. Compatibility field/API names do not override that contract.

## Activation

The control is created only when the page URL contains:

```text
?uiux-test=1
```

Ordinary visitors do not receive `window.__portfolioTest`.

## Presentation routing

`site-bootstrap.js` selects one control path from the viewport that owns the page at load time:

```text
> 760px
  desktop portfolio runtimes
  -> ui-ux-test-control.js

<= 760px
  mobile-fallback.js
  -> ui-ux-mobile-test-control.js
```

Both expose the same high-level API shape where practical, but mobile intentionally does not expose desktop scene navigation.

Crossing the 760px breakpoint reloads the page so presentation/runtime ownership is reconstructed cleanly rather than leaving desktop writers alive behind the mobile fallback.

## Browser-owned setup

The caller must configure before navigation:

- viewport size;
- `prefers-reduced-motion`;
- browser/context settings.

Example:

```js
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: 'no-preference'
});
const page = await context.newPage();
await page.goto(`${baseUrl}/?uiux-test=1`);
await page.waitForFunction(() => Boolean(window.__portfolioTest));
const state = await page.evaluate(() => window.__portfolioTest.ready());
```

Do not switch reduced-motion preference after initialization and assume the runtime will reconstruct itself. Create the context with the intended preference first.

## Shared API

The capture harness may rely on:

```text
ready()
waitForAssets()
setLanguage(locale)
goToCheckpoint(checkpointId)
waitForVisualSettle(...)
getState()
checkpointIds
```

Desktop additionally supports:

```text
goToScene(sceneId)
setSceneProgress(sceneId, normalizedProgress)
sceneIds
```

Calling desktop scene navigation from mobile fallback mode throws intentionally.

## Locale

```js
await page.evaluate(() => window.__portfolioTest.setLanguage('en'));
await page.evaluate(() => window.__portfolioTest.setLanguage('zh-TW'));
```

Both controls use the portfolio's existing language switch. They do not rewrite desktop copy or source-level line-break policy.

## Desktop semantic checkpoints

The desktop controller continues to expose the scene checkpoint program:

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

Normal-motion checkpoint resolution discovers actual scene visibility from the running implementation, searches the relevant semantic range, scores observable rendered state, and waits for stable computed visual state.

The test harness does not contain the production `durations` array.

## Mobile semantic checkpoints

The mobile fallback controller exposes only:

```text
mobile.fallback
mobile.fallback.reduced
```

### `mobile.fallback`

Requires normal motion mode. In test mode the production perimeter-wave shader is frozen at a fixed deterministic time before capture. The user-facing production page still animates the WebGL wave and its line-by-line copy entrance.

The deterministic screenshot is a composition checkpoint; it does not substitute for website-level human review of normal motion.

### `mobile.fallback.reduced`

Requires `prefers-reduced-motion: reduce`. The same accepted composition is rendered with the WebGL effect frozen at the defined reduced-motion state and copy entrance bypassed.

The mobile controller returns a completed settle result directly because it explicitly fixes the mobile effect at a deterministic state rather than searching a desktop scroll timeline.

## Readiness

```js
await page.waitForFunction(() => Boolean(window.__portfolioTest));
const ready = await page.evaluate(() => window.__portfolioTest.ready());
```

`ready()` waits for document fonts, checks visible asset readiness, applies the presentation's deterministic test state, and returns diagnostic metadata.

`assetsReady: false` is not suitable for a baseline candidate.

In mobile mode, the actual GitHub profile avatar is visible content and must be ready. Desktop evidence images remain intentionally excluded from visible-asset readiness because the desktop experience is not part of the mobile product.

## Visual settling

Desktop settling observes stable computed-style signatures across frames.

Mobile settling explicitly freezes the fallback shader at its semantic test frame and then flushes stable frames. No arbitrary long sleep defines readiness.

A capture must treat `settled: false` as a harness failure.

## State inspection

```js
const state = await page.evaluate(() => window.__portfolioTest.getState());
```

Shared useful fields include:

```text
enabled
presentation
reducedMotion
locale
viewport
checkpoints
scrollBehaviorOverride
```

Desktop also reports document/scene state. Mobile reports the fallback state, including deterministic effect time and WebGL availability where exposed by the implementation.

Compatibility fields such as `canvasAvailable` may remain for API stability; they do not mean Canvas is the production motion owner.

## Production invariants

The test-control layer must preserve:

- no visible debug panel;
- no test API without `?uiux-test=1`;
- no test-side rewrite of accepted EN/zh-TW content;
- no copied production animation timeline constants;
- no GitHub Actions dependency;
- no desktop scene runtime execution as part of the mobile fallback;
- deterministic mobile WebGL/effect state under test/reduced-motion modes;
- no test-mode behavior that is treated as a substitute for human verification on the actual website.
