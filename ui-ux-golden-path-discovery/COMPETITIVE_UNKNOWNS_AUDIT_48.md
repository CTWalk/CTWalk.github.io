# Competitive & Unknown-Unknowns Audit — Issue #48

Status: **research artifact. Non-authoritative. Does not modify #48, Method v1, or any baseline.**

Landscape dated: **2026-09-02**
Subject: #48's core bet that upstream *visual-state discovery* is the unsolved, differentiating problem for a reusable UI/UX verification Skill.
Requested posture: adversarial. The case against the premise is made as strongly as the evidence allows.

---

## 1. Executive verdict

**MODIFY the experiment. Do not run #48 as originally framed, and do not claim that automated UI-state discovery or near-duplicate detection is novel.**

Two substantive challenges landed:

1. **GUI state abstraction / near-duplicate detection is a mature, benchmarked research field.** Crawljax, near-duplicate model-inference work, tree-based abstractions, WebEmbed, Judge and a 2026 comparative study show that this is an occupied field. The evidence does **not** support calling it solved: no single abstraction is universally dominant and the techniques trade classification quality, exploration yield, runtime cost and calibration burden differently.
2. **Commercial automation of state/test selection exists.** Meticulous.ai publicly describes recording sessions, selecting useful sessions using coverage information, replaying them deterministically and taking visual snapshots. Therefore the claim that state selection is always fully manual is false.

Three important questions remain open rather than disproven:

3. Existing GUI state abstraction mainly optimizes exploration/model equivalence. **That is adjacent to, but not identical with, selecting which visually distinct compositions deserve golden baselines.** A state can be functionally equivalent yet visually regression-relevant.
4. No published work was found in this audit that directly solves **semantic checkpoint selection inside continuously varying animation/scroll-driven composition**. Not-found is not evidence of non-existence.
5. Session/event/code coverage may under-discriminate visual composition when multiple materially different renders are produced by changing continuous state while traversing the same source-level control-flow regions. This is a measurable hypothesis, not an established fact.

The surviving experiment is therefore broader than a niche keyframe detector but narrower than "solve UI state discovery":

> determine whether source semantics, runtime evidence, mature state-abstraction primitives and selective visual reasoning can be composed into a repeatable, explainable visual-baseline checkpoint proposal — especially where existing stories, traffic or source coverage do not already enumerate the meaningful visual compositions.

---

## 2. The problem, stated independently of the proposed solution

Remove the proposed product and the problem still parses:

> A team has UI behavior whose meaningful visual compositions are not already enumerated in a form a screenshot-regression system can consume. Before reliable regression can start, someone must decide which states deserve golden images, which are redundant, which should be tested temporally/functionally instead, and how to reach the selected states reproducibly.

This remains a real problem, but the beneficiary/economic argument is mixed:

- sometimes the relevant product engineer already knows the states and only needs to encode them;
- sometimes the knowledge is distributed across code, tests, animation logic and runtime behavior and requires nontrivial reconstruction;
- golden-path construction is often a one-time or occasional cost, while flake triage and baseline churn recur per change;
- therefore discovery alone is a weak product; it is better treated as the **front end** of a broader deterministic visual-verification method.

The experiment should test usefulness rather than assume it.

---

## 3. Prior-art audit

### 3.1 LANDED — state abstraction is mature and occupied, not novel

Automated web GUI testing has long treated "are these two states equivalent enough to merge?" as a core problem because redundant states explode exploration cost.

Relevant prior art includes:

- [Crawljax](https://www.researchgate.net/publication/254007517_Crawling_Ajax-Based_Web_Applications_through_Dynamic_Analysis_of_User_Interface_State_Changes)
- [Yandrapally et al., ICSE 2020](https://tsigalko18.github.io/assets/pdf/2020-Yandrapally-ICSE.pdf)
- [Tree-kernel state detection](https://www.researchgate.net/publication/354235199_Web_Application_Testing_Using_Tree_Kernels_to_Detect_Near-duplicate_States_in_Automated_Model_Inference)
- [WebEmbed](https://arxiv.org/pdf/2306.07400)
- [Judge (TOSEM 2026)](https://dl.acm.org/doi/full/10.1145/3736162)
- [2026 empirical comparison of six state abstractions](https://arxiv.org/html/2606.16650)

The 2026 comparison includes StringCmp, Gestalt, RTED, PDiff, WebEmbed and Judge. The field is mature enough that a bespoke structural delta scorer cannot be positioned as the contribution.

However, **"solved" is too strong**. The comparative evidence reports complementary strengths rather than one universally dominant abstraction. Earlier work also shows meaningful tradeoffs: screenshot-based PDiff can classify pairwise visual differences strongly but imposes higher runtime cost; structural methods can explore more quickly and sometimes yield better downstream models; thresholds may need application-specific calibration.

**Consequence for #48:** V1's structural scorer is acceptable only as an experimental baseline. It must be benchmarked against existing primitives before any reusable-engine claim is made.

### 3.2 IMPORTANT DISTINCTION — GUI-state equivalence is not visual-baseline equivalence

Most GUI-crawling/state-abstraction work is designed to reduce exploration redundancy or infer functional models. Its ground truth can legitimately merge states that differ cosmetically but have equivalent behavior.

Visual regression has a different objective. A state can be:

```text
same route
same DOM role
same action
same code branch
```

while a change in:

```text
opacity
layout
hierarchy
image/evidence
z-order
composition
```

is exactly the regression a visual baseline should protect.

Therefore:

```text
GUI state abstraction
        ≠
visual checkpoint selection
```

The former supplies useful primitives; it does not by itself decide whether two states provide distinct golden-baseline value.

### 3.3 LANDED — commercial automated selection exists

[Meticulous.ai](https://www.meticulous.ai/how-it-works) publicly describes installing a recorder, capturing sessions, selecting a subset of sessions using feature/code coverage, replaying them, augmenting the browser for determinism and taking screenshots during replay.

This invalidates any blanket statement that existing tools always require humans to enumerate every visual test state.

But its public documentation does not establish that it performs semantic keyframe selection inside continuously varying animation/scroll composition. Nor does this audit establish that it cannot. The only defensible conclusion is:

> session/event/coverage-guided selection already exists; whether it adequately discriminates continuously varying visual composition is an open empirical question.

### 3.4 OPEN — source coverage may under-discriminate visual composition

The earlier audit overstated CTWalk as "all 22 desktop checkpoints execute through one `renderExperience()` function." That is factually inaccurate.

Current CTWalk has multiple continuous visual owners:

- global `renderExperience()` choreography in `index.html`;
- Commerce's independent rAF render loop;
- Social's independent rAF render loop;
- Intro WebGL's independent draw loop;
- Outro heatmap's independent rAF/history/pointer loop.

The stronger and repo-accurate hypothesis is:

> **multiple visually distinct compositions can be produced by changing continuous state values while executing the same source-level control-flow regions, so statement/branch/function coverage may not discriminate those compositions.**

This must be measured rather than asserted. The experiment should collect source-coverage signatures at independently proposed candidate states and test whether visually distinct candidates collide under those signatures.

### 3.5 NOT-FOUND — semantic checkpoint selection for continuous composition

Searches in this audit did not find published work whose direct objective is:

> choose a compact set of semantically meaningful golden-baseline checkpoints from a continuous animation/scroll composition.

This is **not** a novelty claim. It is a recorded search result with the explicit limitation that not-found is not non-existence.

---

## 4. Substitutes and boundary substrates

| Substrate / substitute | Expected effect on #48 | Experimental role |
| --- | --- | --- |
| **Storybook/component-driven UI** — stories already enumerate interesting component states | Discovery should add little; consume the existing state inventory instead of rediscovering it | **Negative control** |
| **Native CSS scroll-driven animation** — `animation-timeline`, `scroll()`, `view()`, `animation-range`, keyframes | Source analysis becomes cheaper because timeline/keyframe/range metadata is declarative, but the semantically meaningful *composition* may still require runtime/visual reasoning | **Boundary / adaptation substrate** |
| **Session-replay selection** (Meticulous-like model) | Can remove much manual map construction where representative traffic exists | Existing substitute / comparator |
| **Knowledgeable human + small manifest** | One-time, transparent, no vendor; can be good enough on small products | Status-quo comparator |

### Why CSS scroll-driven animation is not a true negative control

Declarative animation tells the system much more about mechanics than hand-rolled rAF choreography. It can expose:

- named timelines;
- keyframes;
- progress ranges;
- entry/exit ranges;
- animation ownership.

But those mechanics do not necessarily identify which combined composition deserves a golden baseline. Multiple animations can overlap, and a visually meaningful composition can occur between authored keyframes.

Expected correct behavior is therefore **adaptation**, not "zero value":

```text
explicit stories exist
→ consume stories

declarative timeline exists
→ parse timeline/keyframes/ranges as candidate anchors
→ use less runtime discovery
→ resolve remaining composition ambiguity selectively

hand-rolled continuous choreography
→ deeper runtime discovery
```

---

## 5. Unknown-unknown register

| # | Unknown | Type | Why it matters | How to reduce |
| --- | --- | --- | --- | --- |
| U-1 | Declarative animation adoption may reduce the amount of inference needed | Open question | Could shrink the expensive hand-rolled-choreography substrate | Run the boundary substrate and inspect adoption over time |
| U-2 | Source coverage may fail to discriminate continuous visual composition | Hypothesis | This is the sharpest technical reason ordinary coverage may not be enough | Capture statement/branch/function coverage signatures at candidate states |
| U-3 | PDiff / WebEmbed / Judge may outperform or complement V1's structural scorer | Open question | Determines whether V1 should be replaced, retained as cheap signal, or fused | Run identical deterministic samples through published abstraction(s) |
| U-4 | Functional-state equivalence may disagree with visual-baseline equivalence | Supported concern | A crawler may merge the exact cosmetic difference VRT needs to preserve | Use independent visual-responsibility labels when comparing abstractions |
| U-5 | Liability when discovery silently misses a state | Open question | False confidence is worse than known incompleteness | Require explicit `not_covered` output |
| U-6 | Will a QA owner trust an agent-proposed checkpoint set? | Adoption unknown | If humans re-derive everything, utility collapses | External practitioner validation later |
| U-7 | VLM/proposal variance | Experimental unknown | A non-repeatable proposal cannot support a reusable method | Run twice; compare semantic responsibility, location and classification |
| U-8 | Maintenance cost after UI evolution | Open question | Re-deriving constantly could erase setup savings | Re-run after a real UI change and compare |
| U-9 | Agentic/self-healing tooling can mask regressions | Known category risk | Weakens trust | Keep human acceptance and no silent baseline updates |

**U-7 is a hard requirement.** Capture determinism without proposal repeatability would be internally inconsistent.

---

## 6. Built-for-built assessment

| Criterion | Status after deeper audit |
| --- | --- |
| Concrete user | **Still weak** — CTWalk maintainer is the only identified operator |
| Recognizable failure | **Partial** — state-map construction is real, but recurring flake/maintenance pain is often louder |
| Falsifiable outcome | **Yes** |
| Negative control | **Now defined:** Storybook/component enumeration |
| Boundary substrate | **Now defined:** native CSS scroll-driven animation |
| Reusable artifact | Claimed, unproven |
| Adoption path | Undefined |
| Stop condition | Present |
| Existing-tool reuse | **Must improve:** V1 is baseline only; PDiff or another published primitive must be benchmarked |
| Bounded cost | Partly; selective vision remains appropriate |
| Changes a real decision | Yes — it gates whether this becomes a Skill module |

The earlier built-for-built warning remains valid: do not invest in a bespoke abstraction engine before measuring existing primitives.

---

## 7. Claims that must not be made

- ❌ "Existing visual testing tools leave state selection entirely to humans." — commercial counterexample exists.
- ❌ "Automated UI state discovery / compression is an open problem." — mature prior art exists.
- ❌ "State abstraction is solved." — evidence shows an occupied field with tradeoffs, not a universal solution.
- ❌ "Near-duplicate detection is our contribution." — it is established prior art.
- ❌ "PDiff is automatically the correct engine for visual checkpoint selection." — it answers a related but narrower pairwise visual-difference question and has cost/calibration tradeoffs.
- ❌ "All CTWalk desktop checkpoints run through one render function." — current repo has several continuous visual owners.
- ❌ "Native CSS scroll animation makes checkpoint discovery unnecessary." — it makes mechanics more inspectable; composition selection may remain.
- ❌ Any percentage reduction in human effort — unsourced.
- ⚠️ Any portability claim from CTWalk alone.

Defensible research question:

> Can a composed mechanism — using existing state-abstraction primitives where useful, plus source semantics, runtime evidence and selective visual reasoning — derive a repeatable, explainable visual-baseline checkpoint proposal, explicitly state what it did not cover, and reduce manual state-map construction on UI surfaces that are not already adequately enumerated by project artifacts?

---

## 8. Recommendation

**Revise #48 before running the full experiment.**

1. **Keep V1 as a naive structural baseline, not a claimed contribution.**
2. **Benchmark PDiff first on identical deterministic samples.** Compare retained visual responsibilities, misses, redundant retention, runtime cost, calibration burden, repeatability and disagreements. If signals are complementary, evaluate a hybrid instead of forcing one winner.
3. **Use Storybook/component enumeration as the true negative control.** Correct behavior is to consume existing stories and mostly stand down.
4. **Use native CSS scroll-driven animation as a boundary/adaptation substrate.** Correct behavior is to exploit declarative timeline metadata and reduce runtime discovery, not necessarily to return zero value.
5. **Require proposal repeatability across two clean runs.** Compare semantic responsibilities, approximate state locations and classifications; prose/name differences alone are not instability.
6. **Require explicit `not_covered`.** Silence about unknown regions is not acceptable.
7. **Measure the coverage-discrimination hypothesis.** Collect source-coverage signatures at independently proposed candidate states and test whether materially distinct visual states collide.
8. **Keep reviewer independence.** A reviewer who already knows the 22 is contaminated for the blind reconstruction.

### Decision criteria

| Outcome | Trigger |
| --- | --- |
| **GO** | The composed mechanism — whether using existing or bespoke primitives — produces a repeatable, explainable proposal on the target substrate, with bounded human review and explicit uncovered areas; proceed to an unrelated Repo B |
| **INTEGRATE** | A published abstraction supplies useful state reduction; consume it and keep the higher-level source/runtime semantics, determinism and governance layers |
| **REFRAME** | Material value appears mainly on continuous composition-heavy UI; narrow the module and state the niche plainly |
| **DEFER** | Proposal is unstable or maintenance economics look poor |
| **STOP** | Meaningful checkpoint construction still requires the hidden manifest or broad manual re-exploration |

Novelty is **not** a GO requirement. Usefulness and repeatability are.

---

## 9. Search scope and limitations

- English-language sources; searches run 2026-09-02.
- Meticulous's selection and determinism mechanism is based on public vendor documentation, not independent testing.
- "Not found" is always reported as not-found, never as non-existence.
- No practitioner interviews have been conducted; adoption/trust remains weakly evidenced.
- Patent landscape not searched.
- The 2026 state-abstraction study is evidence that the field is occupied and tradeoff-heavy, **not** a visual-baseline quality benchmark.
- CTWalk-specific coverage discrimination has not yet been instrumented; until it is, it remains a hypothesis.
