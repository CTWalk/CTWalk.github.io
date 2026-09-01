# Mobile Copy Entrance Trigger-Order Test

## Purpose

This document describes the regression test for the mobile fallback copy entrance lifecycle.

The defect being protected against is **not** a typography, timing, or motion-design defect. The accepted entrance already exists in `assets/js/mobile-fallback.js`: headline and guidance lines begin dim/soft and resolve line-by-line through `mobileCopyLineIn`.

The failure mode is trigger ordering: if the CSS animation starts in the same construction turn in which the line elements are inserted, a browser may advance the animation before it has produced a visible frame containing the intended hidden starting state. On a real mobile device, that can make the accepted entrance appear to be missing even though the keyframes are present.

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
requestAnimationFrame #1
        ↓
requestAnimationFrame #2
        ↓
add .copy-enter
        ↓
existing mobileCopyLineIn animation begins
```

Two animation-frame boundaries are intentional. The first schedules work into the rendering lifecycle; the second gives the browser a paint opportunity with the hidden initial state before the class that owns the animation is applied.

The test is concerned with **ordering**, not elapsed milliseconds. It must not be rewritten as a `setTimeout`, sleep, or arbitrary delay test.

## Static-mode exception

The existing contract remains unchanged for:

- `prefers-reduced-motion: reduce`
- `?uiux-test=1`

Those modes must keep `copy-static` and must not arm `.copy-enter`. Their settled rendering is intentional and deterministic.

## What the test asserts

`scripts/tests/mobile-copy-entrance-trigger-order.test.mjs` checks the production source contract directly:

1. `.mobile-copy-line` owns only the hidden initial state and does **not** auto-start an animation;
2. `.mobile-fallback.copy-enter .mobile-copy-line` owns the existing `mobileCopyLineIn 1.08s` animation;
3. `armCopyEntrance()` contains two `requestAnimationFrame` boundaries before adding `copy-enter`;
4. startup calls `syncLanguage()` before `armCopyEntrance()`;
5. reduced-motion and deterministic UI/UX test mode explicitly bypass entrance arming.

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

## Test-first status

This regression test is intentionally introduced before the runtime repair. On the current buggy implementation it should fail because `.mobile-copy-line` starts `mobileCopyLineIn` immediately and there is no explicit `armCopyEntrance()` paint-boundary trigger yet.

That red state is expected. The subsequent runtime fix is complete only when this test turns green **without changing the accepted animation parameters or bypass rules**.
