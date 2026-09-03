# UI/UX Regression Tests

This directory contains executable regression tests for deterministic UI/UX runtime contracts that can be checked without visual-baseline approval.

These tests do **not** replace actual-site human verification. They protect implementation invariants such as animation/accessibility ownership, deterministic control behavior, and other mechanical contracts that should fail quickly before perceptual review.

## Mobile copy entrance contract

Run:

```bash
npm run uiux:test:mobile-entrance
```

The historical test filename is retained for continuity. The current contract no longer requires the superseded two-RAF or `pagereveal` / `pageshow` trigger machinery.

See `docs/ui-ux/MOBILE_COPY_ENTRANCE_TRIGGER_TEST.md` for the confirmed reduced-motion root cause, current normal/static behavior, language-switch replay rule, and exact regression boundaries.

## Desktop/mobile presentation ownership contract

Run:

```bash
npm run uiux:test:presentation-ownership
```

This source-level regression test protects the #51 integration boundary: `<=760px` is mobile-owned, `>760px` is desktop-owned, desktop evidence is hydrated only inside the desktop guard, the bootstrap no longer cancels a controller that should never start on mobile, the approved ff06 desktop runtime order is retained, and the accepted CueSheet `53vw/740px` geometry remains anchored.

Run both integration contracts together with:

```bash
npm run uiux:test:integration
```

These mechanical checks are deliberately narrower than visual acceptance. The combined candidate still requires actual-site desktop/mobile review before merge.
