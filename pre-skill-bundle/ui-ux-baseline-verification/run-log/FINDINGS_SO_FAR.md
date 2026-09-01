# Findings so far — `b22da62`

**Partial.** 22 of 78 candidates reviewed by eye; all 78 covered mechanically.
This is not a verdict set and must not be read as one.

## Remediations verified effective in rendered Chromium

All four targeted fixes were confirmed present in source *and* effective in the
render. Source-level presence alone was not accepted as proof.

### 1. Commerce reduced-motion phone — FIXED

Previously a blank white phone at every viewport and both locales, caused by a
CSS specificity collision where both declarations carried `!important`:

```css
.commerce-phone-screen img{opacity:0!important}   /* specificity 0,1,1 — won */
.commerce-phone-expired{opacity:1!important}      /* specificity 0,1,0 — lost */
```

Now `.commerce-phone-screen img.commerce-phone-expired`, which wins. Rendered
confirmation: the expired-coupon evidence is fully visible, showing the
`WELCOME20 is expired; no discount was applied` result. Mechanically, the
loudest phone image in both reduced-motion cells is `commerce-phone-expired` at
opacity 1.0.

*Skill note:* the class of bug is "two `!important` rules where the author
assumed source order decides". Worth a detector.

### 2. Commerce scenario pairing — FIXED

Checkpoints previously resolved on transition-word opacity alone, so the phone
consistently trailed one scenario behind the word. Scoring is now a conjunction
of word **and** matching phone evidence.

Rendered confirmation, **16/16 commerce cells correctly paired**:

| Checkpoint | Loudest word | Loudest phone |
| --- | --- | --- |
| `commerce.checkout-event` | checkout 0.58 | checkout 1.0 |
| `commerce.expired-promo` | expired 0.58 | **expired 0.998** |
| `commerce.unavailable` | unavailable 0.58 | **unavailable 1.0** |
| `commerce.final-settled` | (cleared, 0) | unavailable 1.0 |
| `commerce.quiet-after-checkout` | (cleared, 0) | checkout 1.0 |
| `commerce.reduced` | (layer hidden) | expired 1.0 |

### 3. noCode execution step — FIXED

Now keyed on `.nocode-step[data-nocode-step="1"]` rather than the maximum
highlight alpha across the range. Rendered confirmation: emphasis index 1 of 3
(the `fill:` step) in both locales, alphas `[0, 0.15, 0]`. `yaml-readable`
resolves to index 0 with all alphas 0, `result-hold` to index 2 — the three
checkpoints are cleanly separated.

### 4. Outro path-independence — FIXED

Heat is now computed from deterministic row/column geometry under
`data-uiux-test`, rather than accumulating with visit history.

Rendered confirmation — all three navigation paths **byte-identical**:

| Comparison | Result |
| --- | --- |
| Path A vs Path B | BYTE-IDENTICAL |
| Path A vs Path C | BYTE-IDENTICAL |
| Path B vs Path C | BYTE-IDENTICAL |

For contrast, the same probe on the previous revision measured 31,004 differing
pixels (2.39%, max channel delta 93) between paths. This is the clearest
demonstration in the project of why a **BLOCKED** verdict is worth having: the
composition was never wrong, the determinism was, and naming it correctly led to
a source fix instead of a design change.

### 5. CueSheet copy/evidence separation — FIXED

Previously the title, body and label rendered on top of the bright product
screenshot, making the label effectively invisible. Rendered confirmation at both
1440x900 and 1280x800, both locales: evidence occupies the left, copy the right,
with a clear gutter. Mechanical: **zero** copy/evidence overlap above 5% on any
CueSheet cell, at either viewport, in either locale. The focus/scale animation
state does not close the gutter.

## Mobile fallback — all 4 candidates pass every mechanical assertion

| Assertion | en | zh-TW |
| --- | --- | --- |
| Only fallback presentation active | `mobile-fallback` | `mobile-fallback` |
| `html.lang` | `en` | `zh-Hant-TW` |
| Desktop `#experience` hidden | yes | yes |
| Visible desktop scenes | none | none |
| Page scrollable to desktop content | no (844 = viewport) | no |
| Desktop RAF loop alive | no | no |
| `#webgl` id removed | yes | yes |
| Oversized headline | 80.3px | 66.3px |
| Real CTWalk avatar loaded | yes, 460x460 → 112px, centred | yes |
| CTA below avatar | `Open GitHub ↗` | `查看 GitHub ↗` |
| CTA href | `github.com/CTWalk` | same |
| Guidance copy present | yes | yes |
| Deterministic frozen wave | `running:false, timeMs:0, testMode:true` | same |
| Generated-image substitute | none | none |
| Horizontal overflow | none | none |

Intentional absences (QA/SDET eyebrow, scene number, mode label, footer
metadata) correctly absent and **not** flagged, per the precedence document.

Normal-motion wave quality is explicitly out of scope for this run and belongs
to website human review.

## Current defect

### D-1 — reduced-motion intro title clipped at the right viewport edge

`intro.settled` at desktop 1440x900, **both locales**.

Measured: title line right edge at x=1445.5 and x=1497.9 against a 1440px
viewport (EN); x=1444.5 and x=1448.1 (zh-TW). The zh-TW case additionally
collides the scene label with the site header.

Classification: **product/UI defect**, reduced-motion desktop layout only.
Normal-motion `intro.settled` is unaffected and composes correctly.

## Current instability

### I-1 — `intro.settled` is not repeatable

| Viewport | Differing pixels | % | Max channel Δ | Bounding region |
| --- | --- | --- | --- | --- |
| desktop 1440x900 | 32,292 | 2.49% | 28 | x 689–1414, y 197–703 |
| laptop 1280x800 | 28,565 | 2.79% | 24 | x 616–1254, y 175–627 |

Both regions coincide with the intro WebGL host. Checkpoint resolution itself is
stable (`documentProgress` identical across passes), so this is not a navigation
problem.

Root cause: the intro Three.js scene runs its own
`requestAnimationFrame` draw loop, rotating the point cloud as a function of
elapsed time. Nothing under `?uiux-test=1` freezes it — the test control's
determinism work covers the Outro heatmap only. Playwright's
`animations:'disabled'` does not reach a manual RAF loop.

Classification: **test-control gap** (missing determinism hook), *not* a product
defect. The animation is intended.

Smallest recommended correction, for a **future** revision — not this run:
extend the existing determinism block in the test control to freeze the intro
WebGL loop at a fixed time, the same way `mobile-fallback.js` already exposes
`setTime(...)` / `testMode` for the mobile wave field. That prior art is in-repo
and is the pattern to copy.

Consequence for now: `intro.settled` cannot be frozen as a pixel baseline at
desktop or laptop. Its **composition** in normal motion is acceptable; only its
byte-stability is not.

### I-2 — `mobile.fallback` sub-perceptual difference

278 pixels (0.084%), **max channel delta 1**, in the guidance-copy region. A
delta of 1/255 on a twelfth of one percent of the frame is text
anti-aliasing, not a state difference. Classified as an explainable
rendering-only tolerance. `mobile.fallback.reduced` is byte-identical.

## Console / network / asset findings

- **Zero** broken images across all 78 candidates. Zero failed requests.
- One distinct console error, on the 44 desktop-normal records only:
  `Failed to load resource: 404`. Traced by re-running with server-side request
  logging: it is `/favicon.ico`, requested by the browser against the local
  static server. The site declares no favicon. **No site asset is involved.**
- The `mobile-stage-call-sheet.png ERR_ABORTED` seen in the previous run did not
  recur in this audit.

## Historical defects NOT reproduced on this candidate

Recorded explicitly, since the current render is authoritative and absence of
reproduction is itself a finding:

| Historical finding (`1c1990ef`) | Status on `b22da62` |
| --- | --- |
| Commerce reduced-motion blank phone | **not reproduced** — fixed |
| Commerce word/phone scenario desync | **not reproduced** — fixed |
| noCode execution resolving to first step | **not reproduced** — fixed |
| Outro heatmap visit-history dependence | **not reproduced** — fixed |
| CueSheet copy unreadable over evidence | **not reproduced** — fixed |
| Intro reduced-motion clipping | **reproduced** — see D-1 |
| DCA reduced-motion copy/row overlap | pending full review (audit shows ~26% overlap ratio; perceptual call outstanding) |
| zh-TW DCA title wrapping | pending full review (three-line wrap with a 2-char final line still present in audit geometry) |
| Outro reduced typography/margin | pending full review |
| Mobile-specific defects (7-scene era) | **structurally obsolete** — mobile is now a 2-checkpoint fallback; the old findings no longer address an existing surface |
