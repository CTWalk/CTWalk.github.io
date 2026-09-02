# Phase A — Blind Reviewer Brief

Status: **PARKED. Do not use during current V1 construction/calibration.**

This brief is preserved for a future formal validation run **after V1 has been frozen**.
During current #48 development, runtime LLMs are explicitly allowed to read the known
CTWalk reference as a debugging oracle and should instead follow:

- `V1_DEVELOPMENT_STAGE.md`
- `V1_MATERIALS_ACCUMULATION_BRIEF.md`
- the current Issue #48 body

When future blind validation begins, use a fresh reviewer that has not read the reference
inventory or the development corpus, re-run the contamination scan, and then activate this
brief.

---

**Future reviewer instruction starts below.**

You are the independent reviewer for a visual-golden-path discovery validation experiment.

Read this file, then work **only** from the frozen evidence package named by the validation
orchestrator. Do not read the repository, its documentation, the issue tracker, development
artifacts, or any other file. That restriction is part of the future validation experiment;
violating it invalidates the result even if the reasoning is sound.

## Your future inputs

```text
<frozen-validation-run>/llm-review-packet.json
<frozen-validation-run>/candidate-images/**
    only images referenced by the packet
```

The packet must be self-contained by design. If you believe you need something outside it,
**do not fetch it** — record the need under `additional_evidence_requests` and proceed with
what you have.

## What the evidence represents

The frozen discovery mechanism will have sampled a dynamic desktop web UI and produced a
compressed review packet from runtime observations. The packet may include facts such as:

- visible text and elements;
- bounding boxes, opacity, transforms and filters;
- image/background sources;
- semantic/ARIA text;
- area share, colour and z-index;
- structural/change summaries;
- selected candidate images.

Important: the packet is a **compressed product of the discovery mechanism**, not
necessarily the complete dense sample stream. Candidate images are also selective support,
not exhaustive animation frames.

You are not told how many meaningful states the UI has. There is no target count.

## Your future task

Decide which observed states deserve a **golden visual-regression screenshot**, and which do
not.

A state is baseline-worthy when it carries visual-regression information that neighbouring
proposed checkpoints would not adequately catch. Two states can be functionally equivalent
and still both deserve baselines if they look materially different. Two states can look
slightly different and still not deserve separate baselines if they serve the same visual
regression responsibility.

Classify candidates/regions as:

```text
baseline-worthy
visually-redundant
functional-only
transient
temporal-runtime-only
human-only
uncertain
```

Be economical. Continuous animation produces unlimited distinguishable frames; almost none
of them are worth freezing. Prefer holds, settled states, handoffs between visual
responsibilities, and states where dominant evidence changes.

### Use vision selectively

Reason from the recorded observations first. Open a referenced image only when it would
change a classification or resolve a genuine ambiguity.

Record where image evidence affected a decision. Do not review images frame-by-frame by
default.

### Do not invent product intent

Where evidence cannot settle whether something is intentional, say so. Use `uncertain` or
`human-only` and attach one narrow question a human can answer without manually
re-exploring the whole application.

## Required future output

Write `independent-proposal.json`:

```jsonc
{
  "reviewer": {
    "type": "agent|human",
    "model_or_role": "...",
    "prior_access": "..."
  },
  "inputs_used": ["..."],
  "checkpoints": [
    {
      "derived_id": "your own name",
      "scene_id": "...",
      "scene_progress": 0.0,
      "semantic_responsibility": "...",
      "unique_visual_value": "...",
      "stable_condition": "...",
      "evidence_used": ["..."],
      "human_question": null
    }
  ],
  "exclusions": [
    {
      "scene_id": "...",
      "progress_or_range": "...",
      "classification": "...",
      "reason": "..."
    }
  ],
  "not_covered": [
    {
      "surface_or_region": "...",
      "reason": "...",
      "risk_of_omission": "...",
      "suggested_next_verification_method": "..."
    }
  ],
  "human_questions": [],
  "deterministic_control_gaps": [],
  "additional_evidence_requests": []
}
```

`not_covered` is mandatory and must be substantive. Silent completeness claims are not
acceptable.

## Freeze rule

Once written, **do not revise the proposal after the hidden reference is revealed**. Any
later revision must be a separate file. Revising the frozen proposal after seeing the
reference destroys the future validation signal.

## What is not being asked

- Not to achieve complete visual coverage.
- Not to match a particular checkpoint count.
- Not to judge whether the UI is aesthetically good.
- Not to decide final acceptance; a human retains that authority.
- Not to participate in current supervised V1 tuning.
