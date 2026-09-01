# Decision history — rendered UI/UX baseline verification

Status: **historical record for future skill distillation.**

This file preserves decisions and reasoning that occurred during the `b22da62`
evidence run but were originally discussed conversationally rather than recorded
in the repository. It is deliberately separate from the normative UI/UX product
contract. These are method-development observations, not new product acceptance
requirements.

## 1. Review cost observation

During the `b22da62` run, mechanical execution was comparatively cheap:

- source/worktree/matrix verification;
- one 78-candidate semantic capture;
- a mechanical audit over all 78 candidates;
- repeatability probes over 13 checkpoints × two fresh-context passes;
- three alternate Outro entry paths;
- one laptop Intro follow-up.

The dominant context/token cost was opening full-resolution screenshots for
perceptual review. Rough working observation from the session: roughly 22 opened
1440×900-class PNGs consumed most of the review context, with an estimated
~1.5–2k tokens per full-resolution image. Continuing the remaining ~56 images as
an exhaustive visual sweep was therefore expected to cost on the order of
100k+ additional tokens while mostly confirming mechanically clean candidates.

This is not a benchmark and must not be converted into a fixed token budget. The
portable lesson is the **cost asymmetry**: machine-readable facts scale cheaply;
per-image perceptual inspection is expensive and should be allocated where it
adds information.

## 2. Exhaustive sweep vs detector triage

Two strategies were considered after mechanical coverage of all 78 candidates:

### A — detector-led triage

Review only detector-flagged/high-risk images plus a fixed human-review floor.

Benefits:

- substantially fewer images opened;
- preserves machine-readable evidence for every candidate;
- high information yield per human review.

Risks discovered:

- detector calibration from the old 130-image matrix cannot be assumed to
  transfer to the reshaped 78-image matrix;
- known human-only failure classes remain: edge crowding without overflow,
  awkward-but-legal CJK wrapping, and whether a motion state is perceptible in
  ordinary viewing;
- if detector output is seen before labels are produced, the human labels become
  contaminated and cannot independently calibrate the detector.

### B — full visual sweep

Open every remaining candidate by eye.

Benefits:

- every candidate receives direct perceptual inspection;
- no detector blind spot can silently hide an issue within the reviewed set.

Costs:

- much higher context/token consumption;
- low marginal yield when most candidates already pass mechanical checks;
- exhaustive single-reviewer labels are still not objective ground truth.

## 3. Accepted method direction: blind-first stratified calibration

For **skill-building**, plain detector-led triage was rejected because the order
was methodologically wrong.

Accepted direction:

```text
stratify a representative/risk-weighted sample
        ↓
label by eye without detector output
        ↓
run detectors
        ↓
measure agreement/disagreement
        ↓
inspect disagreements and detector failure modes
        ↓
use calibrated detectors for triage
```

The working sample proposed for the 78-candidate matrix was ~22 candidates,
weighted toward:

- all reduced-motion desktop candidates (historically the weakest surface);
- the zh-TW representative set;
- a small number of normal-motion controls.

The exact sample size and weighting remain open design questions; the ordering
does not. **Triage-then-confirm is not valid calibration. Blind labelling must
come first.**

Why this matters: if the human sees a detector flag before judging the image,
the resulting label measures agreement with an influenced reviewer rather than
independent detector quality.

## 4. What is portable vs project-specific

The discussion clarified an important boundary for the future skill.

Portable:

- protocol/stage ordering;
- semantic checkpoints as stable identity;
- capture emits candidates, not approval;
- repeatability and path-independence classification;
- blind human labels before detector calibration;
- explicit detector failure catalogue;
- APPROVED / REJECTED / BLOCKED distinction;
- mechanical evidence vs perceptual authority;
- freeze binding meaning + source revision + environment + image + human
  acceptance;
- verification tooling must not infer semantic identity from visual state.

Not portable without re-derivation:

- detector thresholds;
- scene-specific selectors;
- CTWalk checkpoint names;
- scene inventory and risk weights;
- project-specific tolerances or geometry assumptions.

This prevents the future skill from becoming a CTWalk-shaped template.

## 5. Prior-art implication

The prior-art survey changed the intended scope of the skill.

Commodity/tooling layers already exist for:

- screenshot capture and pixel comparison;
- animation disabling/time control;
- per-mode/per-variant baselines;
- CI visual review and approval workflows.

The differentiated material observed in this project lies primarily in
**baseline governance and verifier calibration**, especially:

1. the third verdict state, `BLOCKED`, for states that cannot yet be judged
   trustworthily;
2. per-project blind-label detector calibration as an explicit workflow step;
3. capture being structurally unable to report UI acceptance/pass.

The intended skill should therefore reuse existing capture/diff mechanisms rather
than rebuild them, and concentrate on the governance protocol around them.

## 6. Why exhaustive human review is not automatically stronger evidence

The research discussion surfaced a useful constraint: even trained human
annotators can disagree materially on whether a visual difference matters.
Therefore a larger pile of single-reviewer labels is not automatically a better
calibration set.

For skill development, a smaller **blind, stratified, auditable** sample can
produce more reusable information than an exhaustive sweep whose labels were
influenced by detector output or whose disagreement properties are unknown.

This does **not** weaken the project-level website human-acceptance gate. Final
product acceptance still follows the normative actual-website verification rule.
The calibration exercise answers a different question: how much mechanical
triage can safely reduce future review burden.

## 7. Source-revision stop condition triggered

The pre-skill bundle and 78-candidate capture were produced against:

`b22da62f824c4903320a07af4311785c4f915b4b`

Before the planned blind-first review continued, `origin/main` advanced to:

`f40e365829af05781cca597dcdb8d97b7c4576d0`

The change was unrelated to pushing the pre-skill side branch. Subsequent main
history included mobile-copy entrance diagnosis/cleanup work (including PRs #37,
#42, #43 and #47 and issues #38/#44).

Files changed between the candidate and new main included files directly bearing
on assertions made by the run, notably:

- `site-bootstrap.js` — mobile/desktop presentation ownership;
- `index.html`;
- `assets/js/mobile-fallback.js`;
- `package.json`;
- new mobile entrance regression-test material.

Per the run rule — **if main moves to a different SHA, stop and report it rather
than silently reviewing/capturing the newer revision** — review stopped.

Consequences:

- the `b22da62` evidence remains valid evidence **for `b22da62`**;
- it must not be relabelled as evidence for `f40e365`;
- completing perceptual verdicts for `b22da62` would create a historical verdict
  set for a superseded revision, not the current freeze candidate unless that SHA
  is explicitly re-selected;
- if the later mobile entrance work is intended to participate in the final
  baseline, the correct path is fresh verification/capture at the newer candidate
  revision.

Three options were identified at the stop:

1. finish blind-first calibration against `b22da62`, explicitly as historical
   evidence;
2. fresh-fetch/re-capture the 78 matrix at `f40e365`, then perform blind-first
   calibration;
3. proceed on `b22da62` only if it is explicitly declared the intended pinned
   freeze candidate and later main work is out of scope.

No option was silently chosen. That unresolved decision belongs to the next
planning discussion.

## 8. Method lessons established by the stop

The source movement itself is useful skill material:

- a candidate SHA is part of evidence identity, not incidental metadata;
- a completed capture does not remain the current baseline candidate merely
  because it was expensive to produce;
- review must not silently drift across revisions;
- when changed files intersect the assertions under review, freshness matters
  more than sunk capture cost;
- historical evidence should be retained rather than overwritten, because it can
  still calibrate the method even when it no longer qualifies for final product
  freeze.

These rules should survive into skill distillation even if the exact
`b22da62 → f40e365` event remains CTWalk-specific history.
