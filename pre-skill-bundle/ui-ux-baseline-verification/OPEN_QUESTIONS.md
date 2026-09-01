# Open questions the skill must answer

Recorded now so the skill is written against real unknowns rather than a tidy
retrospective.

Decisions already established during the run are explicitly marked as such so a
future reader does not reopen them accidentally. See `DECISION_HISTORY.md` for
the conversational alternatives and reasoning that produced these boundaries.

## 1. What is the labelling protocol, exactly?

Established: labels must be produced **blind**, before detector output is seen.
Triage-then-confirm contaminates the labels and yields no usable calibration.
The accepted stage order is:

```text
blind human labels → detector run → agreement analysis → disagreement review → triage
```

Undecided:

- Sample size and stratification. Working intent for `b22da62` was ~22 of 78,
  weighted to all reduced-motion desktop cells, the zh-TW representative set,
  and a few normal-motion controls. Is risk-weighting legitimate, or does it
  bias the measured precision toward the hard cases and understate real-world
  accuracy?
- Given κ ≈ 0.722 among trained annotators (see `RESEARCH_PRIOR_ART.md`), a
  single labeller cannot be treated as truth. Should the skill require a
  self-consistency check — relabel a held-out slice later, blind, and measure
  agreement with oneself — as a proxy for a second annotator?
- Should the sample include a minimum number of known/expected clean controls so
  false-positive behaviour is measurable rather than only detector recall on
  risky surfaces?

Historical note: this calibration stage was **not executed** on `b22da62`
because `origin/main` moved to `f40e365` before review continued. The sample plan
therefore remains a proposed design, not measured evidence.

## 2. How should detector quality be reported?

v1 reported a single precision figure per detector. The arXiv work reports
**noise suppression** and **true-change detection** separately, which is
strictly more informative and harder to game.

Open: adopt the two-number format, and what to do about detectors that fire
rarely. A detector firing 3 times at 1.00 precision is not evidence of a good
detector; it is 3 data points.

## 3. When may a detector threshold be reused?

Established: thresholds do not transfer across projects. Observed here: they do
not even transfer across a **matrix reshape within the same project** —
`1c1990ef` calibration is void for `b22da62` because the mobile surface changed
from seven mirrored scenes to a two-checkpoint fallback and several desktop
scenes were reworked.

Open: what invalidation rule should the skill state? Candidate: any change to
the checkpoint inventory, viewport set, or a scene's composition voids
calibration for the affected cells. Needs to be cheap to evaluate, or it will be
skipped.

The `b22da62 → f40e365` source movement adds a related question: even if the
matrix itself is unchanged, which source-file changes should invalidate prior
calibration or require a fresh sample? A likely rule is dependency-based rather
than "any commit invalidates everything": changes to the presentation/runtime or
assertion owners for a surface invalidate calibration for that surface.

## 4. How is a tolerance legitimised?

Established: never invent a tolerance and then use it to waive an observed
difference.

Working practice: classify first, then decide.

- byte-identical → freezeable
- differs in bytes, zero differing pixels → encoder-only, freezeable
- differs by a handful of pixels at max channel delta ≤ ~2 → anti-aliasing,
  freezeable with the measurement recorded (e.g. I-2: 278 px, Δ1)
- thousands of pixels, or any delta a viewer could see → instability; find the
  cause (e.g. I-1: 2.49% at Δ28, an unfrozen RAF loop)

Open: is there a defensible numeric boundary, or must this stay a judgement with
the measurement recorded? Current lean: keep it a judgement, mandate the
measurement, and forbid a *global* tolerance setting entirely.

## 5. What is the minimum determinism contract for an animated product?

The single most productive finding across both runs. Playwright's
`animations:'disabled'` covers CSS animations/transitions and Web Animations —
**not** a hand-rolled `requestAnimationFrame` loop.

This project now contains one of each:

- mobile wave field — exposes `setTime()` / `testMode`, frozen deterministically, byte-identical
- intro WebGL scene — no hook, measurably unstable at two viewports (I-1)

Open: should the skill require an enumeration of every independent animation
owner as **step zero**, before any capture? The evidence says yes — one
unenumerated RAF loop silently invalidated a representative checkpoint at two
viewports across two revisions.

## 6. Where does the mechanical/perceptual line actually fall?

Repeatedly observed classes that automation cannot settle:

- text crowding a viewport edge without crossing it — geometrically legal, visually wrong
- CJK wraps that are legal but read awkwardly to a native reader
- whether a still frame corresponds to a state a human could perceive during normal motion
- whether a quiet interval reads as intentional rest or as a stall

Open: how the skill should express this. A named "human-only register" per
project, maintained alongside the detectors, so a clean detector run is never
mistaken for approval?

Established boundary: this calibration/triage question does **not** replace the
normative website-level human acceptance gate. A calibrated detector can reduce
review burden; it cannot become perceptual authority.

## 7. Cross-tool consistency of semantic identity

Recurred as a live bug in two independent tools, in two sessions: identifying
"which scene am I looking at" by highest rendered opacity. Under
`prefers-reduced-motion` every scene sits at opacity 1, so the heuristic silently
returns the first scene for every checkpoint — and the tool reports confident,
wrong facts.

Fixed both times by deriving identity from the checkpoint ID via the test
control's own `sceneIds` map.

Established rule: **never infer semantic identity from rendered state.**

Open: this is a rule about the *verification tooling*, not the product. Does the
skill need a short self-audit checklist for its own probes — the way one would
lint a test helper? The second occurrence suggests a rule in prose is not
sufficient.

## 8. What does the bundle owe the next run?

This run could not reuse `1c1990ef`'s calibration, and spent effort rediscovering
the same tooling bug. The source-revision stop also showed that a bundle can
remain useful even after its candidate is superseded, provided its identity and
scope are explicit.

Open: what minimal handoff artifact would have prevented rediscovery and reduced
restart cost? Candidate mandatory contents:

- exact candidate SHA and source freshness status;
- active matrix/checkpoint inventory;
- environment/browser deviations;
- machine-readable capture/audit/repeatability evidence;
- detector definitions and last valid calibration scope;
- known detector blind spots/failure catalogue;
- open human-only review classes;
- explicit incomplete stages and stop reason;
- whether the candidate is current, pinned intentionally, or historical only.

Can the skill make producing this handoff mandatory rather than aspirational?

## 9. What is the source-freshness invalidation rule?

Established from the `b22da62 → f40e365` event:

- a candidate SHA is part of evidence identity;
- do not silently continue review as though old captures represent new main;
- do not silently switch the capture to a newer revision;
- if changed files bear directly on assertions under review, stop and surface the
  revision decision;
- historical evidence remains useful when clearly labelled.

Open: how should a generic skill determine whether changed files are relevant
enough to require re-capture? Possibilities include:

1. always re-capture when the candidate SHA changes — safest, most expensive;
2. dependency-map invalidation by checkpoint/surface;
3. diff classification plus mandatory human acknowledgement for ambiguous files.

This needs a conservative rule that does not turn sunk capture cost into an
excuse for stale approval.
