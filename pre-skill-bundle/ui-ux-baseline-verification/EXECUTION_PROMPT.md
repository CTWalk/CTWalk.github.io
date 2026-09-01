# CTWalk UI/UX Verification → Skill Readiness Execution Prompt

You are continuing the rendered UI/UX verification work in:

https://github.com/CTWalk/CTWalk.github.io

Your objective is **not to build the reusable Skill yet**.

Your job is to finish and validate the repository-specific CTWalk verification system, preserve any new method-development evidence, and then perform the formal Skill-readiness assessment. Only if the repository's existing Skill-distillation gate is fully satisfied may you recommend starting Skill construction.

## Governing rule

The repository already defines the Skill-readiness trigger.

A reusable Skill may be proposed only when:

```text
Total score = 100 / 100
AND
every readiness dimension = 10 / 10
AND
every Method v1 hard gate = PASS
AND
the Human Verification Amendment hard gate = PASS
```

Do not weaken, reinterpret, average, or bypass this rule.

Community value, novelty, token savings, a successful CTWalk run, or a promising architecture are useful evidence but **do not substitute for this gate**.

## First: fresh-read the repository

Fresh-fetch the current `main`.

Do not rely on any previously known SHA.

Record:

```text
origin/main SHA
working branch
worktree status
```

If `main` moves during authoritative verification, follow the existing source-freshness rule: stop and report rather than silently changing the candidate revision.

Before modifying anything, read and understand the current normative and historical material, including at minimum:

```text
docs/ui-ux/UI_UX_SPEC_PRECEDENCE.md
docs/ui-ux/UI_UX_ACCEPTANCE_CONTRACT.md
docs/ui-ux/UI_UX_BASELINE_MANIFEST.md
docs/ui-ux/UI_UX_TEST_CONTROL.md
docs/ui-ux/UI_UX_BASELINE_CAPTURE.md
docs/ui-ux/UI_UX_REVIEW_METHOD.md
docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md
docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1_HUMAN_VERIFICATION_AMENDMENT.md
```

Also read the pre-skill evidence bundle on the relevant branch, especially:

```text
pre-skill-bundle/ui-ux-baseline-verification/README.md
pre-skill-bundle/ui-ux-baseline-verification/DECISION_HISTORY.md
pre-skill-bundle/ui-ux-baseline-verification/RESEARCH_PRIOR_ART.md
pre-skill-bundle/ui-ux-baseline-verification/OPEN_QUESTIONS.md
pre-skill-bundle/ui-ux-baseline-verification/SKILL_READINESS_CROSSWALK.md
pre-skill-bundle/ui-ux-baseline-verification/run-log/RUN_LOG.md
pre-skill-bundle/ui-ux-baseline-verification/run-log/FINDINGS_SO_FAR.md
pre-skill-bundle/ui-ux-baseline-verification/run-log/ENVIRONMENT.md
```

Treat `SKILL_READINESS_CROSSWALK.md` as the current maturity crosswalk, while Method v1 + its Human Verification Amendment remain normative authority.

Historical `b22da62` evidence is historical evidence only. Do not silently treat it as evidence for current `main`.

---

# PHASE 1 — Finish the CTWalk-specific verification implementation

Finish the repository-specific UI/UX verification system before attempting Skill distillation.

Inspect the current implementation and determine which requirements are incomplete.

At minimum verify or complete:

## A. Semantic checkpoint control

The active matrix must resolve semantic checkpoint IDs, not magic scroll coordinates, sleeps, or visual-state guessing.

Never infer semantic identity from rendered opacity or other visual state.

Semantic identity must come from the checkpoint/test-control contract.

## B. Deterministic rendering

Enumerate every independent animation/render owner relevant to baseline capture, including:

```text
CSS animation / transition
Web Animations API
requestAnimationFrame loops
Canvas
WebGL / Three.js
time-dependent state
visit-history-dependent state
locale-switch state
reduced-motion state
```

`animations: 'disabled'` is not sufficient for manual RAF/WebGL loops.

Provide explicit deterministic test-mode control where required.

## C. Same-route repeatability

For representative states:

```text
fresh context
→ resolve
→ settle
→ capture
→ destroy context
→ repeat
→ compare
```

Classify:

```text
byte-identical
encoder-only difference
sub-perceptual renderer noise
genuine instability
```

Do not invent a tolerance to make instability pass.

## D. Alternate-route/path-independence

Where state history can matter, reach the same checkpoint through multiple valid paths.

A checkpoint that visibly depends on entry history is not freezeable until determinism is fixed.

## E. Mechanical audit

Cover the complete active matrix mechanically.

Collect facts rather than approval decisions, including where applicable:

```text
checkpoint identity
locale / html.lang
viewport
motion mode
presentation mode
horizontal overflow
image readiness
failed requests
console/runtime errors
text geometry
clipping
copy/evidence relationships
checkpoint-specific state pairing
reduced-motion evidence
```

## F. Capture provenance

Every authoritative candidate must be bound to:

```text
exact source SHA
clean worktree state
browser/runtime version
browser executable/build
Playwright/driver version
OS/runtime
device scale factor
viewport
locale
motion preference
semantic checkpoint
capture metadata
```

Environment deviations must be explicit.

## G. Verdict governance

Preserve:

```text
APPROVED
REJECTED
BLOCKED
```

Do not collapse REJECTED and BLOCKED.

Also preserve the distinction between:

```text
review proposal
vs.
acceptance authority
```

Capture/detector output must never automatically approve UX.

## H. Human-only/perceptual classes

Maintain explicit awareness of things automation cannot reliably settle, such as:

```text
natural CJK wrapping
edge crowding without geometric clipping
visual hierarchy
whether a quiet interval feels intentional
whether motion is perceptible in normal viewing
whether a kinetic checkpoint represents a meaningful human-visible state
```

## I. Actual-website human verification

This is a normative hard gate.

Screenshots, isolated harnesses, reconstructed DOMs, source inspection, detector output and Playwright captures are engineering evidence only.

Final authoritative human acceptance must occur on the **actual complete website presentation for the target revision**, through the real runtime path.

It must cover the relevant presentation/locale/motion surfaces.

Do not mark a final baseline fully APPROVED without this evidence.

---

# PHASE 2 — Produce one coherent final CTWalk baseline origin

Do not assemble the final golden baseline from unrelated source revisions.

The intended sequence is:

```text
final candidate SHA
→ authoritative capture
→ complete mechanical/determinism evidence
→ explicit candidate verdicts
→ actual-website human acceptance
→ coherent golden baseline
```

Use the repository's current active matrix, not obsolete historical matrices.

If defects or test-control gaps are discovered:

```text
classify
→ fix the correct owner
→ re-verify
→ establish a new coherent candidate SHA if required
```

Do not regenerate screenshots until they happen to look acceptable.

Do not modify checkpoint meaning merely to fit current rendering.

---

# PHASE 3 — Gather method-development evidence while doing the real work

This project is also the empirical source for a possible future reusable Skill.

Therefore preserve useful findings, but do not let research interfere with product correctness.

Record evidence when you discover:

```text
product defect
test-control/determinism defect
capture defect
detector defect
semantic checkpoint defect
false diagnostic hypothesis
human-only perceptual class
source-freshness invalidation case
portable rule
CTWalk-specific rule
```

Maintain the distinction:

```text
portable method principle
vs.
project-specific implementation/threshold/selector
```

Do not encode CTWalk-specific thresholds or checkpoint names as universal rules.

## Review-cost research

Full-resolution image inspection is expensive.

However, do not optimize away information needed for method validation.

For detector research:

```text
blind human labels
→ detector output
→ agreement/disagreement analysis
→ validation/holdout
→ triage
```

Never show detector output first and then use the resulting human judgement as detector calibration truth.

If an exhaustive blind review of the final coherent CTWalk candidate is useful as a one-time reference dataset for measuring how much a cheaper strategy would miss, it may be performed and recorded as research evidence.

Do not turn exhaustive review into a universal future-Skill requirement without evidence.

---

# PHASE 4 — Prove strict post-freeze regression

After the coherent golden baseline exists, implement/verify the strict visual-regression path.

Comparison should mean approximately:

```text
same semantic checkpoint
+ same controlled environment
+ same deterministic state
≈ same rendered pixels
```

Do not use broad blanket tolerances such as “1% difference is acceptable”.

Differentiate known renderer noise from visible regressions using measured evidence.

This phase should prove that the repository can actually use the frozen baseline as a regression origin.

---

# PHASE 5 — Formal Skill-readiness audit

Only after the CTWalk-specific verification system and final baseline/regression path are complete, perform a formal maturity review against:

```text
docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md
docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1_HUMAN_VERIFICATION_AMENDMENT.md
pre-skill-bundle/ui-ux-baseline-verification/SKILL_READINESS_CROSSWALK.md
```

Score every dimension from 0–10:

1. Contract portability
2. Checkpoint portability
3. Capture reproducibility
4. Mechanical audit portability
5. Determinism coverage
6. Verdict governance
7. Detector discipline
8. Baseline lifecycle
9. Golden-regression rigor
10. Independent reuse evidence

A 10 requires:

```text
implemented
+ documented
+ evidenced
```

Planned architecture is not enough.

Produce:

```text
method_version:
implementation_revision:
score:
dimension_scores:
hard_gates:
human_verification_amendment_gate:
missing_requirements:
project_specific_leakage:
validation_evidence:
recommend_skill_distillation:
```

Do not round upward.

Do not infer PASS from intent.

---

# PHASE 6 — Independent portability validation

Remember:

**More CTWalk verification cannot satisfy dimension 10.**

Before Skill readiness can reach 100/100, perform an independent portability exercise against another substantially different UI/repository or another rigorously isolated project adapter exercise that does not rely on hidden CTWalk knowledge.

The purpose is to determine whether the method can transfer:

```text
new UI
→ understand acceptance surface
→ derive/accept project contract
→ model semantic checkpoints
→ identify determinism owners
→ collect mechanical evidence
→ govern verdicts
→ establish baseline lifecycle
```

without manually recreating a CTWalk-shaped solution.

Record exactly what project knowledge had to be supplied.

If the method cannot do this cleanly, return the resulting gaps to method development.

---

# STOP / GO RULE FOR SKILL CONSTRUCTION

If the formal result is anything below:

```text
100 / 100
every dimension = 10 / 10
every Method v1 hard gate = PASS
Human Verification Amendment gate = PASS
```

then:

```text
recommend_skill_distillation: NO
```

Do **not** build the Skill.

Instead:

1. identify the blocking dimensions;
2. identify the smallest evidence/implementation needed to close them;
3. update the readiness crosswalk and relevant historical material;
4. continue method/repository development.

If and only if every condition is satisfied:

```text
recommend_skill_distillation: YES
```

then stop and report that the formal trigger has fired.

Do not immediately invent the final Skill architecture in the same step unless explicitly instructed.

At that point provide a concise handoff containing:

```text
why the gate passed
portable principles proven
project-specific material that must remain outside the Skill
validated workflow
validation datasets/evidence
known human-only boundaries
known detector boundaries
independent-portability evidence
recommended scope for Skill distillation
```

That handoff will be used as the source material for the separate Skill-building task.

---

# General execution rules

- Fresh-fetch before authoritative work.
- Never rely on an old SHA without explicit pinning.
- Do not silently continue across a source revision change.
- Do not weaken normative requirements to make the implementation pass.
- Fix product defects as product defects.
- Fix verification defects in verification ownership.
- Keep historical evidence instead of overwriting it.
- Update documentation when new evidence changes the method.
- Do not fabricate evidence.
- Do not claim Skill readiness from novelty or intuition.
- Prefer empirical disagreement/failure analysis over adding speculative features.
- Keep CTWalk-specific selectors, checkpoint names, thresholds and composition rules out of reusable conclusions unless independent evidence proves portability.

The immediate objective is:

```text
finish CTWalk verification correctly
→ freeze one coherent trustworthy baseline
→ prove strict regression
→ validate portability
→ formally audit readiness
→ only then permit Skill distillation
```
