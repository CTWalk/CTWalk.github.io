# Portfolio Design Method and Reconstruction Contract

This document records the design method I arrived at while building and repeatedly revising this portfolio, and then turns those decisions into a reconstruction contract.

It has two jobs:

1. preserve **why** I make these design decisions;
2. preserve **what must remain true** so a future implementation or a fresh session does not rediscover the same mistakes or quietly redesign the site.

The target is not literal pixel identity from prose alone. The target is that a capable implementation using this document together with the repository should reproduce roughly **95% of the same design intent, hierarchy, motion grammar, copy, scene structure, and interaction behavior** without needing the original conversation.

The central problem is simple:

> A portfolio visitor should understand what I can do before they need to inspect a repository.

Everything else comes from trying to solve that well.

---

# Part I — Design Method

## 1. Background: what this site needs to communicate

My strongest identity is QA / SDET and software quality engineering. Product engineering supports that story. AI / LLM reliability is a newer adjacent area, not the main identity.

That creates an unusual portfolio problem.

A normal project grid can show repository names, screenshots, tags, and descriptions, but that format does not explain how I think as a QA engineer. A repository thumbnail does not naturally communicate things like:

- a browser result being checked against an API and database,
- a test definition being separated from locator maintenance,
- a failed release check being traced to the real source,
- a scheduler preserving most of an existing plan while repairing a conflict,
- or a contribution history showing repeated investigation of edge cases and false success states.

The site therefore needs to do more than display projects. It needs to **show the reasoning inside the projects**.

At the same time, I do not want the page to become a dashboard, an infographic collection, or a wall of technical labels. The visitor should not have to study the interface before understanding the work.

That tension shapes the design.

---

## 2. A project is not a card

I stopped treating each repository as a card with four independent parts:

1. repository name,
2. screenshot,
3. description,
4. link.

Those pieces can all be correct and still fail together.

The better mental model is:

> **Each repository is one self-contained explanation scene.**

The image, words, and motion should not sit beside each other as separate content types. They should cooperate to explain one idea.

The target relationship is:

> I see the visual → the title tells me what I am looking at → the short text tells me why it exists → the motion reveals the part that is difficult to show statically.

If the repository name and GitHub link disappeared, the scene should still communicate most of the project.

My practical test is:

> **After looking at a scene for about five seconds, can someone explain the repository in one or two sentences?**

If not, the scene is not finished.

---

## 3. One scene, one visual thesis

The most useful constraint is:

> **One scene, one visual thesis.**

At any moment I try to keep only:

1. one dominant visual,
2. one headline,
3. one short supporting sentence.

This does not mean the project itself is simple. It means the interface decides which part deserves attention now.

A lot of complexity came from putting several correct ideas on screen at the same time: multiple badges, several cards, screenshots plus diagrams plus labels, or a collection of checkpoints that all demanded equal attention.

The result was technically informative but visually expensive. The eye had to travel too much.

The fix was not better spacing. The fix was **sequencing**.

Instead of explaining more things simultaneously, I use motion to decide what becomes visible next.

---

## 4. Motion reveals the second piece of information

This is the core motion rule for the site:

> **Motion reveals the second piece of information instead of putting both pieces on screen.**

A useful motion should answer a question the static composition cannot.

Examples:

- Which YAML step is executing now?
- What changed between a valid schedule and a conflict state?
- What evidence sits behind a release check?
- How does one technical checkpoint lead to the next?
- Which contribution is being examined before the final audit result?

This is different from using motion merely to make the page feel alive.

If an animation can be removed without losing meaning, it is probably decoration.

If removing it makes the relationship between two states harder to understand, the motion is doing useful work.

---

## 5. Motion should make something happen, not just change opacity

A weak scroll animation often looks like this:

> progress changes → opacity changes → another image appears.

That quickly becomes a slideshow.

A stronger scroll animation is an event:

- a release path grows,
- a pulse reaches a checkpoint,
- a database symbol assembles,
- six browser checks resolve one by one,
- a conflict replaces a stable state,
- a result collapses back into its source,
- or a final sign-off mark resolves before the delivered product appears.

Scroll is still the time controller, but the viewer experiences **an action with meaning**, not a slider.

---

## 6. The evidence hierarchy: explanation first, proof second

I initially leaned too heavily on real screenshots.

Real material is valuable because it proves the work exists. But a screenshot is often a poor explanation surface. Dense CI pages, terminal logs, long reports, and application screens contain too much information for someone scrolling through a portfolio.

That led to a rule that now guides the evidence-heavy sections:

> **The motion and simplified visual explain. The screenshot proves.**

A visitor should not need to read tiny text inside an image to understand the point.

The preferred sequence is:

1. make the concept recognizable,
2. show the mechanism,
3. bring in the real evidence,
4. enlarge only the result that matters,
5. hold long enough to read it.

The screenshot becomes evidence after the visitor already knows what it is evidence *of*.

---

## 7. Real evidence still matters

Simplifying the explanation does **not** mean replacing real material with fake diagrams.

The distinction I use is:

- simplified SVG / motion = interpretation,
- real screenshot / report / execution output = proof.

I avoid rebuilding a fake version of a GitHub job, test report, scheduler, or product screen just to make it prettier.

When possible, the real artifact stays visible and the animation changes what the viewer notices about it.

When the real artifact is too dense, a simplified semantic state appears first, followed by the real artifact.

The goal is credibility without forcing the visitor to perform the analysis themselves.

---

## 8. Do not add an explanation layer when the existing object can become the explanation

A repeated failure mode was adding another component on top of an already complicated scene:

- a screenshot,
- then a badge explaining the screenshot,
- then a connector explaining the badge,
- then another status card confirming the connector.

Every added explanation created another thing the eye had to parse.

A better question is:

> **Can the thing already on screen change state instead?**

Examples:

- The YAML itself can highlight `open`, then `fill`, then `click`.
- The browser outline can contain six checks instead of showing a separate Web E2E dashboard.
- The real scheduler screenshots can become successive states of one surface rather than three cards.
- A release line can become the checkpoint symbol instead of displaying both permanently.

---

## 9. Stable reading zones are part of the animation

Important evidence needs an actual **stop**.

Not “moving more slowly.”

A real hold.

The rhythm becomes:

> transition → arrive → stop → read → transition again.

The eye should not have to track motion and decode evidence at the same time.

The hold is part of the choreography, not dead time.

---

## 10. Different ideas deserve different motion languages

Consistency does not mean every project should animate the same way.

The rule is:

> **Keep the same visual discipline, but let the motion match the mechanism being explained.**

### noCodeE2E

The important thing is execution order.

The YAML remains the primary visual. Scroll reveals the steps sequentially:

> `open` → `fill` → `click` → Playwright passed.

The motion explains how a readable test definition becomes execution without adding another diagram.

### CueSheet

The important thing is state change and minimal disruption.

Real screenshots act as states of the same product:

> production workspace → conflict state → schedule review.

Fake solver graphics and synthetic schedule blocks were removed because the real product states explain the story better.

### SocialPlatform

The important thing is a release moving through meaningful checks and reaching a delivered product state.

The current scene is:

> product → release path → database integrity → Web E2E → delivered → real product screen.

The database symbol assembles from the flow. The browser checks resolve one by one. The delivered state becomes a clear outcome before the final product screenshot fades in.

A mobile-layout sub-story was removed because it was valid evidence but not necessary to the visual thesis. This is an important example of editing by subtraction: technically relevant evidence can still be too much for the scene.

### Decision Contract Audit

The important thing is repeated investigation and contribution history, not a decorative code sample.

The contribution rows carry the evidence. Focus moves through them, and the scene resolves to a centered audit PASS state.

The final result is deliberately simple because the contribution history is the interesting part; PASS is the conclusion.

### CommerceOps

**Current design status: pending redesign.**

The existing live section still presents the older “one flow across several layers” story, but that story now overlaps too much with SocialPlatform and is **not the canonical future direction**.

The next CommerceOps design must be derived from the newer CommerceOps repository and must earn its place with a thesis that SocialPlatform does not already communicate.

Until that redesign is explicitly completed:

- preserve the current scene in code if maintaining the site;
- do not treat its current motion/story as a reusable pattern;
- do not invent a replacement from this document alone;
- update this document when the new CommerceOps scene is accepted.

---

## 11. Continuity matters more than transition spectacle

A scene feels integrated when the viewer can tell **where the next thing came from**.

It feels disconnected when something simply appears from a visually unrelated direction.

The broader rule is:

> **The geometry of the motion should agree with the logic of the story.**

If a result comes from a checkpoint, its movement should originate from that checkpoint.

If a conflict grows out of an existing schedule, the visual should transform from the schedule rather than cut to a separate card.

If a test step leads to a pass result, the result should resolve from the execution sequence, not from an unrelated corner of the frame.

Continuity is explanatory, not merely aesthetic.

---

## 12. Endings need an outcome, not just the final technical step

The last technical check is not always the end of the story.

A QA flow often has a final semantic question:

> **So what? Can this version move forward?**

That is why a release-oriented scene benefits from a final outcome such as sign-off or delivered.

The structure becomes:

> checks → decision → product outcome.

The ending also needs time to land. Once the outcome is visible, I prefer a stable hold before the next project begins.

A scene should finish its sentence before the next scene starts speaking.

---

## 13. Editing by subtraction

A large part of the design process was removing things that were individually reasonable.

Things I removed or rejected include:

- whole explanatory sections that repeated what project scenes already showed,
- floating cue badges after the underlying visual became understandable,
- duplicate screenshots,
- fake solver diagrams,
- permanent checkpoint cards,
- synthetic pass indicators when real evidence was already sufficient,
- mobile product frames that did not fit the composition,
- mobile E2E material when it made the SocialPlatform story too long,
- and motion that existed only because the page could animate it.

The practical rule is:

> **A new element should either replace something or materially improve understanding.**

If it only adds information without reducing interpretation cost, it is probably making the scene worse.

---

## 14. “Easy” is not the same as “simple-looking”

I use the phrase **make things easy rather than complex** as a design check.

This does not mean every screen should be minimal or empty.

It means the visitor should not have to perform unnecessary work.

For example:

- A real screenshot can be visually complex but easy to understand if the motion tells the viewer what to notice.
- A minimal interface can still be hard to understand if three abstract symbols appear without context.
- A longer animation can be easier than a short cut if the longer motion preserves spatial continuity.
- Removing a technically valid stage can improve the explanation if that stage does not change the core story.

The goal is not visual minimalism by itself.

The goal is **low interpretation cost**.

---

## 15. Copy should not be used to repair a visual problem

I do not rewrite the portfolio copy every time a visual treatment fails.

If the title and supporting sentence already communicate the right idea, changing the words can hide the real problem.

A weak scene is often weak because:

- the visual hierarchy is wrong,
- the screenshot is too dense,
- the motion has no semantic job,
- too many things are visible at once,
- or the transition breaks continuity.

The solution should be visual when the problem is visual.

This protects personally tuned wording, especially in the bilingual version of the site.

---

## 16. Bilingual design is a layout problem, not only a translation problem

English and Traditional Chinese do not occupy space the same way.

I treat the Chinese version as its own reading layout rather than forcing it into English line lengths.

Important considerations include:

- preserving intentional line breaks,
- avoiding compressed character spacing,
- allowing natural Chinese line height,
- preventing awkward wrapping,
- keeping technical terms only where they are useful,
- and making Chinese copy sound natural rather than mechanically equivalent to English.

If a layout only works in English, it is not finished.

---

## 17. The visual budget

Before adding something, I ask:

1. Is this the dominant visual, or is it competing with it?
2. Does it explain a relationship that is currently unclear?
3. Can the existing object change state instead?
4. Will the user have to move their eyes somewhere new to understand it?
5. Does it remain useful after the first second?
6. Is it still needed once the motion is working?

The cleanest version of a scene is usually reached after the interaction works, because that is when temporary explanatory scaffolding can be removed.

---

## 18. How I decide whether a motion is worth keeping

A motion survives when it passes most of these tests:

### It changes understanding

The user learns something from the movement that is not obvious in the static frame.

### It preserves orientation

The next state feels like it came from the previous one.

### It reduces reading

The viewer does not need to inspect dense text to know what the scene means.

### It has a clear end state

The motion lands somewhere meaningful instead of fading out because the section ended.

### It allows a hold

Important proof gets a stable reading moment.

### It does not duplicate another explanation

If the title, icon, screenshot, and animation all say the same thing, at least two of them are probably unnecessary.

### It still works without hover

Scroll carries the complete story. Hover or pointer interaction can add inspection, but it should not be required to understand the project.

---

## 19. Reusable scene-building process

### Step 1: write the one-sentence thesis

What should someone understand after five seconds?

Not the feature list. The actual idea.

### Step 2: choose the real proof

Find the screenshot, report, execution result, contribution history, product state, or artifact that proves the thesis.

### Step 3: identify what the proof cannot explain quickly

This is the job for motion or a simplified visual.

### Step 4: choose one semantic action

Examples:

- trace,
- assemble,
- execute,
- compare,
- reveal,
- replan,
- verify,
- resolve,
- deliver.

The animation should be built around that verb.

### Step 5: decide the states

I try to keep the sequence small:

> context → mechanism → evidence → outcome.

Not every scene needs all four, but adding more states should require a strong reason.

### Step 6: add holds

Decide where the viewer is expected to read. Stop the motion there.

### Step 7: remove temporary explanation

Once the sequence works, remove labels, badges, arrows, duplicate screenshots, or helper UI that the motion has made unnecessary.

### Step 8: perform the five-second test

Hide the repository link and ask whether the project can still be described accurately.

---

## 20. Technical implementation habits that support the design

For this site I prefer:

- isolated scene controllers for larger motion experiments,
- explicit scroll phases instead of many unrelated opacity equations,
- stable hold ranges inside the timeline,
- real assets referenced directly rather than reconstructed evidence,
- SVG for simple semantic shapes,
- restrained filters and blur,
- reduced-motion fallbacks that show a meaningful final state,
- and isolated commits for experiments so a bad direction can be rolled back cleanly.

I avoid changing unrelated scenes while testing one project.

---

## 21. The pattern in one sentence

> **Show one idea, use motion to reveal the relationship, use real material to prove it, then stop long enough for the result to land.**

Operationally:

> **Concept → motion → evidence → outcome.**

These are not four boxes on screen. They are four responsibilities distributed across one continuous scene.

---

# Part II — Reconstruction Contract

This part is intentionally more mechanical than Part I.

If I hand this repository to a new session, this is the section that prevents design drift.

## 22. Authority and baseline

### Source of truth order

When reconstructing or modifying the site, use this order of authority:

1. the current rendered behavior in `main`;
2. current `index.html` and scene-specific controllers such as `social-integrated.js`;
3. this reconstruction contract;
4. the design-method discussion in Part I;
5. old commits only when intentionally restoring a previous behavior.

If prose and current code disagree, **current accepted code wins until this document is updated**.

### Design-code baseline at the time this contract was written

The latest design-code commit before documentation-only commits is:

`c1f62b7cac42fbb8c93f0bfebe5cf47beb4b968d`

The important runtime files are:

- `index.html`
- `social-integrated.js`

`index.html` still contains older SocialPlatform fallback markup. `social-integrated.js` replaces the Social showcase at runtime and is the **canonical current Social visual implementation**. Do not rebuild the removed mobile stage because stale markup still exists in `index.html`.

### Reconstruction target

A fresh implementation should preserve:

- information hierarchy,
- scene order,
- dominant visual placement,
- typography character,
- scroll pacing,
- per-scene semantic motion,
- copy and intentional line breaks,
- asset roles,
- mobile and zh-TW reading behavior,
- and rejected-design boundaries.

Small implementation differences are acceptable. A new visual thesis, new card system, new typography system, new motion grammar, or rewritten copy is not.

---

## 23. Non-negotiable portfolio identity

The page must communicate this hierarchy:

1. **QA / SDET / software quality engineering first**
2. product/software engineering as a supporting strength
3. AI / LLM reliability as a smaller recent extension

The site must not accidentally reposition me as primarily:

- an AI engineer,
- a generic frontend designer,
- a full-stack engineer with QA as a side note,
- or a visual-effects portfolio.

Front-end craft should be felt through the experience, not announced as a separate capability label.

Only original/authored projects should be presented as my portfolio projects. Contributions to other repositories may appear as contribution history but must not be presented as authored projects.

---

## 24. Canonical scene architecture

There are **7 scenes total**.

| Scene | Role | Alignment | Numbered project |
|---|---|---|---|
| 0 | Intro | center | no |
| 1 | CommerceOps | left | `01 / 05` |
| 2 | noCodeE2E | right | `02 / 05` |
| 3 | SocialPlatform | left | `03 / 05` |
| 4 | CueSheet | right | `04 / 05` |
| 5 | Decision Contract Audit / Recently | right | `05 / 05` |
| 6 | GitHub outro | center | no |

The actual experience container uses:

```css
--scene-count: 7;
--scroll-units: 13.5;
```

and:

```css
.experience {
  position: relative;
  height: calc(var(--scroll-units, var(--scene-count)) * 112vh);
  height: calc(var(--scroll-units, var(--scene-count)) * 112svh);
  background: #0b0d0f;
}
```

The stage is sticky and viewport-sized.

Do **not** convert the site into normal stacked sections or a card grid unless explicitly redesigning the entire portfolio.

The removed “How I work” scene must **not** be reintroduced just because unused translation keys or old CSS remain in the source.

---

## 25. Canonical visual system

### Core colors and dimensions

```css
--ink: #fff;
--soft: rgba(255,255,255,.9);
--muted: rgba(255,255,255,.64);
--accent: #c8d5ff;
--nav-h: 72px;
--pad: clamp(22px,4vw,64px);
--content: 1180px;
```

Page background:

```css
#0b0d0f
```

The visual atmosphere is dark, restrained, and evidence-led. Avoid bright multi-color dashboard styling.

### Typography stack

Default:

```css
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
"Helvetica Neue",
Arial,
"PingFang TC",
"Noto Sans TC",
"Microsoft JhengHei",
sans-serif
```

Traditional Chinese prioritizes:

```css
"PingFang TC",
"Noto Sans TC",
"Microsoft JhengHei",
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
sans-serif
```

### Desktop title

```css
.scene-title {
  max-width: 16ch;
  font-size: clamp(2.45rem,4.7vw,4.55rem);
  line-height: 1.07;
  letter-spacing: -.025em;
  font-weight: 650;
  white-space: pre-line;
}
```

Intro title:

```css
.intro .scene-title {
  max-width: 14ch;
  font-size: clamp(2.85rem,5.55vw,5.25rem);
}
```

### Desktop supporting copy

```css
.scene-copy {
  max-width: 43ch;
  margin: 22px 0 0;
  color: rgba(255,255,255,.9);
  font-size: clamp(1.04rem,1.28vw,1.16rem);
  line-height: 1.7;
  letter-spacing: .005em;
  font-weight: 400;
  white-space: pre-line;
}
```

### Content placement

Normal left scene content:

```css
left: max(var(--pad), calc((100% - var(--content))/2));
bottom: clamp(58px,9vh,104px);
width: min(610px, calc(100% - 2*var(--pad)));
```

Right scenes mirror that position from the right.

Center scenes use centered content near the vertical middle.

Text sits over a subtle dark radial fog. This is functional readability support, not a visible card.

### Plates and evidence surfaces

Use soft borders, large but restrained radii, and deep shadow:

```css
border: 1px solid rgba(255,255,255,.18);
border-radius: clamp(16px,2vw,28px);
box-shadow: 0 36px 120px rgba(0,0,0,.42);
```

Do not turn every visual into an independent floating card.

---

## 26. Canonical bilingual copy — locked

**Do not rewrite these strings unless the change request explicitly asks for copy editing.**

Intentional line breaks are part of the design.

### English metadata

Title:

```text
CTWalk — QA / SDET Engineer
```

Description:

```text
CTWalk — QA/SDET engineer working across web, API, data, mobile, automation, and product debugging.
```

### English intro

Label:

```text
QA / SDET · SOFTWARE ENGINEERING
```

Title:

```text
I test software
from the UI down to the data.
```

Body:

```text
I build automation across web, API, database, mobile and CI. When something fails, I trace it to the source—and fix the product when the test is not the problem.
```

### English CommerceOps

**Current live copy; preserve until the CommerceOps redesign is explicitly accepted.**

Title:

```text
One flow.
Checked all the way through.
```

Body:

```text
Browser → API → database → webhook → notification. The test only passes when the full path agrees.
```

### English noCodeE2E

Title:

```text
Readable tests.
Maintainable locators.
```

Body:

```text
YAML describes intent. Playwright runs it. Locators, failure evidence and CI stay separate so the suite is easier to maintain.
```

### English SocialPlatform

Title:

```text
One release path.
Evidence at every layer.
```

Body:

```text
Build, API, database, performance, web and mobile checks work together instead of living as isolated test suites.
```

The current Social visual no longer includes a mobile sub-stage. Do not rewrite this body automatically to “fix” that difference; copy changes require an explicit decision.

### English CueSheet

Title:

```text
I test products.
I build them too.
```

Body:

```text
CueSheet is a full-stack rehearsal scheduler. When availability changes, it replans while keeping as much of the existing schedule as possible.
```

### English Recently / Decision Contract Audit

Label:

```text
Recently
```

Title:

```text
The same QA questions.
A newer kind of system.
```

Body:

```text
What was evaluated? What happens when data is missing? Can the failure be reproduced? AI tooling is a side area of my QA work, not the main focus.
```

### English outro

```text
More projects and engineering history
live on GitHub.
```

### Traditional Chinese metadata

Title:

```text
CTWalk — QA / SDET
```

Description:

```text
CTWalk — QA / SDET，Web、API、DB、Native、自動化測試與產品除錯。
```

### Traditional Chinese intro

Label:

```text
QA / SDET · 軟體工程
```

Title:

```text
我是 QA
從畫面一路驗證到 API、DB與Native
```

Body:

```text
除了自動化測試，也會一路追查失敗原因。
如果問題不在測試，而在產品，我會直接修。
```

### Traditional Chinese CommerceOps

**Current live copy; preserve until the CommerceOps redesign is explicitly accepted.**

Title:

```text
一條龍
從開始驗證到最後
```

Body:

```text
瀏覽器、API、資料庫、資料流都要一致。
畫面顯示成功，不代表整條流程都有通。
```

### Traditional Chinese noCodeE2E

Title:

```text
測試流程好讀
定位方式也好維護
```

Body:

```text
YAML 寫操作流程，Playwright 負責執行。
定位、失敗證據與 CI 分開管理，換版時卡好維護。
```

Do not silently “correct” `換版時卡好維護。` unless copy editing is explicitly requested.

### Traditional Chinese SocialPlatform

Title:

```text
不同層的檢查
收進同一條交付流程
```

Body:

```text
Build、API、DB、效能、網頁與手機端各自檢查。
最後判斷這個版本能不能交付。
```

### Traditional Chinese CueSheet

Title:

```text
我不只測產品
也會做產品
```

Body:

```text
CueSheet 是有正式部署的排練排程工具。
若有人臨時不能來，系統會重排，同時盡量保留原本安排。
```

### Traditional Chinese Recently / Decision Contract Audit

Label:

```text
最近在...
```

Title:

```text
同一套 QA 邏輯
也能用來檢查 AI 工具
```

Body:

```text
這個LLM在做什麼？缺資料會不會誤判？錯誤能不能重現？
這是 QA 思維的延伸。
```

### Traditional Chinese outro

```text
更多專案與實作紀錄
都在 GitHub
```

---

## 27. Language behavior

The language system uses:

- `copy.en`
- `copy.zh`
- `data-i18n`
- localStorage key `ctwalk-lang`
- browser-language fallback to Chinese when appropriate
- `<html lang="zh-Hant-TW">` for Traditional Chinese

Text is applied with `textContent`, so intentional `\n` line breaks must be preserved by `white-space: pre-line`.

### Traditional Chinese typography

Desktop:

```css
html[lang^="zh"] .scene-title {
  max-width: 12.5em;
  line-height: 1.2;
  letter-spacing: .015em;
  font-weight: 600;
  word-break: keep-all;
  overflow-wrap: normal;
}

html[lang^="zh"] .scene-copy {
  max-width: 29em;
  line-height: 1.82;
  letter-spacing: .012em;
  font-weight: 400;
  word-break: normal;
  line-break: strict;
}
```

Do not compress Chinese typography to make it fit the English layout.

---

## 28. Global scroll and motion contract

### Timeline constants

```js
const durations = [1.5, 1.5, 2.15, 2.15, 1.5, 3.7];
const timelineTotal = 12.5;
```

These values are part of the current pacing. Do not globally retime the portfolio while editing one scene.

### Scene fade

```js
function alphaFor(distance) {
  const d = Math.abs(distance);
  if (d <= .36) return 1;
  if (d >= .60) return 0;
  return 1 - smooth((d - .36) / .24);
}
```

Decision Contract Audit and the outro have additional special fade behavior in current code.

### Content drift

For normal scenes, content movement remains subtle:

```js
const y = rel * 18;
const x = (scene.classList.contains('right') ? -1 : 1) * rel * 7;
```

Desktop centered scenes preserve the centered transform; mobile removes the horizontal drift.

### Pointer parallax

Pointer movement is intentionally small and secondary. It should never compete with scroll meaning.

Current smoothing is roughly:

```js
pointer.x += (pointerTarget.x - pointer.x) * .055;
pointer.y += (pointerTarget.y - pointer.y) * .055;
```

Background and scene-object offsets stay in the low single-digit / low tens of pixels.

### Global rule

The portfolio already has a motion identity that works. Do **not** globally redesign it to solve a problem inside one repository scene.

---

## 29. Per-scene reconstruction contracts

### Scene 0 — Intro

**Role:** establish identity, not showcase a project.

**Composition:** centered.

**Primary idea:** QA/SDET first; testing from UI down to data; capable of fixing product code when necessary.

**Visual behavior:** dark grid / atmospheric front-end motion, restrained enough that the copy remains dominant.

**Must not:**

- add skill cards,
- add a technology cloud,
- add a project carousel,
- make the intro primarily about AI,
- label the visual technology used to create the effect.

---

### Scene 1 — CommerceOps

**Status:** current live scene is a placeholder relative to the next redesign.

**Current asset:**

```text
https://raw.githubusercontent.com/CTWalk/Shooting_App_demo/main/e2e_test/visual_cv/baseline/seed-report.png
```

**Current live composition:** right-side large report plate; left-side copy.

**Do not infer the future CommerceOps story from this scene.**

Until the next CommerceOps design is accepted, preserving the current implementation is safer than inventing a replacement.

When the redesign is completed, update:

- thesis,
- state machine,
- assets,
- copy if explicitly approved,
- regression guards,
- and this section.

---

### Scene 2 — noCodeE2E

**Visual thesis:** readable intent and maintainable locator architecture become real browser execution.

**Dominant object:** the YAML/code plate.

The YAML is not decoration. It is the primary explanation surface and must remain recognizable.

Canonical displayed sequence:

```yaml
# readable intent, stable locators
name: Fixture login status
steps:
  - open: /
  - fill:
      target: login.username
      value: "${username}"
  - click: login.submit
  - expectText:
      target: dashboard.status
      value: Welcome demo_user
```

Scroll sequence:

```text
open highlight
→ fill highlight
→ click highlight
→ Playwright ✓ passed
```

Current phase mapping is based on:

```js
phase = clamp((rel + .34) / .68)
```

Focus ranges are approximately:

```js
[[.04,.36],[.30,.64],[.58,1.02]]
```

The pass result begins late in the sequence around `.78`.

**Must not:**

- replace YAML with a generic automation dashboard,
- add a connector curve or moving dot,
- show several permanent explanatory badges,
- make the Playwright result dominate before the YAML has told the story.

Reduced motion should show a meaningful finished state: final click emphasis plus Playwright passed.

---

### Scene 3 — SocialPlatform

**Visual thesis:** a product release moves through meaningful checks and resolves to a delivered product state.

**Canonical runtime implementation:** `social-integrated.js`.

Do not reconstruct this scene from the stale Social markup in `index.html`.

Current sequence:

```text
Product
→ release path grows
→ DB checkpoint
→ database symbol assembles
→ real DB proof / PASSED
→ return to flow
→ Web checkpoint
→ browser outline
→ six checks resolve one by one
→ real E2E proof / 6 PASSED / 29.9s
→ return to flow
→ DELIVERED circle + check
→ final Moderation Rules product screenshot fades in from the release endpoint
→ screenshot gently recenters
→ stable hold
```

There is **no mobile-layout sub-stage** in the current accepted runtime design.

There is **no final green delivery dot**.

The Delivered SVG is a circle + check only. There is **no right arrow**.

#### Current Social assets

Product:

```text
https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504
```

CI proof texture:

```text
https://github.com/user-attachments/assets/ac6484fd-78f5-4583-96e1-880e3fec1229
```

DB evidence:

```text
https://github.com/user-attachments/assets/78e165ea-d43d-4044-abd5-c189e70161a4
```

Web E2E evidence:

```text
https://github.com/user-attachments/assets/7ea37734-4f73-4dcb-84fd-89d1c94e3418
```

Final product / sign-off screenshot:

```text
https://github.com/user-attachments/assets/b2fc999c-b87a-4b91-8230-870c9c78b193
```

#### Current Social phase timing

The scene-local phase is:

```js
clamp(((step - 3) + .56) / .82)
```

Important ranges:

```text
product out          .07 → .18
release line draw    .10 → .20
DB semantic stage    .20 → .27
DB proof in          .29 → .35
DB reading hold      ~.35 → .41
DB proof out         .41 → .46
return to flow       .45 → .49
Web semantic stage   .49 → .57
E2E proof in         .58 → .63
E2E reading hold     ~.63 → .69
E2E proof out        .69 → .74
final flow return    .73 → .78
travel to outcome    .78 → .84
Delivered in         .82 → .87
Delivered draw       .84 → .89
final screenshot     .89 → .95, ease-out cubic
recenter             .92 → .97, ease-out cubic
```

The final screenshot starts near the release endpoint at approximately `left: 88%`, fades/scales from about `.84`, and only then recenters toward `50%`.

This geometry is intentional: the screenshot should feel like the product outcome of the release flow, not an unrelated image entering from the side.

#### Social regression guards

**Must not:**

- bring back the mobile-layout stage unless explicitly requested,
- bring back the final green dot,
- add a right-arrow to Delivered,
- make the final screenshot pop through an aggressive circle mask,
- use dense CI screenshots as the primary explanation,
- use floating CI/DB/E2E cue badges as permanent UI,
- turn the sequence back into screenshot slides,
- require users to read small text inside screenshots to understand the story.

---

### Scene 4 — CueSheet

**Visual thesis:** when availability changes, the product repairs the schedule while preserving as much of the existing plan as possible.

**Dominant object:** one desktop product surface that changes state.

Canonical states:

```text
production workspace
→ conflict status
→ schedule review
```

Assets:

```text
https://raw.githubusercontent.com/CTWalk/CueSheet_demo/main/assets/production-workspace.png
https://raw.githubusercontent.com/CTWalk/CueSheet_demo/main/assets/conflict-status.png
https://raw.githubusercontent.com/CTWalk/CueSheet_demo/main/assets/schedule-review.png
```

Initial supporting phone captures:

```text
https://raw.githubusercontent.com/CTWalk/CueSheet_demo/main/assets/mobile-stage-call-sheet.png
https://raw.githubusercontent.com/CTWalk/CueSheet_demo/main/assets/mobile-cast-member.png
```

Phones may establish that this is a real product but fade once conflict/replanning becomes the main idea.

The final state is **schedule review**. The phone screenshots do not return as a duplicate ending.

**Must not:**

- add solver diagrams,
- add benchmark cards to the scene,
- add fake schedule blocks,
- add a second final phone reveal,
- replace the real screenshots with synthetic UI just to make the motion easier.

---

### Scene 5 — Decision Contract Audit / Recently

**Visual thesis:** repeated investigation of false-success and edge-case behavior, supported by real contribution history, resolves to a simple audit result.

**Dominant object:** contribution history rows.

Contribution evidence currently shown:

1. `truera/trulens #2698` — `Show how many records a leaderboard metric actually scored` — author
2. `earthtojake/text-to-cad #280` — `test: fail the Python runner when it collects no tests` — author
3. `katanemo/plano #1008` — `fix(trace): preserve the root trace ID when OTLP children arrive first` — author
4. `microsoft/agent-framework #7399` — `Python: fix LocalEvaluator reporting zero-check items as passed` — state change
5. `SponsioLabs/Sponsio #108` — `Python and TypeScript ordered comparisons diverge on string/number terms` — author
6. `microsoft/agent-governance-toolkit #3436` — `agt test can report success after skipping every fixture without an expectation` — author
7. `ibm-client-engineering/output-drift-financial-llms #2` — `Compliance validators return compliant on absent decisions and unknown task types` — author
8. `microsoft/agent-framework #7397` — `Python: LocalEvaluator with zero checks reports items as passed` — mention

Do not claim current upstream status without a fresh check.

Do not claim that the Decision Contract Audit tool itself caused these contributions unless verified. They are adjacent evidence of the same QA thinking.

#### Purple contribution icon

Keep the supplied purple branch-style SVG shape:

```svg
<svg viewBox="0 0 32 32">
  <g fill="none" stroke="#8250df" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 10v12"/>
    <path d="M8 10c0 6 4.8 11 11 11h3"/>
    <circle cx="8" cy="6" r="4" fill="white"/>
    <circle cx="8" cy="26" r="4" fill="white"/>
    <circle cx="26" cy="21" r="4" fill="white"/>
  </g>
</svg>
```

The icon itself remains purple; parent row focus/dimming may affect the rendered appearance.

#### Audit focus behavior

The Audit scene intentionally gets a long reading distance.

Current global duration allocation includes a long final project duration of `3.7`.

Rows begin subdued and become easier to read through focus:

```css
opacity: .22;
filter: brightness(.4) saturate(.7);
transform: scale(.985);
```

Focus increases opacity, brightness, scale, and text emphasis without turning rows into unrelated cards.

#### Audit ending — locked

The ending is:

```text
scanner moves left → right
→ centered green circular check
→ PASS
```

PASS is centered in the Audit board.

**Must not:**

- attach PASS as a pill to the last contribution row,
- add `checks: 0`,
- add `UNVERIFIED`,
- add `未驗證`,
- replace contribution history with code/rule examples as the primary evidence,
- remove the centered scanner/PASS ending without explicit instruction.

---

### Scene 6 — Outro

**Role:** close the portfolio and point to broader engineering history.

**Composition:** centered.

The scene is intentionally sparse.

Do not add another project grid, skills matrix, timeline, testimonial wall, or contact dashboard here unless explicitly requested.

---

## 30. Asset-use rules

For every project asset, classify it before using it:

### Primary explanation

The visitor can understand the concept directly from it.

Example: noCodeE2E YAML.

### Real proof

The artifact proves the claim but may be too dense to explain itself.

Example: CI execution screenshots.

### State of the same object

Several real images represent one product changing over time.

Example: CueSheet workspace → conflict → review.

### Background atmosphere

A visual may support the scene without carrying meaning.

Never force a background asset to become the explanation merely because it is visually attractive.

If a screenshot requires tiny-text reading to understand the scene, it is proof, not explanation.

---

## 31. Mobile reconstruction contract

Primary breakpoint:

```css
@media (max-width: 760px)
```

Mobile does not simply shrink desktop.

Key rules:

- content moves to the bottom-left rather than remaining centered;
- text width expands relative to the viewport;
- visual plates move to the upper part of the screen;
- horizontal content drift is removed;
- background shading becomes a stronger top-to-bottom gradient to preserve text readability;
- scene objects remain large enough to recognize;
- interactions that require hover must not carry essential meaning.

Global mobile variables:

```css
--nav-h: 64px;
--pad: 18px;
```

Typical mobile plate width is around `86vw`; Social runtime uses about `92vw`.

### Mobile title

Default:

```css
font-size: clamp(2.15rem,9.8vw,3.45rem);
max-width: 13ch;
line-height: 1.1;
```

Traditional Chinese mobile:

```css
font-size: clamp(1.95rem,8.4vw,2.85rem);
line-height: 1.26;
letter-spacing: .01em;
max-width: none;
```

Traditional Chinese body:

```css
max-width: 94%;
font-size: .98rem;
line-height: 1.74;
letter-spacing: .008em;
```

---

## 32. Reduced-motion contract

Reduced motion must not produce an empty or broken scene.

General behavior:

- disable smooth scrolling;
- convert sticky experience into normal stacked scenes;
- show scenes at full opacity;
- remove parallax / animated transforms;
- hide non-essential visual-effects layers.

Per-scene final states:

- noCodeE2E: final click step emphasized + Playwright passed visible;
- CueSheet: schedule review visible;
- Decision Contract Audit: contribution rows readable + centered PASS visible, scanner hidden;
- SocialPlatform: final Moderation Rules product screenshot visible directly;
- CommerceOps: preserve a meaningful static current state until redesigned.

---

## 33. Regression guards — MUST NOT reintroduce

These are not suggestions. They are accepted removals or rejected directions.

### Global

- no restored “How I work” section;
- no project-card grid replacing scene storytelling;
- no generic sci-fi decoration competing with project evidence;
- no permanent multi-badge dashboards;
- no solving visual problems by rewriting copy;
- no requirement to read tiny screenshot text to understand a project;
- no simultaneous explanation of every layer/tool;
- no unrelated visual entering from a direction that breaks the story geometry;
- no global motion redesign while fixing a single scene.

### noCodeE2E

- no replacement of YAML with a generic test result screenshot;
- no curved connector / moving dot;
- no simultaneous step badges.

### SocialPlatform

- no mobile-layout stage;
- no mobile result screenshot;
- no final green delivery dot;
- no Delivered right arrow;
- no aggressive circular pop for final screenshot;
- no persistent CI/DB/E2E cue badges;
- no screenshot slideshow as the core motion;
- no CI screenshot as a thing the visitor must read to understand the scene.

### CueSheet

- no solver illustration;
- no fake schedule blocks;
- no benchmark cards;
- no duplicate final phone return.

### Decision Contract Audit

- no pseudo-dashboard replacing contribution history;
- no code/rule examples becoming more prominent than contribution history;
- no PASS pill attached to the last row;
- no `checks: 0`;
- no `UNVERIFIED` / `未驗證`;
- do not alter the centered scanner → PASS ending casually.

---

## 34. Acceptance tests for a fresh-session reconstruction

A reconstruction is acceptable only when most of these are true.

### Identity test

Within the intro and first projects, a visitor should identify me as QA/SDET first.

### Five-second scene test

Hide the repository name and link. After five seconds, a viewer should be able to explain the project in one or two sentences.

### Screenshot-independence test

Blur or hide small text inside screenshots. The main idea should still be understandable.

### One-thesis test

At any moment there should be one dominant visual thesis rather than several equally important modules.

### Motion-purpose test

For every major animation, answer:

> What relationship becomes easier to understand because this moves?

If there is no answer, remove the motion.

### Continuity test

A new state should visibly come from the previous state when the story says they are related.

### Hold test

Important evidence should have a stable reading interval.

### Ending test

Each scene should land on a meaningful outcome rather than merely run out of scroll distance.

### Bilingual test

English and Traditional Chinese should both preserve hierarchy, intentional line breaks, comfortable line height, and natural wrapping.

### Mobile test

The visual should remain recognizable without forcing the user to track several tiny objects.

### Reduced-motion test

Every scene must still tell a coherent static story.

### Cross-project differentiation test

Each project should communicate a distinct QA/product capability rather than repeating the same “many layers of tests” message.

---

## 35. Change protocol for future sessions

When changing this portfolio:

1. read this document first;
2. inspect the current branch and the actual runtime files;
3. identify the scene's one-sentence thesis;
4. identify which current behavior is accepted and which part is being changed;
5. preserve copy unless the request explicitly includes copy changes;
6. preserve unrelated scenes;
7. prefer changing one existing object over adding another component;
8. keep scroll as the primary interaction;
9. provide reduced-motion behavior;
10. make the change in an isolated commit;
11. compare the result against the previous commit;
12. update this document when a new design decision becomes permanent.

For repository edits, use the current file SHA immediately before writing. Do not run competing writes to the same file.

A failed experiment should be easy to roll back without rewriting unrelated history.

---

## 36. How to use this document in a new session

A useful handoff instruction is:

> Read `PORTFOLIO_DESIGN_METHOD.md` completely, then inspect the current `index.html` and any scene-specific controllers before editing. Treat Part II as the reconstruction contract. Preserve locked copy and accepted regression guards. Do not infer current Social behavior from stale fallback markup in `index.html`; `social-integrated.js` is authoritative for that scene. If a requested change affects one project, do not redesign the global experience.

If rebuilding rather than editing, first recreate:

1. scene architecture,
2. typography/layout system,
3. global scroll behavior,
4. bilingual behavior,
5. each accepted per-scene state machine,
6. reduced-motion states,
7. then polish.

Do not begin by inventing project visuals.

---

## 37. Current known open design item

### CommerceOps

CommerceOps is intentionally left as the next design problem.

The current live scene is preserved for continuity, but its older “one flow across layers” thesis overlaps with SocialPlatform and should not be copied forward automatically.

Before redesigning CommerceOps:

1. inspect the newer CommerceOps repository and its evidence;
2. define a thesis that does not duplicate SocialPlatform;
3. choose proof that supports that thesis;
4. design one semantic motion around it;
5. update this contract after the scene is accepted.

Until then, the rest of the site should remain stable.

---

## 38. Final checklist

Before I consider the portfolio or a reconstructed version faithful, I ask:

- Can the project be understood without opening GitHub?
- Can the main idea be understood without reading tiny screenshot text?
- Is there only one dominant visual idea at a time?
- Does motion explain something rather than decorate something?
- Does real evidence prove the claim without becoming the explanation burden?
- Do state changes have a visible origin?
- Are there real reading holds?
- Is the ending an outcome rather than an arbitrary cutoff?
- Can any label, badge, screenshot, or animation still be removed?
- Does the scene work in English and Traditional Chinese?
- Does mobile preserve the same thesis without shrinking everything into unreadability?
- Does reduced motion still tell the story?
- Does each project have a distinct role in the portfolio?
- Have rejected patterns stayed rejected?
- Has personally tuned copy remained untouched unless explicitly changed?
- Does it still feel like one portfolio rather than assembled components?

If several answers are no, I do not add more components.

I simplify the sequence until the relationship becomes obvious.

---

## Closing note

The most useful design decisions on this site did not come from adding more polish. They came from recognizing where the visitor was being asked to do too much interpretation.

The recurring solution is to make the page carry more of that burden itself:

- decide what matters now,
- reveal the next idea through motion,
- show real proof only after the meaning is clear,
- preserve spatial continuity,
- stop long enough for important results to land,
- and remove anything that no longer earns its place.

That is the design pattern I want to keep using as the portfolio evolves.
