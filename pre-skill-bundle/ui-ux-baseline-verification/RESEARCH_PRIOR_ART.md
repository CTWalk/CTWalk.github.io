# Prior art survey

Conducted 2026-09-01, before writing the skill, to avoid rebuilding commodity
tooling and to locate the genuine gap. Sources are linked inline.

## Summary

**The capture/diff layer is a solved commodity. The governance layer — deciding
whether a rendered state deserves to become golden — is not.** Existing agent
skills cover the former and explicitly do not cover the latter.

## What already exists

### Per-variant baselines with independent approval

[Chromatic modes](https://www.chromatic.com/docs/modes/) treats every
viewport/theme/locale combination as its own entity with "its own unique
baselines and specific approvals". Baseline identity is keyed on the **mode
name**, not on the config values inside it — renaming a mode creates a new
baseline.

*Relevance:* this is independent confirmation of the checkpoint-ID-as-stable-contract
rule already used here. Chromatic reached the same conclusion from the opposite
direction. Their guidance to keep an old mode name alive to preserve a prior
baseline is the same idea as the `superseded` status in
`docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`.

*Where it stops:* the documentation describes approval as a binary per mode. It
does not record reviewer identity, review notes, or the environment the baseline
was accepted in, and it has no state for "capturable but not trustworthy".

### Deterministic capture of animated UI

[Playwright's `animations: 'disabled'`](https://qaskills.sh/blog/playwright-screenshot-animation-caret-disable)
fast-forwards finite CSS animations and cancels infinite ones; the Clock API can
pause JS time.
[Applitools](https://applitools.com/blog/handling-animations-and-loading-artifacts-in-visual-testing/)
recommends controlling playback via the Web Animations API, a reduced-motion
mode, **or a product-level test hook**, then asserting selected frames
intentionally.

*Relevance:* direct vendor-neutral endorsement of the `?uiux-test=1` design.
Note the corollary this project learned the hard way: `animations:'disabled'`
governs CSS/WAAPI only. A `requestAnimationFrame` render loop — a Three.js scene,
a canvas wave field — is untouched by it and needs an explicit product-level
freeze. Where that freeze is missing, the result is measurable instability, not
a subtle one (see `run-log/FINDINGS_SO_FAR.md`).

### The limits of pixel diffing

[Beyond Pixel Diffs (arXiv 2607.01728)](https://arxiv.org/html/2607.01728)
characterises pixel comparison as "semantically blind", treating sub-pixel
jitter and genuine structural regressions identically.

Methodologically the most useful source found. To evaluate their approach they
built a **9,906-sample human-verified ground truth**, used two independent
annotators, reported inter-annotator agreement of **κ ≈ 0.722**, and — critically
— measured **noise suppression and true-change detection as two separate
accuracies** rather than one blended score.

*Relevance, three ways:*
1. Confirms that calibrating automated detection against human labels is the
   right shape of solution, not an idiosyncrasy of this project.
2. κ ≈ 0.722 means **trained humans disagree on roughly a quarter of UI change
   judgements**. A single reviewer's labels are therefore a calibration target,
   not ground truth. This argues for stratified sampling with measured
   agreement over exhaustive sweeps whose labels carry the same uncertainty at
   several times the cost.
3. Separating suppression accuracy from detection accuracy is a better reporting
   format than the single precision figure used in v1 of the method here, and
   should be adopted.

### Baseline governance in CI

[Argos](https://www.ramotion.com/blog/argos-visual-regression-as-baseline-governance/)
and [Percy](https://percy.io/blog/visual-regression-testing/) surface diffs in
pull requests for inline approve/reject, making the baseline a team asset rather
than a private artifact. Relevant to the CI ticket (#10), not to local
acceptance.

### Existing agent skills

[qaskills.sh Claude Code skills](https://qaskills.sh/agents/claude-code) lists
*Screenshot Baseline Generator*, *Visual Regression Testing*, *Screenshot Testing
in CI*, and *Playwright Visual Testing*. Community indexes such as
[awesome-claude-skills](https://github.com/karanb192/awesome-claude-skills)
carry comparable entries.

Scope is baseline generation, pixel-diff thresholds, responsive breakpoints,
dynamic-content masking and CI wiring. On direct inspection the published
descriptions **do not cover human approval models, a mechanical/perceptual
review split, or calibration of detectors against human verdicts.**

## The gap

Three things no surveyed source provides:

### 1. A third verdict state

Every tool has approve/reject. None separates **BLOCKED** — the composition may
be perfectly acceptable, but the environment, assets, or runtime prevented a
trustworthy judgement.

Without it, a non-deterministic state gets recorded as a design failure and
someone "fixes" a design that was never broken. In the `1c1990ef` run this
distinction is what correctly held the Outro scene out of the baseline while
attributing the cause to missing test-mode determinism, which was then fixed at
the source; by `b22da62` that same checkpoint is byte-identical across three
different navigation paths.

### 2. Per-project calibration as a workflow step

The arXiv work calibrates against human labels for a research benchmark. No
practitioner skill treats "label a sample blind, then measure your detectors
against it" as a step you perform on **your own** project before trusting your
own heuristics.

This matters because detector thresholds do not transfer. Worse, an uncalibrated
detector fails silently in both directions: one that never fires and one that
always fires look equally plausible in isolation. Only measured disagreement
separates them. In the v1 calibration this exposed three bugs in the detectors
themselves, including one that fired on all 20 candidates of a scene while
carrying zero information.

### 3. Capture is structurally forbidden from saying "pass"

Industry practice treats a green capture run as provisional approval. The rule
used here is stricter: **the capture command emits candidates only and has no
pass/fail vocabulary at all.** Only comparison against an already-reviewed
baseline may report pass.

The practical consequence is that "the run went green" can never be mistaken for
"the UI is acceptable" — which is the single most common way a visual baseline
silently rots.

## Conclusion for the skill

Do not rebuild the capture/diff layer; cite it. The skill's contribution is the
governance half:

- tri-state verdicts (APPROVED / REJECTED / BLOCKED) with the classification rules;
- repeatability as a *classified* result — byte-identical vs. sub-perceptual
  tolerance vs. genuine instability — never a tolerance invented to absorb the
  difference;
- path-independence probing, which same-way-twice repeatability cannot detect;
- blind labelling → calibration → triage, in that order;
- an explicit register of what detectors provably cannot decide;
- the freeze rule binding meaning + SHA + environment + image + human acceptance.
