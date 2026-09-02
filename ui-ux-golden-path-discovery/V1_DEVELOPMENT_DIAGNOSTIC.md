# V1 Development Diagnostic Helper

Status: **current helper for supervised V1 construction under Issue #48.**

This helper exists so a runtime LLM does not have to reconstruct all development plumbing before it can reason about the mechanism.

It deliberately separates two layers:

```text
generic V1 discovery runner
  -> MUST remain oracle-free

development diagnostic helper
  -> MAY read the known CTWalk 22-state oracle
```

That separation is the core contract.

## Commands

From a clean `phase1/verification-f40e365` checkout:

```bash
npm install
npx playwright install chromium
npm run uiux:test:discovery-contract
npm run uiux:develop-golden-path-v1
```

Equivalent explicit steps:

```bash
npm run uiux:discover-golden-path
npm run uiux:diagnose-golden-path-v1
```

Environment overrides already used by the project remain available:

```text
BASELINE_BROWSER_EXECUTABLE
BASELINE_SOURCE_SHA
UIUX_DISCOVERY_BASE_URL
UIUX_DISCOVERY_OUTPUT
UIUX_DEVELOPMENT_OUTPUT
UIUX_DEVELOPMENT_PORT
```

## What the first script does

`scripts/discovery/golden-path-discovery-v1.mjs` remains the generic mechanism prototype.

It:

- mines source/test signals;
- samples normalized scene progress densely;
- records visible DOM/style/runtime facts;
- computes adjacent structural deltas;
- selects candidate boundaries/change peaks/stable spans;
- captures only selected candidate screenshots;
- emits a compressed LLM review packet.

It must not read:

- `scripts/ui-ux-baseline-plan.json`;
- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `checkpointIds` as candidate truth;
- `goToCheckpoint()` as its discovery strategy.

## What the development diagnostic does

`scripts/discovery/build-v1-development-diagnostic.mjs` is intentionally oracle-aware.

It reads the current normal-desktop reference inventory and manifest, then resolves those reference checkpoints through the existing test-control API.

For each known reference checkpoint it records:

- manifest rationale/excerpt;
- oracle-resolved scene progress;
- resolver score/settle result;
- nearest dense V1 sample;
- nearest retained V1 candidate;
- candidate distance in normalized scene progress;
- whether a retained candidate is within one/two V1 sample steps;
- local structural-delta evidence around the reference location.

This produces a **localization aid**, not an automatic semantic verdict.

A candidate near a reference location does not prove that V1 surfaced the responsibility. The development LLM still has to inspect the dense observations, delta reasons, visible text, and relevant screenshot before assigning a failure layer.

## Generated output

Machine-generated output is ignored by git:

```text
ui-ux-golden-path-discovery/ctwalk-desktop-v1/
  static-signals.json
  runtime-observations.json
  candidate-images/**
  llm-review-packet.json

ui-ux-golden-path-discovery/development-v1/generated/
  development-diagnostic.json
  V1_BASELINE_MACHINE_SUMMARY.md
```

The authored development conclusions remain trackable outside `generated/`:

```text
ui-ux-golden-path-discovery/development-v1/
  SOURCE_RUNTIME_MAP.md
  REFERENCE_RESPONSIBILITY_MAP.md
  V1_BASELINE_DIAGNOSTIC.md
  V1_IMPROVEMENT_QUEUE.md
  MATERIAL_GAPS.md
```

## Runtime LLM focus

The fresh runtime LLM should start from `development-diagnostic.json` rather than rebuilding the reference/runtime correlation manually.

It should then classify important reference responsibilities using the current development labels:

```text
SURFACED
LOST_AT_SOURCE_MINING
LOST_AT_RUNTIME_SAMPLING
LOST_AT_STRUCTURAL_SIGNAL
LOST_AT_CANDIDATE_SELECTION
LOST_AT_EVIDENCE_PACKAGING
REASONING_ONLY
DETERMINISTIC_CONTROL_GAP
PRODUCT_INTENT_ONLY
REFERENCE_QUESTIONABLE
```

It must not grade the mechanism as `N / 22`.

For each miss, the useful question is:

> What generic signal or mechanism behavior would have surfaced this responsibility without reading its checkpoint ID?

## Why this is not hard-coding

The oracle-aware script is development instrumentation. It is not part of the future generic discovery engine.

The repository contract tests explicitly preserve this separation:

```text
generic runner
  no plan/manifest/goToCheckpoint/checkpointIds

development diagnostic
  plan/manifest/goToCheckpoint allowed and expected
```

When V1 is eventually frozen for blind validation, the development diagnostic is not supplied to the blind reviewer.

## Current stopping point

This helper is a first version. Use it to accumulate and diagnose evidence before changing candidate heuristics.

Do not redesign the V1 algorithm merely because the machine summary shows a distant candidate. First verify the semantic responsibility and identify which mechanism layer actually lost it.
