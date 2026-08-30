# UI/UX Baseline Review — #6

Source SHA verified: `1c1990ef05dc764b8e2a1797f7fc41fbded4289f` (fresh fetch of `main`, clean worktree at capture time)
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`
Deterministic control: #7 / `UI_UX_TEST_CONTROL.md`

**Freeze status: NOT COMPLETE.** 73 of 130 candidates are approved and persisted. Four of the seven Tier-A representative scenes do not have a complete EN/zh-TW × desktop/mobile pair, so the #12 §8 minimum matrix is not satisfied.

No GitHub Actions was used. No Percy was used. No production UI/UX code was modified. No image was approved because capture succeeded.

## 1. Environment

| | |
| --- | --- |
| Capture runtime | `node-playwright` (`npm run uiux:capture`, repo script unmodified) |
| Playwright | 1.55.0 (pinned in `package.json`) |
| Browser | Chromium 151.0.7922.34, headless |
| Browser build | ms-playwright `chromium-1234` ("Google Chrome for Testing"), supplied via the documented `BASELINE_BROWSER_EXECUTABLE` override |
| OS | macOS 15.7.4 (arm64) |
| Node | v26.4.0 |
| Device scale factor | 1 |
| Server | repo static server on `127.0.0.1:4173` |

**Environment deviation to carry into #8:** the Playwright 1.55.0 pin expects the `chromium-1187` build. That download would not complete in this environment, so an already-present newer build was used through the supported override. Anti-aliasing and font rasterisation may differ from the pinned build. #8 must either pin this same executable or re-baseline against `chromium-1187`.

## 2. Counts

| | |
| --- | --- |
| Expected captures (plan matrix) | 130 |
| Generated | 130 |
| APPROVED | 73 |
| REJECTED | 48 |
| BLOCKED | 9 |

Every candidate was inspected individually against #5 and #12 — mechanically and perceptually — not sampled.

### By scene

| Scene | APPROVED | REJECTED | BLOCKED | Total |
| --- | ---: | ---: | ---: | ---: |
| Intro | 8 | 2 | 0 | 10 |
| CommerceOps | 14 | 14 | 0 | 28 |
| noCodeE2E | 14 | 4 | 0 | 18 |
| SocialPlatform | 18 | 4 | 0 | 22 |
| CueSheet | 5 | 13 | 0 | 18 |
| DCA | 14 | 10 | 0 | 24 |
| Outro | 0 | 1 | 9 | 10 |

### By viewport

| Viewport | APPROVED | REJECTED | BLOCKED | Total |
| --- | ---: | ---: | ---: | ---: |
| desktop 1440×900 | 34 | 21 | 3 | 58 |
| laptop 1280×800 | 10 | 4 | 2 | 16 |
| mobile 390×844 | 29 | 23 | 4 | 56 |

### By locale

| Locale | APPROVED | REJECTED | BLOCKED | Total |
| --- | ---: | ---: | ---: | ---: |
| en | 38 | 22 | 5 | 65 |
| zh-TW | 35 | 26 | 4 | 65 |

Coverage is symmetric by construction; zh-TW carries four additional rejections, all of them real composition defects rather than weaker review.

### By motion mode

| Motion | APPROVED | REJECTED | BLOCKED | Total |
| --- | ---: | ---: | ---: | ---: |
| normal | 64 | 32 | 6 | 102 |
| reduce | 9 | 16 | 3 | 28 |

Reduced motion is the weakest surface in the product: only 9 of 28 reduced-motion candidates are acceptable.

## 3. Tier-A representative matrix (#12 §8)

| Scene | Representative checkpoint | desktop EN | desktop zh-TW | mobile EN | mobile zh-TW |
| --- | --- | --- | --- | --- | --- |
| Intro | `intro.settled` | APPROVED | APPROVED | APPROVED | APPROVED |
| CommerceOps | `commerce.final-settled` | APPROVED | APPROVED | APPROVED | APPROVED |
| noCodeE2E | `nocode.result-hold` | APPROVED | APPROVED | APPROVED | APPROVED |
| SocialPlatform | `social.final-phone` | APPROVED | APPROVED | **REJECTED** | **REJECTED** |
| CueSheet | `cuesheet.review` | **REJECTED** | **REJECTED** | **REJECTED** | **REJECTED** |
| DCA | `dca.early-contribution` | APPROVED | **REJECTED** | **REJECTED** | **REJECTED** |
| Outro | `outro.settled` | **BLOCKED** | **BLOCKED** | **BLOCKED** | **BLOCKED** |

Three of seven scenes are complete. `dca.early-contribution` was used as the representative locale-composition checkpoint as required; `dca.pass` was reviewed separately as the conclusion state and is approved at every captured viewport in both locales.

## 4. Asset and runtime validation

Every capture was checked for image `complete`, `naturalWidth > 0`, and no failed network state. **No expected evidence asset failed to load in any of the 130 captures.** All ten `raw.githubusercontent.com` assets, five `github.com/user-attachments` assets and two `opengraph.githubassets.com` assets returned HTTP 200.

Two runtime observations, both benign and both explained rather than waived:

- `Failed to load resource: 404` on desktop contexts — this is `/favicon.ico` requested by the browser against the local static server. The site declares no favicon. No site asset is involved.
- `mobile-stage-call-sheet.png net::ERR_ABORTED` — `evidence-readability.js` intentionally swaps the manager phone to the canonical `mobile-stage-conflict-status.png`, aborting the superseded request. This is the behaviour #5 Scene 4 requires; the replacement image loads.

No capture was approved with a missing asset, and no placeholder or substitute asset was generated.

## 5. Repeatability

Protocol: resolve checkpoint → settle → capture → tear the context down entirely → re-resolve → settle → capture; compare bytes, then compare pixels where bytes differ.

| Checkpoint (desktop EN) | Byte-identical | Pixel result |
| --- | --- | --- |
| `commerce.final-settled` | yes | identical |
| `nocode.result-hold` | yes | identical |
| `social.final-phone` | yes | identical |
| `dca.early-contribution` | yes | identical |
| `cuesheet.review` | no | **0 pixels differ** — PNG encoding only |
| `outro.settled` | no | **0 pixels differ** — PNG encoding only |
| `intro.settled` | no | 96 px of 1,296,000 (0.0074%), max channel delta 6 |

Checkpoint resolution itself is stable: `documentProgress` was identical to six decimal places on both passes for all seven.

`intro.settled` differs only by ambient WebGL noise at a magnitude no viewer can perceive (delta ≤ 6/255 on 0.007% of the frame). That is an explainable rendering tolerance, not instability.

### One genuine instability, not hidden behind a tolerance

`outro.settled` is pixel-identical when re-captured the same way, but **its rendered state depends on how many times the scene has been visited in the browsing context**. Capturing the outro after an earlier visit in the same context (which is exactly what the capture matrix does when it iterates EN then zh-TW) produces a different heatmap:

- 31,004 pixels differ (2.39% of the frame)
- max channel delta 93, mean delta 34.6
- differences concentrated in rows 373–406, i.e. the heatmap band

This is visible, not sub-perceptual. It also means the EN and zh-TW outro captures in this run were taken in different heatmap states. Until the outro heatmap has a deterministic state under `?uiux-test=1`, no outro image can be frozen as golden — hence BLOCKED rather than REJECTED. In some lit states the heatmap also becomes visually louder than the CTA, which is a Scene 6 hierarchy risk for #9 to pin down temporally.

## 6. UI/UX defects discovered

These are product defects. Per #6's non-goals they were **not** fixed here.

### D-1 — CueSheet copy is unreadable over its own evidence
`cuesheet.conflict`, `cuesheet.review` (desktop 1440 and laptop 1280, both locales) and `cuesheet.reduced` (desktop, both locales).
The scene title, body and label render on top of the bright product screenshot. The `CueSheet` label becomes effectively invisible and the body copy drops to very low contrast. Violates #5 G-04 and §6 Desktop/laptop INV ("primary copy and primary evidence can coexist without overlap"). This is the single largest blocker: it removes CueSheet's representative checkpoint at every viewport.

### D-2 — Reduced-motion CommerceOps phone renders blank
All viewports, both locales. Root cause is a CSS specificity collision in `commerce-integrated.js:42-43`:

```css
@media(prefers-reduced-motion:reduce){
  .commerce-phone-screen img{opacity:0!important}   /* specificity 0,1,1 */
  .commerce-phone-expired{opacity:1!important}      /* specificity 0,1,0 — loses */
}
```

Both declarations are `!important`, so the higher-specificity rule wins and every phone image stays at opacity 0, leaving the `#f7f5ef` screen background. Violates #5 G-08 INV ("reduced motion must not merely disable animation while leaving essential evidence permanently hidden") and §7 RESP for CommerceOps. A one-line fix would be to raise the second selector to `.commerce-phone-screen img.commerce-phone-expired`.

### D-3 — Reduced-motion intro title clipped at the right viewport edge
Desktop 1440, both locales. In zh-TW the scene label additionally collides with the site header. Violates #5 §6 Desktop INV and G-04.

### D-4 — Mobile SocialPlatform final phone is illegible
`social.final-phone` and `social.reduced` at 390 px, both locales. The phone evidence renders 92 px wide from a 1081 px source (scale 0.085); the moderation-rule rows become texture. The accepted desktop equivalent renders at 239 px. Violates #5 Scene 3's mechanical review requirement that the mobile final phone remain legible.

### D-5 — Mobile CueSheet evidence loses about half its content to `object-fit: cover`
`cuesheet.workspace` and `cuesheet.review` at 390 px both locales, plus zh-TW `cuesheet.reduced`. A 1440-px-wide product screenshot is placed in a 368×448 portrait box, so cover-cropping discards roughly 49% of the source width. Row labels are cut on both sides and the "Schedule review" heading and the "2 calls moved, 4 unchanged" prefix fall outside the frame. Violates #5 Scene 4 INV ("must remain understandable as real product evidence").

### D-6 — Mobile DCA row text escapes its row background
`dca.early-contribution` and `dca.scanner-handoff` at 390 px both locales; worst in `dca.reduced`, where most rows clip. The second line of a row description renders below the painted row pill and is cut. Violates #5 Scene 5 RESP ("active-row text must still be readable at its intended checkpoint").

### D-7 — Desktop reduced-motion DCA copy overlaps the contribution rows
Both locales, worse in zh-TW where the wider title covers three rows. `PASS` also overlaps a row. Violates #5 G-04.

### D-8 — zh-TW desktop DCA title breaks badly
At 1440 the title wraps as `同一套 QA 邏輯 / 也能用來檢查 AI / 工具`, splitting the term `AI 工具` and leaving a two-character orphan line. The same string wraps cleanly in two lines at 390 px, so this is a desktop `max-width: 12.5em` interaction, not a copy problem. Violates #5 G-03. The copy itself is correct and must not be rewritten.

### D-9 — Outro heatmap has no deterministic state
See §5. Scene 6 hierarchy ("CTA clearly stronger than the heatmap") holds in some lit states and not others.

### D-10 — zh-TW desktop reduced-motion outro title runs flush to the right edge
`outro.reduced` at 1440 zh-TW. Not clipped, but with no margin at the viewport boundary.

## 7. Checkpoint-resolution gaps (#7, not product defects)

These are cases where the capture is technically valid but does not represent the state #12 defines. They need a #7 scoring change, not a UI change — and changing the scorer changes what these checkpoint IDs resolve to, so it is being reported rather than done unilaterally.

### R-1 — CommerceOps scenario desync
`commerce.expired-promo` resolves to the frame where the `EXPIRED PROMO` word is at peak opacity, but the phone still shows the **checkout** screen. `commerce.unavailable` resolves to peak `UNAVAILABLE` while the phone still shows the **expired coupon**. #12 requires the word *and* its matching phone evidence together ("the phone is transitioning/settled into expired-coupon evidence"; "unavailable-variant evidence is dominant"). The current scorer maximises word opacity alone, and the phone consistently trails one scenario behind. 10 images rejected on this basis.

`commerce.checkout-event` and `commerce.final-settled` pair correctly and are approved.

### R-2 — noCodeE2E emphasis lands on the first step
`nocode.execution` resolves to step 1 of 4 in every viewport and locale. #12 requires "a middle execution step is clearly emphasized". The scorer takes the maximum step background alpha across the range and the first step's peak wins. 4 images rejected.

Both gaps are deterministic and reproducible — they are definition mismatches, not flakiness.

## 8. What was persisted

```
ui-ux-baselines/1c1990ef0/
  <viewport>/<locale>/<motion>/<checkpoint>.png     73 approved images
  baseline-manifest.json                            130 records
```

`baseline-manifest.json` holds one record per candidate — approved, rejected and blocked alike — so the reason a checkpoint has no golden image stays auditable. Each record carries checkpoint ID, source SHA, status, capture timestamp, worktree cleanliness, browser/Playwright/OS environment, viewport, device scale factor, locale, resulting `html.lang`, motion preference, asset load status, console errors with their explanation, the #7 checkpoint resolution, the settle result, rendered title/body line counts, horizontal-overflow result, mechanical detector flags, reviewer and review notes, and a SHA-256 of the promoted image.

Rejected and blocked candidates are **not** promoted, and their candidate paths are recorded so nothing is silently overwritten or lost.

## 9. Remaining blockers before #6 can close

1. **D-1** — CueSheet copy/evidence collision. Blocks CueSheet's representative checkpoint at all four required cells.
2. **D-4** — mobile SocialPlatform phone legibility. Blocks `social.final-phone` mobile EN + zh-TW.
3. **D-6** — mobile DCA row clipping, and **D-8** zh-TW desktop title wrap. Together these block three of DCA's four required cells.
4. **D-9** — outro heatmap determinism. Blocks all four Outro cells; this one is a harness/runtime determinism problem, not a composition problem.
5. **R-1 / R-2** — #7 checkpoint definitions for `commerce.expired-promo`, `commerce.unavailable` and `nocode.execution`.

Items 1–3 are UI changes and belong in their own issues. Item 4 needs a deterministic heatmap state under `?uiux-test=1`. Item 5 is a #7 change.

Once those land, only the affected checkpoints need re-capture and re-review; the 73 approved images remain valid for this SHA and any unaffected scene.

## 10. Not done here, by design

- No screenshot comparison assertions (#8).
- No Percy (#10).
- No GitHub Actions (#10).
- No production animation/runtime refactor (#4 Stage 2).
- No copy, typography, animation, asset or responsive change made to satisfy a check.
