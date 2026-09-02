# Phase A contamination control

Status: **normative for #48 Phase A execution.**
Established: 2026-09-02, by scanning every tracked file on `phase1/verification-f40e365`.

## Finding: R1 as written is insufficient

R1 forbids the blind reviewer from using:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`
- `scripts/ui-ux-baseline-plan.json`
- historical baseline-review material enumerating the desired checkpoint set

A scan of all tracked files for desktop checkpoint identifiers found **13 files** carrying three or more, not two:

| File | Distinct checkpoint IDs | Severity |
| --- | ---: | --- |
| `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md` | 28 | named by R1 |
| `scripts/ui-ux-baseline-plan.json` | 28 | named by R1 |
| **`docs/ui-ux/UI_UX_TEST_CONTROL.md`** | **28** | **critical — the runbook directs the reviewer to this API** |
| **`scripts/controls/ui-ux-test-control.js`** | **28** | **critical — the runner depends on this file** |
| **`docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`** | **22** | **critical — #48 lists it first under "Research / decision base"** |
| `ui-ux-baselines/1c1990ef0/baseline-manifest.json` | 28 | high |
| `scripts/review/ground-truth.json` | 28 | high |
| `scripts/review/detectors.json` | 28 | high |
| `docs/ui-ux/UI_UX_BASELINE_REVIEW.md` | 19 | high |
| `scripts/review/calibration-round3.txt` | 9 | medium |
| `scripts/review/repeatability.mjs` | 7 | medium |
| `scripts/review/detectors.mjs` | 5 | medium |
| `docs/ui-ux/UI_UX_REVIEW_METHOD.md` | 4 | low |

The three marked critical are the problem. **#48 instructs the reviewer to read the research base, and that research base contains all 22 desktop normal-motion checkpoint IDs.** A reviewer following the ticket honestly is contaminated before sampling anything.

`docs/ui-ux/UI_UX_TEST_CONTROL.md` is equally exposed: the runbook tells the reviewer to navigate via `setSceneProgress()` / `waitForVisualSettle()`, and the document teaching that API also lists the full inventory.

This is a specification defect in the experiment, not a defect in the V1 implementation.

## What is clean

Verified by scan:

- `scripts/discovery/golden-path-discovery-v1.mjs` — **0** checkpoint IDs
- `scripts/discovery/augment-golden-path-review-packet-v1.mjs` — **0** checkpoint IDs

The runner derives scene identity from `data-scene` and `__portfolioTest.sceneIds`. `sceneIds` maps semantic scene names (`intro`, `commerce`, …) to DOM indices. **Scene names are not checkpoint names.** They are independently discoverable from the DOM and are already required to be declared as adapter knowledge under R3. Scene-level identity is therefore permitted; checkpoint-level identity is not.

## Blind-reviewer input allowlist

The Phase A blind reviewer may read **only**:

```text
ui-ux-golden-path-discovery/PHASE_A_BLIND_REVIEWER_BRIEF.md
ui-ux-golden-path-discovery/ctwalk-desktop-v1/run-N/llm-review-packet.json
ui-ux-golden-path-discovery/ctwalk-desktop-v1/run-N/candidate-images/**   (only those the packet references)
```

Nothing else. Not the repository, not the docs tree, not the issue body, not the runbook.

Rationale: the reviewer's job is to reason over frozen evidence. Every additional file is contamination surface with no compensating benefit — the packet is designed to be self-contained.

## Quarantine list

Forbidden to the blind reviewer, in addition to R1's two files:

```text
docs/ui-ux/UI_UX_TEST_CONTROL.md
docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md
docs/ui-ux/UI_UX_BASELINE_REVIEW.md
docs/ui-ux/UI_UX_REVIEW_METHOD.md
scripts/controls/ui-ux-test-control.js
scripts/review/**
ui-ux-baselines/**
phase1-verification-evidence/**
pre-skill-bundle/**                     (see note)
ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md
ui-ux-golden-path-discovery/EXECUTION_REVIEW_48.md
ui-ux-golden-path-discovery/ISSUE_48_REVISION_DRAFT.md
ui-ux-golden-path-discovery/HANDOFF.md
Issue #48 body and comments
```

**`pre-skill-bundle/` note:** it lives on the separate branch
`uiux/pre-skill-bundle-ui-ux-baseline-verification`. Its `run-log/FINDINGS_SO_FAR.md`
and `tools/ground-truth.json` enumerate checkpoint IDs. It is quarantined for the blind
reviewer, and it is not present on this branch, but a reviewer with repository-wide
access could reach it.

## Who may read what

| Role | Access |
| --- | --- |
| **Blind reviewer** (produces `independent-proposal.json`) | The allowlist only. Never the repository. |
| **Orchestrator** (runs the mechanism, freezes artifacts, does A3) | Everything. Must not relay quarantined content into the reviewer's context. |
| **Human acceptance authority** | Everything. |

## Machine enforcement

`npm run uiux:test:discovery-contract` now asserts that the blind reviewer brief contains
no desktop checkpoint identifiers, and that the discovery/augment scripts contain none.

This is a lint, not a proof. It cannot detect a reviewer that was handed forbidden
material out of band. Reviewer independence still has to be recorded honestly under R2.

## Recommended R1 amendment

> R1 — Manifest independence. The blind reviewer operates from an explicit input
> allowlist, not a forbidden-file list. Any file enumerating the expected checkpoint
> inventory is out of scope, including the test-control API documentation, the
> test-control source, the golden-path research record, persisted baseline manifests,
> and detector/calibration artifacts. See
> `ui-ux-golden-path-discovery/PHASE_A_CONTAMINATION_CONTROL.md`.

An allowlist is safer than a denylist here: the denylist has already been shown to miss
files, and new files enumerating checkpoints will keep appearing.
