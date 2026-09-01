# UI/UX Candidate Verdict Schema

Status: **normative for baseline acceptance records in this repository.**

Implements Method v1 §5 (acceptance authority model), §7 (verdict model and
persistence) and the Human Verification Amendment, which requires authoritative
perceptual acceptance to occur on the actual website.

## Why this file exists

Earlier baseline records carried a single `status` field and a free-text
`reviewer` string. That conflates two different things:

- what a reviewer **proposes** after inspecting evidence;
- what the acceptance authority has actually **accepted**.

An automated agent may propose a verdict. It is not the acceptance authority for
perceptual UX, and a proposal must never silently become an approval because the
agent recorded it first.

## Record shape

Every candidate in the active matrix gets exactly one record, whatever its
outcome. Rejected and blocked candidates are recorded too, so a missing golden
image is always explainable.

```jsonc
{
  "checkpoint_id": "commerce.expired-promo",
  "viewport_id": "desktop",
  "locale": "zh-TW",
  "motion_preference": "normal",
  "presentation": "desktop",

  // --- what was captured, and whether it can be trusted ---
  "source_sha": "<40-char sha>",
  "source_worktree_clean": true,
  "capture": { "...": "provenance block, see §Provenance" },
  "mechanical": { "...": "audit facts, see §Mechanical" },
  "determinism": { "...": "repeatability classification, see §Determinism" },

  // --- reviewer proposal: never authoritative on its own ---
  "review_proposal": {
    "verdict": "proposed_approved | proposed_rejected | proposed_blocked",
    "reviewer": "agent:claude-opus-5 | human:<role>",
    "reviewed_on": "screenshot | isolated-harness | actual-website",
    "basis": ["mechanical", "perceptual"],
    "notes": "…",
    "proposed_at": "<iso-8601>"
  },

  // --- acceptance authority: the only field that can freeze a baseline ---
  "acceptance": {
    "status": "approved | rejected | blocked | pending_authority",
    "authority": "human:<named role/person/process>",
    "verified_on_actual_website": false,
    "website_verification": {
      "url": null,
      "revision_confirmed": null,
      "surfaces_reviewed": [],
      "verified_at": null
    },
    "notes": null,
    "decided_at": null
  },

  "supersedes": null,
  "image": null,
  "sha256": null
}
```

## Field rules

### `review_proposal.verdict`

- `proposed_approved` — reviewer believes the state is correct and acceptable.
- `proposed_rejected` — capture is trustworthy, but the state or composition is
  wrong or unacceptable.
- `proposed_blocked` — environment, assets, runtime or state determinism
  prevented a trustworthy judgement.

`reviewed_on` records **how** the reviewer looked. Per the Human Verification
Amendment, `screenshot` and `isolated-harness` are engineering evidence only and
can never produce final approval by themselves.

### `acceptance.status`

- Starts at `pending_authority` for every candidate.
- May become `approved` **only** when all of the following hold:
  1. `mechanical.ok` is true;
  2. `determinism.classification` is `byte-identical` or an explicitly recorded
     and justified rendering-only tolerance;
  3. a `proposed_approved` proposal exists;
  4. `verified_on_actual_website` is true for this `source_sha`.
- May become `rejected` or `blocked` on authority decision without website
  verification, because neither produces a golden image.

**REJECTED and BLOCKED must not be merged.** They imply different fixes:
rejected means change the design or the checkpoint; blocked means fix the
environment or the determinism and re-capture.

### `acceptance.verified_on_actual_website`

False by default. An agent may never set this true. It is set by the acceptance
authority after reviewing the deployed site (or the real complete website served
through its normal runtime path) **for the same `source_sha`**.

`website_verification.revision_confirmed` records how the reviewer confirmed the
deployed revision matches the candidate. Without it, the link between what was
reviewed and what is being frozen is an assumption.

## Provenance block

```jsonc
"capture": {
  "captured_at": "<iso-8601>",
  "runtime": "node-playwright",
  "driver_version": "1.55.0",
  "browser_name": "chromium",
  "browser_version": "145.0.7632.6",
  "browser_build": "ms-playwright chromium-1208",
  "browser_executable": "<path>",
  "environment_deviation": "<explicit text, or null>",
  "os": "macOS 15.7.4 (arm64)",
  "device_scale_factor": 1,
  "viewport": { "width": 1440, "height": 900 },
  "locale_requested": "zh-TW",
  "html_lang_resulting": "zh-Hant-TW",
  "motion_preference": "normal",
  "static_server": "http://127.0.0.1:4173",
  "checkpoint_resolution": { "scene": "1", "documentProgress": 0.16, "score": 1 },
  "settle": { "settled": true, "stableFrames": 4 },
  "screenshot_path": "…",
  "screenshot_sha256": "…"
}
```

`environment_deviation` is required to be explicit rather than omitted when the
pinned browser could not be used. A deviation that is not recorded is
indistinguishable from one that did not happen.

## Mechanical block

```jsonc
"mechanical": {
  "ok": true,
  "horizontal_overflow": false,
  "broken_images": [],
  "failed_requests": [],
  "console_errors": [],
  "console_errors_explained": "…",
  "checks": { "…": "project-specific facts from the audit" }
}
```

Console errors are **explained, not waived**. An unexplained console error keeps
`ok` false.

## Determinism block

```jsonc
"determinism": {
  "same_route": {
    "classification": "byte-identical | encoder-only | sub-perceptual | unstable",
    "differing_pixels": 0,
    "percent": 0,
    "max_channel_delta": 0,
    "bounding_region": null
  },
  "alternate_route": {
    "paths_compared": ["fresh", "via-other-scene", "revisit"],
    "classification": "byte-identical | …"
  }
}
```

Classification rules:

- `byte-identical` — file hashes match.
- `encoder-only` — bytes differ, zero differing decoded pixels.
- `sub-perceptual` — a small number of differing pixels at a low max channel
  delta, with the measurement recorded. Requires a stated reason.
- `unstable` — anything else. **Not freezeable.** Fix the determinism owner.

A blanket percentage tolerance is forbidden. Each accepted difference carries its
own measurement and justification.

## Lifecycle

```text
candidate
  → mechanical audit
  → determinism classification
  → reviewer proposal
  → acceptance authority decision
      ├── approved (requires website verification)  → golden
      ├── rejected                                  → fix design/checkpoint
      └── blocked                                   → fix environment/determinism
```

An approved baseline is never silently overwritten. A replacement is recorded as
a new approval whose `supersedes` names the previous record.

## Anti-patterns this schema exists to prevent

- an agent's proposal being read as an approval;
- a screenshot review being treated as website verification;
- `REJECTED` and `BLOCKED` collapsing into one "failed" bucket;
- an unexplained console error passing as clean;
- instability being absorbed by a global tolerance;
- a golden image whose reviewed revision is unknown or assumed.
