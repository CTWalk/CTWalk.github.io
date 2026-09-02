# Execution Review — Issue #48

Status: **research / execution-planning artifact.** This file records the evidence used to simplify and phase Issue #48 after the prior-art audit. It does not modify the authoritative baseline or Method v1.

Landscape / review date: **2026-09-02**

Related artifacts:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`
- `ui-ux-golden-path-discovery/ISSUE_48_REVISION_DRAFT.md`
- `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md`

---

## 1. Why this execution review happened

The prior-art audit correctly forced Issue #48 away from the broad claim that UI-state discovery is unsolved. The next draft became scientifically stronger, but an execution review found that it bundled too many independent experiments into one acceptance gate:

1. blind CTWalk golden-path reconstruction;
2. structural-vs-PDiff state-abstraction benchmarking;
3. source-coverage discrimination measurement;
4. a Storybook negative control;
5. a declarative CSS scroll-animation boundary case.

If all five are mandatory before the core CTWalk result can be interpreted, a runtime agent can spend more effort building experiment infrastructure than answering the original question:

> Can source/runtime evidence plus selective visual reasoning reconstruct a compact, useful visual checkpoint proposal without being given the existing 22-state manifest?

The execution revision therefore keeps the scientific controls but **phases them** so an early core failure can stop the work honestly.

---

## 2. Search / evidence base used for this revision

### 2.1 State abstraction is mature, but not solved

**Source:** Liu et al., *Understanding Automated Web GUI Testing: An Empirical Study Across Exploration Strategies and State Abstractions* (2026)

- https://arxiv.org/abs/2606.16650

The paper compares multiple exploration strategies and six state abstractions and reports that no single approach dominates across code coverage, state coverage, and failure discovery. State abstraction is a mature and important design dimension, but different abstractions favor different exploration strategies.

**Consequence for #48:**

- do not claim novelty for state abstraction or near-duplicate detection;
- do not call the problem solved;
- treat existing abstractions as reusable primitives / comparators.

### 2.2 PDiff is relevant, but reproducing the research stack would be the wrong experiment

**Sources:**

- Yandrapally et al., ICSE 2020 near-duplicate-state study: https://tsigalko18.github.io/assets/pdf/2020-Yandrapally-ICSE.pdf
- ICST 2026 reproduction repository: https://github.com/ast-fortiss-tum/near-duplicate-detection-siamese-networks

The prior literature uses visual perceptual difference (PDiff) as one state-abstraction signal. The newer reproduction repository shows that its experiment is not a simple generic `pdiff()` package invocation: RTED/PDiff distance is computed through Crawljax / a Java baseline runner, then benchmark-specific classifiers are applied for selected applications.

The repository documents:

- baseline methods including `VISUAL_PDiff`;
- within-app / across-app trained classifiers;
- a Java baseline runner for PDiff distance/timing;
- Crawljax-based integration and application-specific experiment infrastructure.

**Consequence for #48:**

The first CTWalk comparison must benchmark the **raw perceptual-image-distance role** on the same deterministic rendered samples. It must **not** require reproducing the full Crawljax + trained-classifier research stack.

PDiff is initially a comparator / primitive, not an assumed replacement for the V1 structural scorer.

### 2.3 The existing V1 pre-filters screenshots, so PDiff needs an unfiltered common input

**Repo evidence:** `scripts/discovery/golden-path-discovery-v1.mjs`

Current V1 flow:

```text
sample every scene densely
→ compute structural adjacent deltas
→ candidateIndices()
→ capture screenshots only for selected candidate indices
```

Therefore running PDiff only on `candidate-images/` would be circular: the structural scorer would already have decided which frames PDiff is allowed to see.

**Consequence for #48:**

Both methods must receive the same deterministic raw sample positions. The implementation may keep screenshot buffers transient and persist only distances / selected review images to control storage.

### 2.4 Mechanical repeatability and LLM repeatability are different failure modes

A repeated final proposal can vary because:

- the browser evidence itself changed; or
- identical evidence was interpreted differently by the LLM.

These are operationally different defects.

**Consequence for #48:** split repeatability into:

- **mechanical discovery repeatability** — same SHA/environment/sample positions produce equivalent observations, candidate signals, and renders;
- **reasoning repeatability** — the same frozen review packet, given to isolated same-model reviews, produces semantically equivalent visual responsibilities / classifications.

Byte-identical prose or derived names are not required.

### 2.5 Meticulous already performs coverage/session-driven state selection

**Sources:**

- https://www.meticulous.ai/how-it-works
- https://app.meticulous.ai/docs/how-to/testing-pool
- https://app.meticulous.ai/docs/faq-and-troubleshooting

Meticulous records developer/user sessions, tracks executed code, rendered components, and route patterns, selects a subset of sessions that collectively maximize unique coverage, replays recorded events, and captures visual snapshots after events. Its browser/network environment is designed for deterministic replay.

**Consequence for #48:**

Do not claim that commercial tooling leaves all state selection to humans. The narrower experiment is whether session/event/source coverage is sufficient to discriminate **continuously varying visual compositions** and, where not, whether our composed mechanism adds value.

This remains a hypothesis; the public materials do not establish that Meticulous cannot handle scroll/animation composition.

### 2.6 Storybook is a real negative control because stories already encode state

**Sources:**

- https://storybook.js.org/tutorials/ui-testing-handbook/react/en/visual-testing
- https://storybook.js.org/docs/8/essentials/interactions

Storybook defines stories as reproducible rendered component states. Its visual-testing workflow is explicitly:

```text
write states as stories
→ manually verify initial appearance
→ snapshot every story
→ regress automatically
```

Interactive stories can also encode interaction-derived states.

**Consequence for #48:**

A good discovery mechanism should detect this existing state inventory and **stand down / consume it** rather than paying for deep rediscovery. This is the true negative control.

### 2.7 Declarative CSS scroll animation is a boundary/adaptation case, not a negative control

**Sources:**

- MDN scroll-driven animation timelines: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timelines
- MDN timeline range names: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations/Timeline_range_names
- Chrome DevTools Animations panel: https://developer.chrome.com/docs/devtools/css/animations/

Native scroll/view timelines expose mechanics such as:

- `animation-timeline`;
- `scroll()` / `view()`;
- named timelines;
- `animation-range`;
- keyframes / attachment ranges.

Chrome DevTools can inspect and scrub scroll-driven animation groups.

This makes candidate anchors easier to derive from source/runtime metadata, but declarative mechanics do **not** by themselves prove which combined composition deserves a golden baseline.

**Consequence for #48:**

Treat this as a **boundary/adaptation substrate**. Correct behavior is to parse declarative timeline metadata first and reduce brute-force exploration; selective runtime/visual reasoning remains allowed for combined composition ambiguity.

### 2.8 Source coverage is a diagnostic hypothesis, not a prerequisite infrastructure project

The 2026 empirical study above also reports weak correlation between code coverage and failure revelation. CTWalk itself contains multiple continuous render owners where different values inside the same execution regions can produce different compositions.

However, CTWalk currently has no Istanbul/nyc branch-coverage pipeline, and V1 is a static/Playwright experiment.

**Consequence for #48:**

Start with the cheapest reproducible execution signature available (for example Chromium/V8 function/range coverage through DevTools). Only add deeper branch instrumentation if the cheap signature cannot resolve the question.

Coverage discrimination must **not block the core blind reconstruction result** merely because instrumentation is expensive.

### 2.9 Existing `__portfolioTest` controls are CTWalk adapter knowledge

**Repo evidence:**

V1 uses:

```text
window.__portfolioTest.setSceneProgress(...)
window.__portfolioTest.waitForVisualSettle(...)
```

This is valuable existing infrastructure, not generic discovery logic. It already supplies semantic scene IDs and a deterministic way to move through scene progress.

**Consequence for #48:**

The final report must separate:

```text
reusable engine logic
vs
CTWalk adapter / test-control knowledge
```

A CTWalk success cannot be presented as “unknown repo → zero-adapter automatic discovery.”

### 2.10 `not_covered` must be part of the actual runtime contract

The revised research requires explicit blind spots, but V1's original `llm-review-packet.json` request and runbook did not require a `not_covered` field.

**Consequence for #48:** align the actual packet/runbook so the reviewer must report:

```text
surface / region
reason
risk of omission
suggested next verification method
```

---

## 3. Revised execution architecture

### Phase A — core CTWalk falsification

This phase answers the main question and may stop the ticket early.

#### A0 — contract / contamination gate

- exact source SHA and environment recorded;
- active 22-state manifest/plan inaccessible to discovery and independent reviewer;
- reviewer prior access recorded;
- CTWalk adapter inputs (`__portfolioTest`, scene IDs, settle logic) explicitly declared.

#### A1 — mechanical V1, twice

Run the structural discovery twice from clean state on the same source/environment.

Compare:

- sample positions;
- runtime observations;
- structural change signals;
- candidate regions;
- rendered evidence where retained.

Classify mechanical evidence as stable / explainably equivalent / unstable.

#### A2 — blind LLM reasoning, twice on frozen evidence

Freeze one review packet / image set, then perform two isolated reviews using the same model/prompt/input contract.

Compare semantic responsibilities, state locations, classifications, and `not_covered` claims. Do not compare prose wording.

A materially unstable proposal is a stop/defer signal.

#### A3 — freeze and reveal

Freeze the independent proposal before revealing the current 22.

Then compare by visual responsibility:

- matches;
- misses;
- extras;
- equivalent states with different names/progress;
- unavailable-product-intent misses;
- discovery/mechanism misses;
- potential weaknesses in the historical 22.

**A3 is the core Issue #48 result.**

If A3 fails badly — for example the mechanism misses major narrative responsibilities and requires broad human re-exploration — stop or reframe before building secondary experiment infrastructure.

---

### Phase B — secondary falsification / mechanism selection

Run only if Phase A is promising enough to justify further work.

#### B1 — structural vs perceptual-distance benchmark

Both methods consume the same unfiltered deterministic sample positions.

Compare:

- meaningful responsibilities retained/missed;
- redundant states retained;
- compute/runtime cost;
- calibration burden;
- run-to-run stability;
- disagreements;
- complementarity.

Correct outcomes include:

```text
perceptual signal sufficient
structural signal sufficient / cheaper
hybrid useful
```

Novelty is irrelevant.

#### B2 — coverage-discrimination diagnostic

Use the cheapest practical execution signature first (V8 function/range coverage preferred for the first slice).

Question:

> Do independently judged visually distinct candidates collide under the same or substantially overlapping source-execution signature?

A positive or negative result is useful. Failure to build deep branch instrumentation is not a failure of Phase A.

---

### Phase C — substrate controls before broader GO

Required before carrying a broad mechanism claim into Repo B, but not required to obtain the core CTWalk result.

#### C1 — Storybook negative control

Expected behavior:

```text
explicit stories/fixtures found
→ consume them
→ little/no deep discovery
```

#### C2 — declarative CSS animation boundary case

Expected behavior:

```text
timeline/keyframes/ranges found
→ use as candidate anchors
→ reduce brute-force runtime sampling
→ visually inspect only unresolved composition
```

---

## 4. Simplified artifact contract

Avoid creating a separate document for every intermediate array. Prefer one source of truth per run.

```text
ui-ux-golden-path-discovery/
  ctwalk-desktop-v1/
    run-1/
      discovery-evidence.json
      llm-review-packet.json
      independent-proposal.json
    run-2/
      discovery-evidence.json
      llm-review-packet.json
      independent-proposal.json
    repeatability-report.md
    reference-comparison.md
    final-report.md

    # added only if Phase B executes
    abstraction-comparison.md
    coverage-discrimination-report.json
```

`independent-proposal.json` should contain:

- checkpoints;
- exclusions;
- `not_covered`;
- human questions;
- deterministic-control gaps.

Controls / boundary experiments receive their own directory only if Phase C executes.

---

## 5. Decision logic

| Outcome | Evidence |
| --- | --- |
| **GO** | Core proposal is repeatable/explainable, human questions are bounded, blind spots are explicit, and later controls behave sensibly |
| **INTEGRATE** | Existing perceptual/state abstraction provides useful/superior compression; consume it under the higher-level workflow |
| **REFRAME** | Value exists mainly for continuous composition-heavy UI or another narrow substrate |
| **DEFER** | Mechanical/reasoning proposal is unstable or economics/tooling prerequisites are poor |
| **STOP** | Blind reconstruction still requires the hidden manifest or broad manual re-exploration |

A published primitive working well is a positive integration result, not a failure.

---

## 6. Superseded statements from the earlier #48 audit comment

The earlier issue comment remains useful historical evidence, but these statements are superseded:

1. **"all 22 desktop checkpoints execute through a single `renderExperience()`"** — incorrect. CTWalk has multiple continuous visual owners; the coverage question must be measured instead.
2. **declarative CSS scroll animation as a negative control where discovery should add zero value** — too strong. It is now a boundary/adaptation substrate.
3. **PDiff as a drop-in published abstraction that should replace V1 if it reduces candidates better** — underspecified. The first benchmark uses the raw perceptual-distance role on the same unfiltered deterministic samples and may produce a hybrid result.
4. **one repeatability test over `independent-proposal.json`** — insufficient to localize instability. Mechanical and reasoning repeatability are now separate.

These changes do not weaken the falsification posture; they make the experiment cheaper to execute and make failures attributable to the correct layer.
