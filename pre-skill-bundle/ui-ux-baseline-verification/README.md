# Pre-skill bundle — rendered UI/UX baseline verification

Status: **raw material for a future skill. Not a skill. Not a verdict set. Not a baseline.**

Collected during the #6 evidence run against candidate revision
`b22da62f824c4903320a07af4311785c4f915b4b`.

## Skill-distillation gate

This bundle does **not** decide when the method is ready to become a reusable Skill.
That decision is governed by `docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md`
§§9–12.

The trigger is deliberately strict:

```text
Total Skill-readiness score = 100 / 100
AND
Every readiness dimension = 10 / 10
AND
Every hard gate = PASS
```

Until that condition is formally demonstrated, this repository must describe the
work as **method development / pre-skill evidence**, even if the method appears
valuable, novel, or likely to reduce effort.

`SKILL_READINESS_CROSSWALK.md` maps the newer material in this bundle back to that
existing gate and records which requirements remain unfulfilled.

## Why this folder exists

Across two verification runs on this repository (`1c1990ef`, then `b22da62`) a
repeatable working method emerged for a problem that turns out to be poorly
served by existing tooling: **deciding which rendered UI states are trustworthy
enough to freeze as golden baselines, when the product is animation-driven,
bilingual, and has separate desktop and mobile presentations.**

The intent is to distil that method into a reusable skill **only after the Method
v1 readiness gate is satisfied**. This folder freezes the inputs before
distillation, so any future Skill is written from evidence rather than from
memory:

- what was actually run, in what environment, with what result (`run-log/`);
- the throwaway probes written to answer questions the repo tooling could not
  (`tools/`);
- what prior art already exists, and precisely where it stops
  (`RESEARCH_PRIOR_ART.md`);
- the method decisions reached during the run, including rejected alternatives
  and the source-revision stop condition (`DECISION_HISTORY.md`);
- the open design questions the method still has to answer (`OPEN_QUESTIONS.md`);
- how all of that evidence maps back to the formal Skill-readiness dimensions
  and hard gates (`SKILL_READINESS_CROSSWALK.md`).

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
  side branch. The evidence itself remains pinned to `b22da62` even though
  `origin/main` later advanced to `f40e365829af05781cca597dcdb8d97b7c4576d0`.
- **No Skill-readiness claim.** Useful evidence in this folder may improve one or
  more Method v1 dimensions, but it cannot substitute for a formal 100/100 review
  with every hard gate passing.

## Source lifecycle note

The `b22da62` capture was valid when produced, but before the planned blind-first
calibration review continued, `origin/main` advanced to `f40e365`. Changed files
included mobile/bootstrap/runtime material directly relevant to assertions in the
run. The project rule therefore triggered: **stop rather than silently continue
against a stale candidate or silently switch revisions.**

This does not invalidate `b22da62` as historical evidence. It does mean that its
remaining review cannot be presented as current-main baseline approval unless
`b22da62` is explicitly re-selected as the intended freeze candidate. See
`DECISION_HISTORY.md` for the alternatives and method implications.

## Relationship to what is already in the repo

`docs/ui-ux/UI_UX_REVIEW_METHOD.md` is the v1 empirical write-up, distilled from
the `1c1990ef` run.

`docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md` is the **maturity standard**
that governs whether those empirical lessons are sufficiently portable,
implemented, and evidenced to justify Skill distillation. The two documents are
not interchangeable: accumulating more CTWalk findings does not automatically
increase Skill readiness.

This bundle carries the deltas learned since:

- the active matrix changed shape (130 → 78; mobile became a dedicated
  two-checkpoint fallback rather than a seven-scene mirror);
- v1's measured detector precision does **not** transfer across that change, and
  must not be quoted as if it does;
- the "never infer semantic identity from rendered state" rule recurred as a
  live bug in a second, independent tool — evidence it belongs in the method as a
  first-class verifier rule rather than a footnote;
- detector-led triage is not valid calibration when detector output is shown
  before human labels; the accepted ordering is blind labels → calibration →
  triage;
- full-resolution screenshot review dominated context/token cost, strengthening
  the case for calibrated, risk-aware review rather than unconditional exhaustive
  image opening;
- candidate SHA freshness is part of evidence identity: when main moves through
  files relevant to the assertions, review must stop or explicitly remain pinned
  to the older revision.

These are inputs to the readiness review, not permission to skip it.

## Reading order

1. `README.md` (this file) — intent, scope and the formal distillation gate
2. `SKILL_READINESS_CROSSWALK.md` — current evidence mapped to Method v1 readiness
3. `DECISION_HISTORY.md` — decisions, rejected alternatives, cost lesson and source stop
4. `RESEARCH_PRIOR_ART.md` — what exists, what does not
5. `run-log/ENVIRONMENT.md` — the exact controlled environment
6. `run-log/RUN_LOG.md` — what was executed and what it produced
7. `run-log/FINDINGS_SO_FAR.md` — verified remediations, current defects, instability
8. `OPEN_QUESTIONS.md` — unresolved method/readiness questions
9. `tools/` — the probes, with notes on what each was written to answer
