# Mobile Copy Entrance Trigger-Order Test

## Purpose

This document describes the regression test for the mobile fallback copy entrance lifecycle.

The defect being protected against is **not** a typography, timing, or motion-design defect. The accepted entrance already exists in `assets/js/mobile-fallback.js`: headline and guidance lines begin dim/soft and resolve line-by-line through `mobileCopyLineIn`.

## Evidence from real-device verification

Two distinct startup-order defects have now been observed:

1. attaching the CSS animation directly to `.mobile-copy-line` allowed the animation clock to start during DOM construction;
2. moving animation ownership behind two `requestAnimationFrame` callbacks was still insufficient on the actual iOS device, because those callbacks were still scheduled before the page had crossed a semantic presentation boundary.

The second failure is important: the double-RAF hypothesis was structurally reasonable but **disproved by real-device evidence** after PR #37.

The repaired contract therefore separates two concerns:

- **page presentation**: do not begin startup entrance scheduling until the document is being presented;
- **animation arming**: after presentation, preserve two RAF boundaries before adding the class that owns the CSS animation.

## Required normal-motion order

The regression contract is:

```text
create dedicated mobile fallback
        ↓
render localized headline/guidance line spans
        ↓
lines exist at the accepted hidden start state
(opacity 0 / blur 8px / translateY 7px)
        ↓
wait for page-presentation boundary
  pagereveal when supported
  pageshow as fallback / missed-reveal safety
        ↓
requestAnimationFrame #1
        ↓
requestAnimationFrame #2
        ↓
add .copy-enter
        ↓
existing mobileCopyLineIn animation begins
```

If `mobile-fallback.js` is inserted after `document.readyState === 'complete'`, the page has already crossed the load/presentation lifecycle and the runtime proceeds directly into the existing two-RAF arm path.

`pagereveal` is preferred when available because it represents the first rendered frame of a newly loaded or activated document. `pageshow` remains registered as a fallback because it occurs after `load` during initial navigation and cannot be missed while the document is still incomplete.

The test is concerned with **ordering**, not arbitrary elapsed milliseconds. It must not be rewritten as a `setTimeout`, sleep, or timeout-inflation test.

## Language-change rule

Language switching may replay the entrance, but only after the initial page-presentation boundary has been crossed.

Before presentation, a mutation to `html.lang` may rerender the hidden localized spans, but it must **not** call `armCopyEntrance()` and bypass the initial presentation gate.

## Static-mode exception

The existing contract remains unchanged for:

- `prefers-reduced-motion: reduce`
- `?uiux-test=1`

Those modes must keep `copy-static`, must not register entrance-trigger listeners, and must not arm `.copy-enter`. Their settled rendering is intentional and deterministic.

## What the test asserts

`scripts/tests/mobile-copy-entrance-trigger-order.test.mjs` checks the production source contract directly:

1. `.mobile-copy-line` owns only the hidden initial state and does **not** auto-start an animation;
2. `.mobile-fallback.copy-enter .mobile-copy-line` owns the existing `mobileCopyLineIn 1.08s` animation;
3. `armCopyEntrance()` still contains two `requestAnimationFrame` boundaries before adding `copy-enter`;
4. `scheduleInitialCopyEntrance()` gates startup on `pagereveal` / `pageshow`, with a `document.readyState === 'complete'` late-load path;
5. startup calls `syncLanguage()` before `scheduleInitialCopyEntrance()` and does not directly call `armCopyEntrance()`;
6. language changes only re-arm after `copyPresentationReady` is true;
7. reduced-motion and deterministic UI/UX test mode explicitly bypass both scheduling and arming.

This test deliberately reads `assets/js/mobile-fallback.js` rather than a duplicate helper fixture. That keeps the assertion attached to the actual production runtime and prevents a test-only scheduler from passing while production regresses.

## What the test does not assert

This is not a visual-regression or perceptual-acceptance test. It does not judge:

- blur quality;
- easing quality;
- typography;
- WebGL perimeter-wave appearance;
- real-device compositor behavior;
- whether the fade is perceptually strong enough.

Those remain actual-site human-verification concerns under the mobile UI/UX acceptance contract.

## Running the test

From the repository root:

```bash
npm run uiux:test:mobile-entrance
```

The test uses Node's built-in `node:test`; no new package dependency is required.

## Current implementation status

The production runtime on this branch now follows the page-presentation-gated contract. `.mobile-copy-line` is mounted in the hidden starting state without owning an animation. `scheduleInitialCopyEntrance()` waits for `pagereveal` when supported and keeps `pageshow` as fallback. Once presentation readiness is established, `armCopyEntrance()` waits through two RAF boundaries and adds `.copy-enter`, which owns the unchanged `mobileCopyLineIn 1.08s` animation.

Language changes rerender localized lines and replay the same lifecycle only after presentation readiness. `prefers-reduced-motion: reduce` and `?uiux-test=1` continue to bypass entrance scheduling/arming and remain settled immediately.

The repair intentionally changes only trigger ownership/order. Accepted copy, typography, layout, WebGL treatment, easing, duration, per-line delays, blur values, and vertical travel are unchanged. Actual-device perceptual verification remains authoritative for final acceptance.
