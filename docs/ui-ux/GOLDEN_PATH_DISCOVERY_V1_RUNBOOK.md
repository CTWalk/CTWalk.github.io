# Golden-Path Discovery V1 Runbook

Status: **experimental implementation for Issue #48 — supervised development mode**  
Current stage: **build/calibrate V1 on CTWalk before blind validation.**

Current execution authority:

- `ui-ux-golden-path-discovery/V1_DEVELOPMENT_STAGE.md`
- `ui-ux-golden-path-discovery/V1_MATERIALS_ACCUMULATION_BRIEF.md`
- Issue #48

Research / prior-art base:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
- `ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md`

Future blind-validation infrastructure is preserved but parked:

- `ui-ux-golden-path-discovery/PHASE_A_CONTAMINATION_CONTROL.md`
- `ui-ux-golden-path-discovery/PHASE_A_BLIND_REVIEWER_BRIEF.md`

---

## 1. What we are doing now

CTWalk is currently a **known development fixture**.

The developer, user and runtime LLM may read the existing 22 normal-motion desktop
checkpoints and use them to debug V1.

The current loop is:

```text
understand source/runtime ownership
        ↓
run current V1 unchanged
        ↓
inspect samples / deltas / candidates / packet
        ↓
compare against known CTWalk visual responsibilities
        ↓
attribute each miss/noise item to a mechanism layer
        ↓
propose the smallest generalizable V1 change
        ↓
rerun
```

This stage does **not** claim independent discovery or Skill readiness.

---

## 2. Critical boundary: informed developer, reference-independent runner

The developer may know the 22. The generic discovery runner must still earn its candidates
from source/runtime evidence.

The runner must not:

- read `scripts/ui-ux-baseline-plan.json`;
- read `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- call `goToCheckpoint()` as the discovery mechanism;
- use `.checkpointIds` as candidate truth;
- embed known checkpoint IDs / per-scene expected output lists merely to match the oracle.

This is why `npm run uiux:test:discovery-contract` remains useful during supervised
development.

Correct development pattern:

```text
V1 misses an important known responsibility
→ inspect why the generic evidence pipeline lost it
→ improve a generalizable signal/heuristic
```

Incorrect pattern:

```text
V1 misses commerce.quiet-after-checkout
→ explicitly add commerce.quiet-after-checkout to output
```

---

## 3. Current V1 command

From a clean checkout of `phase1/verification-f40e365`:

```bash
git status --porcelain
npm install
npx playwright install chromium
npm run uiux:test:discovery-contract
npm run uiux:discover-golden-path
```

Record:

- exact source SHA;
- worktree cleanliness before execution;
- Node version;
- Playwright version;
- browser executable/version;
- OS and DSF;
- any `BASELINE_BROWSER_EXECUTABLE` override.

The generated discovery output is development evidence only. Do not place it in or promote
it to authoritative #6 baseline paths.

---

## 4. Important adapter boundary

V1 is not a zero-adapter unknown-repo crawler.

It deliberately reuses CTWalk verification infrastructure:

```text
window.__portfolioTest.sceneIds
window.__portfolioTest.setSceneProgress(...)
window.__portfolioTest.waitForVisualSettle(...)
```

Treat these as **CTWalk adapter knowledge**, not reusable engine logic.

Reusable-engine candidates currently include:

```text
source/static signal mining
dense normalized sampling
runtime observation capture
structural change evidence
candidate compression
selective screenshot evidence
review-packet construction
future perceptual-distance evidence
failure-layer attribution
```

CTWalk adapter includes:

```text
scene identities
setSceneProgress()
settle implementation
verification-mode deterministic hooks
```

A successful CTWalk development run therefore does not prove zero-setup portability.

---

## 5. What V1 does today

### Layer 1 — source/test signals

The runner scans application JavaScript, `index.html`, and tests for hints such as:

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

At desktop `1440x900`, V1 uses the scene-progress adapter and records visible browser facts
across normalized progress samples:

- visible text/elements;
- bounding boxes;
- opacity;
- transforms/filters;
- image/background sources;
- semantic/ARIA text;
- area share;
- color/background;
- z-index.

Adjacent samples receive a structural change score.

### Layer 3 — candidate compression

V1 selects scene boundaries, local structural-change peaks and representative stable spans.

This is the first place important visual responsibilities can be lost.

### Layer 4 — selective screenshots / review packet

V1 persists screenshots only for selected candidates. Therefore the review packet is a
**compressed view of the dense runtime evidence**, not the complete sample stream.

This distinction matters when diagnosing misses:

```text
state existed in dense samples but never became a candidate
!=
candidate existed but reviewer could not understand it
```

---

## 6. First task for a fresh runtime LLM

Before further algorithm changes, follow:

`ui-ux-golden-path-discovery/V1_MATERIALS_ACCUMULATION_BRIEF.md`

Produce:

```text
ui-ux-golden-path-discovery/development-v1/
  SOURCE_RUNTIME_MAP.md
  REFERENCE_RESPONSIBILITY_MAP.md
  V1_BASELINE_DIAGNOSTIC.md
  V1_IMPROVEMENT_QUEUE.md
  MATERIAL_GAPS.md
```

The fresh runtime LLM is **not blind**. It may read the known reference and historical
evidence because its role is mechanism development.

Do not change the algorithm until the baseline diagnostic exists, except for a narrowly
recorded instrumentation fix required to make the documented evidence observable.

---

## 7. Development-oracle comparison

Compare by semantic responsibility, not exact checkpoint name/count.

For each known important CTWalk responsibility, classify:

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

Also record false positives:

```text
intermediate animation frame
visually redundant state
DOM-heavy but visually trivial change
functional-only difference
asset/layout noise
unstable/transient evidence
```

The point is to identify **where the mechanism failed**, not to produce an `N / 22` score.

---

## 8. Improvement rule

Every proposed mechanism change must have:

```text
problem demonstrated
supporting source/runtime evidence
failure layer
generalizable mechanism change
why it does not hard-code the known 22
expected benefit
risk / likely false positives
verification plan
```

Potential generalizable changes include:

- better stable-span detection;
- source/evidence-change weighting;
- repeated-node identity handling;
- source-derived timeline anchors;
- structural + perceptual signal fusion;
- richer neighboring-sample context;
- better review-packet evidence.

Do not implement a change solely because it makes CTWalk match the historical list.

---

## 9. Stage-2 freeze gate

Move from supervised development to V1 freeze only when:

- important CTWalk responsibilities are surfaced or their absence is explicitly
  attributable;
- obvious frame noise is compressed;
- deterministic sampling is stable enough to compare revisions;
- review evidence is sufficient to diagnose candidate differences;
- remaining human/product-intent questions are narrow;
- reusable logic and CTWalk adapter are distinguishable;
- `not_covered` / known limitations are explicit;
- the generic runner still does not consume the reference inventory.

At freeze:

- pin source SHA / V1 code version;
- pin input/output contract;
- define reproducible output layout;
- preserve mechanical repeatability evidence;
- stop modifying V1 based on knowledge of the future validation answer.

---

## 10. Future blind validation — parked

Only after V1 freeze should the project run the previous independent reconstruction
experiment.

Then reactivate:

```text
PHASE_A_CONTAMINATION_CONTROL.md
PHASE_A_BLIND_REVIEWER_BRIEF.md
fresh reviewer / explicit allowlist
frozen evidence packet
independent proposal
reasoning-repeatability check
reference reveal after proposal freeze
```

The current user and current/past runtime sessions already know the CTWalk reference and
cannot be formal blind reviewers. That is irrelevant during the current supervised stage.

The contamination audit remains valuable because it demonstrated that a simple denylist
is insufficient; many repository files leak checkpoint identities.

---

## 11. Later research controls — not current blockers

After a frozen V1 survives independent validation, then consider:

### Existing abstraction/perceptual benchmark

- compare structural evidence with raw perceptual-distance evidence on the same unfiltered
  sample positions;
- do not reproduce full Crawljax/classifier infrastructure without evidence that it is
  necessary;
- accept structural, perceptual or hybrid outcomes.

### Source-coverage diagnostic

- test whether visually distinct states collide under cheap V8 function/range coverage;
- do not assume coverage inadequacy;
- do not build full branch instrumentation unless needed.

### Storybook control

- explicit stories/fixtures should cause the mechanism to consume existing state
  enumeration rather than rediscover everything.

### Declarative CSS animation boundary

- parse timeline/keyframe/range metadata first;
- reduce brute-force runtime exploration;
- retain visual reasoning only for unresolved combined composition.

These remain research requirements before broad portability/Skill claims, but they do not
block V1 construction.

---

## 12. Boundaries

V1 development is not intended to:

- replace the authoritative #6 baseline;
- silently change the current 22 checkpoints;
- prove complete UI coverage;
- prove independent discovery during supervised calibration;
- replace Percy/Chromatic/Playwright diffing;
- put LLM vision into every PR;
- prove portability from CTWalk alone;
- claim that CTWalk was explored without project-specific adapter help.

Current job:

```text
known CTWalk product knowledge
+
source/runtime evidence
+
current V1 output
        ↓
precise mechanism diagnosis
        ↓
small evidence-backed V1 improvements
```
