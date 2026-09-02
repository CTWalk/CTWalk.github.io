# Golden-Path Discovery V1 Runbook

Status: **experimental implementation for Issue #48**  
Purpose: test whether code/runtime evidence can derive a compact desktop visual checkpoint proposal before the existing CTWalk 22-checkpoint manifest is revealed.

Research / execution base:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
- `ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md`

The execution-review artifact records why the experiment is phased, why PDiff must see the same unfiltered samples as the structural scorer, why mechanical and LLM repeatability are separated, and why Storybook/CSS controls do not block the first CTWalk result.

---

## 1. Current V1 command

Run:

```bash
npm install
npx playwright install chromium
npm run uiux:test:discovery-contract
npm run uiux:discover-golden-path
```

The runner intentionally does **not** consume:

- `scripts/ui-ux-baseline-plan.json`;
- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- historical review records that enumerate the desired checkpoint set.

Do not reveal those materials to the independent reviewer until the proposal is frozen.

---

## 2. Important adapter boundary

V1 is not a zero-adapter unknown-repo crawler.

It deliberately reuses CTWalk verification infrastructure:

```text
window.__portfolioTest.sceneIds
window.__portfolioTest.setSceneProgress(...)
window.__portfolioTest.waitForVisualSettle(...)
```

Treat these as **CTWalk adapter knowledge**, not reusable engine logic.

The final report must distinguish:

```text
Reusable engine
- source/static signal mining
- dense normalized sampling
- structural change evidence
- future perceptual-distance evidence
- selective visual reasoning
- proposal/exclusion/not_covered schema
- repeatability/freeze governance

CTWalk adapter
- scene identities
- setSceneProgress()
- settle implementation
- verification-mode deterministic hooks
```

A successful CTWalk run therefore does not, by itself, prove zero-setup portability.

---

## 3. What V1 does today

### Layer 1 — source/test signals

The runner scans application JavaScript, `index.html`, and test files for signals such as:

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

At desktop `1440x900`, V1 uses the semantic scene-control adapter only for generic scene navigation:

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

V1 currently persists screenshots only for:

- scene boundaries;
- local structural-change peaks;
- representative stable spans between peaks.

These screenshots are discovery evidence only. They are not golden baselines.

**Important for Phase B:** the current persisted `candidate-images/` set is already structurally pre-filtered. A PDiff benchmark must therefore use the same **unfiltered deterministic sample positions** as the structural scorer, not only these candidate images. The implementation may keep raw screenshots as transient buffers and persist only perceptual-distance results plus review images.

---

# 4. Phased execution

## Phase A — core CTWalk falsification

This is the first required result. Do not build secondary experiment infrastructure before the core question has evidence.

### A0 — contract / contamination gate

Record:

- source SHA;
- browser/version/environment;
- viewport;
- discovery input files;
- CTWalk adapter inputs;
- reviewer identity/type and prior access.

The discovery mechanism and independent reviewer must not read the active 22-state manifest/plan before freeze.

### A1 — mechanical discovery repeatability

Run V1 twice from a clean state on the same source revision and controlled environment.

Compare mechanical evidence, not LLM prose:

- scene/sample positions;
- runtime observations;
- structural signatures/deltas;
- candidate regions;
- retained screenshots where relevant.

Classify:

```text
stable
explainably-equivalent
mechanically-unstable
```

If the browser evidence itself is materially unstable, stop and fix/record that before judging LLM reasoning.

### A2 — reasoning repeatability

Freeze one review packet / referenced image set.

Give that **same frozen evidence** to two isolated reviews using the same model/version, prompt, and input contract. The reviewers must not see each other's result and must not know the 22-state reference.

Compare:

- semantic visual responsibilities;
- approximate runtime/timeline locations;
- baseline/exclusion classifications;
- `not_covered` claims;
- human questions.

Do not require byte-identical wording or derived IDs.

Classify:

```text
identical
equivalent-with-explained-variation
materially-unstable
```

Material reasoning instability is a DEFER/STOP signal even if screenshots are deterministic.

### A3 — freeze and reveal

Write the independent result to:

```text
ui-ux-golden-path-discovery/ctwalk-desktop-v1/independent-proposal.json
```

Freeze it before reading:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`.

Only after freeze compare by **visual responsibility**, not exact names/count.

Record:

- responsibilities independently rediscovered;
- current checkpoints missed by V1;
- V1 proposals absent from the current 22;
- equivalent states with different naming/progress;
- misses caused by unavailable product intent;
- misses caused by weak runtime/source discovery;
- possible redundancy or gaps in the current 22;
- human knowledge that had to be injected manually;
- any contamination discovered after the fact.

Store that separately as:

```text
reference-comparison.md
```

**A3 is the core Issue #48 result.** If blind reconstruction fails badly or requires broad manual re-exploration, stop/reframe before Phase B/C.

---

## Phase B — secondary falsification / mechanism selection

Run only if Phase A is promising enough to justify more infrastructure.

### B1 — structural vs perceptual-distance benchmark

Do not reproduce the complete Crawljax / benchmark-app classifier stack used in academic experiments.

For the first slice, benchmark the **raw perceptual-image-distance role associated with PDiff** using a documented reproducible implementation.

Both structural and perceptual methods must consume the same unfiltered deterministic sample positions.

Compare:

- meaningful visual responsibilities retained;
- meaningful responsibilities missed;
- redundant states retained;
- execution/runtime cost;
- threshold/calibration burden;
- run-to-run stability;
- disagreements;
- whether signals are complementary.

Valid outcomes:

```text
perceptual distance sufficient
→ consume it

structural evidence sufficient / cheaper
→ keep it as implementation detail, not novelty

signals complementary
→ evaluate a hybrid
```

Do not force one winner.

### B2 — coverage-discrimination diagnostic

The goal is to test, not assume, whether conventional source execution signatures distinguish visual composition.

Start with the cheapest reproducible source-execution signature available, preferably Chromium/V8 function/range coverage through DevTools.

For independently judged visually distinct candidates ask:

```text
Do these states have indistinguishable or substantially overlapping
source-execution signatures?
```

If yes, record where and why. If no, report that the presumed coverage wedge weakened.

Do **not** build Istanbul/nyc branch instrumentation unless the cheaper diagnostic is insufficient to answer the question.

Coverage instrumentation difficulty does not invalidate Phase A.

---

## Phase C — substrate controls before broader GO

Run only after Phase A is promising. Phase C is required before making a broader mechanism claim / carrying the result into unrelated Repo B.

### C1 — Storybook negative control

Use a component-driven UI where stories/fixtures already enumerate meaningful states.

Expected correct behavior:

```text
existing enumeration detected
→ consume stories/fixtures
→ little or no expensive rediscovery
```

A discovery mechanism that re-crawls every explicit story state with heavy vision has failed this control.

### C2 — declarative CSS animation boundary case

Use a page with native scroll-driven primitives such as:

```text
animation-timeline
scroll()
view()
animation-range
@keyframes
```

This is not a zero-value negative control.

Expected behavior:

```text
declarative timeline metadata detected
→ use timeline/keyframe/range information as candidate anchors
→ reduce brute-force runtime exploration
→ use runtime/visual reasoning only for unresolved combined composition
```

---

# 5. Runtime LLM instruction

Give the independent reviewer the generated `llm-review-packet.json` plus only the candidate images referenced by the frozen packet.

Do **not** let it read the existing baseline manifest or active baseline plan before proposal freeze.

Use this instruction:

> You are performing an independent desktop visual golden-path discovery experiment. The repository already has an existing checkpoint manifest, but you are forbidden from reading or reconstructing it from historical baseline documentation until your proposal is frozen.
>
> Use the supplied source signals, runtime observations, and candidate screenshots to understand each scene's meaningful visual responsibilities. Source/runtime facts are primary evidence. Use screenshots only where they help distinguish materially different visual states.
>
> Your task is not to capture every animation frame and not to hit a target checkpoint count. Compress the observed state space.
>
> For each candidate or candidate region, classify it as one of: `baseline-worthy`, `visually-redundant`, `functional-only`, `transient`, `temporal-runtime-only`, `human-only`, or `uncertain`.
>
> A `baseline-worthy` state must provide visual regression information not adequately represented by its neighboring proposed checkpoints. Explain its semantic responsibility, unique visual value, and the condition under which it is stable enough for controlled capture.
>
> Do not guess product intent when evidence is insufficient. Put those cases in `uncertain` or `human-only` and ask one narrow question that a human can answer without manually re-exploring the whole application.
>
> You must also produce an explicit `not_covered` list for surfaces/regions/state dimensions you could not adequately observe or classify. For each item state: the surface/region, why it is not covered, the risk of omission, and the next verification method you recommend.
>
> Identify behavior that should not become screenshot baselines, especially continuous motion, timing/pacing, interaction behavior, or states whose difference is functional but not meaningfully visual.
>
> Produce: (1) a compact proposed checkpoint list; (2) inclusion rationale; (3) major exclusions; (4) `not_covered`; (5) targeted human questions; (6) deterministic-control gaps; and (7) any additional runtime evidence that would materially change your proposal.
>
> Freeze this proposal before reading the project's existing checkpoint manifest.

---

# 6. Frozen proposal format

Recommended structure:

```jsonc
{
  "source_sha": "...",
  "proposal_frozen_at": "...",
  "inputs_used": ["..."],
  "adapter_inputs": ["window.__portfolioTest.setSceneProgress", "window.__portfolioTest.waitForVisualSettle"],
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
  "not_covered": [
    {
      "surface": "...",
      "reason": "...",
      "risk_of_omission": "...",
      "suggested_verification": "..."
    }
  ],
  "human_questions": [],
  "deterministic_control_gaps": [],
  "additional_evidence_requests": []
}
```

Do not silently revise the frozen file after seeing the existing 22-state reference. Any later comparison or revised proposal must be stored separately.

---

# 7. Simplified artifact structure

Prefer one source of truth per run rather than many synchronized intermediate files.

```text
ui-ux-golden-path-discovery/ctwalk-desktop-v1/
  run-1/
    discovery-evidence.json
    llm-review-packet.json
    independent-proposal.json
  run-2/
    discovery-evidence.json
    llm-review-packet.json
    independent-proposal.json
  repeatability-report.md
  reference-comparison.md
  final-report.md

  # Phase B only
  abstraction-comparison.md
  coverage-discrimination-report.json
```

Equivalent structure is acceptable if provenance and sequencing remain auditable.

---

# 8. Decision rules

Do not invent percentage scores.

**GO:** the composed mechanism produces a repeatable/explainable proposal, bounded human questions, explicit blind spots, and later controls behave sensibly.

**INTEGRATE:** an existing state/perceptual abstraction provides useful or superior reduction; consume it beneath the source/runtime/determinism/governance workflow.

**REFRAME:** value appears mainly on continuous composition-heavy UI or another narrow substrate.

**DEFER:** mechanical/reasoning proposal is unstable or maintenance/tooling economics are poor.

**STOP:** meaningful checkpoint construction still requires the hidden manifest or broad manual re-exploration.

Novelty is not a success criterion.

---

# 9. Boundaries

V1 is not intended to:

- replace the authoritative #6 baseline;
- silently change the current 22 checkpoints;
- prove complete UI coverage;
- replace Percy/Chromatic/Playwright diffing;
- put LLM vision into every PR;
- prove portability from CTWalk alone;
- claim that CTWalk was explored without project-specific adapter help.

Its core Phase-A job is:

```text
code/runtime evidence
→ candidate visual-state discovery
→ state compression
→ explicit blind spots
→ compact checkpoint proposal
→ targeted human questions
→ diagnostic comparison with the historical 22
```
