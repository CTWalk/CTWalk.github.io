# Rendered UI/UX Baseline Review — Method

Distilled from the #6 review of `1c1990ef05dc764b8e2a1797f7fc41fbded4289f`, where 130 candidates were judged by eye and then used to calibrate a mechanical detector set.

The method exists to answer one question honestly: **which rendered states are safe to freeze as golden, and which are not?** A capture run that exits 0 answers none of it.

## The core rule

> A baseline is authoritative only when the accepted checkpoint meaning, the exact source SHA, the exact capture environment, the rendered image, and an explicit human acceptance are recorded **together**.

Everything below serves that rule.

## Stage 0 — Establish the contract before looking at pixels

Read, in order: the acceptance contract (what "as expected" means), the checkpoint manifest (which states are worth freezing), the test-control doc (how to reach a state deterministically), and the capture script. Confirm the repository still matches the documentation. If it does not, stop and report before changing the verification contract — a review that quietly redefines the checkpoints proves nothing.

Fresh-fetch the branch. Never trust a previously known SHA. Record the SHA you actually verify, and confirm the worktree was clean at capture time.

## Stage 1 — Capture with the project's own tooling

Use the repo's existing capture path unmodified so the recorded SHA stays meaningful and the run stays reproducible by someone else. Resist the urge to "improve" it mid-review.

When the environment forces a deviation — a different browser build, a fallback runtime — take the deviation through a **documented override** rather than editing the script, and record the deviation as a first-class metadata field. In this run the pinned Chromium build could not be downloaded, so an existing newer build was supplied through the capture script's own `BASELINE_BROWSER_EXECUTABLE` env var. The deviation is recorded in every baseline record because it changes what a later pixel comparison will see.

## Stage 2 — Mechanical audit (scripted, cheap, total)

Run a DOM pass over the same matrix collecting facts, not judgements:

- resulting `html.lang` per requested locale;
- `documentElement.scrollWidth` vs `clientWidth` (horizontal overflow);
- every image's `complete` / `naturalWidth`;
- failed requests and console errors, **each one explained rather than waived**;
- rendered line geometry from `Range.getClientRects()` — a wrap fact, never a source-`\n` fact.

This pass is what lets you say "no overflow anywhere, no broken asset anywhere" with evidence instead of impression. It also isolates benign noise early: in this run the only console error was `/favicon.ico` 404 from the local static server, and the only failed request was an intentional image swap.

## Stage 3 — Repeatability, before any approval

For at least the representative checkpoint of every scene: resolve → settle → capture → **tear the context down** → re-resolve → settle → capture. Compare bytes; where bytes differ, compare *pixels*.

The byte/pixel distinction matters. In this run two checkpoints produced different file hashes but **zero** differing pixels — PNG encoding noise, not instability. A byte-level check alone would have raised two false alarms; a tolerance-based check alone would have hidden the one real problem.

Then probe for **path dependence**, which a same-way-twice check cannot see: reach the same checkpoint by a different route (a fresh context vs. after visiting the scene once) and diff. That is how the outro heatmap's 2.39%/Δ93 non-determinism surfaced — the naive repeatability check called it stable.

Never widen a screenshot tolerance to make instability go away. Classify it, then decide: sub-perceptual noise is an explainable tolerance; a visible state that depends on visit history is BLOCKED.

## Stage 4 — Mechanical detectors, calibrated against human verdicts

This is the part worth reusing. Detectors **triage**; they never approve.

Write each detector to encode a rule the contract or manifest actually states, then measure it against verdicts a human already made. Do not ship a detector whose hit rate you have not measured.

### The detector set, with measured precision on 130 images

| ID | Encodes | Fired | Precision |
| --- | --- | ---: | ---: |
| `D1_LIGHT_TEXT_ON_BRIGHT` | G-04 — evidence must not make copy unreadable | 19 | 1.00 |
| `D4_EDGE_CLIP` | §6 — no clipping at the viewport boundary | 4 | 1.00 |
| `D5_EVIDENCE_TOO_SMALL` | evidence must not shrink into texture | 4 | 1.00 |
| `D6_EMPTY_EVIDENCE` | G-08 — reduced motion must not hide evidence | 8 | 1.00 |
| `D7_SCENARIO_DESYNC` | manifest scenario pairing | 10 | 1.00 |
| `D8_STEP_NOT_MIDDLE` | manifest "a middle execution step" | 4 | 1.00 |
| `D9_SHORT_LAST_LINE` | G-03 — orphan/widow lines | 3 | 1.00 |
| `D2_COPY_EVIDENCE_OVERLAP` | §6 — copy and evidence coexist without overlap | 26 | 0.77 |
| `D10_EVIDENCE_OVERCROPPED` | Scene 4 — evidence stays understandable | 14 | 0.64 |
| `D3_TEXT_ESCAPES_CONTAINER` | Scene 5 — active row text stays readable | 2 | 0.50 |

**Aggregate: recall 42/48 on rejected images, false positives 8/73 on approved images.**

### What calibration actually caught — the reason to do it

Round 1 scored 79% recall with a 37% false-positive rate. Inspecting the disagreements exposed three bugs *in the detectors*, each invisible without labelled data:

1. **Wrong element identity.** `D7` compared the loudest node matching `[class*="commerce-phone-"]`, which matched the always-opaque `.commerce-phone-screen` wrapper. It fired on all 20 commerce captures and carried *zero* signal while looking like a 0.50-precision detector. Fixed by comparing the loudest `<img>` inside the wrapper. → precision 1.00.
2. **Wrong scene.** The "visible scene" was picked by highest opacity. Under `prefers-reduced-motion` every scene sits at opacity 1, so every reduced-motion checkpoint was silently analysed against the intro scene. That is why `D6` never fired on a blank phone that was plainly blank. Fixed by deriving the scene from the checkpoint ID via the test control's own `sceneIds` map.
3. **Wrong measurement.** `D5` and `D10` keyed off `className` and element-box overflow. The evidence `<img>` inside a phone has **no class**, and the mobile CueSheet evidence is not geometrically clipped — it loses ~49% of its content to `object-fit: cover`, which `getBoundingClientRect()` cannot see. Fixed by keying off the *clipping ancestor* and by computing cover-crop from natural vs. rendered aspect ratio.

The general lesson: **a detector that never fires and a detector that always fires look equally plausible in isolation.** Only labelled disagreement separates them.

### What the detectors provably cannot decide

Six rejections survived all three rounds with no flag. Five are one class:

- **Mobile DCA row-pill clipping** (`dca.early-contribution`, `dca.scanner-handoff`, `dca.reduced`). The clipped row is not reliably the highest-opacity row, so a dominance gate either misses it or floods with faded-row noise. **Verify DCA rows by eye at narrow viewports.**
- **Text crowding the viewport edge without crossing it** (`outro.reduced` zh-TW). Geometrically legal, visually wrong. Perceptual by nature.

Plus the whole category detectors were never asked to judge: is the intended message understandable before deliberate inspection; is the primary visual dominant; is a quiet interval actually quiet; does a still frame correspond to a state a human could perceive during normal motion; is a CJK or EN wrap natural to a native reader. **These stay human. A clean detector run is not an approval.**

## Stage 5 — Human review

Detectors narrow the field; they do not shrink the obligation. Review by eye:

1. every image the detectors flagged;
2. every image in the Tier-A representative matrix, flagged or not;
3. every image in a class the detectors are known to miss (above);
4. a sample of the remainder.

For each image ask the mechanical questions (right checkpoint, locale, `html.lang`, viewport, asset, no clipping/overflow/overlap, right animation state, reduced motion carries meaning) and then the perceptual ones (hierarchy, readability, natural wraps in **both** locales, nothing unexpectedly loud, nothing awkwardly split).

Treat both locales as first-class. Source-level `\n` is neither correct nor incorrect on its own — judge the rendered composition. Expect genuine locale-specific defects: here zh-TW carried four more rejections than EN, all real.

## Stage 6 — Verdicts and persistence

Every image ends as exactly one of:

- **APPROVED** — correct semantic state, technically valid, manually reviewed, acceptable UX.
- **REJECTED** — captured correctly, but the state is wrong or unacceptable.
- **BLOCKED** — environment, assets or runtime prevented trustworthy verification.

The distinction between REJECTED and BLOCKED is load-bearing. A composition that is fine but cannot be captured deterministically is BLOCKED, not REJECTED — the fix is a determinism fix, not a design change.

Persist approved images into a durable tree keyed by short SHA, and write **one record per candidate — approved, rejected and blocked alike** — so the reason a checkpoint has no golden image stays auditable. Keep rejected candidates on disk. Never overwrite an approved image silently; supersede it.

## Anti-patterns this method exists to prevent

- Approving because the capture run exited 0.
- Regenerating a snapshot until it looks acceptable.
- Widening a pixel tolerance to bury instability.
- Substituting a placeholder for an evidence asset that failed to load.
- Fixing the product mid-review so the baseline passes. Report the defect; freeze nothing.
- Changing the checkpoint definitions to match what the harness happens to resolve.
- Giving one locale weaker coverage because its defects are harder to judge.

## Reusing this elsewhere

Portable: the six stages, the triage protocol, the APPROVED/REJECTED/BLOCKED model, the calibration discipline, the byte-vs-pixel and same-way-twice-vs-different-route distinctions, and the named list of what detectors cannot decide.

Not portable: the thresholds. `renderedWidth < 150`, `coverCrop >= 0.35`, `brightFraction >= 0.30`, `overlap >= 0.25` were fitted to this product's accepted and rejected images. On another project, re-derive them the same way — label a set by eye first, then tune until the disagreements are ones you can explain.
