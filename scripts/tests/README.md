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
