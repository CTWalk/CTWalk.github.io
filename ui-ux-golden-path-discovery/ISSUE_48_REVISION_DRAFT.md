# Draft revision of Issue #48

Status: **proposed replacement text. Not applied to the issue. Review before posting.**

Basis:

- `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
- `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md` (landscape dated 2026-09-02)

## What changed and why

| # | Change | Driver |
| --- | --- | --- |
| 1 | Retire the broad claim that UI-state discovery is unsolved, without pretending state abstraction is solved | Mature prior art exists, but no universal abstraction dominates |
| 2 | Distinguish **GUI-state equivalence** from **visual-baseline equivalence** | Functional/crawler abstractions may merge cosmetic states that visual regression must preserve |
| 3 | Keep V1's scorer only as an experimental baseline and benchmark PDiff on the same deterministic samples | Reuse-before-invention; published abstractions have known strengths/costs |
| 4 | Use Storybook as the true negative control and native CSS scroll-driven animation as a **boundary/adaptation substrate** | Stories already enumerate states; declarative animation exposes mechanics but not necessarily semantic compositions |
| 5 | Require the **proposal itself** to be repeatable | Stable captures are insufficient if checkpoint selection changes between runs |
| 6 | Require an explicit **`not_covered`** output | Silent misses create false confidence |
| 7 | Replace the inaccurate "all 22 use one `renderExperience()`" statement with a measurable **coverage-discrimination hypothesis** | Current CTWalk has multiple continuous visual owners |
| 8 | Add reviewer independence | Anyone who already knows the 22 is contaminated for blind reconstruction |
| 9 | Make usefulness, repeatability and bounded human review the decision criteria — not algorithmic novelty | Existing primitives working well is a positive outcome, not a failure |

Everything below is proposed replacement text for the current issue.

---

# Proposed issue text

## Purpose

Test whether a reusable UI/UX verification mechanism can derive a **compact, explainable and deterministic visual-regression checkpoint proposal** from code and runtime evidence **without being given the existing CTWalk 22-checkpoint manifest as the answer**.

The mechanism may consume mature state-abstraction primitives where they help. The experiment is not trying to invent near-duplicate detection.

Research record:

`docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`

Prior-art / falsification audit:

`ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`

---

## Revised premise

The original framing implied that upstream UI-state discovery is broadly unsolved. **That claim is retired.** The prior-art audit established:

- GUI state abstraction and near-duplicate detection are mature, benchmarked research areas;
- no single published abstraction is universally dominant across quality, exploration yield, runtime cost and calibration burden;
- commercial systems such as Meticulous.ai already automate meaningful parts of test/state selection using recorded sessions, coverage and deterministic replay;
- therefore neither "state selection is fully manual" nor "state compression is our contribution" is defensible.

A second distinction is critical:

```text
GUI-state equivalence
        ≠
visual-baseline equivalence
```

State-abstraction research often optimizes exploration/model equivalence. A visual-regression system may need to preserve a state difference that is functionally equivalent but visually important — for example changed hierarchy, opacity, evidence, geometry or composition.

The narrower hypothesis tested here is:

> **For UI surfaces whose meaningful visual compositions are not already adequately enumerated by project artifacts, a combination of source analysis, runtime observation, existing state-abstraction techniques and selective visual reasoning can produce a repeatable, explainable checkpoint proposal, surface determinism gaps, and explicitly state what it could not cover.**

The experiment pays particular attention to **continuously varying visual composition** where session/event/source coverage may not distinguish materially different renders.

This is a hypothesis to test, not a claim that current tools cannot handle such UI.

---

## Explicit non-claims

This experiment must not be cited to assert any of the following:

- automated UI state discovery is an open problem;
- state abstraction is solved;
- mainstream visual tools always leave state selection to humans;
- near-duplicate state detection is a contribution of this work;
- PDiff is automatically the correct checkpoint-selection engine;
- all CTWalk desktop checkpoints execute through one render function;
- native CSS scroll-driven animation eliminates checkpoint-selection work;
- any percentage reduction in human effort;
- portability from CTWalk evidence alone.

---

## Hard experimental rules

### R1 — Manifest independence

During discovery, neither the discovery mechanism nor the independent reviewer may use or reconstruct the desired checkpoint set from:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`;
- historical review records whose purpose is to enumerate the expected checkpoint inventory.

Those materials may be revealed **only after the independent proposal is frozen**.

### R2 — Reviewer independence

The reviewer that produces `independent-proposal.json` must not have prior exposure to the 22-checkpoint set.

A reviewer who has already read the manifest — including through an earlier conversation/session — is disqualified regardless of intent.

Acceptable examples:

- a fresh runtime agent given only `llm-review-packet.json`, referenced images and allowed source evidence;
- a human who has not worked on the existing baseline program.

The final report must record reviewer identity/type and prior access.

### R3 — Reuse and benchmark before invention

V1's structural-change scorer is an **experimental baseline**, not a claimed reusable contribution.

Run **PDiff at minimum** on the identical deterministic sample set before deciding what state-compression primitive should survive.

Compare at least:

- which independently judged visual responsibilities each method retains;
- meaningful states each method misses;
- redundant states retained;
- execution/runtime cost;
- threshold or calibration burden;
- stability across repeated runs;
- disagreements between structural and visual signals;
- whether the signals provide complementary information.

Do **not** force one winner.

Possible correct outcomes include:

```text
PDiff is sufficient
→ consume PDiff

structural scorer is sufficient and cheaper
→ retain it as implementation detail, not novelty

signals are complementary
→ evaluate a hybrid
```

If another published abstraction is practical to add after PDiff (for example an embedding-based approach), that comparison is welcome but not required for the first vertical slice.

### R4 — Proposal repeatability

Run discovery **twice from a clean state on the same source revision**.

Compare the two independent proposals by:

- semantic responsibility;
- approximate runtime/timeline location;
- inclusion/exclusion classification;
- uncovered-region claims.

Do not require byte-identical wording or checkpoint names.

Classify the result as:

```text
identical
equivalent-with-explained-variation
materially-unstable
```

A **materially unstable** proposal is disqualifying for this ticket.

### R5a — True negative control: component-enumerated UI

Run the mechanism against a Storybook/component-driven UI where stories already enumerate the meaningful component states.

Expected correct behavior:

```text
existing state inventory detected
→ consume stories/fixtures
→ little or no expensive rediscovery
```

The system should demonstrate that it knows when **not** to perform deep runtime/vision discovery.

### R5b — Boundary/adaptation substrate: declarative scroll animation

Run the mechanism against a page using native CSS scroll-driven animation primitives such as:

```text
animation-timeline
scroll()
view()
animation-range
keyframes
```

This is **not** required to produce low/zero value.

Expected correct behavior is adaptation:

```text
declarative timeline detected
→ parse keyframes/timeline/ranges as candidate anchors
→ reduce brute-force runtime discovery
→ use runtime/visual reasoning only for unresolved combined composition
```

The purpose is to test whether the mechanism changes strategy when the animation model is explicit.

### R6 — Explicit `not_covered`

Every proposal must contain an explicit `not_covered` section containing surfaces, regions, dimensions or behaviors the mechanism could not adequately observe or classify.

Each entry should include:

```text
surface / region
reason
risk of omission
suggested next verification method
```

A proposal that lists only what it found, with no account of uncertainty or blind spots, is incomplete.

### R7 — Measure coverage discrimination; do not assume it

The earlier premise that all CTWalk desktop checkpoints execute through a single `renderExperience()` function is incorrect.

Current CTWalk contains multiple continuous visual owners, including global choreography plus scene-specific rAF/WebGL/history-driven loops.

The experiment instead tests this measurable hypothesis:

> **materially different visual compositions may execute indistinguishable or substantially overlapping source-level control-flow coverage because continuous state values, rather than new branches, produce the visual difference.**

For independently proposed candidate states, collect source coverage where practical (statement / branch / function) and derive comparable coverage signatures.

Then ask:

```text
Do independently judged visually distinct candidates
share indistinguishable or substantially overlapping
source-coverage signatures?
```

If yes, record where and why.

If no, report that the presumed wedge weakened.

---

## Required mechanism

### 1. Codebase state discovery

Inspect the repository before spending visual-analysis tokens.

Discover relevant artifacts such as:

- pages/components/scenes;
- routes;
- Storybook stories and fixtures;
- existing functional/E2E tests;
- state branches;
- loading/error/success states;
- locale variants;
- responsive breakpoints;
- reduced-motion behavior;
- animation ownership;
- rAF/WebGL loops;
- declarative animation timelines/keyframes;
- scroll-driven phases;
- mock/test data.

Output a structured candidate inventory.

Do not call any state baseline-worthy yet.

### 2. Runtime exploration

Run the desktop UI and verify/extend source hypotheses against actual browser behavior.

Prefer inexpensive evidence first:

- visible text;
- element visibility;
- state/data attributes;
- image/source changes;
- computed styles;
- bounding boxes;
- opacity/transform/filter changes;
- timeline/scroll progress;
- assets/network readiness;
- console/page errors.

### 3. Build a semantic visual-state graph

Represent meaningful candidate states and transitions rather than raw animation frames.

Each state should record at least:

```text
state_id
semantic responsibility / inferred meaning
runtime trigger or path
observable visual responsibility
state owner(s)
predecessor/successor relationship
variant dimensions
confidence and evidence
```

State names must be derived independently; they do not need to match the existing checkpoint names.

### 4. State abstraction / compression

Use V1's structural scorer as the naive baseline and apply R3.

The objective is not merely "different pixels" or "different DOM." The output should distinguish:

```text
baseline-worthy
visually redundant
functional-only
transient / no unique visual responsibility
temporal/runtime-only
human-only perceptual
uncertain
not-covered
```

For every proposed golden candidate, explain the unique visual-regression responsibility it protects.

### 5. Selective visual recognition

Use visual reasoning only where source/runtime/abstraction evidence cannot settle the decision.

Valid questions include:

- Does the dominant evidence materially change?
- Is this composition effectively redundant with a neighbor?
- Is this merely an intermediate interpolation frame?
- Does hierarchy materially change?
- Does a combined composition exist that is not obvious from individual declarative keyframes?

Cost discipline:

```text
source / existing artifacts
        ↓
runtime structural facts
        ↓
state abstraction / candidate reduction
        ↓
vision only on remaining ambiguity
```

Do not default to frame-by-frame VLM analysis.

### 6. Propose the compact checkpoint set

For every included checkpoint provide:

- semantic responsibility;
- why a visual baseline adds unique information;
- how it differs from neighboring candidates;
- expected stable/settled condition;
- evidence used to derive it;
- known human-review question, if any.

For every major excluded class provide the exclusion rationale.

Include R6's `not_covered` section.

No target checkpoint count is prescribed.

### 7. Identify deterministic-control requirements

For every proposed checkpoint determine whether it can be reached reproducibly.

Identify nondeterminism owners such as:

- rAF/WebGL time;
- random values;
- wall-clock time;
- network/fixture state;
- animation progress;
- scroll progress;
- path/history dependence;
- pointer-dependent effects;
- asset readiness.

Prefer opt-in semantic controls over magic pixels or arbitrary sleeps.

Production behavior outside verification mode must remain unchanged.

### 8. Generate Playwright proof

Demonstrate that Playwright can, for the proposed checkpoint set:

- reach the semantic state;
- capture it in a controlled desktop environment;
- record source/environment provenance;
- verify settle/assets/runtime health;
- repeat the state deterministically where feasible.

These captures are experimental evidence, not new authoritative goldens.

### 9. Produce a targeted human-decision queue

Do not make "human reviews the whole site" the fallback workflow.

For unresolved product/perceptual questions output focused records such as:

```text
candidate: <state>
automation evidence: <facts>
question requiring human judgement: <specific question>
related source/runtime area: <location>
```

The agent must report uncertainty rather than invent product intent.

### 10. Freeze the independent proposal

Before revealing the current 22-state reference:

- write `independent-proposal.json`;
- write `not_covered` inside it or as a referenced artifact;
- complete R4's second run and repeatability report;
- record reviewer independence.

Only then may the historical baseline manifest be revealed.

### 11. Compare against the existing CTWalk reference

The comparison is diagnostic, not exact-count grading.

Report:

- responsibilities found by both;
- reference responsibilities the mechanism missed;
- extra responsibilities proposed by the mechanism;
- states judged equivalent despite different names;
- misses caused by unavailable product intent;
- misses caused by discovery/abstraction weakness;
- candidates where the existing 22 may deserve reconsideration;
- any contamination discovered after the fact.

Do not silently edit the authoritative baseline manifest.

### 12. Measure the coverage-discrimination hypothesis

For independently proposed visually distinct states, collect and compare source-coverage signatures where practical.

Produce evidence of:

```text
visual states that collide under coverage
or
coverage signatures that successfully discriminate them
```

Do not presuppose the result.

---

## Expected artifacts

```text
ui-ux-golden-path-discovery/
  ctwalk-desktop-v1/
    inputs.md
    state-inventory.json
    state-graph.json
    structural-candidates.json
    pdiff-candidates.json
    abstraction-comparison.md
    independent-proposal.json              # frozen before reference reveal
    independent-proposal-run2.json
    repeatability-report.md
    exclusions.json
    visual-analysis-log.json
    deterministic-control-gaps.md
    coverage-discrimination-report.json
    human-decision-queue.md
    reference-comparison.md                # after freeze only
    final-report.md

  control-c1-component/
    final-report.md

  boundary-c2-declarative-animation/
    final-report.md
```

Equivalent structure is acceptable if provenance and sequencing remain auditable.

---

## Evaluation questions

1. Did source inspection recover the major dynamic structure without the manifest?
2. Did runtime exploration discover important visual responsibilities not obvious from source?
3. Did the mechanism distinguish GUI-state equivalence from visual-baseline equivalence where necessary?
4. Did it identify meaningful holds, handoffs, evidence changes and settled states?
5. Did it avoid proliferating meaningless interpolation frames?
6. Did it correctly separate screenshot-suitable states from temporal/functional verification?
7. Where did selective visual reasoning materially change a classification?
8. Could proposed states be reached deterministically?
9. How many decisions genuinely required human product/perceptual judgement?
10. Were those human questions narrow and actionable?
11. How much CTWalk-specific knowledge had to be supplied manually?
12. What appears reusable engine logic versus project adapter knowledge?
13. What did PDiff retain/miss compared with V1's structural scorer?
14. Were PDiff and structural evidence substitutes or complements?
15. What runtime/calibration cost did each abstraction introduce?
16. Was the proposal semantically repeatable across two clean runs?
17. Did the Storybook negative control correctly cause the mechanism to mostly consume existing enumeration rather than rediscover it?
18. Did the declarative-animation boundary case cause the mechanism to adapt by using keyframe/timeline/range metadata?
19. Did `not_covered` accurately expose blind spots or unsupported regions?
20. Did materially distinct visual candidates collide under statement/branch/function coverage signatures?
21. Does the result support GO / INTEGRATE / REFRAME / DEFER / STOP?

---

## Acceptance criteria

- Discovery runs without using the active 22-checkpoint manifest as the answer.
- Reviewer independence is recorded.
- Repository/runtime inputs used by discovery are recorded.
- A source-derived candidate inventory exists.
- Runtime exploration validates or extends it.
- A semantic visual-state graph exists.
- V1's structural scorer is explicitly treated as an experimental baseline.
- PDiff is run on the same deterministic sample set and compared under R3.
- Major method disagreements are analyzed rather than hidden in one aggregate score.
- Proposed baseline states are distinguished from redundant, functional-only, temporal-only, human-only, uncertain and not-covered states.
- Every proposed checkpoint has an inclusion rationale.
- Major exclusions have a rationale.
- `not_covered` is present and actionable.
- Visual recognition is selective and logged.
- Deterministic-control gaps are explicit.
- Playwright controlled capture is demonstrated or blockers are documented.
- Human-review requests are specific rather than broad site-review requests.
- Two clean discovery runs are compared and are not materially unstable.
- The independent proposal is frozen before the current 22 are revealed.
- Storybook negative-control behavior is reported.
- Declarative-animation boundary/adaptation behavior is reported.
- Coverage-discrimination evidence is measured rather than assumed.
- The post-freeze comparison explains agreements, misses, extras and causes without forcing an exact count match.
- The experiment identifies reusable responsibilities vs CTWalk adapter knowledge.
- It does not replace the authoritative #6 baseline or declare new goldens.
- Final report states which decision outcome the evidence supports.

---

## Decision criteria

| Outcome | Trigger |
| --- | --- |
| **GO — carry into unrelated Repo B** | The composed mechanism, whether using published or bespoke primitives, produces a repeatable and explainable proposal with bounded human review and explicit uncovered areas; controls/boundary cases behave sensibly |
| **INTEGRATE** | A published abstraction supplies useful or superior state reduction → consume it and keep the higher-level source/runtime semantics, deterministic controls and governance |
| **REFRAME** | Material value appears mainly on continuous composition-heavy UI → narrow the module and state the niche plainly |
| **DEFER** | Proposal is materially unstable, maintenance economics look poor, or prerequisite tooling/substrates are not ready |
| **STOP** | Meaningful checkpoint construction still requires the hidden manifest or broad manual re-exploration |

**Novelty is not a GO criterion.** A result that successfully composes existing primitives into a useful workflow is valid.

---

## Non-goals

- Do not prove 100% visual coverage.
- Do not define arbitrary checkpoint-completeness percentages.
- Do not define arbitrary human-effort-reduction percentages.
- Do not require the result to contain exactly 22 states.
- Do not build a Percy replacement.
- Do not put an LLM/VLM into the every-PR pixel-diff loop.
- Do not make vision inspect every animation frame by default.
- Do not claim novelty for state abstraction or near-duplicate detection.
- Do not treat PDiff as automatically authoritative.
- Do not treat CTWalk-only success as portability evidence.
- Do not assume source coverage is inadequate before measuring it.
- Do not require the CSS boundary substrate to show zero value.
- Do not remove the negative/boundary controls to make results look stronger.
- Do not overwrite current authoritative baseline artifacts.
- Do not weaken existing Method v1 provenance, determinism, human-authority or baseline-lifecycle requirements.

---

## Long-term division of labor being tested

```text
Project artifacts / source
  -> expose explicit states, timelines, tests, fixtures

Discovery module
  -> consume what already exists
  -> explore only unresolved state space
  -> combine structural + published visual abstraction signals
  -> propose compact visual responsibilities
  -> expose not-covered / uncertainty
  -> identify deterministic-control gaps

Playwright
  -> deterministic execution
  -> screenshot capture
  -> expected / actual / diff
  -> normal CI visual regression

Human
  -> unresolved product intent
  -> perceptual acceptance
  -> intentional baseline replacement authority
```

The experiment succeeds conceptually if it can reduce **manual construction of the visual state map** without pretending that automation can prove completeness or replace human product judgement.
