# Draft revision of Issue #48

Status: **proposed replacement text. Not applied to the issue. Review before posting.**

Basis: `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md` (landscape dated 2026-09-02).

## What changed and why

| # | Change | Driver |
| --- | --- | --- |
| 1 | Narrow the claimed gap from "UI state discovery" to "composition-level animation/scroll-driven state where coverage cannot discriminate visual state" | Meticulous.ai already automates state selection; state abstraction is a mature field |
| 2 | Reuse published state abstractions instead of a bespoke delta scorer, or justify not doing so with measurement | Crawljax/PDiff/WebEmbed/Judge exist and are benchmarked |
| 3 | Add a **negative control** substrate | #48 had none; a CTWalk-only success proves little |
| 4 | Require the **proposal itself** to be repeatable | The program demands byte-identical captures but never required a stable proposal |
| 5 | Require a **not-covered** output | Silent misses create false confidence, worse than a known-incomplete hand-written set |
| 6 | Add an explicit reviewer-independence protocol | The obvious reviewer already knows the answer |

Everything below replaces the corresponding sections of the current issue. Sections not mentioned are unchanged.

---

# Proposed issue text

## Purpose

Test whether a reusable UI/UX verification mechanism can derive a compact, defensible visual-regression checkpoint set for a **composition-level, animation- or scroll-driven UI**, from code and runtime evidence, without being given the existing CTWalk 22-checkpoint manifest.

Research record: `docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md`
Prior-art and falsification audit: `ui-ux-golden-path-discovery/COMPETITIVE_UNKNOWNS_AUDIT_48.md`

## Revised premise

The original framing claimed that upstream state discovery is broadly unsolved. **That claim is retired.** The audit established:

- near-duplicate GUI state detection and state abstraction are a mature research field with a 2026 six-technique benchmark;
- Meticulous.ai automates visual-state selection commercially via coverage-guided replay of recorded sessions, and claims deterministic browser augmentation.

The narrower surviving claim this ticket tests:

> For UIs whose visual states are **neither component-enumerated nor recoverable from production traffic**, and where **code coverage does not discriminate visual state**, an agent can derive a compact deterministic golden-path proposal from source and runtime evidence, and surface the determinism gaps that block reliable screenshot regression.

CTWalk is evidence for the third condition: all 22 desktop checkpoints execute through a single `renderExperience()` function, so a branch-coverage-guided selector cannot separate `commerce.expired-promo` from `commerce.unavailable`.

## Explicit non-claims

The experiment must not be used to assert any of:

- that automated UI state discovery is an open problem;
- that mainstream visual testing tools leave state selection entirely to humans;
- that near-duplicate state detection is a contribution of this work;
- any percentage reduction in human effort;
- portability, from CTWalk evidence alone.

## Hard experimental rules

### R1 — Manifest independence (unchanged)

During discovery the mechanism and the reviewer must not read or reconstruct:

- `docs/ui-ux/UI_UX_BASELINE_MANIFEST.md`;
- `scripts/ui-ux-baseline-plan.json`;
- historical review records enumerating the desired checkpoint set.

### R2 — Reviewer independence (new)

The reviewer that produces `independent-proposal.json` must not have prior exposure to the 22-checkpoint set. A reviewer who has previously read the manifest — including in an earlier session of the same conversation — is disqualified regardless of intent.

Acceptable: a fresh agent given only `llm-review-packet.json` and its referenced images; or a human who has not worked on the baseline program.

The final report must record who reviewed, and what they had prior access to.

### R3 — Reuse before invention (new)

Before the bespoke structural-change scorer is accepted as the compression mechanism, run **at least one published state abstraction** over the identical sample set — PDiff at minimum, since it is screenshot-based and dependency-light.

Report the comparison. If a published abstraction produces an equivalent or better candidate reduction, the engine should consume it and the contribution moves up a layer to governance and determinism.

### R4 — Proposal repeatability (new)

Run discovery **twice** from a clean state on the same source revision. Diff the two `independent-proposal.json` outputs.

Classify as: identical / equivalent-with-explained-variation / unstable.

**An unstable proposal is disqualifying for this ticket.** The program requires byte-identical screenshot capture; a discovery mechanism whose output changes between runs cannot be used to justify a reusable Skill.

### R5 — Negative control (new)

Run the same mechanism against **two control substrates** where the audit predicts it should add little or nothing:

- **C1 component-driven:** any Storybook-based UI, where stories already enumerate the states.
- **C2 declaratively animated:** a page using native CSS scroll-driven animations (`animation-timeline`, `scroll()`, `view()`, `animation-range`), where keyframes are readable from CSS.

Low or zero value on C1 and C2 is the **expected and correct** result. It bounds the addressable substrate rather than failing the experiment. A mechanism that appears equally valuable everywhere is more likely measuring nothing.

### R6 — Not-covered output (new)

The proposal must include an explicit `not_covered` section: regions, scenes, or state dimensions the mechanism believes it could not adequately observe or classify, and why.

A proposal that lists only what it found, with no account of what it may have missed, is incomplete.

## Required mechanism

Steps 1–3 (codebase state discovery, runtime exploration, semantic visual-state graph) unchanged.

**Step 4 — state compression.** Amended by R3: compare against at least one published abstraction rather than assuming the bespoke scorer.

**Step 5 — selective visual recognition.** Unchanged. Cost discipline retained: source/runtime reduction first, vision only on remaining ambiguity, never frame-by-frame by default.

**Steps 6–9** unchanged, plus R6's `not_covered` requirement in step 6.

**Step 10 — comparison.** Unchanged, and still performed only after the proposal is frozen.

## Expected artifacts

```text
ui-ux-golden-path-discovery/
  ctwalk-desktop-v1/
    inputs.md
    state-inventory.json
    state-graph.json
    independent-proposal.json          # frozen before comparison
    independent-proposal-run2.json     # R4
    repeatability-report.md            # R4
    abstraction-comparison.md          # R3
    exclusions.json
    visual-analysis-log.json
    deterministic-control-gaps.md
    human-decision-queue.md
    reference-comparison.md            # written only after freeze
    final-report.md
  control-c1-component/
    final-report.md                    # R5
  control-c2-declarative-animation/
    final-report.md                    # R5
```

## Evaluation questions

Original 12 retained. Add:

13. Did a published state abstraction match or beat the bespoke scorer? (R3)
14. Was the proposal repeatable across runs? (R4)
15. Did the mechanism add materially less value on C1 and C2 than on CTWalk? (R5)
16. Did the mechanism correctly identify what it could not cover? (R6)
17. Can the coverage-cannot-discriminate-visual-state claim be demonstrated concretely on CTWalk — how many distinct visual states share a single code branch?

## Acceptance criteria

Original criteria retained, plus:

- reviewer independence recorded per R2;
- comparison against at least one published abstraction recorded per R3;
- two discovery runs diffed and classified per R4;
- both control substrates run and reported per R5;
- `not_covered` present per R6;
- the final report states which of GO / INTEGRATE / REFRAME / DEFER / STOP the evidence supports, using the audit's criteria.

## Decision criteria

| Outcome | Trigger |
| --- | --- |
| **GO** — carry into an unrelated Repo B | Major responsibilities recovered without the manifest; proposal repeatable; published abstractions do not trivially match it; controls correctly show low value |
| **INTEGRATE** | A published abstraction matches the bespoke scorer → keep governance and determinism layers, consume published abstraction underneath |
| **REFRAME** | Works only on CTWalk-shaped substrate → narrow the Skill to animation/scroll-driven composition verification and state the niche plainly |
| **DEFER** | Proposal unrepeatable, or the declaratively-animated substrate is displacing hand-rolled choreography fast enough to erode the target class |
| **STOP** | Discovery requires the manifest or broad manual exploration to work |

## Non-goals

Original non-goals retained. Add:

- do not claim novelty for state abstraction or near-duplicate detection;
- do not treat a CTWalk-only success as portability evidence;
- do not remove the negative controls to make the result look stronger.
