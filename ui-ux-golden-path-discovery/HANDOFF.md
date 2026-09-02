# Handoff — state of play before #48 Phase A

Status: **orchestrator-facing. Quarantined from the Phase A blind reviewer** (see
`PHASE_A_CONTAMINATION_CONTROL.md`). Written 2026-09-02.

Purpose: let a new session start Phase A without silently losing prior work, and without
mistaking superseded material for current.

---

## 1. Read in this order

| # | File | Why |
| --- | --- | --- |
| 1 | this file | what exists, what is live, what is dead |
| 2 | `PHASE_A_CONTAMINATION_CONTROL.md` | **read before touching Phase A** — R1 is insufficient as written |
| 3 | Issue #48 body | the phased experiment specification |
| 4 | `EXECUTION_REVIEW_48.md` | why #48 was rescoped, with evidence |
| 5 | `COMPETITIVE_UNKNOWNS_AUDIT_48.md` | prior-art landscape and falsification posture |
| 6 | `docs/ui-ux/GOLDEN_PATH_DISCOVERY_V1_RUNBOOK.md` | how to run V1 |
| 7 | `docs/ui-ux/REUSABLE_UI_UX_VERIFICATION_METHOD_V1.md` + Human Verification Amendment | still normative, unchanged by the direction change |

`PHASE_A_BLIND_REVIEWER_BRIEF.md` is **not** for the orchestrator to absorb and relay. It
is handed to the blind reviewer as its entire instruction set.

---

## 2. Can Phase A start cleanly? Yes, with one caveat

| Precondition | State |
| --- | --- |
| V1 discovery runner present | ✅ `scripts/discovery/golden-path-discovery-v1.mjs` |
| Review-packet augmentation present | ✅ `scripts/discovery/augment-golden-path-review-packet-v1.mjs` |
| Contract test | ✅ `npm run uiux:test:discovery-contract` — **8/8 pass** |
| Discovery command | ✅ `npm run uiux:discover-golden-path` |
| Output root reserved | ✅ `ui-ux-golden-path-discovery/` |
| Runner independence | ✅ machine-asserted: no `goToCheckpoint`, no `.checkpointIds`, no baseline-plan read |
| Runner leaks no checkpoint IDs | ✅ machine-asserted |
| Blind reviewer brief | ✅ written, machine-asserted clean |
| Blind reviewer allowlist | ✅ defined |
| **Reviewer independence** | ⚠️ **the caveat — see §3** |
| Deterministic substrate | ✅ see §4 — this is the main inherited asset |

**Caveat:** the environment is ready; the *reviewer* is the open question. Any agent that
has read this repository's docs tree is contaminated. Use a fresh reviewer with the
allowlist only.

---

## 3. Contamination status of prior sessions

The session that produced most of this branch **read the baseline manifest and the
baseline plan in full**, repeatedly, and captured the full checkpoint matrix three times.
It is disqualified under R2 from producing `independent-proposal.json`. That is recorded
here rather than left implicit, because the disqualification is not obvious from the
commit history.

Consequence: **do not** ask a session that has read §5 or §6 of this file, or any
quarantined file, to act as the blind reviewer.

---

## 4. Inherited assets that Phase A depends on — keep

These survive the direction change and are load-bearing for Phase A.

### 4.1 A deterministic substrate

Phase A samples the running UI. If the UI is not deterministic under `?uiux-test=1`, every
observation delta is noise and A1 mechanical repeatability cannot pass.

Two fixes on this branch made it deterministic:

| Commit | Fix | Evidence |
| --- | --- | --- |
| `3e888aa` | Intro Three.js loop was free-running on the rAF timestamp; frozen at a fixed time under `?uiux-test=1` only | before: 2.17% differing px / Δ32 desktop, 0.78% / Δ11 laptop. after: byte-identical |
| `0a28d38` | Reduced-motion `!important` collision positioned centered scene copy by its top-left corner, clipping the title | title extents `[794.5..1445.5]` → `[394.5..1045.5]` at vw 1440 |

Evidence committed at `phase1-verification-evidence/0a28d38/` — quarantined from the
blind reviewer, but verifiable by the orchestrator instead of taken on trust.

**Full determinism sweep at `0a28d38`: 22/22 comparisons byte-identical** — 19 same-route
checkpoints in torn-down fresh contexts, 3 alternate-route path comparisons. No tolerance
invoked, no masks.

Also verified: the freeze is opt-in only. Production navigation still animates (17,727 px
drift over 600 ms with `__portfolioTest` absent); test mode shows 0 px drift.

**If Phase A runs against `origin/main` (`f40e365`) instead of this branch, the intro
WebGL loop is still free-running and A1 will likely report mechanical instability that is
not the mechanism's fault.** Run Phase A on this branch, or merge these two fixes first.

### 4.2 Governance layer — direction-independent

The audit weakened the *discovery* claim but not these. If the Skill ends up narrower,
this is the part with evidence behind it.

- `docs/ui-ux/UI_UX_VERDICT_SCHEMA.md` — separates `review_proposal` from `acceptance`; an
  agent can never set `verified_on_actual_website`. Phase A's proposals are proposals.
- `docs/ui-ux/UI_UX_HUMAN_ONLY_REGISTER.md` — 6 human-only classes, 6 website-only classes,
  each with *why automation fails* rather than an assertion. Phase A's `human-only`
  classification should be consistent with it.
- Method v1 + Human Verification Amendment (on `main`) — unchanged, still normative.

### 4.3 Reusable probe techniques

Corrected probes are at `phase1-verification-evidence/0a28d38/tools/`. The older copies in
`scripts/review/` predate three probe-level bug fixes documented in that directory's
README — including the scene-identity-from-opacity bug that appeared in **two
independently written tools**. Prefer the corrected copies.

Techniques worth carrying:

- pixel diff via the browser's own canvas — no image library dependency;
- fresh-context repeatability — tear the context down, do not re-navigate;
- path-independence as a separate probe — same-way-twice cannot detect visit-history dependence;
- facts and judgements in separate passes.

---

## 5. Superseded — do not reuse as current

| Artifact | Why dead | Keep? |
| --- | --- | --- |
| `b22da62` 78-candidate capture + audit | source revision superseded twice | yes, audit history |
| `pre-skill-bundle/**` (other branch) | framed around the governance-gap direction that #48 replaced | yes, historical |
| 130-image detector calibration (`scripts/review/*.json`) | calibrated against the old seven-scene-mobile matrix; **precision figures do not transfer** and must not be quoted | yes, do not cite |
| `ui-ux-baselines/1c1990ef0/` | 73 approved images at a two-generations-old SHA | yes, auditable |
| My original #48 comment | four statements superseded; see `EXECUTION_REVIEW_48.md` §6 | yes, historical |

Nothing above was deleted. All of it remains in git history and on-branch.

---

## 6. Live but parked — Phase 1 baseline

Independent of #48 and **not** blocking it.

- Candidate `0a28d38`: 78 candidates captured, fully audited, 22/22 deterministic.
- Mechanical results: 0 checkpoint errors, 0 overflow, 0 broken images, 0 clipped lines,
  locale mapping correct, 16/16 commerce scenario pairings correct, `nocode.execution`
  resolving to the middle step, 24 image requests on desktop vs 1 on mobile.
- **All 78 remain `pending_authority`.** Nothing is frozen.
- Blocked on: website human verification (W-1…W-6 in the human-only register) for this
  same SHA, which an agent structurally cannot supply.
- Also unreviewed: `0a28d38` changes accepted reduced-motion composition. That needs human
  eyes before it is treated as correct.
- 14 candidates show DCA copy/evidence overlap 0.187–0.293. Probably intentional design,
  but it is an H-3 hierarchy judgement and no verdict was proposed.

---

## 7. Phase A execution order

```text
A0  record provenance: SHA, browser/version, viewport/motion/locale,
    source+adapter inputs, reviewer type and prior access
    npm run uiux:test:discovery-contract        # expect 8/8

A1  npm run uiux:discover-golden-path           # run 1 -> run-1/
    npm run uiux:discover-golden-path           # run 2 -> run-2/
    diff mechanical evidence; classify
    stable | explainably-equivalent | mechanically-unstable

A2  freeze ONE packet; two isolated blind reviews of identical frozen evidence
    hand each reviewer ONLY the allowlist
    classify identical | equivalent-with-explained-variation | materially-unstable

A3  freeze independent-proposal.json
    THEN reveal the reference inventory and diagnose by visual responsibility
```

Gate discipline worth pre-committing: **A3 alone cannot produce GO**, only
"proceed to B/C". The core result is measured on the substrate most favourable to the
hypothesis; C1/C2 bound it.

---

## 8. Open issues I would raise before running

1. **R1 should become an allowlist** — the denylist has already been shown to miss 11
   files. Proposed wording in `PHASE_A_CONTAMINATION_CONTROL.md`.
2. **A2 measures variance, not bias.** Two reviews at the same model, prompt and inputs
   detect sampling noise. Two reviewers can be *consistently wrong in the same direction*
   and score `identical`. Consider one cross-model or cross-framing review as a separate
   bias probe.
3. **A3 is not a GO gate** — state it as a rule, not only as a decision-table implication.
4. **Phase A has no negative control.** Defensible for cost, but it means the headline
   result comes from the friendliest substrate.

---

## 9. Environment

| | |
| --- | --- |
| Node | v26.4.0 |
| Playwright | 1.55.0 (repo pin) |
| Browser used for all prior evidence | Chromium 145.0.7632.6, ms-playwright `chromium-1208`, headless |
| Deviation | the pinned `chromium-1187` build **fails to extract on this host** — download completes, extraction stalls at 624 KB, reproduced twice. Supplied `chromium-1208` via `BASELINE_BROWSER_EXECUTABLE`. Any pixel comparison must pin the same executable or re-baseline. |
| OS | macOS 15.7.4 arm64 |
| DSF | 1 |

Also inherited: `waitForAssets` defaults to an 8 s budget, which a cold cache plus a
concurrent browser run can exceed. It surfaced twice as a transient "assets not ready"
abort. Refusing to capture is correct behaviour; give probes a longer budget and avoid
running two browser jobs at once.

---

## 10. Branch state

```text
origin/main                                   f40e365   untouched
phase1/verification-f40e365                   this branch, 7 fix/doc commits + #48 material
uiux/pre-skill-bundle-ui-ux-baseline-verification   historical, quarantined
```

Nothing merged to `main`. Nothing frozen. No authoritative baseline overwritten.
