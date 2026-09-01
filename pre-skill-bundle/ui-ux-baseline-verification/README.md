# Pre-skill bundle — rendered UI/UX baseline verification

Status: **raw material for a future skill. Not a skill. Not a verdict set. Not a baseline.**

Collected during the #6 evidence run against candidate revision
`b22da62f824c4903320a07af4311785c4f915b4b`.

## Why this folder exists

Across two verification runs on this repository (`1c1990ef`, then `b22da62`) a
repeatable working method emerged for a problem that turns out to be poorly
served by existing tooling: **deciding which rendered UI states are trustworthy
enough to freeze as golden baselines, when the product is animation-driven,
bilingual, and has separate desktop and mobile presentations.**

The intent is to distil that method into a reusable skill. This folder freezes
the inputs before distillation, so the skill is written from evidence rather
than from memory:

- what was actually run, in what environment, with what result (`run-log/`);
- the throwaway probes written to answer questions the repo tooling could not
  (`tools/`);
- what prior art already exists, and precisely where it stops
  (`RESEARCH_PRIOR_ART.md`);
- the open design questions the skill still has to answer (`OPEN_QUESTIONS.md`).

## What is deliberately NOT here

- **No screenshots.** The 78 candidates for `b22da62` are capture output, not
  approved baselines. Committing them here would blur exactly the line this
  method exists to hold. They live in the run's candidate directory and are
  reproducible with the command in `run-log/RUN_LOG.md`.
- **No verdicts for `b22da62`.** At the time this bundle was cut, 22 of 78
  candidates had been reviewed by eye. An incomplete verdict set is worse than
  none, because it invites being mistaken for a complete one.
- **No changes to the candidate revision.** Nothing in this folder touches
  production code, the test controls, the capture scripts, the baseline plan, or
  dependency versions. It is additive documentation and throwaway tooling on a
  side branch; `main` remains at `b22da62`.

## Relationship to what is already in the repo

`docs/ui-ux/UI_UX_REVIEW_METHOD.md` is the v1 write-up, distilled from the
`1c1990ef` run. It remains accurate about staging and about detector
calibration. This bundle carries the deltas learned since:

- the active matrix changed shape (130 → 78; mobile became a dedicated
  two-checkpoint fallback rather than a seven-scene mirror);
- v1's measured detector precision does **not** transfer across that change, and
  must not be quoted as if it does;
- the "never infer semantic identity from rendered state" rule recurred as a
  live bug in a second, independent tool — evidence it belongs in the skill as a
  first-class rule rather than a footnote.

## Reading order

1. `README.md` (this file) — intent and scope
2. `RESEARCH_PRIOR_ART.md` — what exists, what does not
3. `run-log/ENVIRONMENT.md` — the exact controlled environment
4. `run-log/RUN_LOG.md` — what was executed and what it produced
5. `run-log/FINDINGS_SO_FAR.md` — verified remediations, current defects, instability
6. `OPEN_QUESTIONS.md` — what the skill must still decide
7. `tools/` — the probes, with notes on what each was written to answer
