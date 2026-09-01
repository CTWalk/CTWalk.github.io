# UI/UX Regression Tests

This directory contains executable regression tests for deterministic UI/UX runtime contracts that can be checked without visual-baseline approval.

These tests do **not** replace actual-site human verification. They protect implementation invariants such as trigger ordering, deterministic control behavior, and other mechanical contracts that should fail quickly before perceptual review.

## Mobile copy entrance trigger order

Run:

```bash
npm run uiux:test:mobile-entrance
```

See `docs/ui-ux/MOBILE_COPY_ENTRANCE_TRIGGER_TEST.md` for the exact lifecycle contract, expected red/green state, and scope boundaries.
