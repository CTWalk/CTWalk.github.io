# V1 Materials Accumulation Brief

Status: **current input brief for a fresh runtime LLM during V1 development.**
This is not a blind-review brief.

Purpose: accumulate the source/runtime/reference evidence needed to improve the current V1
discovery mechanism before any further algorithm change is made.

---

## 1. Role

You are a development/research agent working on `CTWalk/CTWalk.github.io`.

You are **not** acting as an independent blind reviewer. You may inspect the known 22-state
desktop reference and historical project evidence. Your job is to use that knowledge as a
debugging oracle for the V1 mechanism, while ensuring the generic discovery runner itself
does not simply consume or hard-code the oracle.

Do not claim independent rediscovery or Skill readiness from this work.

---

## 2. Start state

Work from branch:

```text
phase1/verification-f40e365
```

Before analysis:

```bash
git fetch --all --prune
git checkout phase1/verification-f40e365
git pull --ff-only
git status --porcelain
```

Stop and report if the worktree is not clean or the branch changed underneath the analysis.
Record the exact SHA, Node version, Playwright version, browser executable/version, OS and
DSF if runtime work is performed.

---

## 3. Read these first

Current sequencing / rationale:

1. `ui-ux-golden-path-discovery/V1_DEVELOPMENT_STAGE.md`
2. Issue #48
3. `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md`
4. `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
5. `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
6. `ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md`
7. `ui-ux-golden-path-discovery/HANDOFF.md`

Known reference / deterministic control:

8. `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`
9. `scripts/ui-ux-baseline-plan.json`
10. `docs/ui-ux/UI_UX_TEST_CONTROL.md`
11. `scripts/controls/ui-ux-test-control.js`

Current V1 implementation:

12. `scripts/discovery/golden-path-discovery-v1.mjs`
13. `scripts/discovery/augment-golden-path-review-packet-v1.mjs`
14. `scripts/tests/golden-path-discovery-contract.test.mjs`
15. `package.json`

Historical/mechanical evidence may be used as supporting development evidence:

16. `phase1-verification-evidence/0a28d38/README.md`
17. `phase1-verification-evidence/0a28d38/capture-metadata.json`
18. `phase1-verification-evidence/0a28d38/mechanical-audit.json`
19. `phase1-verification-evidence/0a28d38/determinism-sweep.json`

Do not treat historical evidence as current human acceptance.

---

## 4. Source/runtime material to mine

Do not limit yourself to the files below if source inspection reveals other active owners.
At minimum map:

- `index.html` — global scene choreography and inline owners;
- `commerce-integrated.js` — Commerce continuous render/state/evidence transitions;
- `social-runtime.js` — Social state/render ownership;
- `experience-pacing.js` — scene-specific pacing/presentation writes;
- `evidence-readability.js` — evidence emphasis/readability behavior;
- `outro-heatmap.js` — Outro continuous/interaction state;
- mobile runtime files only where they help distinguish reusable assumptions from desktop
  assumptions;
- tests/fixtures that already encode meaningful UI states or transitions.

For every desktop scene, identify:

```text
primary render owner(s)
state/progress variables
important thresholds / plateaus / handoffs
dominant text/evidence changes
settled/hold regions
continuous/transient-only behavior
locale/reduced-motion effects relevant to state discovery
runtime dependencies / assets
existing deterministic controls
```

---

## 5. Build a known-reference responsibility map

Use the current 22 normal-motion desktop checkpoints as a **development oracle**.

For each reference checkpoint, record:

```text
checkpoint ID
semantic responsibility
why it historically deserved a baseline
source/runtime owner(s)
approximate scene-progress region / transition boundary
observable DOM/runtime signals
visual evidence change, if any
whether the responsibility is source-enumerable, runtime-derived, visually-derived,
temporal-only, or product-intent-dependent
what V1 would need to observe to surface it without reading the checkpoint ID
```

Do not assume every reference checkpoint is correct. Mark any item whose unique regression
value appears weak or whose responsibility could be represented better by another state.

---

## 6. Run the current V1 as a baseline

Before modifying the algorithm:

```bash
npm install
npx playwright install chromium
npm run uiux:test:discovery-contract
npm run uiux:discover-golden-path
```

If the repository/host requires the previously documented browser override, record it
explicitly rather than silently changing browser versions.

Preserve the resulting discovery evidence and review packet outside authoritative baseline
paths.

Then inspect:

- dense sample observations;
- adjacent structural deltas;
- selected candidate indices/regions;
- retained candidate screenshots;
- generated review-packet contents;
- any source-signal summary produced by V1.

This first run is the **V1 development baseline**. Do not change the algorithm before its
failure modes are written down.

---

## 7. Diagnose discrepancies by layer

Compare V1 output against the known-reference responsibility map, not only checkpoint
names or count.

For each important reference responsibility, determine:

```text
SURFACED
- V1 retained enough evidence to identify the responsibility.

LOST_AT_SOURCE_MINING
- source contains useful state semantics/anchors but V1 does not mine them.

LOST_AT_RUNTIME_SAMPLING
- V1 never samples a useful location/state.

LOST_AT_STRUCTURAL_SIGNAL
- the state exists in observations but produces too little / wrong delta signal.

LOST_AT_CANDIDATE_SELECTION
- signal exists but candidate compression removes the useful region.

LOST_AT_EVIDENCE_PACKAGING
- candidate exists but the LLM/human packet cannot understand why it matters.

REASONING_ONLY
- packet contains sufficient evidence; interpretation is the remaining problem.

DETERMINISTIC_CONTROL_GAP
- state cannot be reproduced/stabilized reliably.

PRODUCT_INTENT_ONLY
- code/runtime cannot establish why the state deserves a baseline.

REFERENCE_QUESTIONABLE
- historical 22 may be redundant/misaligned; do not force V1 to imitate it.
```

Also classify V1 false positives / noise:

```text
intermediate animation frame
same visual responsibility as neighbour
DOM-heavy but visually trivial change
asset/layout noise
transient state with no stable capture value
functional-only difference
```

---

## 8. Required output artifacts

Create a development directory such as:

```text
ui-ux-golden-path-discovery/development-v1/
```

Produce at least:

### `SOURCE_RUNTIME_MAP.md`

Scene-by-scene source/runtime ownership and state-variable map.

### `REFERENCE_RESPONSIBILITY_MAP.md`

Known 22-state responsibilities mapped to source/runtime/visual evidence and the generic
signals V1 would need to detect them.

### `V1_BASELINE_DIAGNOSTIC.md`

Current V1 run results, important surfaced responsibilities, false negatives, false
positives, and failure-layer attribution.

### `V1_IMPROVEMENT_QUEUE.md`

Ranked proposed mechanism changes. For each proposal include:

```text
problem demonstrated
supporting evidence
failure layer
proposed generalizable change
why it is not simply hard-coding the 22
expected benefit
risk / likely new false positives
how to verify after implementation
```

### `MATERIAL_GAPS.md`

Anything still unknown or expensive to infer, including additional runtime probes or
human/product questions needed before an implementation decision.

---

## 9. Stop boundary

For this pass, **accumulate and diagnose first**.

Do not make broad V1 algorithm changes until the evidence artifacts above exist.

You may make a tiny instrumentation-only correction if the current runner cannot produce
its documented evidence at all, but record that separately and do not reinterpret the
result as algorithm improvement.

Do not:

- implement the known 22 directly into the discovery runner;
- edit authoritative #6 baseline artifacts;
- claim the existing 22 are complete;
- claim blind/independent validation;
- activate the blind-reviewer workflow yet;
- start Repo B;
- build Percy/Chromatic replacement infrastructure;
- add arbitrary success percentages.

The desired handoff from this pass is:

```text
We now know what V1 sees,
what it misses,
where each miss happens,
and which smallest generalizable mechanism changes are worth trying next.
```
