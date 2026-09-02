# Phase A Contamination Control — Parked Future-Validation Infrastructure

Status: **PARKED. Normative only when a frozen V1 enters formal blind validation.**
Established: 2026-09-02 by scanning tracked files on `phase1/verification-f40e365`.

Current #48 execution is supervised V1 development. During the current stage, developers,
the user and runtime LLMs **may read the known checkpoint reference** as a debugging oracle.
This file must therefore **not** be used to restrict normal Stage-1/Stage-2 development.

What remains active now is narrower:

> The generic V1 discovery runner must not read or hard-code the reference inventory.

The strict reviewer allowlist below becomes active only **after V1 freeze**, when the
project deliberately starts an independent reconstruction experiment.

---

## 1. Why this file still matters

The original blind-validation design used a denylist that named only:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`
- `scripts/ui-ux-baseline-plan.json`
- historical baseline-review material enumerating the desired checkpoint set

A scan showed that this was insufficient. Multiple other files expose checkpoint IDs.
That remains a real methodological finding for future validation.

Tracked files carrying three or more desktop checkpoint IDs included:

| File | Distinct checkpoint IDs | Future blind-review severity |
| --- | ---: | --- |
| `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md` | 28 | explicit reference |
| `scripts/ui-ux-baseline-plan.json` | 28 | explicit reference |
| `docs/ui-ux/UI_UX_TEST_CONTROL.md` | 28 | critical leakage |
| `scripts/controls/ui-ux-test-control.js` | 28 | critical leakage |
| `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md` | 22 | critical leakage |
| `ui-ux-baselines/1c1990ef0/baseline-manifest.json` | 28 | high |
| `scripts/review/ground-truth.json` | 28 | high |
| `scripts/review/detectors.json` | 28 | high |
| `docs/ui-ux/UI_UX_BASELINE_REVIEW.md` | 19 | high |
| `scripts/review/calibration-round3.txt` | 9 | medium |
| `scripts/review/repeatability.mjs` | 7 | medium |
| `scripts/review/detectors.mjs` | 5 | medium |
| `docs/ui-ux/UI_UX_REVIEW_METHOD.md` | 4 | low |

A future reviewer following broad repository instructions could therefore become
contaminated without deliberately cheating.

---

## 2. Current development-stage rule

During supervised development:

```text
developer / runtime LLM
    may read known 22-state reference
    may read research and historical evidence
    may compare V1 output to the reference

V1 discovery runner
    must not consume the reference as candidate truth
```

The current development authority is:

- `V1_DEVELOPMENT_STAGE.md`
- `V1_MATERIALS_ACCUMULATION_BRIEF.md`
- Issue #48
- `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md`

Do not call a development session "contaminated" merely because it read the reference.
It is only contaminated **for the later blind-review role**.

---

## 3. Future blind-reviewer allowlist — activate only after V1 freeze

When formal independent validation begins, the blind reviewer may read **only**:

```text
ui-ux-golden-path-discovery/PHASE_A_BLIND_REVIEWER_BRIEF.md
<future frozen validation run>/llm-review-packet.json
<future frozen validation run>/candidate-images/**
    only images referenced by the packet
```

Nothing else: not the repository, docs tree, issue body/comments, runbook, test-control
source, research record or historical evidence.

If the reviewer needs information outside the packet, it must request it explicitly rather
than fetch it.

---

## 4. Future quarantine list

For a formal blind reviewer, quarantine at least:

```text
docs/ui-ux/UI_UX_TEST_CONTROL.md
docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md
docs/ui-ux/UI_UX_BASELINE_REVIEW.md
docs/ui-ux/UI_UX_REVIEW_METHOD.md
scripts/controls/ui-ux-test-control.js
scripts/review/**
ui-ux-baselines/**
phase1-verification-evidence/**
pre-skill-bundle/**
ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md
ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md
ui-ux-golden-path-discovery/ISSUE_48_REVISION_DRAFT.md
ui-ux-golden-path-discovery/HANDOFF.md
ui-ux-golden-path-discovery/V1_DEVELOPMENT_STAGE.md
ui-ux-golden-path-discovery/V1_MATERIALS_ACCUMULATION_BRIEF.md
Issue #48 body and comments
```

The exact list should be re-scanned when V1 freezes because new leakage files may have
appeared.

---

## 5. Role/access model for future validation

| Role | Access |
| --- | --- |
| V1 developer | full repo/reference access |
| Human/product authority | full repo/reference access |
| Validation orchestrator | full access; must not relay hidden inventory to reviewer |
| Blind reviewer | explicit allowlist only |

The current user and existing runtime sessions already know the reference. They can continue
working as developers/orchestrators, but cannot later produce the formal blind proposal.

---

## 6. Machine enforcement

`npm run uiux:test:discovery-contract` currently checks both:

1. the useful **development boundary** — discovery/augmentation code does not embed known
   checkpoint IDs or consume the manifest/plan;
2. parked future-validation hygiene — the blind-reviewer brief contains no checkpoint IDs
   and critical leakage vectors are documented.

The second category is preserved so the future validation harness does not decay while V1
is being built. It is not a current requirement that development agents themselves remain
blind.

---

## 7. Future activation gate

Do not activate the blind-review process until Stage 2 freezes a V1 implementation with:

- pinned discovery code/input/output contract;
- stable mechanical sampling;
- explicit CTWalk adapter boundary;
- known limitations / `not_covered`;
- no further oracle-driven mechanism tuning during the validation attempt.

Then re-scan contamination surfaces, freeze the validation evidence, and use the allowlist.

The sequencing rule is now:

```text
supervised development
→ V1 freeze
→ blind validation
```

not:

```text
supervised development and blind validation simultaneously
```
