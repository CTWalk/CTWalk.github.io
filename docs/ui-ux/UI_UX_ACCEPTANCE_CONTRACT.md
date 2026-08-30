# UI/UX Acceptance Contract

Issue: #5  
Related architecture work: #4  
Mobile presentation decision: #20  
Reference implementation reviewed: `0a3f665131fe4774a8fac1e64d0cd8c08dcf6281`

## 1. Purpose

This document defines what “as expected” means for the portfolio before screenshots become golden baselines and before animation/runtime ownership is refactored.

It is normative for **observable UX**, not for the current implementation structure. A future implementation may change DOM structure, JavaScript ownership, CSS organization, or animation plumbing without violating this contract if the accepted experience remains equivalent.

The reference commit above is evidence of the current experience. It is not automatically correct merely because it is current. A baseline may only be frozen after the state is checked against this contract.

### #20 responsive-scope amendment

The portfolio is now intentionally split into two presentation modes:

```text
viewport > 760px
  -> full desktop interactive portfolio
  -> Scenes 0–6 and their choreography

viewport <= 760px
  -> dedicated mobile fallback
  -> one full-screen desktop-first guidance composition
  -> no project-scene parity requirement
```

This amendment supersedes the earlier assumption that every desktop scene must have a responsive mobile equivalent. Unless explicitly stated otherwise, the Scene 0–6 contracts below are now normative for the **desktop interactive presentation only**. Any older per-scene wording that says “mobile may…” is historical context and does not require those scenes to render at `<= 760px`.

## 2. Requirement classes

Every requirement in this document belongs to one of these classes:

- **INV — must remain invariant:** a regression unless the change is intentional, reviewed, and the acceptance contract/baseline is updated.
- **RESP — intentional responsive or modality difference:** desktop/mobile, language, pointer, or reduced-motion variants may differ in presentation while preserving the intended product decision.
- **FREE — allowed implementation freedom:** implementation details may change without baseline approval when the observable contract is preserved.
- **GAP — pre-freeze acceptance gap:** a current behavior that must be resolved or explicitly accepted before it can become a golden baseline.

## 3. Verification classes

The later verification suite must distinguish two kinds of checks.

### Mechanical checks

Suitable for automation: selected locale, text content, visibility, geometry, wrapping, crop, image/state selection, ordering, reduced-motion state, presentation mode, and deterministic checkpoints.

### Perceptual checks

Require human review unless a meaningful deterministic proxy exists: whether hierarchy is obvious, whether text can be understood before it changes, whether a pause feels sufficient, whether motion feels continuous, and whether any element becomes unexpectedly loud.

Passing screenshots alone is not sufficient to declare an animated UX safe.

## 4. Global contract

### G-01 — EN and zh-TW have equal acceptance status — INV

EN and zh-TW are both first-class product surfaces. Both must be reviewed for content, hierarchy, wrapping, presentation mode, motion coexistence, and reduced-motion behavior. Neither language is a secondary fallback and neither receives weaker regression coverage by default.

### G-02 — wording changes are intentional changes — INV

The currently accepted wording in each locale is the content baseline candidate. A future rewrite is allowed, but it must be treated as an intentional UX change rather than an incidental side effect of a refactor.

Scene runtimes must not silently substitute different copy after language initialization.

### G-03 — line breaks are presentation, not automatically content — INV / RESP

EN and zh-TW follow the same rule: a source-level hard break is only invariant when the rendered composition has been explicitly accepted as intentional.

Neither locale has a blanket “preserve every `\n`” or “remove every `\n`” rule. The rendered title/body must use natural phrase boundaries, avoid orphaned connector words or nonsensical splits, and remain readable across the approved viewport matrix.

For regression purposes, the **rendered composition at a frozen checkpoint** is authoritative; the presence of a literal newline in source code is not.

### G-04 — readable hierarchy — INV

For every active presentation, the viewer must be able to identify the primary message without deliberate inspection. The title is the primary textual message; body copy is supporting explanation. Evidence graphics may be visually strong but must not make the text unreadable.

Decorative backgrounds, grids, blur layers, parallax, ambient geometry, and the mobile ambient light field must remain subordinate to the message they frame.

### G-05 — one dominant idea per scene/presentation — INV

Each desktop project scene communicates one main idea. The mobile fallback communicates one main idea: this portfolio is deliberately desktop-first and the full interactive walkthrough belongs on desktop.

Additional evidence or decoration must support that idea instead of introducing a competing headline or success ceremony.

### G-06 — macro pacing includes silence — INV

The accepted desktop cross-scene rhythm is not continuous escalation. Quiet holds and decompression are part of the interaction design and must not be removed merely to make the page feel more active.

### G-07 — mobile is a dedicated fallback presentation — RESP / INV

At `<= 760px`, the portfolio does **not** reproduce the desktop project scenes.

Mobile must instead present one deliberately designed full-screen fallback that:

- identifies CTWalk / QA / SDET;
- retains EN / zh-TW language switching;
- clearly states that the full interactive walkthrough is designed for desktop;
- provides at least the GitHub navigation affordance;
- uses a polished code-driven composition rather than a generic compatibility warning;
- does not expose CommerceOps, noCodeE2E, SocialPlatform, CueSheet, DCA, Outro, or desktop scroll choreography;
- does not use a generated image as the page substitute.

The mobile fallback may use a restrained Hey-Siri-like ambient edge-light field. That field is decorative, deterministic under test mode, and the only intentional continuous mobile motion.

Crossing the `760px` breakpoint must change presentation ownership. Desktop scene runtimes must not remain active behind the mobile fallback.

### G-08 — reduced motion preserves the active presentation — RESP / INV

For desktop, `prefers-reduced-motion: reduce` may replace scroll-driven choreography with static scene states, but each scene’s main claim and representative evidence must remain understandable.

For mobile, reduced motion keeps the same dedicated fallback composition and freezes the ambient Canvas field into a deterministic static state.

Reduced motion must never merely disable animation while leaving essential content permanently hidden.

### G-09 — evidence remains factual — INV

Do not introduce fake dashboards, fabricated test results, invented deployment states, or visual language that implies evidence not present in the project. Existing factual contribution/issue titles in DCA must not be rewritten merely for stylistic consistency.

The mobile fallback contains no fake project screenshot or generated-image proxy.

### G-10 — accessibility semantics survive refactors — INV

Language selection must update the document language correctly. Meaningful images/containers must retain appropriate accessible names or alternative text. Decorative/ambient elements should remain hidden from assistive technology where appropriate. Keyboard-visible focus behavior and functional links must remain usable.

The mobile ambient Canvas and static decorative framing are `aria-hidden`; the fallback title/message and GitHub link remain semantic content.

### G-11 — implementation structure is not frozen — FREE

DOM nesting, JavaScript module boundaries, loader architecture, stylesheet ownership, shared timeline internals, and RAF scheduling may be refactored as long as all observable invariants remain satisfied.

### G-12 — baseline changes require review — INV

A failing visual baseline is not permission to regenerate snapshots. Baselines are updated only after the difference is classified as intentional and checked against this contract.

---

# 5. Desktop scene contracts

The following Scene 0–6 contracts apply to the desktop interactive presentation (`> 760px`). They do not imply mobile scene parity after #20.

## Scene 0 — Intro

### Accepted content

**EN**

- Label: `QA / SDET · SOFTWARE ENGINEERING`
- Title: `I test software from the UI to the database.`
- Body: `I automate web, API, database and mobile checks, then run them in CI. When one fails, I trace the failure before deciding whether the test or the product needs fixing.`
- Scroll cue: `Scroll`

**zh-TW**

- Label: `QA / SDET · 軟體工程`
- Title meaning/content: `我是 QA 從畫面一路驗證到 API、DB與Native`
- Body meaning/content: `除了自動化測試，也會一路追查失敗原因。如果問題不在測試，而在產品，我會直接修。`
- Scroll cue: `向下滑`

Current source-level zh-TW breaks are a baseline candidate, not a language-wide requirement. Their rendered placement must be judged at #6 in the same way as EN wrapping.

### Visual hierarchy

- **INV:** the introductory title is the immediate focal point.
- **INV:** the supporting paragraph remains readable without competing with the ambient background.
- **INV:** the WebGL/network treatment is atmospheric, not information the user must inspect.
- **FREE:** exact ambient geometry and small parallax offsets may change if perceived prominence remains equivalent.

### Motion

- **INV:** intro motion remains restrained; it should establish atmosphere rather than behave like a product demo.
- **INV:** the scroll cue is discoverable but secondary.
- **RESP:** desktop reduced motion hides the WebGL animation and presents a static readable section.

### Review questions

Mechanical: correct locale text, no horizontal overflow, title/body remain visible, WebGL is decorative, reduced-motion content remains present.

Perceptual: can the role/value proposition be understood immediately, and does the background stay quieter than the copy?

---

## Scene 1 — CommerceOps

### Accepted content

**EN**

- Label: `CommerceOps QA Demo`
- Title: `I test the whole checkout flow.`
- Body: `For this demo, I follow a checkout through the browser, API, database, webhook and notification, and verify the result at each step.`

**zh-TW — current effective runtime copy**

- Label: `CommerceOps QA Demo`
- Title meaning/content: `用真的產品情境練習 再對照參考驗證流程`
- Body: `CommerceOps 是給初階 QA 練習的電商測試環境。先自己測結帳與各種失敗情境，再對照專案提供的參考驗證流程，看看有沒有漏掉重要檢查。`

### Visual hierarchy

- **INV:** the phone/product state is the primary visual evidence.
- **INV:** oversized `CHECK OUT`, `EXPIRED PROMO`, and `UNAVAILABLE` words are transitional events, not persistent competing headlines.
- **INV:** the orange transition language remains visually distinct from the neutral portfolio typography without obscuring the main title/body.
- **FREE:** exact phone pixel position or scale may be refactored if the approved visual baseline remains perceptually equivalent.

### Motion

- **INV:** event order is `CHECK OUT` → quiet interval → `EXPIRED PROMO` → separate interval → `UNAVAILABLE`.
- **INV:** the post-CHECK OUT quiet interval is perceptible; the scene must not collapse into three continuous words with no rest.
- **INV:** phone evidence changes correspond to the intended scenario rather than drifting out of sync with the transition word.
- **INV:** final state settles without a reset or abrupt jump.
- **FREE:** exact normalized timing constants may change if #9 confirms perceptual equivalence.
- **RESP:** desktop reduced motion removes the transition-word choreography and shows a meaningful static failure-state example.

### Review questions

Mechanical: correct title after all runtimes load and after EN ↔ zh-TW switching; transition order; expected scenario asset; no overflow/crop regression.

Perceptual: is the quiet gap clearly felt, and do the large scenario words support rather than overpower the section explanation?

---

## Scene 2 — noCodeE2E

### Accepted content

**EN**

- Label: `noCodeE2E`
- Title: `I keep test steps readable.`
- Body: `The YAML says what the test should do. Playwright executes it. I keep locators, failure output and CI config outside the YAML so UI changes are easier to update.`

**zh-TW**

- Label: `noCodeE2E`
- Title meaning/content: `測試流程好讀 定位方式也好維護`
- Body meaning/content: `YAML 寫操作流程，Playwright 負責執行。定位、失敗證據與 CI 分開管理，換版時卡好維護。`

### Visual hierarchy

- **INV:** the YAML/code plate is readable evidence, not decorative texture.
- **INV:** the project title remains compact enough that it does not dominate the code example.
- **INV:** the Playwright result is a final proof point, not the primary headline.

### Motion

- **INV:** the YAML exists quietly before execution emphasis begins.
- **INV:** step emphasis progresses in a readable order.
- **INV:** the Playwright `passed` result arrives early enough to leave a deliberate final comprehension hold.
- **INV:** the result should not disappear immediately at the scene boundary.
- **FREE:** the exact highlight opacity/glow values and internal timing numbers may change if readability and hold duration remain equivalent.
- **RESP:** desktop reduced motion presents a readable static YAML/result state without requiring the sequential animation.

### Review questions

Mechanical: code text is present and legible; runner/result appears at the final checkpoint; locale copy is correct.

Perceptual: can a viewer understand “readable intent → execution → result” without pausing the page manually?

---

## Scene 3 — SocialPlatform

### Accepted content

**EN**

- Label: `SocialPlatform`
- Title: `I run one release through all of these checks.`
- Body: `Build, API, database, performance, web and mobile checks all run against the same version.`

**zh-TW**

- Label: `SocialPlatform`
- Title meaning/content: `不同層的檢查 收進同一條交付流程`
- Body meaning/content: `Build、API、DB、效能、網頁與手機端各自檢查。最後判斷這個版本能不能交付。`

### Visual hierarchy

- **INV:** the scene communicates one release moving through multiple verification layers.
- **INV:** product evidence is the anchor; database and web representations are intermediate states, not separate dashboard products.
- **INV:** `DATABASE` and `WEB UI` labels are structural wayfinding and remain visually restrained.
- **INV:** the final mobile product evidence is the closing state of the desktop scene.
- **INV:** do not reintroduce green success badges/checks, `PASSED`, `Delivered`, a glowing signoff halo, or another celebratory success layer.
- **INV:** do not fabricate CI/deployment/dashboard evidence that the scene does not actually prove.

### Motion

- **INV:** semantic order is product → database → web UI → final mobile product.
- **INV:** DB and Web states have perceptible plateaus; they must not flash by as decorative transitions.
- **INV:** the final phone receives a meaningful reading hold before the next scene.
- **INV:** one neutral path/marker remains the conceptual through-line rather than a success-progress meter.
- **FREE:** SVG geometry and interpolation internals may change if the same sequence and visual restraint remain.
- **RESP:** desktop reduced motion resolves to a meaningful final-product state with subdued structural context instead of replaying the full sequence.

### Review questions

Mechanical: correct final phone asset, correct DB/Web order, no removed success language returns.

Perceptual: does the viewer read one release path rather than several unrelated test demos, and is the final phone held long enough to understand?

---

## Scene 4 — CueSheet

### Accepted content

**EN**

- Label: `CueSheet`
- Title: `I also build my own products.`
- Body: `CueSheet is a rehearsal scheduler I built. If someone's availability changes, it can rebuild the schedule while trying to keep the existing plan intact.`

**zh-TW**

- Label: `CueSheet`
- Title meaning/content: `我不只測產品 也會做產品`
- Body meaning/content: `CueSheet 是有正式部署的排練排程工具。若有人臨時不能來，系統會重排，同時盡量保留原本安排。`

### Visual hierarchy

- **INV:** desktop scheduling evidence is the primary visual.
- **INV:** mobile-device evidence inside this desktop scene is supporting context, not a second competing product story.
- **INV:** the manager-phone evidence uses the accepted canonical Conflicts view when that phone is shown.
- **INV:** screenshots must remain understandable as real product evidence; they must not be shrunk until text becomes merely texture.

### Motion

- **INV:** progression reads as workspace/context → conflict → review/final evidence.
- **INV:** evidence focus feels like one continuous camera/readability move rather than three independent scene resets.
- **INV:** CueSheet is a decompression scene; it should not acquire a loud success animation or rapid event cadence.
- **INV:** the final/review state receives enough quiet exposure to understand the product behavior.
- **FREE:** exact focus scale/damping values may change if the continuous calm behavior remains equivalent.
- **RESP:** desktop reduced motion presents the review/final evidence directly; sequential motion is not required.

### Review questions

Mechanical: expected conflict/review assets, manager-phone source where visible, no crop that removes essential UI.

Perceptual: does the section feel calmer than the preceding kinetic scene, and is the scheduling consequence understandable before exit?

---

## Scene 5 — Decision Contract Audit

### Accepted content

**EN**

- Label: `Recently`
- Title: `Lately I've been testing AI tooling too.`
- Body: `I check what was actually evaluated, what happens when input is missing, and whether a failure can be reproduced. It's a newer area of my QA work.`
- Link label: `Decision Contract Audit`

**zh-TW**

- Label: `最近在...`
- Title meaning/content: `同一套 QA 邏輯 也能用來檢查 AI 工具`
- Body meaning/content: `這個LLM在做什麼？缺資料會不會誤判？錯誤能不能重現？這是 QA 思維的延伸。`
- Link label remains the project name: `Decision Contract Audit`

### Visual hierarchy

- **INV:** all factual contribution/issue rows remain available as evidence; do not rewrite titles merely to make them stylistically uniform.
- **INV:** only the active contribution asks for serious reading at a given moment; inactive history remains context.
- **INV:** the contribution history recedes before scanner/PASS becomes the focal mode.
- **INV:** `PASS` remains restrained and must not turn into a celebratory product-success claim.
- **INV:** the scene must not imply that Decision Contract Audit caused external contributions unless such causality is independently verified.

### Motion

- **INV:** contribution traversal is deliberately non-uniform rather than eight equal metronomic beats.
- **INV:** the cadence includes small punctuation/hold moments.
- **INV:** scanner begins only after the history-reading phase has substantially completed.
- **INV:** PASS follows the scan and then settles.
- **FREE:** exact keyframe percentages may change if #9 confirms the same phrasing and perceptual rhythm.
- **RESP:** desktop reduced motion exposes the contribution history and PASS statically, with scanner motion removed.

### Review questions

Mechanical: all expected rows exist; active-row focus works; scanner/PASS order is correct; reduced-motion rows are readable; no contribution text has been silently altered.

Perceptual: does the history feel phrased rather than mechanically stepped, and does PASS remain a conclusion rather than the scene's loudest spectacle?

---

## Scene 6 — Outro

### Accepted content

**EN**

- Label: `CTWalk`
- Title: `More of my work is on GitHub.`
- Link: `Open GitHub`

**zh-TW**

- Label: `CTWalk`
- Title meaning/content: `更多專案與實作紀錄 都在 GitHub`
- Link: `查看 GitHub`

### Visual hierarchy

- **INV:** the outro is a quiet exit and clear GitHub invitation, not another portfolio case study.
- **INV:** the contribution heatmap is ambient context behind the CTA.
- **INV:** the link remains clearly discoverable and usable.

### Motion

- **INV:** arrival remains quiet.
- **INV:** the one-time discovery ripple/pointer response is secondary and must not loop as a constant attention demand.
- **INV:** pointer interaction must not interfere with the link.
- **RESP:** desktop reduced motion shows a subdued static heatmap.

### Review questions

Mechanical: GitHub link works; heatmap does not block pointer events; reduced mode is stable.

Perceptual: does the experience clearly feel finished, with the CTA stronger than the decorative heatmap?

---

# 6. Cross-presentation responsive contract

## Desktop / laptop (`> 760px`)

- **INV:** primary copy and primary evidence can coexist without overlap.
- **INV:** the viewer should not need browser zoom to read intended evidence.
- **FREE:** exact left/right offsets may change as long as the accepted composition remains equivalent.

## Mobile fallback (`<= 760px`)

- **INV:** only the dedicated fallback is visible and reachable.
- **INV:** no desktop project scene is reachable by scrolling.
- **INV:** page does not horizontally or vertically scroll as a disguised continuation of the desktop portfolio.
- **INV:** primary fallback title/message remain readable at normal device scale.
- **INV:** GitHub navigation and language switching remain usable.
- **INV:** the visual treatment reads as an intentional mobile entry, not an error/unsupported-browser warning.
- **INV:** desktop RAF/parallax/scene-specific runtimes do not continue behind the fallback.
- **RESP:** the fallback has its own composition and does not preserve desktop scene geometry, evidence, or ordering.

## Locale switching

- **INV:** switching EN ↔ zh-TW updates every translatable visible node consistently in the active presentation.
- **INV:** switching away and back does not restore stale copy from another runtime writer.
- **INV:** `html.lang`, document title, and description follow the selected locale.
- **INV:** neither language produces nonsensical hard-break artifacts at approved viewports.

# 7. Reduced-motion contract

Reduced motion is a separate accepted presentation, not an animation failure mode.

## Desktop

- **INV:** all desktop scenes remain navigable as normal document sections.
- **INV:** essential content/evidence is visible without waiting for scroll-driven animation state.
- **INV:** no continuous RAF-driven choreography is required to understand a project.
- **RESP:** CommerceOps may show one representative failure state without transition words.
- **RESP:** noCodeE2E may show a static highlighted step/result.
- **RESP:** SocialPlatform may show final product evidence with subdued structural context.
- **RESP:** CueSheet may show the final review state directly.
- **RESP:** DCA may show readable contribution rows and PASS without scanner animation.
- **RESP:** Outro may show a static subdued heatmap.

## Mobile

- **INV:** the dedicated fallback remains the only presentation.
- **INV:** all fallback content and navigation remain present.
- **INV:** the ambient edge-light Canvas is frozen at a deterministic static state.
- **INV:** no continuous desktop or mobile animation is required for understanding.

# 8. Allowed implementation freedom

The following are explicitly **not** golden-contract requirements by themselves:

- file names or module boundaries;
- whether CSS is inline or runtime-injected;
- exact easing function implementation;
- exact RAF organization;
- internal normalized progress formulas;
- exact DOM wrapper structure;
- source-code line breaks that do not represent an accepted rendered composition;
- minor anti-aliasing differences;
- implementation-specific class names, provided test hooks have stable semantic identifiers.

A change to these is safe only when observable requirements above remain satisfied.

# 9. Pre-freeze conditions for #6

Before #6 captures the final coherent golden baseline:

1. Desktop copy/bootstrap ownership must remain deterministic so rendered language does not depend on last-writer-wins load order.
2. EN and zh-TW desktop title/body wrapping must receive equal manual readability review at selected desktop/laptop checkpoints.
3. The #20 mobile fallback must be implemented and reviewed in EN and zh-TW at the selected mobile viewport.
4. Mobile normal and reduced-motion checkpoints must be deterministic and contain no desktop scene content.
5. Desktop scenes must be viewed in normal motion and reduced motion before their screenshot states are approved.
6. Any mismatch between implementation and this contract must be resolved or explicitly reclassified before snapshots become authoritative.

# 10. Baseline approval rule

The #6 freeze is approved only when a reviewer can answer both questions positively:

1. **Mechanical:** Is this the correct locale, state, asset, presentation mode, responsive layout, and deterministic checkpoint?
2. **Perceptual:** Can the intended message be understood comfortably, with the accepted hierarchy and pacing?

Only then may the rendered state become a golden visual baseline.
