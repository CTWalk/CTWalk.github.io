# Prior art survey

Conducted 2026-09-01, before writing the skill, to avoid rebuilding commodity
tooling and to locate the genuine gap. Sources are linked inline.

## Summary

**The capture/diff layer is a solved commodity. The governance layer — deciding
whether a rendered state deserves to become golden — is much less well covered.**
Existing agent skills strongly cover the former; the surveyed material does not
provide the full governance/calibration workflow being developed here.

## What already exists

### Per-variant baselines with independent approval

[Chromatic modes](https://www.chromatic.com/docs/modes/) treats every
viewport/theme/locale combination as its own entity with its own baseline and
approval. Baseline identity is keyed on the **mode name**, not merely the config
values inside it.

[Chromatic branch/baseline documentation](https://www.chromatic.com/docs/branching-and-baselines/)
also makes baseline history explicit: a baseline is the last known good state,
it follows Git history, and stale branch baselines can produce false-positive
review work until branches are synchronized.

*Relevance:* this independently supports two rules already used here:

- semantic/mode identity must be stable rather than reconstructed from incidental
  rendering configuration;
- baseline provenance/freshness belongs to source history rather than being an
  unversioned screenshot fact.

Chromatic's model is comparable to the `superseded`/source-revision lifecycle in
`docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`, though the abstractions are not identical.

*Where it stops for this method:* the surveyed docs focus on comparison and
approval of known visual states. They do not provide the full tri-state
APPROVED/REJECTED/BLOCKED classification, per-project detector calibration, or
actual-website perceptual-acceptance model used here.

### Deterministic capture of animated UI

[Playwright visual comparisons](https://playwright.dev/docs/test-snapshots)
provides first-run reference screenshots, later pixel comparison, configurable
diff limits, and style injection for volatile/dynamic surfaces. It explicitly
warns that screenshot rendering varies with OS, browser version, settings,
hardware and execution mode, so baselines must be generated and compared in a
consistent environment.

[Applitools](https://applitools.com/blog/handling-animations-and-loading-artifacts-in-visual-testing/)
describes framework-native animation handling and, for richer dynamic cases,
intentional control of the rendered state rather than passively hoping a capture
lands at a useful frame.

*Relevance:* this supports the deterministic-state and environment-provenance
parts of `?uiux-test=1` and Method v1. The CTWalk-specific corollary remains:
CSS/WAAPI animation controls do not automatically freeze every independent
JavaScript `requestAnimationFrame`/WebGL owner. The Intro instability in
`run-log/FINDINGS_SO_FAR.md` is direct project evidence for enumerating those
owners rather than assuming the screenshot tool controls them all.

### The limits of pixel diffing

[Beyond Pixel Diffs (arXiv 2607.01728)](https://arxiv.org/html/2607.01728)
characterises traditional pixel comparison as semantically blind and motivates
methods that separate meaningful UI changes from rendering noise.

The paper's dataset contains **9,906 retained samples**. The paper reports human
verification of the generated samples and separately evaluates inter-annotator
reliability on a deliberately sampled **100-example double-annotation subset**.
On that subset the two annotators agreed on **86/100** examples and Cohen's
**κ = 0.722**, reported as substantial agreement.

This distinction matters. The earlier note in this bundle incorrectly treated
κ≈0.722 as if it meant roughly 28% raw disagreement across the 9,906 samples.
That inference is wrong: kappa is chance-corrected agreement, not `1 - raw
agreement`, and the reported raw disagreement in the 100-example reliability
subset was 14%.

*Relevance:*

1. It supports the general need for human-labelled evidence when assessing
   automated visual-change methods.
2. It shows human judgement is **substantially but not perfectly consistent**,
   which is enough to justify recording reviewer uncertainty/disagreement rather
   than treating one label as metaphysical ground truth. It does **not** by
   itself prove that a particular CTWalk sample size or risk-weighting scheme is
   correct.
3. It reinforces separating meaningful-change detection from noise suppression
   instead of collapsing detector quality into one convenient number.

The paper is research-scale benchmarking, not a prescription for a practitioner
workflow. Our blind-labelling → calibration → triage ordering still needs its own
project evidence and holdout validation.

### Baseline governance in CI

[Argos](https://www.ramotion.com/blog/argos-visual-regression-as-baseline-governance/)
and [Percy](https://percy.io/blog/visual-regression-testing/) surface visual
differences in pull requests so teams can approve or reject intentional changes.
That is relevant to the later CI/golden-regression layer (#10), not a substitute
for deciding whether the original candidate state deserves authority.

### Existing agent skills

[qaskills.sh Visual Regression Testing](https://qaskills.sh/skills/thetestingacademy/visual-regression)
and related community skills cover Playwright screenshot baselines, responsive
coverage, determinism tactics and threshold-based diffing. Community indexes such
as [awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills)
carry comparable entries.

The inspected QASkills description explicitly treats baseline screenshots as the
source of truth for visual correctness and emphasizes deterministic rendering and
threshold-based comparison. That is useful commodity implementation guidance,
but it begins **after** the central governance question this method is trying to
answer: how the baseline earns trust and what to do when the rendered state is
not yet trustworthy enough to approve or reject.

On the surveyed descriptions, these skills do not provide the full combination
of:

- separate mechanical vs perceptual acceptance authority;
- APPROVED / REJECTED / BLOCKED lifecycle;
- blind per-project detector calibration and holdout validation;
- path-dependence classification before baseline approval;
- source-revision stop/freshness discipline for an in-progress acceptance run.

## The gap

The prior-art survey supports a **candidate differentiator**, not a novelty proof.
Absence from the surveyed material must not be written as "nobody does this".
What remains comparatively under-served in the sources inspected is the workflow
for deciding whether a candidate baseline is trustworthy enough to become
authoritative.

### 1. A third verdict state

The surveyed comparison/approval workflows are principally approve/reject. This
method separates **BLOCKED** — the composition may be acceptable, but the
environment, assets, semantic resolution, or runtime determinism prevents a
trustworthy judgement.

Without it, a non-deterministic state can be misrecorded as a design failure and
someone may "fix" a design that was never broken. In the `1c1990ef` run this
distinction correctly held the Outro scene out of the baseline while attributing
the cause to missing test-mode determinism; by `b22da62` that checkpoint was
byte-identical across three navigation paths.

### 2. Per-project calibration as a workflow step

Research benchmarks validate automated methods against human-labelled evidence,
but the surveyed practitioner/agent workflows do not make "label a project
sample blind, then measure and inspect your own detectors before trusting them"
an explicit per-project stage.

This matters because detector thresholds do not automatically transfer. Worse,
an uncalibrated detector can fail silently in both directions: one that never
fires and one that always fires can each look plausible in isolation. In the v1
CTWalk calibration, disagreement analysis exposed three bugs in the detectors
themselves, including one that fired on all candidates of a scene while carrying
no useful signal.

The reusable claim is not yet proven: the current 78-matrix blind/holdout
exercise remains unfinished and is explicitly tracked by the Skill-readiness
gate.

### 3. Capture is structurally forbidden from saying "pass"

Many screenshot tools generate or compare a reference as part of a successful
test workflow. The rule used here is intentionally stricter: **the capture command
emits candidates only and has no UX-approval vocabulary.** Only an explicitly
reviewed baseline can later serve as a regression authority.

The practical purpose is to prevent "the capture ran successfully" from being
mistaken for "the UI was accepted".

## Conclusion for the future skill

Do not rebuild the capture/diff layer; integrate with or cite it. The proposed
contribution is the governance layer around existing tooling:

- tri-state verdicts (APPROVED / REJECTED / BLOCKED) with explicit classification
  rules;
- repeatability as a classified result — byte-identical vs explainable renderer
  noise vs genuine instability — rather than a tolerance invented after the
  difference appears;
- path-independence probing, which same-way-twice repeatability cannot detect;
- blind labelling → calibration → validation/holdout → triage, in that order;
- an explicit register of what detectors cannot decide;
- source-freshness/stop discipline while acceptance is in progress;
- a freeze rule binding meaning + source revision + environment + rendered
  evidence + human acceptance.

These are **pre-skill hypotheses and method evidence**, not proof that the Skill
is ready. `SKILL_READINESS_CROSSWALK.md` remains the bridge from this research to
the formal 100/100 distillation gate.
