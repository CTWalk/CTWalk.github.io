# Handoff — Current State of Golden-Path Discovery Work

Status: **orchestrator/development-agent facing.** Updated 2026-09-02 after the sequencing
correction that moved blind validation behind V1 construction.

Current branch:

```text
phase1/verification-f40e365
```

Current execution mode:

```text
Stage 1 — supervised V1 mechanism development
```

The current user and prior runtime sessions know the CTWalk 22-state reference. That is
expected and useful during development. They are only disqualified from a **future formal
blind validation**, which is not the current task.

---

## 1. Read in this order

1. `V1_DEVELOPMENT_STAGE.md` — current sequencing and boundaries.
2. `V1_MATERIALS_ACCUMULATION_BRIEF.md` — first task for a fresh runtime LLM.
3. Issue #48 — live implementation ticket.
4. `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md` — execution loop.
5. `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md` — why the discovery gap matters.
6. `EXECUTION_REVIEW_48.md` — prior-art / execution findings that still constrain design.
7. `COMPETITIVE_UNKNOWNS_AUDIT_48.md` — competitive/prior-art falsification record.

For development, it is also explicitly allowed to read:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`;
- `docs/ui-ux/UI_UX_TEST_CONTROL.md`;
- `scripts/controls/ui-ux-test-control.js`;
- historical deterministic/mechanical evidence.

The reference is an oracle for debugging, not input to the generic runner.

---

## 2. Current engineering question

We are no longer asking a fresh agent to prove:

> Can it independently reconstruct the historical 22 without seeing them?

We first need to answer:

> What does V1 currently see, what does it miss, where are those misses introduced, and
> which smallest generalizable mechanism changes are worth implementing?

The current loop is:

```text
known CTWalk responsibilities
+
source/runtime ownership
+
current V1 output
        ↓
failure-layer attribution
        ↓
evidence-backed V1 improvement queue
```

Do not spend independence/blind-review effort until V1 reaches a freeze candidate.

---

## 3. Critical boundary that remains active

Even though the developer may know the 22, the generic discovery runner must not consume
or hard-code them.

Keep the discovery contract protections:

- no baseline-plan read;
- no baseline-manifest read;
- no `goToCheckpoint()` discovery dependency;
- no `.checkpointIds` as candidate truth;
- no per-scene expected output list copied from the oracle.

Correct use of the oracle:

```text
known responsibility missing
→ determine why source/runtime/signal/compression/packet lost it
→ improve a reusable primitive
```

Incorrect use:

```text
known responsibility missing
→ add it directly to V1 output
```

---

## 4. Inherited deterministic substrate — keep

Two fixes on this branch remain load-bearing for meaningful runtime comparison:

| Commit | Fix |
| --- | --- |
| `3e888aa` | Intro Three.js loop frozen at a fixed time under `?uiux-test=1` only |
| `0a28d38` | Reduced-motion centered copy no longer loses its required centering transform |

Evidence is committed under:

```text
phase1-verification-evidence/0a28d38/
```

Important recorded facts from that evidence:

- 78/78 candidate captures completed for that historical candidate revision;
- same-route / selected alternate-route determinism comparisons were byte-identical;
- 0 settle failures / asset-gate failures in the recorded successful run;
- 0 horizontal overflow / broken images / clipped title-body lines after the fix;
- Commerce scenario pairing and noCode middle-step emphasis were mechanically verified;
- production animation still moves; the test freeze is opt-in.

These are development/mechanical facts, **not human acceptance**. The 78 candidates remain
`pending_authority` and #6 is separate from the current #48 work.

---

## 5. Current V1 implementation

Present:

```text
scripts/discovery/golden-path-discovery-v1.mjs
scripts/discovery/augment-golden-path-review-packet-v1.mjs
scripts/tests/golden-path-discovery-contract.test.mjs
npm run uiux:discover-golden-path
npm run uiux:test:discovery-contract
```

V1 currently:

```text
source/test signal scan
→ dense scene-progress sampling
→ runtime observation fingerprints
→ adjacent structural deltas
→ boundary/change-peak/stable-span candidate selection
→ selective screenshots
→ compressed review packet
```

The review packet is **not** the full dense sample stream. When a known responsibility is
missing, diagnose whether it disappeared during sampling, scoring, candidate selection, or
packet construction before blaming reasoning.

---

## 6. Immediate next task

Use a fresh runtime LLM with:

```text
V1_MATERIALS_ACCUMULATION_BRIEF.md
```

Do **not** ask it to be blind.

Its first pass should accumulate and diagnose, not redesign the algorithm immediately.
Required outputs:

```text
ui-ux-golden-path-discovery/development-v1/
  SOURCE_RUNTIME_MAP.md
  REFERENCE_RESPONSIBILITY_MAP.md
  V1_BASELINE_DIAGNOSTIC.md
  V1_IMPROVEMENT_QUEUE.md
  MATERIAL_GAPS.md
```

Only after these exist should the next V1 algorithm patch be selected.

---

## 7. Useful failure-layer taxonomy

For known responsibilities:

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

For noise / false positives:

```text
intermediate animation frame
visually redundant state
DOM-heavy but visually trivial change
functional-only difference
asset/layout noise
unstable/transient evidence
```

The objective is precise attribution, not an `N / 22` grade.

---

## 8. Parked future-validation infrastructure

Keep these files, but do not use them as current blockers:

```text
PHASE_A_CONTAMINATION_CONTROL.md
PHASE_A_BLIND_REVIEWER_BRIEF.md
```

The contamination audit found a real issue: repository-wide access leaks checkpoint
identities through many files, so a future blind reviewer must use a strict allowlist.

Re-activate that machinery only after V1 is frozen.

Future sequence:

```text
freeze V1
→ fresh blind reviewer / allowlist
→ independent reconstruction
→ reveal reference
→ unrelated Repo B
→ broader Skill evaluation
```

---

## 9. Research conclusions that still stand

Do not regress these decisions while implementing V1:

- state abstraction / near-duplicate detection is mature prior art, not our novelty;
- functional/GUI equivalence is not automatically visual-baseline equivalence;
- commercial systems already automate parts of state/session selection;
- PDiff is a comparator/primitive, not automatically the answer;
- Storybook should eventually be a consume/stand-down control;
- declarative CSS animation should trigger strategy adaptation, not blind brute-force
  exploration;
- source-coverage inadequacy must be measured later rather than assumed;
- CTWalk `__portfolioTest` controls are adapter knowledge;
- Playwright remains the likely recurring regression backend after golden-path construction.

---

## 10. Branch / authority status

```text
origin/main                         f40e365   untouched by this research branch
phase1/verification-f40e365        active V1 development branch
```

Nothing in #48 is an authoritative baseline approval.
No candidate screenshot becomes golden because V1 captures it.
Do not overwrite #6 baseline artifacts while developing the discovery mechanism.
