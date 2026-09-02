# Golden-Path Discovery Research Record

Status: **research / design record, not yet a normative Method v1 amendment**  
Repository: `CTWalk/CTWalk.github.io`  
Origin: Phase-1 UI/UX baseline verification discussion  
Purpose: preserve the reasoning that exposed the current checkpoint-discovery gap, summarize external prior art, define the current north star, and specify the next mechanism to test before deciding whether this work is worth distilling into a reusable Skill.

---

## 1. Why this record exists

The current CTWalk desktop baseline plan contains 22 normal-motion desktop checkpoints. They are meaningful semantic states, and the project has already invested substantial work in making them deterministic and reviewable.

However, a critical question emerged:

> Why should a reviewer trust that these 22 checkpoints are a sufficiently good representation of a dynamic desktop experience?

The concern is **not** that the baseline must somehow prove 100% visual coverage. That is neither realistic nor currently measurable in a useful way.

The concern is also **not** that 22 is necessarily the wrong number.

The concern is that the current method can explain **what a checkpoint is**, how to make it deterministic, how to capture it, how to audit it, and how to govern approval — but it does not yet demonstrate how an unfamiliar team or reusable agent would derive a compact checkpoint set from a dynamic UI without already possessing the project knowledge that produced the 22 states.

This matters because the difficult work in visual regression often happens **before** screenshot comparison begins.

A visual regression engine can reliably answer:

```text
Did this accepted state change?
```

It usually cannot, by itself, answer:

```text
What are the meaningful states of this application?
Which states are visually redundant?
Which transitions or holds matter?
Which states deserve golden screenshots?
Which behaviors should not be represented by screenshots at all?
How should those states be reached deterministically?
```

If a reusable Skill merely automates screenshot capture and diffing after a human has already answered those questions, it competes with mature tools such as Percy, Chromatic, Applitools, and Playwright screenshot assertions on their strongest ground. That would be a weak reason to introduce a new Skill.

The more promising problem is therefore the **upstream golden-path construction problem**.

---

## 2. What triggered the “22 checkpoints may be insufficiently justified” concern

### 2.1 The current matrix is the result of accumulated project knowledge

The active desktop normal-motion inventory is:

```text
intro.settled

commerce.checkout-event
commerce.quiet-after-checkout
commerce.expired-promo
commerce.unavailable
commerce.final-settled

nocode.yaml-readable
nocode.execution
nocode.result-hold

social.product
social.database
social.web
social.final-phone

cuesheet.workspace
cuesheet.conflict
cuesheet.review

dca.early-contribution
dca.phrased-hold
dca.late-contribution
dca.scanner-handoff
dca.pass

outro.settled
```

These are not arbitrary frames. They encode important design knowledge that was learned through inspection and iteration. Examples include:

- Commerce contains a deliberate quiet interval after checkout.
- Commerce event text must correspond to the correct phone evidence.
- A final settled state is different from the preceding transition state.
- noCode has readable pre-execution, execution-emphasis, and result-hold responsibilities.
- Social has product, database, web, and final-product responsibilities.
- DCA contains early contribution, phrased hold, late contribution, scanner handoff, and restrained PASS responsibilities.
- Outro requires a deterministic final CTA state across valid entry paths.

The current manifest therefore demonstrates **good semantic checkpoint design**.

What it does not yet demonstrate is that the reusable method could have discovered those responsibilities rather than being taught them.

### 2.2 Dynamic UI makes naive screenshot enumeration unreliable

A dynamic UI can contain many observable frames without containing equally many meaningful visual states.

For example:

```text
frame 1
frame 2
frame 3
...
frame 200
```

may represent only:

```text
entering state
stable hold
handoff
final state
```

Capturing every frame creates noise and review cost.

Capturing only the final frame can miss meaningful regressions in intermediate semantics, pairings, holds, or handoffs.

The missing capability is therefore not “take more screenshots.” It is **state-space reduction with semantic justification**.

### 2.3 Manual verification is tiring but trustworthy

The user concern that led to this record was practical:

- manual exploration is expensive;
- manual review is tiring;
- but experienced humans can reason about which states matter;
- if a Skill still requires humans to manually discover every meaningful state, then the Skill may save too little effort to justify its cost and complexity.

At the same time, attempting to define an exact target such as “100% coverage” or “75% effort reduction” before we have evidence risks definition-driven design rather than empirical design.

Therefore this project does **not** currently adopt a numeric checkpoint-completeness percentage or human-effort-reduction percentage as a formal gate.

Instead, the next experiment asks a simpler and more falsifiable question:

> Can an agent, using the repository plus the running UI, independently reconstruct a compact and defensible visual-state model with substantially less human construction work than the historical CTWalk process required?

---

## 3. What real-world teams appear to do before visual regression tools

The research found a recurring pattern across mature visual-testing workflows:

```text
team/product knowledge
+ existing state artifacts
+ manual judgement
        ↓
finite set of important UI states
        ↓
approved baseline
        ↓
visual regression engine
```

The visual regression product usually operates **after** a state inventory already exists.

### 3.1 Storybook / Chromatic model

Sources:

- Storybook visual testing documentation: https://storybook.js.org/docs/8/writing-tests/visual-testing
- Storybook UI testing handbook: https://storybook.js.org/tutorials/ui-testing-handbook/react/en/visual-testing
- Storybook visual-testing article: https://storybook.js.org/blog/visual-testing-in-storybook

Observed model:

1. Isolate a component.
2. Define states using props/mock data.
3. Manually verify those states initially.
4. Turn every story into a visual test.
5. Compare future renders against the accepted story baseline.

Important implication:

Chromatic does not need to discover the product's component state space because Storybook stories already encode it.

The upstream human/developer decision is effectively:

```text
Which states are interesting enough to become stories?
```

Once that has been answered, automated visual regression is straightforward.

### 3.2 GOV.UK Frontend / Percy model

Source:

- GOV.UK Frontend testing documentation: https://github.com/alphagov/govuk-frontend/blob/main/docs/releasing/testing-and-linting.md

Observed model:

- at least one screenshot per component;
- usually the default example;
- extra screenshots for visually distinct variants;
- JavaScript-off variants only where JavaScript materially changes appearance;
- reviewers approve or reject Percy changes.

Important implication:

The goal is not a Cartesian product of every possible input or environment. The test author deliberately chooses **visually distinct** examples.

This is close to the CTWalk principle of semantic state selection, but GOV.UK already has structured component fixtures from which the examples are chosen.

### 3.3 Canva / Storybook + Percy model

Source:

- Canva Engineering, “Why we left manual UI testing behind”: https://www.canva.dev/blog/engineering/why-we-left-manual-ui-testing-behind/

Observed model:

- Canva already had hundreds of Storybook stories exposing decoupled component states.
- They wanted visual regression for those existing states without writing a duplicate set of Percy-specific tests.
- Percy became the rendering/comparison/review infrastructure around that pre-existing state inventory.
- Canva also used selected application screens and language/direction variants.

Important implication:

A mature team may have already paid the expensive state-modeling cost as part of component development. In that environment, a new discovery Skill has lower marginal value.

### 3.4 Android official screenshot-testing guidance

Source:

- Android Developers screenshot testing guidance: https://developer.android.com/training/testing/ui-tests/screenshot

Observed principle:

> Minimize screenshot tests while maximizing regression feedback and coverage.

The guidance explicitly warns against testing every combination of themes, font sizes, screen sizes, and components when combinations do not produce unique information.

Important implication:

Industry guidance supports **unique-feedback selection**, not exhaustive combinatorial screenshot generation.

### 3.5 Percy itself

Sources:

- Percy visual testing: https://percy.io/visual-testing
- Percy Testing Library integration guidance: https://percy.io/blog/testing-library-snapshot
- Percy visual diff workflow: https://percy.io/blog/visual-diff-testing

Observed model:

Percy is strong at:

- rendering snapshots;
- rendering across widths/browsers;
- baseline selection;
- visual diffing;
- review workflow;
- source-control/CI integration;
- snapshot stabilization and comparison infrastructure.

Percy guidance still expects the test author to place snapshots at meaningful or key user-visible states such as initial, post-interaction, error, or async-complete states, and warns against snapshotting every test case.

Important implication:

The state-selection problem is not Percy's primary responsibility.

### 3.6 Applitools Autonomous

Sources:

- Applitools Autonomous: https://applitools.com/platform/autonomous/
- Applitools create/test-generation page: https://applitools.com/platform/create/

Observed capabilities claimed by the vendor:

- crawl a site/sitemap;
- build a starter test suite;
- add Visual AI checkpoints;
- turn recorded or plain-English flows into repeatable tests;
- use visual comparison rather than brittle DOM-only assertions.

Important implication:

“AI crawls a site and automatically creates screenshots” is **not sufficient differentiation** for our future Skill.

A URL/sitemap crawler is also less compelling for CTWalk-like experiences where important states are produced inside one highly dynamic page through scroll choreography, animation ownership, locale/motion variations, and state/evidence pairings.

---

## 4. What we are choosing as the north star

The north star is **not Percy replacement**.

The north star is:

> Turn an unfamiliar dynamic UI into a compact, explainable, deterministic visual regression state model that a human can approve and that a conventional regression engine can maintain afterward.

Short form:

```text
unknown dynamic UI
        ↓
small defensible golden path
```

The Skill should focus on the expensive reasoning work that happens before ordinary screenshot regression becomes cheap and reliable.

### 4.1 Why not compete with Percy/Chromatic/Applitools on regression execution

Once a checkpoint is accepted, deterministic tools are better suited to repeated CI work.

For example:

```text
await goToCheckpoint("commerce.expired-promo")
await expect(page).toHaveScreenshot("commerce.expired-promo.png")
```

Playwright can then repeatedly answer:

```text
Did this accepted state change?
```

The Skill does not need to re-understand the entire page visually on every PR.

This keeps LLM/vision use primarily as a **setup and occasional investigation cost**, not a permanent regression cost.

### 4.2 Why Playwright is the current default execution target

Playwright is sufficient for the repository-local mechanism we need:

- navigate/control the UI;
- set viewport/locale/motion preference;
- collect DOM/runtime facts;
- capture screenshots;
- store expected/actual/diff artifacts;
- perform screenshot assertions;
- run cheaply in CI;
- keep the test architecture transparent and source controlled.

Percy or Chromatic can remain optional downstream adapters if a team values hosted review, baseline management, browser infrastructure, or collaboration features.

The reusable unit should therefore be:

```text
semantic checkpoint
+ deterministic resolver
+ environment contract
+ accepted baseline candidate
```

not a Percy-specific snapshot call.

---

## 5. Current proposed mechanism

The mechanism is intentionally layered so expensive visual reasoning is used only where it adds information.

```text
1. codebase understanding
        ↓
2. runtime exploration
        ↓
3. semantic visual-state modelling
        ↓
4. state compression
        ↓
5. deterministic checkpoint construction
        ↓
6. Playwright candidate capture
        ↓
7. mechanical/determinism triage
        ↓
8. targeted human acceptance
        ↓
9. golden freeze
        ↓
10. Playwright visual regression
```

### Stage 1 — Understand the UI from the codebase

Before spending visual-analysis tokens, inspect artifacts that may already encode the state space.

Examples:

- routes and pages;
- component hierarchy;
- application state/state machines;
- error/loading/success branches;
- Storybook stories;
- fixtures/mock data;
- Playwright/Cypress/E2E tests;
- animation timelines;
- scroll-driven choreography;
- breakpoints;
- locale catalogs;
- reduced-motion handling;
- feature flags;
- design/acceptance documentation.

Output:

```text
code-derived candidate state inventory
+ known state transitions
+ potential visual-risk variants
+ unknowns requiring runtime inspection
```

This should be treated as a hypothesis, not truth.

### Stage 2 — Observe the real browser runtime

Run the application and verify which code-derived states are actually observable.

Use cheap browser/runtime facts first:

- text changes;
- element visibility;
- DOM/state attributes;
- computed styles;
- bounding boxes;
- image/source changes;
- active animation ownership;
- scroll progress;
- network/asset readiness;
- console errors;
- focus/interaction state where relevant.

The runtime inspection should also discover states that source inspection did not make obvious.

### Stage 3 — Build a semantic visual-state map

Represent the UI as meaningful states and transitions rather than raw frames.

Example:

```text
Commerce
  checkout-event
      ↓
  quiet-after-checkout
      ↓
  expired-promo
      ↓
  unavailable
      ↓
  final-settled
```

Each candidate state should have at least:

```text
semantic meaning
runtime trigger / route
observable visual responsibility
state owner(s)
relationship to neighboring states
known variant dimensions
```

### Stage 4 — Compress the state map into checkpoint candidates

The agent attempts to remove states that do not provide unique baseline information.

Possible classifications:

```text
baseline-worthy
visually redundant
functional-only
transient/no unique responsibility
temporal/runtime-only
human-only perceptual question
uncertain
```

A state is not baseline-worthy merely because it exists in source or because a frame can be captured.

The desired output is something like:

```text
Observed/inferred states: N
Strong checkpoint candidates: X
Redundant/non-unique: Y
Temporal/runtime-only: Z
Human judgement required: K
```

No numeric ratio is currently treated as a quality gate.

### Stage 5 — Use visual recognition selectively

Vision is useful, but it is intentionally not the first or permanent verification mechanism.

Good visual-recognition questions include:

- Did the primary composition materially change between state A and B?
- Are A and B effectively the same visual responsibility?
- Did the dominant evidence change?
- Did hierarchy materially change?
- Is a candidate merely an animation frame between two stronger states?
- Is a supposedly distinct runtime state visually indistinguishable from another candidate?

Vision should be applied after source/runtime analysis has already reduced the search space.

Preferred cost shape:

```text
repo/runtime facts
        ↓
small set of plausible visual states
        ↓
selected visual comparisons
```

not:

```text
vision over every animation frame
```

### Stage 6 — Make selected states deterministic and directly reachable

For every strong checkpoint candidate, create or reuse a semantic resolver.

Good:

```text
goToCheckpoint("commerce.expired-promo")
```

Bad:

```text
scroll to 4237 px
sleep 800 ms
```

Where uncontrolled behavior exists, identify the actual owner and introduce opt-in test controls when appropriate:

- rAF/WebGL time;
- random data;
- current time;
- asynchronous fixture state;
- animation state;
- scroll progress;
- external asset readiness.

Production behavior must not be altered outside verification mode.

### Stage 7 — Generate Playwright candidate evidence

For each proposed checkpoint, Playwright should:

- set the target viewport;
- set locale;
- set motion preference;
- navigate/resolve semantic checkpoint;
- wait for semantic settle;
- verify required assets;
- record console/network/runtime failures;
- collect mechanical geometry where useful;
- capture candidate screenshot and metadata.

Capture success does not imply approval.

### Stage 8 — Automatically remove obvious bad evidence before human review

Mechanical/determinism checks should prevent wasting human judgement on untrustworthy candidates.

Examples:

- wrong locale;
- wrong viewport;
- failed images;
- unexpected horizontal overflow;
- clipping;
- state/evidence mismatch;
- unresolved semantic state;
- console/runtime error;
- path-dependent rendering;
- uncontrolled animation.

These are engineering problems first, not perceptual approval questions.

### Stage 9 — Ask humans only for genuine product/perceptual decisions

Human review remains authoritative where judgement is genuinely needed.

However, the Skill should present a narrow question tied to a specific candidate, not require the person to rediscover the entire page manually.

Example:

```text
Candidate: dca.scanner-handoff

Automation evidence:
  deterministic: yes
  assets: ready
  overflow: none
  semantic resolution: correct

Human decision required:
  - Does scanner dominance look intentional?
  - Is preceding contribution context still sufficiently legible?
```

Human investigation may inspect:

- expected/actual/diff screenshot;
- live website at the checkpoint;
- related scene/script implementation;
- relevant product/design contract.

Source inspection alone cannot settle purely perceptual questions such as natural wrapping or visual hierarchy.

### Stage 10 — Freeze and move normal regression to Playwright

Once accepted:

```text
semantic checkpoint
+ exact source revision
+ controlled environment
+ deterministic state
+ accepted screenshot
```

becomes the golden baseline.

Normal future execution becomes:

```text
PR
  ↓
Playwright reaches checkpoint
  ↓
Playwright screenshot assertion
  ↓
no diff -> PASS

diff -> expected / actual / diff
        ↓
        targeted investigation
        ↓
        intentional -> re-approve/update baseline
        regression  -> fix product
```

The LLM does not need to re-perform full visual-state discovery on every PR.

---

## 6. What problem this mechanism is intended to solve

### Real-world problem

A team wants visual regression but has one or more of these conditions:

- dynamic product UI;
- organically grown/legacy frontend;
- limited or no Storybook state catalog;
- incomplete visual test architecture;
- animations or scroll choreography;
- responsive variants;
- locale variants;
- stateful flows;
- functional tests that do not encode enough visual checkpoints;
- manual release-time visual exploration;
- uncertainty about what should become a baseline.

For such a team, the expensive question is not necessarily how to compare two screenshots. It is how to turn the application into a finite, maintainable visual regression model.

### CTWalk-specific known problem

CTWalk already has a manually evolved answer: 22 desktop normal-motion states plus additional laptop/reduced/mobile variants.

That makes CTWalk a useful research fixture.

The next mechanism should intentionally avoid using the existing 22-state manifest as discovery input and ask:

> Given the repository, runtime, contracts, and existing non-manifest test artifacts, what visual state model would the agent independently derive?

The existing 22 checkpoints then become **reference evidence for comparison**, not a target that must be matched exactly.

The goal is not “reproduce 22/22 names.”

The evaluation questions are qualitative and diagnostic:

- Did the agent identify the important narrative responsibilities?
- Did it notice deliberate holds such as Commerce quiet-after-checkout?
- Did it understand state/evidence pairings?
- Did it identify handoff and settled-state responsibilities?
- Did it avoid meaningless animation-frame proliferation?
- Did it distinguish screenshot-suitable states from temporal/runtime-only behavior?
- Did it surface uncertainty instead of inventing product intent?
- How much hidden CTWalk knowledge had to be supplied manually?

---

## 7. Why this mechanism may be worth a reusable Skill

A useful Skill would not promise “AI verifies every pixel better than Percy.”

Its value proposition is closer to:

> Use reasoning to construct the visual test architecture; use deterministic tools to operate it.

The desired human-work transformation is:

### Current/manual-heavy path

```text
human explores application
→ human discovers states
→ human decides what is visually important
→ human identifies timing/transition risks
→ human designs checkpoint taxonomy
→ engineer creates deterministic controls
→ engineer writes screenshot tests
→ human approves initial baseline
→ regression engine finally becomes useful
```

### Proposed assisted path

```text
agent reads project artifacts
→ agent explores runtime
→ agent proposes semantic state map
→ agent compresses redundant states
→ agent identifies deterministic-control gaps
→ agent creates/proposes Playwright checkpoint machinery
→ human resolves ambiguous product decisions
→ human approves candidate baseline
→ Playwright owns normal regression
```

The exact percentage of effort reduction is intentionally undefined at this stage.

The research goal is simply to establish whether the difference is materially useful in practice.

---

## 8. Where the Skill is probably not valuable

A team may gain little from this Skill if it already has:

- comprehensive Storybook stories for all meaningful states;
- disciplined component fixtures;
- mature Playwright/Cypress user journeys;
- stable deterministic state controls;
- a documented snapshot policy;
- established Percy/Chromatic/Applitools approval workflow.

Such a team has already solved much of the upstream state-modeling problem.

For them, introducing an LLM may add cost and uncertainty without sufficient benefit.

The likely target is therefore not “every frontend team.”

It is teams whose **visual state model is expensive, incomplete, or implicit**.

---

## 9. Current boundary between agent, Playwright, and human authority

### Agent owns

- repository/state-artifact inspection;
- candidate state inference;
- runtime exploration planning;
- semantic state map construction;
- visual redundancy analysis;
- checkpoint proposal;
- deterministic-control gap identification;
- Playwright test/control generation or proposal;
- mechanical evidence collection;
- explicit uncertainty reporting.

### Playwright owns

- deterministic browser execution;
- viewport/locale/motion setup;
- semantic checkpoint resolution;
- screenshot capture;
- screenshot comparison;
- expected/actual/diff generation;
- CI regression execution;
- cheap repeatable runtime assertions.

### Human owns

- final product intent where documentation is insufficient;
- perceptual acceptance;
- ambiguous hierarchy/readability/composition judgement;
- intentional baseline replacement approval;
- decisions the agent explicitly cannot justify from evidence.

This authority split is deliberate.

The agent is an accelerator for state-model construction, not the final aesthetic authority.

---

## 10. Current research principles

1. **Do not begin with vision if source/runtime facts can answer the question more cheaply.**
2. **Do not make the LLM part of the permanent pixel-regression loop.**
3. **Do not compete with Percy/Chromatic where conventional tools are already better.**
4. **Do not assume a sitemap/page crawl is equivalent to dynamic state discovery.**
5. **Do not capture every runtime frame.** Seek unique visual responsibility.
6. **Do not collapse functional state, temporal behavior, and visual baseline into one test type.**
7. **Do not invent numeric completeness or effort-reduction thresholds before empirical evidence exists.**
8. **Do not use the CTWalk 22-state manifest as hidden discovery knowledge in the reconstruction experiment.**
9. **Do compare the independently discovered model against CTWalk historical knowledge afterward.**
10. **Do carry the mechanism to an unrelated Repo B before declaring it reusable.**

---

## 11. Immediate experiment proposed by this record

### Experiment A — CTWalk blind-ish golden-path reconstruction

Inputs allowed to the discovery mechanism:

- source code;
- runtime website/application;
- product/acceptance documentation that a real team would reasonably have;
- existing functional/E2E tests;
- locale/breakpoint/motion configuration;
- Storybook/fixtures if present.

Input intentionally withheld:

- the active 22-checkpoint desktop manifest as a discovery answer;
- historical reviewer conclusions that directly enumerate the desired checkpoint set.

Process:

```text
inspect codebase
→ infer possible semantic states
→ explore runtime
→ build state graph
→ collect cheap structural/runtime distinctions
→ use selected visual comparisons for ambiguous/redundant states
→ classify states
→ propose compact checkpoint set
→ identify deterministic-control requirements
→ report human-only uncertainties
```

Then compare against the existing CTWalk state model.

Expected deliverables:

- discovered state inventory;
- transition/state graph;
- checkpoint recommendations;
- inclusion rationale for each recommendation;
- exclusion rationale for discarded states/classes;
- states requiring visual recognition and why;
- deterministic-control gaps;
- human-decision queue;
- comparison against current 22 after discovery is complete;
- lessons that belong in the reusable method vs CTWalk adapter.

### Experiment B — independent Repo B

After Experiment A stabilizes the mechanism, run the same process on a UI that does not share CTWalk's scene architecture.

The experiment fails as a portability demonstration if the mechanism requires hidden CTWalk assumptions such as:

- scene numbers;
- scroll-story structure;
- CTWalk checkpoint names;
- CTWalk-specific selectors;
- CTWalk-specific visual hierarchy rules.

---

## 12. Relationship to Method v1

This record does **not** yet modify `REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md`.

Method v1 currently provides strong rules for:

- semantic checkpoint identity;
- deterministic state control;
- capture provenance;
- mechanical audit;
- same-route/alternate-route repeatability;
- detector discipline;
- human acceptance;
- verdict governance;
- coherent golden freeze;
- strict regression.

The newly exposed research question sits before those steps:

```text
How is a defensible checkpoint manifest derived in the first place?
```

Only after experiments produce evidence should this become a normative Method v2/v1.x requirement.

This avoids prematurely turning an open research question into a formal definition.

---

## 13. Working north-star statement

Until evidence changes it, use this statement when evaluating future implementation choices:

> **The reusable system should help a team move from an unfamiliar dynamic UI to a compact, explainable, deterministic golden path, while leaving repetitive visual regression to conventional tools and leaving irreducible product/perceptual decisions to humans.**

A feature belongs in the candidate Skill when it materially helps that transition.

A feature should be challenged with:

```text
Does Playwright/Percy/Chromatic/Applitools already do this better?
```

If yes, prefer integration rather than replacement.

If no, and the feature reduces the expert work required to discover, model, compress, stabilize, or explain the visual state space, it is within the research target.
