# Competitive & Unknown-Unknowns Audit — Issue #48

Status: **research artifact. Non-authoritative. Does not modify #48, Method v1, or any baseline.**

Landscape dated: **2026-09-02**
Subject: #48's core bet that upstream *visual-state discovery* is the unsolved, differentiating problem for a reusable UI/UX verification Skill.
Requested posture: adversarial. The case against the premise is made as strongly as the evidence allows.

---

## 1. Executive verdict

**MODIFY the experiment. Do not run #48 as currently framed, and do not reframe the Skill around "discovery is unsolved" — that claim is partially falsified.**

Two kill-shots landed:

1. **State compression (#48 step 4) is a mature research field**, not an open problem. Near-duplicate GUI state detection / state abstraction has ~15 years of work and a 2026 benchmark comparing six techniques.
2. **A funded commercial product already automates visual-state selection** — Meticulous.ai selects which states become visual snapshots without a human authoring them, and claims deterministic browser augmentation.

Three kill-shots missed, and their misses are positive evidence:

3. No product was found that proposes checkpoints for **animation/scroll-driven composition states without production traffic**.
4. No published work was found on **keyframe/checkpoint selection for animation-driven visual baselines**.
5. Percy / Chromatic / Applitools were **confirmed** to require human-authored states; Applitools explicitly operates only after tests exist.

The surviving gap is real but **much narrower** than #48 asserts. It is not "dynamic UI state discovery." It is:

> deriving visual regression checkpoints for **composition-level animation/scroll-driven state**, where no component/story enumeration exists, no production traffic exists, and code coverage is a poor proxy because many visual states share one code path.

#48 should be rewritten around that narrower claim, and given a **negative control**, which it currently lacks.

---

## 2. The problem, stated independently of the proposed solution

Applying the skill's test — remove the proposed product and check the problem still parses:

> A team has a UI whose meaningful visual states are not enumerated anywhere. Before any screenshot regression can start, someone must decide which states deserve golden images, which are redundant, and how to reach each one reproducibly. Today that map is built by hand, by whoever knows the product.

This parses. The problem is real in the abstract.

**But the operator/beneficiary analysis weakens it.** The person who builds that map is usually the person who *already knows the product*. The map is a byproduct of knowledge they already hold. The expensive part is not knowing the states — it is the discipline to write them down deterministically. That is closer to the *governance* gap identified before #48 than to a discovery gap.

**Frequency check:** map-building is a one-time-per-surface cost. Flake triage and baseline churn are per-PR costs. A tool that reduces a one-time cost competes badly against tools reducing recurring costs.

---

## 3. Kill-shot audit

### 3.1 LANDED — state abstraction is a solved research problem

Automated web GUI testing has long treated "are these two states the same?" as core, because redundant exploration wrecks crawlers. [Crawljax](https://www.researchgate.net/publication/254007517_Crawling_Ajax-Based_Web_Applications_through_Dynamic_Analysis_of_User_Interface_State_Changes) established dynamic UI-state crawling; [Yandrapally et al., ICSE 2020](https://tsigalko18.github.io/assets/pdf/2020-Yandrapally-ICSE.pdf) framed near-duplicate detection in model inference explicitly; [tree-kernel methods](https://www.researchgate.net/publication/354235199_Web_Application_Testing_Using_Tree_Kernels_to_Detect_Near-duplicate_States_in_Automated_Model_Inference) and [WebEmbed neural embeddings](https://arxiv.org/pdf/2306.07400) followed; [Judge (TOSEM 2026)](https://dl.acm.org/doi/full/10.1145/3736162) uses page-structure merging plus contrastive learning.

A [2026 empirical study](https://arxiv.org/html/2606.16650) benchmarks six abstractions — StringCmp, Gestalt, RTED, **PDiff (screenshot perceptual difference)**, WebEmbed, Judge.

**Consequence for #48:** step 4 (state compression) and much of steps 1–3 (inventory, graph) are re-implementations. #48's proposed mechanism — dense sampling plus adjacent structural-change scoring — is closest to RTED/StringCmp, i.e. **the weaker end** of the benchmarked field. Writing a bespoke delta scorer when Judge/WebEmbed exist is the "custom infrastructure before existing tools are evaluated" built-for-built signal.

### 3.2 LANDED — commercial automation of state selection already ships

[Meticulous.ai](https://www.meticulous.ai/how-it-works) (YC) installs a JS snippet, records real user sessions, then on each PR **selects a subset of sessions that cover each feature**, replays them, and snapshots after each dispatched event — curating "a suite of visual end-to-end tests that cover every line of your codebase." It also states "the browser is augmented to be deterministic in order to eliminate flakes" and mocks network by default.

That is: automated state selection **and** determinism control **and** visual diff, with no human state map.

**This is the strongest single piece of evidence against #48's premise as written.** Any claim that "mainstream tooling leaves state selection entirely to humans" must be retired.

### 3.3 MISSED — but only outside Meticulous's preconditions

Meticulous's selection is driven by **recorded traffic** and **code-coverage**. Both preconditions fail for the substrate #48 cares about:

- **No traffic** → nothing to replay. Pre-launch products, internal tools, portfolios.
- **Coverage is a poor proxy for visual state in animation-driven UI.** In CTWalk every desktop checkpoint flows through the *same* `renderExperience()` function; branch coverage cannot distinguish `commerce.expired-promo` from `commerce.unavailable`. A coverage-guided selector would plausibly collapse many visually distinct states into one.

Meticulous's own materials do not address scroll-driven animation, canvas, or WebGL. *Not-found, not disproven* — their public docs simply do not specify.

This is where a real gap survives, and it is narrower and more technical than "discovery."

### 3.4 MISSED — no animation-keyframe-selection-for-testing literature

Searches for keyframe/representative-frame selection applied to UI regression returned only CSS specification material, no testing research. **Not-found ≠ does not exist**, but combined with 3.3 it suggests genuine white space.

### 3.5 MISSED — incumbent VRT tools confirmed human-authored

[Applitools](https://applitools.com/blog/ai-self-healing-test-cloud/) self-heals *locators in existing tests*; it does not choose what to test. Independent 2026 commentary warns self-healing can [quietly re-point a test and hide real UX regressions](https://sdet.qa/blog/self-healing-test-automation-ai-first-tools-2026/) — which incidentally supports the governance discipline already established in this program. [QA.tech's](https://qa.tech/blog/visual-testing-with-agents-how-to-catch-ui-bugs-before-your-users-do) agent generates *steps* from a human-written goal and expected result; it does not decide which states deserve baselines. Chromatic/Percy snapshot what you tell them to.

---

## 4. Substitutes that shrink the audience

| Substitute | Effect on #48's value | Evidence |
| --- | --- | --- |
| **Component-driven testing** — stories *are* the state enumeration; Chromatic snapshots every story × mode | Discovery ≈ free. And story authoring is itself being automated from TypeScript prop types | [Storybook AI](https://storybook.js.org/ai), [story-ui](https://github.com/southleft/story-ui/), [50-component pipeline case study](https://www.backend.ai/blog/2026-02-writing-stories-for-50-components) |
| **Native CSS scroll-driven animations** — `animation-timeline`, `scroll()`, `view()`, `animation-range`; keyframes are declarative and DevTools-inspectable | If adopted, the state map is *readable from CSS*. Discovery collapses to parsing | [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations), [spec draft](https://drafts.csswg.org/scroll-animations-1/) |
| **Session-replay selection** (Meticulous) | Removes the need for a map entirely, where traffic exists | §3.2 |
| **Status quo: a knowledgeable human writes 22 lines of JSON** | One-time cost, no vendor, no trust problem. Frequently good enough | CTWalk's own manifest |

**The addressable audience is the intersection of the negatives:** hand-rolled (non-declarative) animation choreography, no component enumeration, no usable traffic, and enough visual complexity that hand-authoring genuinely hurts. That is a narrow segment, and CTWalk sits precisely in its centre — which is exactly why it is a poor sole validator.

---

## 5. Unknown-unknown register

Lenses used: user/workflow, technical architecture, economics, security/trust, maintenance, open-source health, evidence quality, organizational ownership. Not claimed exhaustive.

| # | Unknown | Type | Why it matters | How to reduce |
| --- | --- | --- | --- | --- |
| U-1 | Native CSS scroll-driven animations may make the target substrate a **shrinking** class | Assumption → open question | Erodes the gap over time regardless of execution quality | Check adoption trend; test discovery against a declaratively-animated site |
| U-2 | Coverage-guided selection may be *actively wrong* for animation UI (one code path, many visual states) | Supported inference | This is the sharpest technical wedge against Meticulous — and #48 never states it | Measure: how many distinct visual states share a branch in CTWalk |
| U-3 | Judge/WebEmbed may already compress CTWalk's state space as well as a bespoke scorer | Open question | If yes, #48's engine should be a *consumer* of published abstractions | Run PDiff + an embedding abstraction over the same samples; compare |
| U-4 | Liability when discovery misses a state | Unknown needing experiment | An agent-proposed set that silently omits a state creates false confidence — worse than a known-incomplete hand-written set | Require explicit "not covered" output, not just proposals |
| U-5 | Trust/adoption: will a QA owner accept agent-proposed checkpoints? | Unknown | Determines whether output is used or re-derived by hand anyway | Ask one external practitioner before building more |
| U-6 | VLM cost/variance in the loop | Assumption | #48 already bounds this (selective vision), but per-run cost and *run-to-run instability of the proposal* are unmeasured | Run discovery twice; compare proposals. **An unstable proposal is disqualifying** |
| U-7 | Maintenance: does the proposal need re-deriving on every UI change? | Open question | If yes, the one-time saving evaporates | Re-run after a real UI change and diff proposals |
| U-8 | Self-healing/agentic tools can mask real regressions | Known fact | Reputational risk for the whole category the Skill would sit in | Keep the human-authority separation already built |

**U-6 deserves emphasis.** Nothing in #48 requires the discovery mechanism to be *repeatable*. This program has spent the entire session insisting that captures be byte-identical across runs. A discovery mechanism whose proposed checkpoint set changes between runs would fail the program's own standard while being used to justify a Skill.

---

## 6. Built-for-built assessment

| Criterion | Status |
| --- | --- |
| Concrete user | **Weak** — only CTWalk's maintainer is identified |
| Recognizable failure | **Partial** — hand-authoring is real, but the loudly expressed practitioner pain is flake/noise/maintenance, not state discovery ([1](https://www.shakacode.com/blog/flaky-visual-regression-tests-and-what-to-do-about-them/), [2](https://bug0.com/knowledge-base/jest-visual-regression-testing)) |
| Falsifiable outcome | **Yes** — #48's evaluation questions are honest and mostly answerable |
| **Negative control** | **MISSING** — no substrate on which discovery *should* fail or be unnecessary |
| Reusable artifact | Claimed, unproven |
| Adoption path | Undefined |
| Stop condition | Present in spirit; not quantified |
| Existing-tool reuse | **Failing** — bespoke delta scoring instead of evaluating PDiff/WebEmbed/Judge |
| Bounded cost | Partly; VLM cost bounded, maintenance cost unmeasured |
| Changes a real decision | Yes — it gates the Skill decision |

Two signals fire clearly: **generic capability before a vertical slice**, and **custom infrastructure before existing tools are evaluated**.

To #48's credit it explicitly forbids inventing completeness percentages, forbids putting vision in the per-PR loop, forbids declaring portability from CTWalk alone, and treats failure as valuable. That is unusually disciplined framing.

---

## 7. Claims that must not be made

- ❌ "Existing visual testing tools leave state selection to humans." — Meticulous falsifies it.
- ❌ "Automated UI state discovery / compression is an open problem." — 15 years of literature.
- ❌ "Near-duplicate state detection is our contribution." — it is a benchmarked field; best reported coverage in the 2026 study is ~54%, so it is *unsolved-but-occupied*, which is different from *open*.
- ❌ "This reduces human effort by X%." — unsourced.
- ⚠️ Any portability claim from CTWalk alone — #48 already forbids this; keep it.

Defensible, narrower claim:

> For UIs whose visual states are neither component-enumerated nor recoverable from production traffic, and where code coverage does not discriminate visual state, an agent can derive a compact deterministic golden-path proposal from source and runtime evidence, and surface the determinism gaps that block reliable screenshot regression.

---

## 8. Recommendation

**Modify #48 before running it.** Five changes, in priority order:

1. **Add a negative control.** Run the same mechanism against a component-driven Storybook app *and* a site using native CSS scroll-driven animations. If discovery adds nothing there, that is the correct and expected result — and it defines the real boundary. Without a control, a CTWalk success proves almost nothing.
2. **Reuse, don't reinvent, state abstraction.** Evaluate PDiff and one embedding-based abstraction against the bespoke delta scorer on identical samples. If a published technique matches it, the engine becomes a consumer and the contribution moves up a layer.
3. **Require proposal repeatability.** Run discovery twice; diff the proposals. Hold it to the same determinism standard as capture. Instability is disqualifying (U-6).
4. **State the anti-Meticulous wedge explicitly.** "Coverage-guided selection cannot discriminate visual states that share a code path" is the sharpest technical claim available, and it is measurable on CTWalk today (all desktop checkpoints share `renderExperience`).
5. **Require a not-covered output.** The mechanism must report what it believes it *missed*, not only what it proposes (U-4).

**On the contamination problem:** unchanged and independent of this audit. I have the 22-checkpoint manifest in context and cannot be the independent reviewer. Options 1–3 from my previous message still stand; a fresh subagent consuming only `llm-review-packet.json` is the cleanest.

### Decision criteria

| Outcome | Trigger |
| --- | --- |
| **GO** (carry into Repo B) | Discovery recovers major responsibilities without the manifest, proposals are repeatable, published abstractions do **not** trivially match it, and the negative control correctly shows low value on component-driven UI |
| **INTEGRATE** | Judge/WebEmbed/PDiff matches the bespoke scorer → keep the governance + determinism layer, consume published abstraction underneath |
| **REFRAME** | Discovery works but only on CTWalk-shaped substrate → narrow the Skill to "animation/scroll-driven composition verification," a niche, and say so |
| **DEFER** | Proposals unrepeatable, or native scroll-driven animation adoption is rising fast enough to erode the substrate |
| **STOP** | Discovery needs the manifest or broad manual exploration to work — #48 already names this as the honest failure signal |

---

## 9. Search scope and limitations

- English-language sources; searches run 2026-09-02.
- Meticulous's selection algorithm and determinism implementation are **vendor claims from marketing pages**, not verified. Not independently tested here.
- "Not found" is reported as not-found, never as non-existence — specifically for animation-keyframe-selection-for-testing and for Meticulous's animation handling.
- No practitioner interviews. U-5 and the frequency argument in §2 rest on published commentary, not primary user research. This is the weakest evidence in the report.
- Patent landscape not searched.
- The 2026 empirical study's ~54% best coverage figure is *branch coverage for crawling*, not a visual-baseline quality metric; it is cited to show the field is occupied and imperfect, not to grade #48.
