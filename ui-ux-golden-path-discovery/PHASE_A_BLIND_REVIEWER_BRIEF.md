# Phase A — blind reviewer brief

**You are the independent reviewer for a visual-golden-path discovery experiment.**

Read this file, then work **only** from the evidence package named below. Do not read the
repository, its documentation, the issue tracker, or any other file. That restriction is
the experiment; violating it invalidates the result even if your reasoning is sound.

## Your inputs

```text
run-N/llm-review-packet.json          the frozen evidence
run-N/candidate-images/**             only the images the packet references
```

The packet is self-contained by design. If you believe you need something outside it,
**do not go and get it** — record the need under `additional_evidence_requests` and
proceed with what you have.

## What the evidence is

A dynamic desktop web UI was sampled at `1440x900`. For each of its scenes, a runner
stepped through normalised scene progress and recorded, at each sample:

- visible text and visible elements;
- bounding boxes, opacity, transforms, filters;
- image and background sources;
- semantic/ARIA text;
- area share, colour, z-index.

Adjacent samples were scored for structural change. Screenshots were persisted only at
scene boundaries, local change peaks, and representative stable spans — so **the images
are a pre-filtered subset, not the full sample set.** Treat the numeric observations as
primary evidence and the images as selective support.

You are not told how many meaningful states this UI has. There is no target count.

## Your task

Decide which observed states deserve a **golden visual-regression screenshot**, and which
do not.

The distinction that matters: a state is baseline-worthy when it carries visual
regression information that its neighbouring proposed checkpoints would not catch. Two
states can be functionally equivalent and still both deserve baselines if they look
materially different. Two states can look slightly different and still not deserve
separate baselines if one would catch the other's regressions.

Classify every candidate or region as exactly one of:

```text
baseline-worthy
visually-redundant
functional-only
transient
temporal-runtime-only
human-only
uncertain
```

Be economical. Continuous animation produces unlimited distinguishable frames; almost
none of them are worth freezing. Prefer holds, settled states, handoffs between visual
responsibilities, and states where the dominant evidence changes.

### Use vision selectively

Reason from the recorded observations first. Open a referenced image only when it would
change a classification or resolve a genuine ambiguity — for example, whether the primary
composition materially changed, whether the dominant evidence changed, or whether a
candidate is merely an intermediate animation frame.

Record where you used an image and what decision it supported. Do not review images
frame by frame by default.

### Do not invent product intent

Where the evidence cannot settle whether something is intentional, say so. Put it in
`uncertain` or `human-only` and attach **one narrow question** a human can answer without
re-exploring the whole application. "Please review the site" is not an acceptable
question.

## Required output

Write `independent-proposal.json`:

```jsonc
{
  "reviewer": { "type": "agent|human", "model_or_role": "...", "prior_access": "..." },
  "inputs_used": ["..."],
  "checkpoints": [
    {
      "derived_id": "your own name; it need not match anything",
      "scene_id": "...",
      "scene_progress": 0.0,
      "semantic_responsibility": "...",
      "unique_visual_value": "why a baseline here catches something its neighbours miss",
      "stable_condition": "when this is settled enough to capture",
      "evidence_used": ["observation fields and/or image paths"],
      "human_question": null
    }
  ],
  "exclusions": [
    { "scene_id": "...", "progress_or_range": "...", "classification": "...", "reason": "..." }
  ],
  "not_covered": [
    { "surface_or_region": "...", "reason": "...", "risk_of_omission": "...",
      "suggested_next_verification_method": "..." }
  ],
  "human_questions": [],
  "deterministic_control_gaps": [],
  "additional_evidence_requests": []
}
```

`not_covered` is mandatory and must be substantive. A proposal that lists only what it
found, with no account of what it could not observe or classify, is treated as incomplete
regardless of quality. Silent completeness claims are the failure mode this experiment
most needs to avoid.

## Freeze rule

Once written, **do not revise this file.** It will be compared against a reference
inventory you have not seen. Any later revision must be a separate file. Revising the
frozen proposal after seeing the reference destroys the only thing this experiment
measures.

## What is not being asked of you

- Not to achieve complete visual coverage.
- Not to match any particular count.
- Not to judge whether the UI is good.
- Not to decide final acceptance — a human holds that authority.
