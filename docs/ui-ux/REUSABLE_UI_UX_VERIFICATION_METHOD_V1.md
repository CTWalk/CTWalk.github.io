# Reusable Rendered UI/UX Verification Method v1

Status: **method standard, not yet a reusable Skill**  
Origin: distilled from the CTWalk portfolio baseline program (#5, #6, #7, #12)  
Purpose: define a portable method for turning an accepted rendered UI/UX experience into a trustworthy, deterministic golden baseline and later visual-regression suite.

This document is the maturity standard for future UI/UX verification tooling in this repository. As the scripts evolve, they should be assessed against this method. A Skill should be proposed only after the Skill-readiness score in §11 reaches **100/100 with every hard gate satisfied**.

---

## 1. Core principle

A successful screenshot capture is not an approval.

An authoritative rendered baseline exists only when these are recorded together:

```text
accepted UX meaning
+ semantic checkpoint identity
+ exact source revision
+ exact capture environment
+ deterministic rendered state
+ mechanically valid evidence
+ explicit acceptance verdict
```

The method therefore separates four questions that must never be collapsed:

```text
Did the state render?
Did it render deterministically?
Is it mechanically valid?
Is it actually acceptable UX?
```

Only the last three together can produce a golden baseline.

---

## 2. Scope and non-goals

This method applies to rendered UI/UX that may vary by:

- viewport;
- locale;
- motion preference;
- semantic application/scene state;
- responsive composition;
- animation or scroll progress;
- evidence assets;
- browser/runtime environment.

It is intended for static pages, product UI, portfolios, animation-heavy experiences and other interfaces where pixel output is part of the acceptance surface.

This method does **not** claim that aesthetic or perceptual UX can be fully automated. Mechanical detectors triage; they do not become the acceptance authority.

---

## 3. Required conceptual layers

Every implementation should preserve these layers even if filenames or tools differ.

### Layer A — Acceptance contract

Defines what “as expected” means before screenshots become authoritative.

It should distinguish:

- invariants;
- intentional changes;
- responsive differences;
- locale-specific composition rules;
- motion/reduced-motion expectations;
- perceptual requirements that remain human-reviewed.

Current code is evidence, not automatically the specification.

### Layer B — Checkpoint manifest

Defines which semantic states are worth freezing.

Checkpoint IDs are stable contracts. Raw scroll pixels, DOM selectors, animation constants and source line breaks are implementation details.

Good:

```text
commerce.expired-promo
social.final-phone
checkout.payment-error
```

Bad:

```text
scrollY=5437
step=12
wait 650 ms
```

### Layer C — Deterministic state control

Provides a semantic API that can reliably reach a checkpoint.

The test control should be opt-in and should not alter normal production behaviour outside verification mode.

### Layer D — Capture and metadata

Produces candidate screenshots and records exact provenance.

### Layer E — Audit and determinism

Checks that the rendered candidate is technically trustworthy before acceptance.

### Layer F — Acceptance review

Combines mechanical facts with perceptual review and records the verdict.

### Layer G — Golden regression

After freeze, compares future renders against the accepted baseline under controlled environment/state conditions.

---

## 4. End-to-end method

### Stage 0 — Establish the contract

Before capture:

1. read the acceptance contract;
2. read the checkpoint manifest;
3. read the deterministic test-control contract;
4. inspect the capture implementation;
5. confirm the repository still matches the documentation;
6. fresh-fetch the target branch;
7. record the exact source revision;
8. require a clean worktree for authoritative capture.

If implementation and documentation materially disagree, stop. Do not silently redefine the verification contract to match the current code.

### Stage 1 — Capture candidates

Use the project’s own supported capture path.

Capture metadata should include at least:

```text
checkpoint_id
source_revision
capture_status
capture_runtime
browser_name
browser_version
browser_executable/build
Playwright or driver version
OS/container
device_scale_factor
viewport
locale
resulting html.lang
motion preference
asset readiness
console/runtime errors
semantic resolution result
settle result
screenshot path/hash
```

Environment deviations must use documented overrides and must be recorded explicitly. Do not patch the capture script during an authoritative run merely to make the environment work.

### Stage 2 — Mechanical audit

Collect facts for the complete intended matrix, not impressions.

Typical checks:

- requested locale vs resulting `html.lang`;
- viewport dimensions;
- horizontal overflow;
- image `complete` and `naturalWidth > 0`;
- failed requests;
- console/page errors;
- rendered text line geometry;
- clipping or text escaping containers;
- evidence scale/readability proxies;
- destructive crop ratios;
- hidden evidence in reduced-motion mode;
- checkpoint-specific state pairing.

A mechanical audit may identify a defect, but a clean audit never auto-approves UX.

### Stage 3 — Determinism verification

Determinism is checked before freezing.

#### 3.1 Same-route repeatability

For representative states:

```text
resolve
→ settle
→ capture
→ tear context down
→ resolve again
→ settle
→ capture again
```

Compare in layers:

```text
file bytes
→ if different, decoded pixels
→ if pixels differ, magnitude/location classification
```

Different PNG bytes with zero differing decoded pixels are encoding variance, not visual instability.

#### 3.2 Alternate-route repeatability

A same-way-twice check is insufficient.

Where relevant, resolve the same semantic state through more than one valid route, for example:

- fresh context;
- visit scene, leave, then return;
- locale switch before resolution;
- reload before resolution;
- revisit after earlier animation/state history.

If the same semantic checkpoint visibly changes because of entry history, it is **BLOCKED** until state control becomes deterministic.

Never widen screenshot tolerance to hide path dependence.

### Stage 4 — Mechanical detectors

Detectors are optional accelerators, not authorities.

Each detector must:

1. encode an explicit contract/manifest rule;
2. report facts or suspicious conditions;
3. have a documented project adapter or selector source;
4. be measured against labelled human verdicts before being trusted for triage;
5. document known blind spots.

Detectors must not invent universal thresholds from one project.

Project-calibrated thresholds such as minimum evidence width, crop ratio, luminance, overlap ratio or orphan-line ratio belong in project configuration/adapters.

### Stage 5 — Calibration and validation of detectors

Do not call the calibration set “proof of accuracy”.

A correct workflow distinguishes:

```text
calibration set
from
validation / holdout set
```

At minimum:

- keep labelled verdicts separate from detector output;
- measure per-detector precision;
- measure rejected-state recall;
- measure approved-state false positives;
- inspect every disagreement;
- identify detector bugs separately from product defects.

For a reusable detector framework, use a holdout strategy such as:

- held-out scenes;
- held-out viewport/locale classes;
- a separate project;
- or another documented validation split.

Metrics measured only after repeatedly tuning on the same labelled images are **calibration-set fit**, not generalisation accuracy.

### Stage 6 — Human acceptance review

The review mode depends on the goal.

#### Discovery mode

Purpose: find issues quickly before freeze.

Review at least:

- detector-flagged candidates;
- representative checkpoints;
- known detector blind-spot classes;
- a sample of remaining candidates.

#### Freeze mode

Purpose: create an authoritative golden baseline.

Every candidate intended to become golden receives an explicit acceptance verdict. Sampling is not sufficient for authoritative freeze.

Review both:

**Mechanical correctness**

- correct semantic state;
- correct locale and viewport;
- correct assets;
- no accidental clipping/overflow;
- correct responsive presentation;
- correct reduced-motion evidence;
- correct checkpoint-specific state.

**Perceptual correctness**

- message understandable without forensic inspection;
- intended hierarchy is clear;
- primary evidence remains primary;
- text is readable at normal viewing distance;
- locale-specific wrapping is natural;
- composition is not unexpectedly crowded or empty;
- kinetic checkpoint corresponds to a human-perceivable state.

Source-level line breaks are not acceptance evidence. Judge rendered composition.

### Stage 7 — Verdict model and persistence

Every candidate ends as exactly one of:

- **APPROVED** — correct semantic state, trustworthy capture, manually accepted UX;
- **REJECTED** — trustworthy capture, but wrong/unacceptable state or composition;
- **BLOCKED** — environment/runtime/assets/state determinism prevents trustworthy judgement.

Do not merge REJECTED and BLOCKED. They imply different fixes.

Persist one record per candidate, including rejected and blocked candidates, so missing golden images remain explainable.

Never silently overwrite an approved baseline. An intentional replacement should be recorded as a new approval and the previous baseline marked superseded.

### Stage 8 — Coherent baseline freeze

During iterative remediation, previously approved images may be treated as **provisional approved evidence**.

For the final regression origin, prefer one coherent accepted source revision:

```text
final accepted repo revision
→ authoritative capture
→ complete review
→ coherent golden baseline
```

Avoid a final golden set composed of unrelated source revisions unless the project explicitly supports multi-revision baselines and preserves that complexity intentionally.

### Stage 9 — Golden regression

After baseline freeze, future visual regression should be much stricter than exploratory detectors.

The comparison target is:

```text
same semantic state
+ same controlled environment
+ same deterministic assets/state
≈ same pixels
```

Do not use a blanket “1% difference is fine” rule. One percent of a large viewport can hide a visibly broken component.

Prefer explicit measurements such as:

- changed-pixel ratio;
- maximum per-channel delta;
- region-specific masks only for understood nondeterministic surfaces;
- separate handling for known renderer noise.

Visible state differences are fixed or re-approved; they are not buried under tolerance.

---

## 5. Acceptance authority model

A reviewer and the product acceptance authority are not necessarily the same actor.

A reusable verdict schema should distinguish proposal from authority, for example:

```text
review_proposal:
  proposed_approved | proposed_rejected | proposed_blocked

acceptance_status:
  approved | rejected | blocked | pending_authority

reviewer:
  agent | human_reviewer | product_owner

acceptance_authority:
  named role/person/process
```

An automated agent may recommend a verdict. A disputed perceptual judgement must not become authoritative merely because the agent labelled it first.

---

## 6. Portable versus project-specific components

### Portable

These belong in the reusable method/engine:

- contract-before-pixels discipline;
- semantic checkpoint model;
- provenance metadata;
- mechanical audit categories;
- APPROVED / REJECTED / BLOCKED lifecycle;
- same-route and alternate-route determinism checks;
- byte-vs-pixel distinction;
- detector calibration discipline;
- discovery mode vs freeze mode;
- acceptance-authority separation;
- coherent final baseline rule;
- strict post-freeze regression model.

### Project-specific

These belong in adapters/configuration:

- selectors;
- scene/checkpoint IDs;
- evidence hierarchy;
- locale-specific rules;
- required viewport matrix;
- motion checkpoints;
- detector thresholds;
- project-specific state pairings;
- acceptable renderer-noise masks/tolerances.

A reusable implementation must not hard-code one project’s CSS classes or checkpoint semantics into its generic engine.

---

## 7. Minimum reusable architecture

A future reusable implementation should converge toward a separation like:

```text
rendered-ui-verification/
  method/
    METHOD.md
  schemas/
    checkpoint.schema.json
    baseline-record.schema.json
    verdict.schema.json
  engine/
    capture
    mechanical-audit
    determinism
    pixel-diff
    calibration
  project-adapter/
    checkpoints
    selectors
    detector-rules
    project-thresholds
```

Equivalent structures are acceptable if they preserve the same separation of concerns.

---

## 8. Required anti-pattern protections

The implementation must explicitly prevent or document protection against:

- approving because capture exited successfully;
- regenerating until a candidate happens to look acceptable;
- silently redefining checkpoint meaning to fit current output;
- hard-coded page scroll pixels as checkpoint identity;
- arbitrary sleep as the primary settle mechanism;
- placeholders replacing failed evidence assets;
- widening pixel tolerance to hide instability;
- treating one locale as secondary;
- treating reduced motion as “animation disabled” while evidence disappears;
- detector output becoming automatic UX approval;
- mixing REJECTED and BLOCKED;
- silently replacing approved baselines;
- claiming detector generalisation from calibration-set fit only.

---

## 9. Method maturity review protocol

At meaningful script-design milestones, assess the current implementation against this document rather than only asking whether scripts run.

The review should produce:

```text
method_version: v1
implementation_revision: <sha>
score: <0-100>
hard_gates: pass/fail
missing_requirements: [...]
project_specific_leakage: [...]
validation_evidence: [...]
recommend_skill_distillation: yes/no
```

The score is diagnostic. Skill distillation is governed by the hard rule in §11.

---

## 10. Skill-readiness dimensions

Each dimension is scored from 0 to 10. A 10 means the requirement is implemented, documented and evidenced — not merely planned.

1. **Contract portability** — method accepts project-defined UX contracts without CTWalk-specific assumptions.
2. **Checkpoint portability** — semantic checkpoint engine is project-adapter driven rather than hard-coded to one scene model.
3. **Capture reproducibility** — provenance, clean revision, environment and supported overrides are complete.
4. **Mechanical audit portability** — generic facts are separated from project selectors/rules.
5. **Determinism coverage** — same-route and alternate-route state equivalence are supported and evidenced.
6. **Verdict governance** — proposal vs acceptance authority, APPROVED/REJECTED/BLOCKED and audit history are explicit.
7. **Detector discipline** — detectors are triage-only, configurable, calibrated and validated with a holdout strategy.
8. **Baseline lifecycle** — candidate, provisional evidence, approved, superseded and coherent final freeze are handled safely.
9. **Golden-regression rigor** — strict pixel-diff strategy distinguishes renderer noise from visible regression without broad tolerance hiding.
10. **Independent reuse evidence** — the method/tooling has been applied without relying on hidden CTWalk knowledge, ideally on a second distinct UI or a deliberately isolated adapter exercise.

---

## 11. Skill distillation gate — full-score requirement

A Skill recommendation is allowed **only** when all of the following are true:

```text
Total score = 100 / 100
AND
Every dimension = 10 / 10
AND
Every hard gate below = PASS
```

There is no weighted-average exception. A 99/100 implementation is not Skill-ready under this standard.

### Hard gates

- Generic engine contains no required CTWalk-specific selectors/checkpoint names.
- Project-specific thresholds live outside the reusable engine.
- Capture provenance is complete and reproducible.
- Same-route repeatability exists.
- Alternate-route/path-dependence testing exists.
- Freeze mode requires explicit review for every golden candidate.
- Detector output cannot automatically approve UX.
- Detector validation uses evidence not wholly reused from its calibration loop.
- Acceptance authority is represented separately from reviewer proposal.
- Approved/rejected/blocked history is durable and auditable.
- Final baseline can be produced coherently from one accepted source revision.
- Post-freeze comparison uses controlled environment/state and a justified strict tolerance model.
- At least one independent reuse/portability exercise succeeds without hidden project knowledge.

Only after this gate passes should the system suggest distilling the method into a reusable Skill.

---

## 12. Current CTWalk relationship

The existing `UI_UX_REVIEW_METHOD.md` and `ui-ux-review-tools/` are the empirical source material that led to this method.

They should not automatically be treated as the reusable implementation because they currently contain project-specific selectors, checkpoint rules, calibrated thresholds and execution artefacts.

As the CTWalk scripts evolve, compare them to this document and move reusable behaviour into generic components while leaving CTWalk-specific knowledge in adapters/configuration.

The intended sequence is:

```text
script/method design
→ method-v1 conformance improves
→ repository UI defects resolved
→ final accepted repo revision
→ authoritative baseline freeze
→ coherent golden path
→ strict visual regression all green
→ independent portability validation
→ 100/100 Skill-readiness review
→ only then suggest Skill distillation
```

---

## 13. Versioning rule

This is Method v1, not an immutable truth.

Change the method only when new evidence exposes a missing principle, ambiguity or unsafe assumption. Do not weaken the method merely because a current implementation cannot satisfy it.

When the method itself changes materially, increment its version and record why.
