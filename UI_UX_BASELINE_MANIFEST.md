# UI/UX Baseline Checkpoint Manifest

Issue: #12  
Parent baseline ticket: #6  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Reference implementation: `a520491c119279753956bfaa81ee4722801dc305`

## 1. Purpose

This manifest defines **which rendered UI states are worth freezing** before visual-regression automation is added.

It does not declare any screenshot approved. A checkpoint becomes authoritative only after the rendered image has been reviewed against #5 and its status is changed from `candidate` to `approved` in the baseline record.

The checkpoint ID is the stable contract. Current scroll percentages, RAF timing constants, CSS selectors, DOM structure, and source-level line breaks are implementation details and are not part of the baseline identity.

## 2. Status model

Every captured baseline has one status:

- `candidate` — captured from the target SHA but not yet manually accepted.
- `approved` — manually reviewed against #5 and accepted as the golden state.
- `superseded` — previously approved but intentionally replaced by a later accepted UX change.

Never silently overwrite an `approved` image. Preserve its traceability and mark it `superseded` when a replacement is accepted.

## 3. Capture environments

### Primary viewports

| ID | Size | Purpose |
| --- | --- | --- |
| `desktop` | 1440×900 | Primary wide-screen composition and motion-state baseline |
| `laptop` | 1280×800 | Guard against title/evidence collisions and tighter desktop wrapping |
| `mobile` | 390×844 | Primary narrow responsive composition |

The exact CSS viewport size is part of capture metadata.

### Locales

- `en`
- `zh-TW`

**Normative locale-pairing rule:** whenever a checkpoint is selected for a viewport, capture that same checkpoint in both EN and zh-TW unless there is literally no localized visible content in the captured composition. The current portfolio scenes contain visible localized copy, so the checkpoints in this manifest are paired by locale.

The baseline freezes the **accepted rendered composition**, not the presence or absence of source-level `\n` characters. Neither locale receives weaker visual coverage by default.

### Motion modes

- `normal`
- `reduce`

Reduced motion is a separate accepted presentation, not a broken version of the normal-motion scene.

## 4. Coverage strategy

The matrix is deliberately selective by **viewport and checkpoint**, not by locale.

### Tier A — representative scene composition

Every scene gets one representative checkpoint at:

- desktop, both locales;
- mobile, both locales.

### Tier B — intermediate motion states

Distinct kinetic states are captured at desktop in both locales. Add mobile in both locales when the responsive implementation materially changes geometry, scale, evidence placement, or collision risk.

### Tier C — laptop risk checks

Use 1280×800 in both locales only for states with a realistic tighter-desktop risk:

- long/wide title composition;
- large transitional graphics near copy;
- dense evidence boards;
- final evidence that nearly fills the stage.

### Tier D — reduced motion

Every animated scene gets at least one reduced-motion representative checkpoint at mobile in both locales. Add desktop in both locales when reduced-motion composition differs materially or contains dense evidence.

This keeps EN/zh-TW symmetric while avoiding a blind Cartesian product across viewports and every frame.

## 5. Filename convention

Recommended path once images are captured:

```text
ui-ux-baselines/
  <source-sha-short>/
    <viewport>/
      <locale>/
        <motion>/
          <checkpoint-id>.png
```

Example:

```text
ui-ux-baselines/a520491/desktop/en/normal/commerce.quiet-after-checkout.png
ui-ux-baselines/a520491/desktop/zh-TW/normal/commerce.quiet-after-checkout.png
```

The later Playwright implementation may relocate files into its native snapshot directory, but it must preserve these semantic checkpoint IDs in test names/metadata.

## 6. Required capture metadata

Every image record must contain:

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
motion_preference
asset_load_status
reviewer
review_notes
supersedes (optional)
```

If any expected external image failed to load, the capture cannot be approved unless the missing asset is itself the state under test.

## 7. Checkpoint inventory

Coverage below names **viewports only**. Both locales are required for every listed viewport by the locale-pairing rule above.

### Scene 0 — Intro

#### `intro.settled`

**State:** initial settled portfolio introduction.

**Must show:** role label, accepted title/body, secondary scroll cue in normal motion, subdued ambient network treatment.

**Must not become:** a product-demo animation or background-first composition.

**Coverage:** desktop, mobile, laptop; reduced-motion mobile and desktop.

**Contract anchors:** G-01, G-03, G-04, G-07, G-08; Scene 0 hierarchy/motion requirements.

---

### Scene 1 — CommerceOps

Current implementation reference only: CHECK OUT sweep occupies approximately scene phase `.03–.22`, EXPIRED PROMO `.29–.50`, UNAVAILABLE `.61–.84`; phone transitions toward expired around `.37–.45` and unavailable around `.68–.76`. These numbers help identify the current frame but are **not** the checkpoint contract.

#### `commerce.checkout-event`

**State:** CHECK OUT is the active oversized transition event while checkout evidence remains the phone state.

**Must show:** CHECK OUT as a transient visual event, accepted title/body readable, phone dominant evidence.

**Coverage:** desktop, mobile, laptop.

#### `commerce.quiet-after-checkout`

**State:** CHECK OUT has cleared and EXPIRED PROMO has not begun.

**Must show:** a perceptible visual rest; phone remains readable; no replacement headline occupies the quiet interval.

**Coverage:** desktop, mobile.

**Reason to freeze:** this intentionally designed silence is easy to erase accidentally during timing refactors.

#### `commerce.expired-promo`

**State:** EXPIRED PROMO is the active scenario event and the phone is transitioning/settled into expired-coupon evidence.

**Coverage:** desktop, mobile, laptop.

#### `commerce.unavailable`

**State:** UNAVAILABLE is the active scenario event and unavailable-variant evidence is dominant.

**Coverage:** desktop, mobile.

#### `commerce.final-settled`

**State:** transition word has cleared; final unavailable phone state remains readable before scene exit.

**Coverage:** desktop, mobile.

#### `commerce.reduced`

**State:** representative reduced-motion failure state with transition-word layer removed. Current implementation uses the expired-coupon phone.

**Coverage:** mobile, desktop.

**Contract anchors:** G-04, G-06, G-07, G-08; Scene 1 hierarchy and event-order requirements.

---

### Scene 2 — noCodeE2E

Current implementation reference only: step emphasis ranges approximately `.12–.38`, `.34–.62`, `.58–1.02`; Playwright result reveal begins around `.72` and finishes around `.82`.

#### `nocode.yaml-readable`

**State:** YAML/code plate exists quietly before execution emphasis becomes the main event.

**Coverage:** desktop, mobile.

#### `nocode.execution`

**State:** a middle execution step is clearly emphasized while the whole test remains readable as context.

**Coverage:** desktop, mobile.

#### `nocode.result-hold`

**State:** Playwright `passed` result is fully visible and there is still deliberate scene time remaining.

**Must show:** compact accepted title, readable code evidence, result as proof rather than headline.

**Coverage:** desktop, mobile, laptop.

#### `nocode.reduced`

**State:** static readable YAML plus visible result without sequential choreography.

**Coverage:** mobile, desktop.

**Contract anchors:** G-03, G-04, G-08; Scene 2 readable-evidence and final-hold requirements.

---

### Scene 3 — SocialPlatform

#### `social.product`

**State:** initial product state before database/web transformation dominates.

**Coverage:** desktop, mobile.

#### `social.database`

**State:** DATABASE is the active structural layer; DB representation is readable as an intermediate state, not a dashboard product.

**Must not show:** green success badge/check, PASSED, Delivered, signoff halo, or fabricated CI dashboard.

**Coverage:** desktop, mobile.

#### `social.web`

**State:** WEB UI is the active structural layer while the neutral release path remains the through-line.

**Coverage:** desktop, mobile.

#### `social.final-phone`

**State:** final mobile product evidence is fully established and held for reading.

**Must show:** moderation-rules phone as closing evidence; DB/Web structure receded; no success ceremony.

**Coverage:** desktop, mobile, laptop.

#### `social.reduced`

**State:** final phone is directly visible with subdued structural context and no replayed transformation sequence.

**Coverage:** mobile, desktop.

**Contract anchors:** G-05, G-08, G-09; Scene 3 single-release-path, restrained-intermediate-state, and final-hold requirements.

---

### Scene 4 — CueSheet

#### `cuesheet.workspace`

**State:** scheduling workspace/context is dominant before conflict/review focus.

**Coverage:** desktop, mobile.

#### `cuesheet.conflict`

**State:** conflict evidence is dominant and understandable as the reason a schedule change is required.

**Coverage:** desktop, mobile.

#### `cuesheet.review`

**State:** review/final evidence is dominant after the calm evidence-focus progression.

**Must show:** canonical Conflicts manager-phone evidence when that supporting phone is visible; desktop schedule evidence remains primary; mobile may intentionally hide supporting phones.

**Coverage:** desktop, mobile, laptop.

#### `cuesheet.reduced`

**State:** review/final evidence is shown directly; sequential camera/focus choreography is unnecessary.

**Coverage:** mobile, desktop.

**Contract anchors:** G-04, G-06, G-07, G-08; Scene 4 evidence readability and decompression requirements.

---

### Scene 5 — Decision Contract Audit

The factual contribution/issue titles are evidence and are not style-copy to be rewritten.

#### `dca.early-contribution`

**State:** early contribution row is the primary readable row; inactive history remains contextual.

**Coverage:** desktop, mobile.

#### `dca.phrased-hold`

**State:** representative punctuation/hold point in the deliberately non-uniform traversal.

Current cadence contains two small punctuation regions; one static visual checkpoint is sufficient for visual geometry. #9 must protect both temporal holds.

**Coverage:** desktop.

#### `dca.late-contribution`

**State:** late contribution is primary before history recedes for scanner mode.

**Coverage:** desktop, mobile.

#### `dca.scanner-handoff`

**State:** history has substantially receded and scanner mode is visibly taking focus; PASS is not yet the settled conclusion.

**Coverage:** desktop, mobile.

#### `dca.pass`

**State:** restrained PASS conclusion after scanning; contribution history remains background context rather than disappearing as fabricated proof.

**Coverage:** desktop, mobile, laptop.

#### `dca.reduced`

**State:** contribution history and PASS are statically available; scanner motion removed.

**Coverage:** mobile, desktop.

**Contract anchors:** G-09; Scene 5 factual-row preservation, phrased cadence, scanner handoff, restrained PASS.

---

### Scene 6 — Outro

#### `outro.settled`

**State:** quiet final GitHub invitation with heatmap as ambient context.

**Must show:** CTA clearly stronger than the heatmap.

**Coverage:** desktop, mobile, laptop.

#### `outro.reduced`

**State:** static subdued heatmap; no continuous/discovery motion required.

**Coverage:** mobile, desktop.

The pointer/ripple interaction is intentionally **not** a golden static checkpoint yet. #9 may define its behavioral/perceptual verification once it can be triggered reproducibly.

**Contract anchors:** G-06, G-08; Scene 6 quiet-ending and CTA-priority requirements.

## 8. Minimum representative matrix

These are the minimum locale-responsive composition images that must exist before #6 can close:

| Scene | Representative checkpoint | desktop EN | desktop zh-TW | mobile EN | mobile zh-TW |
| --- | --- | ---: | ---: | ---: | ---: |
| Intro | `intro.settled` | ✓ | ✓ | ✓ | ✓ |
| CommerceOps | `commerce.final-settled` | ✓ | ✓ | ✓ | ✓ |
| noCodeE2E | `nocode.result-hold` | ✓ | ✓ | ✓ | ✓ |
| SocialPlatform | `social.final-phone` | ✓ | ✓ | ✓ | ✓ |
| CueSheet | `cuesheet.review` | ✓ | ✓ | ✓ | ✓ |
| DCA | `dca.pass` | ✓ | ✓ | ✓ | ✓ |
| Outro | `outro.settled` | ✓ | ✓ | ✓ | ✓ |

This is 28 representative composition images. Every additional checkpoint selected above is also locale-paired for each listed viewport.

## 9. Approval questions for every candidate

### Mechanical

- Is the source SHA correct?
- Is the locale correct after all runtimes have initialized?
- Is `html.lang` consistent with the selected locale?
- Is the viewport exactly the recorded size?
- Is the expected evidence asset loaded?
- Is this the intended semantic checkpoint?
- Is there horizontal overflow, clipping, accidental extra-line wrapping, or missing content?
- Does reduced motion expose meaningful evidence rather than hidden animation state?

### Perceptual

- Can the intended message be understood before deliberate inspection?
- Is the visual hierarchy consistent with #5?
- Is any supporting element unexpectedly louder than the primary message/evidence?
- For kinetic states, does the still image correspond to a state that is actually readable during normal motion?
- For both EN and zh-TW, are line breaks/automatic wraps natural in the rendered viewport?

A candidate may be mechanically stable and still be rejected perceptually.

## 10. Relationship to later tickets

### #6

Captures candidates using this manifest, records environment metadata, performs manual acceptance, and freezes approved images.

### #7

Implements deterministic ways to reach these exact checkpoint IDs. It may change how a checkpoint is reached, but not what the checkpoint means.

### #8

Uses the approved #6 images as golden snapshots and names tests with these checkpoint IDs.

### #9

Protects temporal relationships that a still manifest cannot prove, including both DCA punctuation holds, quiet intervals, plateaus, and final reading holds.

### #10

Moves the resulting visual/motion checks into a stable CI review workflow and decides whether Percy adds enough review value.

## 11. Freeze rule

The authoritative baseline is not “whatever screenshot was generated by the script.”

A baseline is authoritative only when all of the following are recorded together:

```text
accepted checkpoint meaning (#5 + this manifest)
+ exact source SHA
+ exact capture environment
+ rendered candidate image
+ explicit manual approval
```

Until then, the image remains a candidate.