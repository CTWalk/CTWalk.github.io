# V1 Development Stage — Current #48 Execution Mode

Status: **current normative execution mode for Issue #48.**
Established: 2026-09-02.

This document corrects the sequencing of the golden-path discovery work. The project is
currently **building and calibrating a V1 discovery mechanism**, not yet validating a
finished method or Skill through a blind reconstruction experiment.

---

## 1. Current objective

Use CTWalk as a **known development fixture** to build a useful discovery mechanism:

```text
repo/source evidence
        ↓
runtime sampling
        ↓
change/state signals
        ↓
candidate compression
        ↓
review packet
        ↓
known-reference diagnosis
        ↓
V1 improvement
```

The immediate engineering questions are:

- Does the runner understand the relevant source/runtime owners?
- Does deterministic sampling expose the meaningful visual changes?
- Does candidate compression retain important holds, handoffs, evidence changes and
  settled states?
- Which known responsibilities does V1 miss, and at which layer are they lost?
- Which candidates are noise/redundancy?
- Does the review packet contain enough evidence to explain the result?
- Which signals should be added, removed, or combined before V1 is frozen?

This stage does **not** claim independent discovery, portability, or Skill readiness.

---

## 2. The existing 22-state desktop inventory is allowed as a development oracle

During this stage, developers, the user, and runtime LLMs may read:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`;
- `docs/ui-ux/UI_UX_TEST_CONTROL.md`;
- historical review/evidence records;
- the research and execution-review documents;
- the current source and tests.

The known 22 desktop normal-motion checkpoints are useful because they preserve hard-won
project knowledge such as intentional quiet intervals, evidence/state pairings, handoffs,
reading holds and settled conclusions.

They are an **oracle for debugging**, not unquestionable truth. V1 may expose:

- a known checkpoint it cannot justify;
- a known checkpoint that appears redundant;
- a meaningful state the historical 22 missed;
- a responsibility that cannot be inferred without product intent.

Those findings should be recorded rather than forced to match 22/22.

---

## 3. Critical boundary: informed development must not become hard-coded discovery

The **development agent may know the 22**. The **generic V1 discovery runner must still not
consume or encode the 22 as its answer**.

Keep these protections:

- no read of `scripts/ui-ux-baseline-plan.json` from the discovery runner;
- no read of the baseline manifest from the discovery runner;
- no `goToCheckpoint()` dependency for discovery;
- no `.checkpointIds` lookup as the source of candidate states;
- no special-case branch such as `if scene === commerce then emit expired-promo` merely
  because the oracle contains that checkpoint.

Allowed development use:

```text
run generic mechanism
→ compare output with known CTWalk responsibility
→ identify the missing signal / bad heuristic / insufficient evidence
→ improve a generalizable primitive
```

Disallowed shortcut:

```text
read known checkpoint inventory
→ emit those IDs/states directly
```

The existing discovery contract test remains useful primarily for this boundary.

---

## 4. Current stage model

### Stage 1 — V1 mechanism construction — **NOW**

CTWalk is supervised development data.

Use source, runtime, known 22-state responsibilities and prior evidence to understand:

- what the current V1 sees;
- what it misses;
- why it misses it;
- what implementation signal would improve the mechanism.

Iteration is allowed and expected.

### Stage 2 — V1 baseline implementation / freeze

When the mechanism stops changing merely to accommodate obvious CTWalk misses:

- pin the runner/version/input contract;
- define stable output artifacts;
- demonstrate mechanical repeatability;
- document CTWalk adapter knowledge separately from reusable logic;
- record known limitations / `not_covered`;
- freeze a V1 implementation candidate.

Only after this freeze does independent validation become meaningful.

### Stage 3 — blind validation — **PARKED**

Use a fresh reviewer/project context to test whether the frozen mechanism can reconstruct a
useful golden path without being taught the answer.

At this stage the following parked infrastructure becomes active again:

- `PHASE_A_CONTAMINATION_CONTROL.md`;
- `PHASE_A_BLIND_REVIEWER_BRIEF.md`;
- reviewer allowlist;
- independent proposal freeze;
- reasoning-repeatability checks.

The current user and existing runtime sessions already know the CTWalk reference and are
not valid blind reviewers. That is **not a problem during Stage 1/2**.

### Stage 4 — portability / Skill evaluation

Only after a frozen mechanism survives independent validation:

- apply it to unrelated Repo B;
- test artifact-first behavior such as Storybook consumption;
- test declarative-animation adaptation;
- benchmark existing abstraction primitives where useful;
- evaluate whether the combined workflow saves enough expert construction work to justify
  Skill distillation.

---

## 5. Current development loop

For each iteration:

```text
1. fresh branch/worktree check
2. inspect current V1 + relevant source/runtime ownership
3. run current V1
4. inspect raw observations and candidate reduction
5. compare with known CTWalk responsibilities
6. classify each discrepancy by failure layer
7. propose the smallest generalizable mechanism change
8. implement only after the evidence supports it
9. rerun and record whether the discrepancy changed
```

Useful discrepancy classes:

```text
source-mining miss
runtime-sampling miss
structural-signal miss
candidate-selection miss
screenshot/evidence-packaging miss
LLM/reviewer reasoning miss
deterministic-control gap
product-intent-only / cannot infer
historical-reference weakness
```

This attribution is more important than matching an exact checkpoint count.

---

## 6. Current success criteria

V1 development is ready to move toward freeze when:

- the runner remains independent from the reference inventory;
- known important CTWalk responsibilities can be surfaced or their absence is explicitly
  explainable;
- obvious animation-frame noise is compressed;
- the evidence packet makes important candidate differences diagnosable;
- deterministic sampling is stable enough that algorithm changes can be compared;
- misses are attributable to a specific layer rather than broad manual re-exploration;
- remaining human/product-intent questions are narrow;
- the reusable logic and CTWalk-specific adapter are distinguishable.

Do **not** require:

- exactly 22 output checkpoints;
- a completeness percentage;
- a human-effort-reduction percentage;
- blindness during development;
- Repo B before V1 is technically credible.

---

## 7. Parked validation infrastructure is not wasted work

The contamination audit found a genuine future-validation problem: many repository files
leak the reference inventory, so a later blind reviewer must operate from an allowlist.

That finding remains valid. The sequencing correction is simply:

```text
build first
→ freeze mechanism
→ then spend independence/blind-review effort
```

not:

```text
build and prove independence at the same time
```

Preserve the contamination-control files and tests so they can be activated after V1
freeze without reconstructing that work later.
