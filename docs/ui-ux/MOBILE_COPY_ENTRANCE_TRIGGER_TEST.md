# Mobile Copy Entrance Regression Contract

## Purpose

This document records the production contract and evidence for the mobile fallback copy entrance.

The accepted visual behavior is unchanged: headline and guidance lines materialize line-by-line through `mobileCopyLineIn`, beginning dim/soft and slightly displaced before resolving to their final sharp state.

The historical filename `MOBILE_COPY_ENTRANCE_TRIGGER_TEST.md` and test command are retained for continuity, but **page-presentation trigger ordering is no longer part of the accepted contract**.

## Confirmed real-device root cause

PR #43 added a query-only diagnostic after repeated reports that no entrance was visible on the actual iOS device. The probe produced this state:

```text
readyState: complete
visibility: visible
reducedMotion: true
uiuxTest: false
copyStatic: true
copyEnter: false
lineCount: 6
animationName: none
animationPlayState: running
animationDuration: 0s
opacity: 1
filter: none
transform: none
activeAnimations: []
Replay blocked: copy-static is active
```

After iOS **Reduce Motion** was disabled, the accepted mobile copy entrance was visibly confirmed working on the same device.

This establishes the root cause: Safari was correctly reporting `prefers-reduced-motion: reduce`, and the production runtime was correctly applying `copy-static`. The animation engine was not failing.

The raw probe trace is preserved in the PR #43 discussion. Issue #38 contains the final diagnosis that supersedes its original page-timing hypothesis.

## Superseded hypotheses

PR #37 and PR #42 introduced progressively more startup machinery under the assumption that Safari was advancing the CSS animation before a perceptible first frame:

- explicit `.copy-enter` ownership;
- two `requestAnimationFrame` callbacks;
- `pagereveal` / `pageshow` gating;
- `copyPresentationReady` state.

The real-device probe showed that this diagnosis was false for the observed failure. Those mechanisms therefore must not become permanent requirements merely because they existed in merged history.

The earlier conclusion that direct line-owned animation had failed is also superseded: the device had reduced motion enabled, so the absence of an entrance was expected accessibility behavior rather than evidence against direct CSS animation ownership.

## Current normal-motion contract

Normal mobile rendering is intentionally simple:

```text
create dedicated mobile fallback
        ↓
render localized headline/guidance line spans
        ↓
each .mobile-copy-line owns mobileCopyLineIn
        ↓
CSS applies the existing per-line delay
        ↓
line resolves from dim/soft/displaced to settled copy
```

The accepted motion values remain:

- duration: `1.08s`;
- easing: `cubic-bezier(.22,.72,.24,1)`;
- start: `opacity:0`, `blur(8px)`, `translateY(7px)`;
- midpoint: `opacity:.38`, `blur(3.5px)`, `translateY(3px)`;
- end: `opacity:1`, `blur(0)`, `translateY(0)`;
- title delays: `120ms` start + `145ms` per line;
- guidance delays: `760ms` start + `135ms` per line.

No `pagereveal`, `pageshow`, double-RAF, `copyPresentationReady`, or `.copy-enter` arming state is required.

## Language-change rule

Language switching **may replay the entrance** in normal-motion mode.

`syncLanguage()` replaces the existing line elements through `renderLines()`. The replacement `.mobile-copy-line` elements own `mobileCopyLineIn`, so the new localized lines naturally begin the same entrance when they are inserted.

This avoids a second animation scheduler or special language-switch timing path.

## Static-mode accessibility contract

The behavior remains unchanged for:

- `prefers-reduced-motion: reduce`;
- `?uiux-test=1`.

Before line rendering, either condition applies `copy-static` to the mobile fallback. The static selector must force:

```text
opacity: 1
filter: none
transform: none
animation: none
```

This is intentional product behavior, not a fallback defect. The real-device incident is now direct evidence that this accessibility path works.

## What the regression test asserts

`scripts/tests/mobile-copy-entrance-trigger-order.test.mjs` reads the production source directly and protects the corrected contract:

1. `.mobile-copy-line` directly owns the accepted `mobileCopyLineIn 1.08s` animation and hidden/soft start state;
2. the accepted keyframe values remain unchanged;
3. `copy-static` is applied for reduced-motion or deterministic test mode and overrides the animation with settled copy;
4. `renderLines()` replaces line elements and preserves the accepted stagger calculation;
5. the title and guidance start/step delays remain `120/145ms` and `760/135ms`;
6. the language observer calls `syncLanguage`, so replacing localized line elements replays the entrance in normal-motion mode;
7. the superseded page-presentation/arming tokens remain absent.

The test is a source-level mechanical contract. It does not replace actual-device perceptual acceptance.

## What the test does not assert

It does not judge:

- whether a user has enabled Reduce Motion at OS level;
- subjective blur/easing quality;
- typography or layout quality;
- WebGL perimeter-wave appearance;
- real-device compositor quality.

Those remain actual-site human-verification concerns.

## Running the test

From the repository root:

```bash
npm run uiux:test:mobile-entrance
```

The test uses Node's built-in `node:test`; no new package dependency is required.

## Evidence retention

The temporary `?uiux-entrance-probe=1` production diagnostic is removed after completing its purpose. Its evidence is intentionally retained in Git history and the PR #43 / issue #38 discussions rather than leaving diagnostic UI in the shipped runtime.
