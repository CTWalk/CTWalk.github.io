# Issue #48 — applied revision record

Status: **approved execution revision; intended to match the live Issue #48 body after application.**

Evidence base:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
- `ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md`

The execution-review artifact records the searches and repo evidence that caused the final phasing changes. In particular it supersedes the earlier claims that all CTWalk desktop states use one `renderExperience()` owner, that declarative CSS animation should be a zero-value negative control, and that the academic PDiff experiment is a drop-in CTWalk comparator.

---

# Derive the desktop visual golden path from code and runtime evidence

## Purpose

Test whether a reusable UI/UX verification mechanism can derive a **compact, explainable and repeatable visual-regression checkpoint proposal** from code and runtime evidence **without being given the existing CTWalk 22-checkpoint manifest as the answer**.

This is not an attempt to invent GUI state abstraction, near-duplicate detection, or a Percy replacement.

Research / decision base:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
- `ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md`
- `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md`

---

## Why the ticket changed

The original #48 framing was too broad. Prior-art and execution review established:

1. GUI state abstraction / near-duplicate detection is a mature, benchmarked field, but not a universally solved one.
2. Commercial systems such as Meticulous already automate meaningful state/session selection from recorded interactions and coverage; “state selection is fully manual” is not defensible.
3. GUI-state equivalence is not necessarily visual-baseline equivalence. A crawler may merge functionally equivalent cosmetic states that visual regression must keep distinct.
4. PDiff is relevant prior art, but the research implementations include Crawljax / trained-classifier infrastructure; #48 should benchmark the raw perceptual-distance role rather than reproduce the entire research stack.
5. The current V1 structural scorer sees every sampled state but persists screenshots only after structural pre-filtering. Any PDiff comparison must therefore use the same **unfiltered deterministic sample positions**, not only V1 candidate images.
6. Mechanical discovery repeatability and LLM reasoning repeatability are separate failure modes and must be measured separately.
7. Storybook is a valid negative control because stories already enumerate states. Native CSS scroll-driven animation is instead a boundary/adaptation substrate: declarative timelines reduce discovery work but do not automatically decide semantic golden compositions.
8. CTWalk contains multiple continuous visual owners. Coverage discrimination must be measured, not asserted from a single-render-function premise.
9. `window.__portfolioTest` scene/progress/settle APIs are valuable CTWalk adapter knowledge and must not be misreported as generic zero-adapter discovery.
10. The original revised scope bundled too many experiments into one blocking gate. The core CTWalk falsification now runs first; secondary benchmarks and substrate controls run only if the core result is promising enough to justify them.

Full supporting evidence and links are in `EXECUTION_REVIEW_48.md`.

---

## Core hypothesis

> **For UI surfaces whose meaningful visual compositions are not already adequately enumerated by project artifacts, a combination of source analysis, runtime observation, mature state/perceptual-abstraction primitives and selective visual reasoning can produce a repeatable, explainable checkpoint proposal, surface deterministic-control gaps, and explicitly state what it could not cover.**

The experiment pays particular attention to **continuously varying visual composition** where session/event/source coverage may under-discriminate materially different renders.

This is a hypothesis to test, not a claim that current commercial tools cannot handle such UI.

---

## Explicit non-claims

Do not use this experiment to claim:

- automated UI state discovery is an open problem;
- state abstraction is solved;
- mainstream visual tools always leave state selection to humans;
- near-duplicate detection is our contribution;
- PDiff is automatically the correct checkpoint-selection engine;
- all CTWalk desktop states execute through one render function;
- native CSS scroll animation eliminates checkpoint-selection work;
- any arbitrary percentage reduction in human effort;
- portability from CTWalk alone.

---

# Hard experimental rules

## R1 — Manifest independence

During blind discovery neither the mechanism nor the independent reviewer may use or reconstruct the expected state inventory from:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`;
- historical baseline-review material whose purpose is to enumerate the desired checkpoint set.

Reveal those only after the independent proposal is frozen.

## R2 — Reviewer independence

A reviewer that already knows the 22-state manifest is disqualified from producing the blind `independent-proposal.json`.

Use a fresh runtime agent / human reviewer with no prior manifest exposure. Record reviewer type, model/version if applicable, and prior access.

## R3 — Declare adapter knowledge

V1 currently depends on CTWalk-specific verification infrastructure, including generic scene identities, `setSceneProgress()` and `waitForVisualSettle()`.

Record those explicitly as **adapter inputs**. Final reporting must separate reusable engine responsibilities from CTWalk adapter/test-control knowledge.

## R4 — Explicit `not_covered`

Every independent proposal must state what the mechanism could not adequately observe or classify.

Each `not_covered` item should include:

```text
surface / region
reason
risk of omission
suggested next verification method
```

Silent omission is not acceptable evidence of completeness.

---

# Phase A — core CTWalk falsification

Phase A answers the main ticket question. If it fails badly, stop/reframe before building the secondary experiment infrastructure.

## A0 — contamination / provenance gate

Record:

- exact source SHA;
- browser/version/environment;
- viewport/motion/locale configuration;
- source/test/document inputs;
- CTWalk adapter inputs;
- reviewer independence.

Run the existing discovery contract test.

## A1 — mechanical discovery repeatability

Run V1 discovery **twice from a clean state on the same source revision and controlled environment**.

Compare mechanical evidence:

- scene/sample positions;
- runtime observations;
- structural signatures/deltas;
- candidate regions;
- retained rendered evidence.

Classify:

```text
stable
explainably-equivalent
mechanically-unstable
```

If evidence itself is materially unstable, fix/report that before blaming the reasoning layer.

## A2 — blind reasoning repeatability

Freeze one LLM review packet and its referenced images.

Perform **two isolated reviews of the same frozen evidence**, using the same model/version, prompt and input contract. The reviewers must not see each other's result or the historical 22.

Compare semantic output, not wording:

- visual responsibilities;
- approximate runtime/timeline locations;
- baseline/exclusion classifications;
- `not_covered` claims;
- human questions.

Classify:

```text
identical
equivalent-with-explained-variation
materially-unstable
```

Material reasoning instability is a DEFER/STOP signal.

## A3 — freeze, reveal, diagnose

Freeze `independent-proposal.json` before revealing the active 22-state reference.

Then compare by **visual responsibility**, not exact names/count:

- responsibilities found by both;
- reference responsibilities missed;
- extra responsibilities proposed;
- equivalent states with different naming/progress;
- misses caused by unavailable product intent;
- misses caused by source/runtime/abstraction weakness;
- possible gaps/redundancy in the historical 22;
- any contamination discovered after the fact.

A3 is the **core #48 result**.

If the mechanism misses major responsibilities and needs broad manual re-exploration to recover them, STOP or REFRAME before Phase B/C.

---

# Phase B — secondary falsification / mechanism selection

Run only if Phase A is promising enough to justify further work.

## B1 — structural vs perceptual-distance benchmark

V1's structural scorer is an experimental baseline, not a claimed contribution.

Benchmark a documented implementation of the **raw perceptual-image-distance role associated with PDiff**. Do not reproduce the full Crawljax + trained benchmark-classifier stack unless later evidence specifically requires it.

Critical fairness rule:

```text
same deterministic raw sample positions
        ├─ structural evidence
        └─ perceptual-distance evidence
```

Do not run the perceptual comparator only on `candidate-images/`, because those images are already selected by the structural scorer.

Compare:

- meaningful visual responsibilities retained/missed;
- redundant states retained;
- runtime/compute cost;
- threshold/calibration burden;
- repeatability;
- disagreements;
- complementarity.

Valid outcomes include:

```text
perceptual signal sufficient
structural signal sufficient / cheaper
hybrid useful
```

A published primitive working well is a positive **INTEGRATE** result, not failure.

## B2 — coverage-discrimination diagnostic

Test rather than assume the coverage wedge.

Start with the cheapest reproducible execution signature available, preferably Chromium/V8 function/range coverage through DevTools.

For independently judged visually distinct candidates ask:

> Do they have indistinguishable or substantially overlapping source-execution signatures?

If yes, record where/why. If no, report that the presumed wedge weakened.

Do not build a full Istanbul/nyc branch-instrumentation project unless the cheaper diagnostic cannot resolve the question.

B2 difficulty does not invalidate Phase A.

---

# Phase C — substrate controls before broader GO

Run only if Phase A is promising. Phase C is required before carrying a broad mechanism claim into unrelated Repo B.

## C1 — Storybook negative control

Use a component-driven UI where stories/fixtures already enumerate meaningful states.

Expected correct behavior:

```text
existing state inventory detected
→ consume stories/fixtures
→ little/no expensive rediscovery
```

The mechanism should demonstrate that it knows when **not** to crawl/vision-analyze deeply.

## C2 — declarative CSS animation boundary case

Use a page with native scroll-driven animation primitives such as:

```text
animation-timeline
scroll()
view()
animation-range
@keyframes
```

This is not a zero-value negative control.

Expected adaptation:

```text
declarative timeline detected
→ parse keyframes/timeline/ranges as candidate anchors
→ reduce brute-force runtime sampling
→ use runtime/visual reasoning only for unresolved combined composition
```

---

# Runtime LLM output contract

For candidate/regions classify as:

```text
baseline-worthy
visually-redundant
functional-only
transient
temporal-runtime-only
human-only
uncertain
```

A proposed baseline state must explain:

- semantic responsibility;
- unique visual-regression value;
- approximate scene/progress location;
- stable/settled condition;
- evidence used;
- narrow human question, if any.

The proposal must also contain:

```text
exclusions
not_covered
human_questions
deterministic_control_gaps
additional_evidence_requests
```

Visual reasoning should be selective: source/runtime/state-abstraction evidence first, visual inspection only where it changes a classification or resolves ambiguity.

---

# Playwright proof boundary

During Phase A, do **not** require durable final semantic checkpoint resolvers for every newly inferred state.

It is sufficient to demonstrate that a proposed responsibility can be re-rendered reproducibly through the current scene/progress adapter and to record the durable semantic resolver it would require if accepted.

Permanent checkpoint-control synthesis belongs after the candidate proves worth retaining.

---

# Artifact contract

Prefer one source of truth per run:

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

`independent-proposal.json` contains checkpoints, exclusions, `not_covered`, human questions, and deterministic-control gaps.

Equivalent layout is acceptable if provenance/freeze sequencing remains auditable.

---

# Acceptance / stop gates

## Core Phase-A acceptance

- Manifest independence is enforced.
- Reviewer independence is recorded.
- CTWalk adapter knowledge is explicitly declared.
- Two mechanical runs are compared.
- Two isolated reasoning reviews of frozen identical evidence are compared.
- `not_covered` is explicit/actionable.
- The independent proposal is frozen before reference reveal.
- Comparison with the historical 22 diagnoses matches, misses, extras and causes without exact-count grading.
- Human questions are narrow/actionable rather than “review the whole site.”
- Reusable-engine vs CTWalk-adapter responsibilities are separated.
- No authoritative #6 baseline is overwritten.

At A3 the ticket may honestly conclude STOP / REFRAME / DEFER without running Phase B/C.

## Requirements before broad GO to Repo B

If Phase A is promising enough to continue:

- B1 perceptual/structural comparison is completed on the same unfiltered deterministic samples;
- B2 coverage diagnostic is attempted with the cheapest practical execution signature and its limitations recorded;
- C1 Storybook control demonstrates consume/stand-down behavior;
- C2 declarative-animation case demonstrates strategy adaptation;
- final decision is GO / INTEGRATE / REFRAME / DEFER / STOP.

---

# Decision criteria

| Outcome | Trigger |
| --- | --- |
| **GO — carry into unrelated Repo B** | The composed mechanism is repeatable/explainable, human review is bounded, blind spots are explicit, and B/C controls behave sensibly |
| **INTEGRATE** | Existing state/perceptual abstraction supplies useful or superior reduction; consume it underneath the higher-level workflow |
| **REFRAME** | Material value appears mainly on continuous composition-heavy UI or another narrow substrate |
| **DEFER** | Mechanical/reasoning proposal is unstable or maintenance/tooling economics are poor |
| **STOP** | Meaningful checkpoint construction still requires the hidden manifest or broad manual re-exploration |

**Novelty is not a GO criterion.**

---

# Non-goals

- Do not prove 100% visual coverage.
- Do not invent checkpoint-completeness percentages.
- Do not invent human-effort-reduction percentages.
- Do not require exactly 22 states.
- Do not build a Percy replacement.
- Do not put LLM/VLM interpretation in the normal every-PR pixel-diff loop.
- Do not inspect every animation frame with vision by default.
- Do not claim novelty for state abstraction/near-duplicate detection.
- Do not treat PDiff as automatically authoritative.
- Do not assume source coverage is inadequate before measuring it.
- Do not treat CSS scroll animation as a zero-value control.
- Do not hide CTWalk adapter help.
- Do not overwrite authoritative baseline artifacts.
- Do not weaken Method v1 provenance, determinism, human-authority or baseline-lifecycle requirements.
