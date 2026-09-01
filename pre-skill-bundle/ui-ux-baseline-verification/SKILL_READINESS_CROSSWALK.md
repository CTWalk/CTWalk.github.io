# Skill-readiness crosswalk

Status: **active maturity crosswalk for the pre-skill bundle; not a Skill recommendation.**

Normative authority: `docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md`, especially §§9–12.

## The trigger we must not forget

Method v1 deliberately forbids premature Skill distillation. A reusable Skill may be proposed only when:

```text
Total score = 100 / 100
AND
Every readiness dimension = 10 / 10
AND
Every hard gate = PASS
```

A strong idea, useful prior art gap, successful CTWalk run, or high community-value estimate does **not** override this gate.

This file exists because several useful method/history documents were added after the gate was written. Their evidence must feed the gate rather than accidentally becoming an informal replacement for it.

## Current readiness crosswalk

This is **not yet a formal 0–100 scoring pass**. A dimension may contain strong evidence and still remain below 10/10 because Method v1 requires implementation + documentation + evidence, not merely a sound principle.

| # | Method v1 dimension | New/current evidence that bears on it | What is still missing before 10/10 |
| --- | --- | --- | --- |
| 1 | Contract portability | Method v1 separates portable contracts from CTWalk-specific rules; `RESEARCH_PRIOR_ART.md` reinforces that the Skill should govern baseline trust rather than rebuild commodity capture tooling. | Evidence that a reusable implementation accepts a different project's contract without hidden CTWalk assumptions. |
| 2 | Checkpoint portability | CTWalk's semantic checkpoint model is well evidenced; `DECISION_HISTORY.md` explicitly classifies checkpoint names and scene inventories as non-portable. | A project-adapter-driven checkpoint engine exercised outside the CTWalk scene model. |
| 3 | Capture reproducibility | `run-log/ENVIRONMENT.md`, `RUN_LOG.md`, capture metadata, clean-SHA discipline, browser-deviation disclosure, and the `b22da62 → f40e365` stop condition provide strong provenance evidence. | Re-run on the final intended candidate revision and evidence the same provenance discipline in reusable tooling rather than only CTWalk scripts. |
| 4 | Mechanical audit portability | `tools/audit78.mjs` and `evidence/audit78.json` demonstrate total-matrix fact collection; `DECISION_HISTORY.md` distinguishes portable fact categories from project selectors. | Generic audit engine separated from CTWalk selectors/checkpoint semantics, with project adapter/configuration. The current probe is explicitly throwaway/project-specific. |
| 5 | Determinism coverage | `repeat78.mjs`, same-route fresh-context comparison, alternate Outro paths, byte-vs-pixel classification, and the Intro RAF instability provide strong empirical material. | Close known deterministic-control gaps for the final candidate and demonstrate reusable same-route + alternate-route machinery outside hidden CTWalk knowledge. |
| 6 | Verdict governance | Method v1 and the human-verification amendment separate reviewer proposal from acceptance authority; APPROVED/REJECTED/BLOCKED is established; `DECISION_HISTORY.md` preserves why BLOCKED matters. | A reusable verdict schema/workflow plus a complete authoritative run using it. `b22da62` deliberately has no complete verdict set. |
| 7 | Detector discipline | The 130-image v1 calibration exposed detector bugs; `DECISION_HISTORY.md` establishes **blind labels → detector run → disagreement analysis → triage**; `OPEN_QUESTIONS.md` records threshold invalidation and reporting questions. | The blind-first calibration was **not executed** on `b22da62`; no valid current-matrix calibration/holdout exists; independent validation evidence is still missing. This hard gate is therefore not satisfied. |
| 8 | Baseline lifecycle | Candidate/approved/rejected/blocked/superseded semantics exist; historical 130-image evidence and the source-movement stop demonstrate why SHA identity and coherent freeze matter. | A final coherent active 78-candidate freeze from one accepted revision, with website-level human acceptance and durable records. |
| 9 | Golden-regression rigor | Method v1 defines strict comparison and tolerance discipline; repeatability probes provide renderer-noise vs visible-instability examples. | The post-freeze regression layer must be implemented/proven against the final coherent baseline; #8/#10 work must not be assumed complete from capture/audit research. |
| 10 | Independent reuse evidence | `RESEARCH_PRIOR_ART.md` clarifies the likely reusable niche and `DECISION_HISTORY.md` explicitly warns against CTWalk-shaped extraction. | **No independent second-UI/isolated-adapter portability exercise has yet succeeded.** This hard gate remains unsatisfied. |

## Hard-gate consequences visible today

The following Method v1 hard gates are clearly **not yet satisfied** from the current material:

- generic engine contains no required CTWalk-specific selectors/checkpoint names — no finished generic engine yet;
- project-specific thresholds live outside the reusable engine — architecture is specified, not yet fully demonstrated;
- detector validation uses evidence not wholly reused from its calibration loop — current 78-matrix blind/holdout validation was stopped before execution;
- final baseline can be produced coherently from one accepted source revision — active final 78-image freeze is not complete;
- post-freeze comparison uses controlled environment/state and a justified strict tolerance model — final post-freeze regression evidence is not complete;
- at least one independent reuse/portability exercise succeeds without hidden project knowledge — not yet performed.

Other hard gates have strong CTWalk evidence, but they should not be marked PASS for Skill readiness until they are represented in the reusable implementation and included in a formal maturity review.

## How the newer pre-skill materials relate to the gate

### `DECISION_HISTORY.md`

Feeds primarily dimensions **3, 5, 7 and 8**:

- source revision is evidence identity;
- sunk capture cost cannot justify stale approval;
- blind-first calibration ordering;
- path-dependence and BLOCKED classification;
- portable vs project-specific boundaries.

It records method evidence. It does **not** itself satisfy portability.

### `RESEARCH_PRIOR_ART.md`

Feeds dimensions **1, 6, 7 and 9** by clarifying where existing tooling ends and where the proposed method may add value.

Prior-art novelty/value is **not a readiness dimension**. A differentiated idea can still be unready to distil.

### `OPEN_QUESTIONS.md`

Should be read as an explicit list of readiness blockers/unknowns, especially for dimensions **5, 7 and 8**. An open question must not silently become a default Skill rule merely because it sounds plausible.

### `run-log/RUN_LOG.md` and `run-log/ENVIRONMENT.md`

Provide historical implementation evidence for dimensions **3 and 5**. They are pinned to `b22da62`; they do not certify the later `f40e365` state.

### `run-log/FINDINGS_SO_FAR.md`

Provides defect taxonomy and empirical evidence for dimensions **4 and 5**, including the distinction between product defects and deterministic-control gaps.

### `tools/`

These are research probes. Their useful ideas may inform dimensions **4, 5 and 7**, but the tools themselves must not be mistaken for the reusable engine because they contain project-specific assumptions.

## Required trigger sequence

The authoritative sequence remains Method v1 §12:

```text
script/method design
→ method-v1 conformance improves
→ repository UI defects resolved
→ final accepted repo revision
→ authoritative baseline freeze
→ coherent golden path
→ strict visual regression all green
→ independent portability validation
→ formal 100/100 Skill-readiness review
→ only then suggest Skill distillation
```

The recent token-cost discussion changes **how we may gather evidence efficiently**. It does not remove any step from this sequence.

## Current conclusion

```text
recommend_skill_distillation: NO
reason:
  valuable method evidence exists,
  but the 100/100 + all-hard-gates trigger has not been fulfilled
```

Until the formal maturity review returns 100/100 with every hard gate PASS, refer to this work as **method development / pre-skill evidence**, not as a buildable or ready-to-distil Skill.
