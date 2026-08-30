# UI/UX Baseline Checkpoint Manifest

Issue: #12  
Parent baseline ticket: #6  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Mobile presentation decision: #20

## 1. Purpose

This manifest defines **which rendered UI states are worth freezing** before visual-regression automation is added.

A successful capture is never an approval. A checkpoint becomes authoritative only after the rendered state has been reviewed against the acceptance contract and explicitly accepted.

The checkpoint ID is the stable contract. Scroll percentages, RAF timing constants, DOM structure, selector names, and source-level line breaks are implementation details.

## 2. Active presentation model

The portfolio now has two intentional presentation modes:

```text
viewport > 760px
  -> desktop interactive portfolio
  -> project scenes / scroll choreography

viewport <= 760px
  -> dedicated mobile fallback
  -> one full-screen composition
  -> no desktop project scenes
```

This is an intentional product decision, not a temporary capture shortcut.

### Historical #6 evidence

The first full review at source SHA `1c1990ef05dc764b8e2a1797f7fc41fbded4289f` used the previous matrix and produced 130 candidates: 73 approved, 48 rejected, and 9 blocked.

Those records remain valuable audit evidence for that SHA. They do **not** define the active future mobile baseline after #20. The final coherent golden baseline must be captured from one later accepted repository SHA using the active matrix below.

## 3. Status model

Every baseline record has one explicit status:

- `candidate` — rendered from the target SHA but not yet accepted.
- `approved` — explicitly reviewed and accepted as golden evidence.
- `rejected` — deterministic/renderable, but does not satisfy the acceptance contract.
- `blocked` — cannot be accepted or rejected reliably because state, assets, or determinism are unresolved.
- `superseded` — previously approved but intentionally replaced by a later accepted UX change.

Never silently overwrite an approved image. Preserve traceability and record the replacement relationship.

## 4. Capture environments

### Primary viewports

| ID | Size | Purpose |
| --- | --- | --- |
| `desktop` | 1440×900 | Primary desktop composition and motion-state baseline |
| `laptop` | 1280×800 | Tighter desktop collision/wrapping risk |
| `mobile` | 390×844 | Dedicated mobile fallback composition |

The exact CSS viewport size is capture metadata.

### Locales

- `en`
- `zh-TW`

Whenever a checkpoint is selected, both locales are captured. EN and zh-TW are equal acceptance surfaces.

### Motion modes

- `normal`
- `reduce`

Reduced motion is a separate accepted presentation, not an animation failure mode.

## 5. Active matrix

The executable source of truth is `scripts/ui-ux-baseline-plan.json`.

Current matrix size:

```text
normal desktop: 22 checkpoints
normal laptop:   8 checkpoints
normal mobile:   1 checkpoint
reduce desktop:  7 checkpoints
reduce mobile:   1 checkpoint
--------------------------------
39 checkpoint/viewport/motion cells
x 2 locales
= 78 candidate screenshots
```

## 6. Desktop checkpoint inventory

Scene contracts below apply to the desktop interactive presentation. Mobile does not reproduce these scenes.

### Scene 0 — Intro

#### `intro.settled`

Initial settled portfolio introduction.

Must show the accepted role/title/body hierarchy and subdued ambient network treatment. In reduced motion, the message remains complete without WebGL animation.

**Coverage:** desktop normal, laptop normal, desktop reduced.

---

### Scene 1 — CommerceOps

#### `commerce.checkout-event`

CHECK OUT is the active transition event while checkout evidence remains the phone state.

**Coverage:** desktop, laptop.

#### `commerce.quiet-after-checkout`

CHECK OUT has cleared and EXPIRED PROMO has not begun. The intentionally designed quiet interval must be visible.

**Coverage:** desktop.

#### `commerce.expired-promo`

EXPIRED PROMO is the active scenario event and corresponding phone evidence is transitioning/settled into the expired-coupon state.

**Coverage:** desktop, laptop.

#### `commerce.unavailable`

UNAVAILABLE is the active scenario event with unavailable-variant evidence dominant.

**Coverage:** desktop.

#### `commerce.final-settled`

Transition word has cleared; final unavailable phone state remains readable before scene exit.

**Coverage:** desktop.

#### `commerce.reduced`

Representative static reduced-motion failure state with transition-word choreography removed.

**Coverage:** desktop reduced.

---

### Scene 2 — noCodeE2E

#### `nocode.yaml-readable`

YAML/code evidence is readable before execution emphasis becomes the main event.

**Coverage:** desktop.

#### `nocode.execution`

A middle execution step is the emphasized step while the whole YAML remains understandable as context.

**Coverage:** desktop.

#### `nocode.result-hold`

Playwright result is fully visible with deliberate reading time remaining.

**Coverage:** desktop, laptop.

#### `nocode.reduced`

Static readable YAML plus visible result without sequential choreography.

**Coverage:** desktop reduced.

---

### Scene 3 — SocialPlatform

#### `social.product`

Initial product state before structural verification layers dominate.

**Coverage:** desktop.

#### `social.database`

DATABASE is the active structural layer and DB evidence is readable as an intermediate state.

Must not introduce fabricated success ceremony, green signoff language, `PASSED`, `Delivered`, or an invented CI dashboard.

**Coverage:** desktop.

#### `social.web`

WEB UI is the active structural layer while one release path remains the through-line.

**Coverage:** desktop.

#### `social.final-phone`

Final product evidence is fully established and held for reading.

**Coverage:** desktop, laptop.

#### `social.reduced`

Meaningful reduced-motion representative state with sequential choreography removed.

**Coverage:** desktop reduced.

---

### Scene 4 — CueSheet

#### `cuesheet.workspace`

Initial production workspace/context is the primary evidence.

**Coverage:** desktop.

#### `cuesheet.conflict`

Conflict state is established and readable.

**Coverage:** desktop.

#### `cuesheet.review`

Final/review evidence is established and held as the calm conclusion of the scene.

**Coverage:** desktop, laptop.

#### `cuesheet.reduced`

Final/review evidence is presented directly without sequential choreography.

**Coverage:** desktop reduced.

---

### Scene 5 — Decision Contract Audit

#### `dca.early-contribution`

Early contribution state with localized scene copy still visible. This remains the representative locale-composition checkpoint for DCA.

**Coverage:** desktop.

#### `dca.phrased-hold`

Contribution traversal is in a deliberate reading hold rather than an equal-step metronome.

**Coverage:** desktop.

#### `dca.late-contribution`

A later contribution state is emphasized before scanner handoff.

**Coverage:** desktop.

#### `dca.scanner-handoff`

History-reading phase is receding and scanner becomes the focal transition.

**Coverage:** desktop.

#### `dca.pass`

PASS is established as a restrained conclusion. It is not the representative locale-composition checkpoint because scene copy has already receded.

**Coverage:** desktop, laptop.

#### `dca.reduced`

Contribution history and PASS remain understandable without scanner animation.

**Coverage:** desktop reduced.

---

### Scene 6 — Outro

#### `outro.settled`

Quiet final CTA state with GitHub invitation dominant over ambient heatmap treatment.

The state must be deterministic across valid entry paths before approval.

**Coverage:** desktop, laptop.

#### `outro.reduced`

Static subdued outro without continuous motion.

**Coverage:** desktop reduced.

## 7. Mobile fallback checkpoints

Mobile is no longer a compressed version of the seven desktop scenes.

### `mobile.fallback`

**Presentation:** normal-motion mobile fallback at 390×844.

**Must show:**

- CTWalk / QA / SDET identity;
- EN or zh-TW language control;
- oversized editorial desktop-first message;
- the accepted desktop guidance copy;
- intentionally dark poster-like composition;
- code-rendered ambient edge light;
- GitHub navigation;
- no desktop scene content.

**Must not show:**

- CommerceOps, noCodeE2E, SocialPlatform, CueSheet, DCA, or Outro scene evidence;
- scroll narrative or scene numbers from the desktop experience;
- generated-image material used as the fallback page;
- random/uncontrolled particle state.

In `?uiux-test=1`, the Canvas field resolves to a fixed deterministic time so the screenshot is reproducible.

**Coverage:** mobile normal, both locales.

### `mobile.fallback.reduced`

**Presentation:** reduced-motion mobile fallback.

The same composition and message remain complete, but the ambient Canvas field is frozen at the defined reduced-motion state.

**Coverage:** mobile reduced, both locales.

## 8. Filename convention

Recommended path:

```text
ui-ux-baselines/
  <source-sha-short>/
    <viewport>/
      <locale>/
        <motion>/
          <checkpoint-id>.png
```

Examples:

```text
ui-ux-baselines/<sha>/desktop/en/normal/commerce.final-settled.png
ui-ux-baselines/<sha>/mobile/zh-TW/normal/mobile.fallback.png
ui-ux-baselines/<sha>/mobile/en/reduce/mobile.fallback.reduced.png
```

## 9. Required capture metadata

Every record must contain at least:

```text
checkpoint_id
source_sha
status
captured_at
browser_name
browser_version
os_or_container
viewport_width
viewport_height
device_scale_factor
locale
html_lang
motion_preference
asset_load_status
console_errors
checkpoint_resolution
settle
reviewer
review_notes
supersedes (optional)
```

If an expected visible asset fails to load, the state cannot be approved unless the missing asset is intentionally under test.

For mobile fallback captures, hidden desktop evidence is outside the active presentation and must not participate in visible-asset readiness.

## 10. Approval questions

Every candidate intended for a golden baseline must be explicitly reviewed.

### Mechanical

- correct source SHA and environment;
- correct viewport, locale, and motion mode;
- correct semantic checkpoint;
- no unexpected overflow, clipping, missing assets, or wrong presentation mode;
- deterministic repeatability.

### Perceptual

- intended message is immediately understandable;
- hierarchy matches the acceptance contract;
- evidence/motion is subordinate or dominant in the intended way;
- no accidental visual noise or rushed/awkward state is being frozen.

A detector may triage candidates, but it cannot approve them.

## 11. Final freeze rule

The final golden set must be coherent:

```text
one final accepted repository SHA
+ one controlled browser/runtime environment
+ active 78-image matrix
+ explicit review of every candidate
```

Do not assemble the final golden origin from a mixture of old source SHAs simply because individual historical images were previously approved.
