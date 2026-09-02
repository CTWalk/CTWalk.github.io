# Golden-Path Discovery V1 Runbook

Status: **experimental implementation for Issue #48**  
Purpose: test whether code/runtime evidence can derive a compact desktop visual checkpoint proposal before the existing CTWalk 22-checkpoint manifest is revealed.

## What V1 does

Run:

```bash
npm run uiux:discover-golden-path
```

The runner intentionally does **not** consume:

- `scripts/ui-ux-baseline-plan.json`;
- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- historical review records that enumerate the desired checkpoint set.

It uses three evidence layers.

### Layer 1 — source/test signals

The runner scans the application JavaScript, `index.html`, and test files for signals such as:

- scene references;
- DOM selectors;
- class mutations;
- dataset writes;
- style writes;
- image/link changes;
- rAF / reduced-motion / scroll / timer ownership;
- obvious animation range boundaries.

These are hints, not checkpoint decisions.

### Layer 2 — dense browser observations

At desktop `1440x900`, the runner uses the existing semantic test-control API only for generic scene navigation:

```text
setSceneProgress(scene, progress)
waitForVisualSettle(scene)
```

It deliberately does not call `goToCheckpoint()` or read `checkpointIds`.

For every scene it samples progress densely and records visible browser facts:

- visible text;
- visible elements;
- bounding boxes;
- opacity;
- transforms/filters;
- image/background sources;
- semantic/ARIA text;
- area share;
- color/background;
- z-index.

Adjacent samples receive a structural change score.

### Layer 3 — selective screenshots

Screenshots are generated only for:

- scene boundaries;
- local change peaks;
- representative stable spans between change peaks.

These screenshots are discovery evidence only. They are not golden baselines.

The aim is to reduce visual-token usage before an LLM sees any image.

## Output

Default path:

```text
ui-ux-golden-path-discovery/ctwalk-desktop-v1/
```

Outputs:

```text
static-signals.json
runtime-observations.json
candidate-images/
llm-review-packet.json
README.md
```

`runtime-observations.json` is deliberately verbose evidence. `llm-review-packet.json` is the compact handoff intended for the runtime LLM.

## Runtime LLM instruction

Give the runtime LLM the generated `llm-review-packet.json` plus only the candidate images referenced by that packet.

Do **not** let it read the existing baseline manifest or active baseline plan before it has frozen its proposal.

Use this instruction:

> You are performing an independent desktop visual golden-path discovery experiment. The repository already has an existing checkpoint manifest, but you are forbidden from reading or reconstructing it from historical baseline documentation until your proposal is frozen.
>
> Use the supplied source signals, runtime observations, and candidate screenshots to understand each scene's meaningful visual responsibilities. Source/runtime facts are primary evidence. Use screenshots only where they help distinguish materially different visual states.
>
> Your task is not to capture every animation frame and not to hit a target checkpoint count. Compress the observed state space.
>
> For each candidate or candidate region, classify it as one of:
>
> - `baseline-worthy`
> - `visually-redundant`
> - `functional-only`
> - `transient`
> - `temporal-runtime-only`
> - `human-only`
> - `uncertain`
>
> A `baseline-worthy` state must provide visual regression information not adequately represented by its neighboring proposed checkpoints. Explain its semantic responsibility, its unique visual value, and the condition under which it is stable enough for Playwright capture.
>
> Do not guess product intent when evidence is insufficient. Put those cases in `uncertain` or `human-only` and ask one narrow question that a human can answer without manually re-exploring the whole application.
>
> Also identify behavior that should not become screenshot baselines, especially continuous motion, timing/pacing, interaction behavior, or states whose difference is functional but not meaningfully visual.
>
> Produce:
>
> 1. a compact proposed checkpoint list;
> 2. inclusion rationale for each checkpoint;
> 3. major exclusions and reasons;
> 4. targeted human questions;
> 5. deterministic-control gaps;
> 6. any additional runtime observation that would materially change your proposal.
>
> Freeze this proposal before reading the project's existing checkpoint manifest.

## Required frozen proposal format

Write the independent result to:

```text
ui-ux-golden-path-discovery/ctwalk-desktop-v1/independent-proposal.json
```

Recommended structure:

```jsonc
{
  "source_sha": "...",
  "proposal_frozen_at": "...",
  "inputs_used": ["..."],
  "checkpoints": [
    {
      "derived_id": "...",
      "scene_id": "...",
      "scene_progress": 0.0,
      "semantic_responsibility": "...",
      "unique_visual_value": "...",
      "stable_condition": "...",
      "screenshot": "...",
      "human_question": null
    }
  ],
  "exclusions": [
    {
      "scene_id": "...",
      "progress_or_range": "...",
      "classification": "visually-redundant",
      "reason": "..."
    }
  ],
  "human_questions": [],
  "deterministic_control_gaps": [],
  "additional_evidence_requests": []
}
```

Do not silently revise this file after seeing the existing 22-state reference. Any later comparison or revised proposal must be stored separately.

## After the proposal is frozen

Only then may the reviewer read:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`.

Compare by **visual responsibility**, not exact names or exact count.

Record:

- responsibilities independently rediscovered;
- current checkpoints missed by V1;
- V1 proposals absent from the current 22;
- equivalent states with different naming/progress;
- misses caused by unavailable product intent;
- misses caused by weak runtime/source discovery;
- possible redundancy or gaps in the current 22;
- human knowledge that had to be injected manually.

Store that separately as:

```text
reference-comparison.md
```

## What would make V1 promising

Do not invent a percentage score.

V1 is promising if the result shows that an unfamiliar runtime LLM can:

- recover the major dynamic scene structure without the manifest;
- find meaningful visual transitions/holds/handoffs rather than arbitrary frames;
- discard many redundant runtime samples before visual review;
- identify screenshot-unsuitable temporal behavior;
- produce a reasonably compact proposed golden path;
- reduce human involvement to specific product/perceptual questions;
- identify deterministic-control work needed before Playwright regression.

Failure is also valuable evidence. If the LLM requires the existing manifest or broad manual site exploration to understand the UI, the proposed Skill has not yet solved the upstream problem.

## Boundaries

This V1 is not intended to:

- replace the authoritative #6 baseline;
- change the current 22 checkpoints;
- prove complete UI coverage;
- replace Percy/Chromatic/Playwright diffing;
- put LLM vision into every PR;
- prove portability from CTWalk alone.

Its only job is to test the middle of the proposed future Skill:

```text
code/runtime evidence
→ visual-state discovery
→ state compression
→ compact checkpoint proposal
→ targeted human questions
```
