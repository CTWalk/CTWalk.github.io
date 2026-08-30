# Portfolio Design Method and Reconstruction Contract

This document records the design method behind this portfolio and the current accepted implementation state.

It has two jobs:

1. preserve **why** the design works this way;
2. preserve **what must remain true** so a future edit does not quietly restore rejected patterns or redesign unrelated scenes.

The repository remains the source of truth for exact implementation. This document is the source of truth for **intent, hierarchy, motion grammar, readability rules, pacing, accepted scene behavior, and regression guards**.

The central goal is:

> A visitor should understand what I can do before they need to inspect a repository.

The portfolio is not a gallery of screenshots. It is a sequence of explanations.

---

# Part I — Design Method

## 1. Portfolio identity

The hierarchy is intentionally:

1. **QA / SDET / software quality engineering first**;
2. product/software engineering as a supporting strength;
3. AI / LLM reliability as a newer adjacent area.

The site should not read primarily as an AI portfolio, frontend-effects portfolio, or generic full-stack portfolio.

Front-end craft should be felt through the experience rather than announced as a separate capability.

---

## 2. A project is a scene, not a card

The working mental model is:

> **Each repository is one self-contained explanation scene.**

The image, copy, evidence, and motion should cooperate to explain one idea rather than behave as separate content modules.

The target relationship is:

> visual context → headline → short explanation → motion reveals the relationship that is difficult to show statically.

A useful test is:

> After about five seconds, can someone explain the project in one or two sentences without opening GitHub?

If not, the scene is not finished.

---

## 3. One scene, one visual thesis

At any moment, prefer:

1. one dominant visual;
2. one headline;
3. one short supporting sentence;
4. one active transformation.

Several correct pieces of evidence can still produce a bad scene if they demand attention simultaneously.

The solution is usually **sequencing**, not more cards, labels, spacing, or badges.

> Complexity belongs in the project. The interface decides what matters now.

---

## 4. Low interpretation cost is the real target

Minimal-looking and easy-to-understand are not the same thing.

A dense real screenshot can be easy if the visitor already knows what to notice. A sparse abstract diagram can be hard if the viewer must decode several unfamiliar symbols.

The design target is:

> **low interpretation cost**

Before adding an element, ask:

- Does it reduce the amount of interpretation the visitor must perform?
- Does it replace something, or only add another thing to parse?
- Can an existing object change state instead?
- Is it still useful after the first second?

If an addition gives more information but does not reduce interpretation cost, it is probably making the scene worse.

---

## 5. Readability is perceptual, not just a font-size rule

Readability is defined as:

> A visitor can recognize, parse, and understand the intended information at normal viewing distance and normal scroll speed without deliberately stopping or straining.

The working model is:

> **readability = size × contrast × hierarchy × motion × exposure time**

A technically large enough font can still fail if it moves too quickly, competes with another object, or is visible for too little time.

### Three semantic levels

#### Must read

Project titles, explanations, actions, important evidence.

These should support comfortable sentence reading.

#### Must recognize

Short labels such as `DATABASE`, `WEB UI`, project labels, and state names.

These should be understood in a glance.

#### Atmospheric

Scene numbers, minor metadata, decorative technical texture.

These may remain quieter and smaller.

### Practical scale guidance

At ordinary desktop viewing and 100% zoom:

- roughly 16–19px: sustained/body reading;
- roughly 14–16px: meaningful UI/supporting information;
- roughly 12–14px: short labels/metadata;
- below 12px: generally decorative unless there is a strong reason.

These are heuristics, not a substitute for perception testing.

### Perception tests

Use these instead of trusting CSS values alone:

- **one-second glance:** can the project/stage and dominant message be named quickly?
- **normal-scroll test:** can short labels be recognized without stopping?
- **peripheral hierarchy test:** while focusing on the headline, is the next important element still understandable?
- **squint/blur test:** does the hierarchy remain obvious?
- **100% zoom test:** does meaningful text require leaning forward?
- **mobile test:** does the same hierarchy survive around 375–430px width?
- **fast-scroll recovery test:** after reversing scroll, can the visitor immediately tell where they landed?

Stopping because content is interesting is good. Stopping because it is difficult to perceive is not.

---

## 6. Explanation first, proof second

Real screenshots matter because they establish credibility, but dense product screens, logs, CI pages, and reports are often poor explanation surfaces.

The evidence rule is:

> **Simplified motion explains. Real material proves.**

The preferred order is:

1. make the concept recognizable;
2. reveal the mechanism;
3. show the real product/evidence;
4. give the important state enough visual territory;
5. hold long enough for recognition.

Never rebuild fake CI, fake test output, fake product dashboards, or fake evidence just to make a prettier scene.

SVG and abstract motion may interpret a mechanism, but they must not fabricate proof.

---

## 7. Embedded-product readability is a separate problem

CSS cannot make text inside a raster screenshot intrinsically larger.

For screenshots and device mockups, first ask:

> What does the visitor need to recognize from this screen within about one second?

They do **not** need to read every embedded label. They do need to recognize the product state that makes the screenshot worth showing.

Preferred solutions:

- allocate more physical viewport territory to important evidence;
- preserve real screenshot aspect ratio and context;
- let inactive evidence recede;
- sequence dense surfaces rather than showing them all equally;
- use a gentle camera/focus move when the whole screenshot cannot carry the message at once;
- on mobile, remove supporting surfaces that become meaningless thumbnails.

Avoid:

- enlarging UI text by editing the screenshot;
- `object-fit: cover` when it removes meaningful context;
- making every screenshot/device larger at once;
- treating desktop composition as something that can simply be scaled down for mobile.

---

## 8. Motion must reveal a relationship

The core motion rule is:

> **Motion reveals the second piece of information instead of putting both pieces on screen at the same time.**

Useful motion answers questions such as:

- Which test step is executing now?
- What changed between a stable schedule and a conflict?
- Which layer of a release is being inspected?
- How does one state become the next?
- Which contribution is currently being examined?

If removing an animation does not reduce understanding, the animation is probably decoration.

Scroll remains the main time controller, but the viewer should experience **an action with meaning**, not a slideshow controlled by scroll.

---

## 9. Endpoint magnitude and interpolation are separate design decisions

A motion can have the right destination and still feel coarse if the transition is poorly interpolated.

Two failures became useful rules:

1. tiny scale changes can be technically correct but perceptually invisible;
2. large changes can improve recognition but feel abrupt if applied as short pulses or static jumps.

The preferred approach is:

> **make the endpoint obvious, then earn it through continuous interpolation.**

For important focus transfers:

- start emphasis before the previous state fully disappears;
- use overlap rather than hard handoff;
- let supporting elements yield slightly before the dominant object reaches full emphasis;
- avoid independent short focus pulses that create a dip/re-acceleration between related states;
- use smoother easing and light damping when coarse wheel deltas would otherwise become coarse visual jumps.

CueSheet is the canonical example.

---

## 10. Continuity matters more than transition spectacle

A transition feels integrated when the viewer can tell where the next state came from.

The geometry of the motion should agree with the logic of the story.

Examples:

- a conflict should grow out of the same product surface;
- a release marker should move along the release path;
- a final product should resolve from the release endpoint rather than fly in from an unrelated edge;
- a test result should feel downstream of the execution sequence.

> **Spatial continuity is explanatory, not merely aesthetic.**

---

## 11. Stable reading zones are part of the animation

Important evidence needs a real arrival state.

The rhythm is:

> anticipation → transformation → comprehension hold

or, more simply:

> transition → arrive → read/recognize → continue.

The eye should not have to track movement and decode dense evidence at the same time.

A hold is not dead time. It is part of the choreography.

---

## 12. Portfolio-level pacing: every scene must not perform at the same intensity

Once individual scenes became strong enough to carry themselves, the next problem appeared at the portfolio level:

> **every scene wanted to perform.**

A sequence where every project contains an equally strong event feels like a film where every scene is a climax.

The accepted solution is to design **contrast in animation density**, not to weaken the scenes themselves.

The intended rhythm is approximately:

| Scene | Dynamic role | Character |
|---|---|---|
| Intro | restrained | orientation |
| CommerceOps | loud | graphic / immediate |
| noCodeE2E | calmer | precise / procedural |
| SocialPlatform | active | continuous / kinetic |
| CueSheet | decompression | observational / product-led |
| Decision Contract Audit | crescendo then settle | reading → focus → resolution |
| Outro | quietest | stillness + optional interaction |

A useful shorthand is:

> **quiet → event → quiet → event → rest → event → long rest**

Do not try to make every scene equally animated, equally fast, or equally impressive.

Variation is part of the direction.

---

## 13. Silence is a design material

The final pacing pass established a rule that should survive future redesigns:

> **When an outcome becomes understandable, stop explaining for a moment.**

Stillness is not an absence of design. It is when the viewer finishes the mental connection.

Examples:

- CommerceOps needs space between scenario events so the current product state exists before the next scenario takes over.
- noCodeE2E needs a final Playwright hold so the visitor can connect YAML intent to execution.
- SocialPlatform needs the final real product to remain after the release system has finished yielding.
- CueSheet benefits from a long observational final state after the replanning sequence.
- DCA needs its history to recede before the scanner/PASS mode becomes dominant.
- The outro should remain sparse instead of adding another concluding module.

When improving a mature scene, first ask whether it needs **more time**, not more animation.

---

## 14. Different projects deserve different motion languages

Consistency means shared discipline, not identical animation.

### CommerceOps — scenario switching

One stable phone represents one realistic commerce product. Large scenario words sweep behind it while the product state changes:

> `CHECK OUT` → hold → `EXPIRED PROMO` → hold → `UNAVAILABLE`

The phone remains the stable object. Scenario typography is transitional, not a permanent competing headline.

### noCodeE2E — execution order

The YAML/code plate remains the primary explanation surface:

> quiet YAML → `open` → `fill` → `click` → Playwright passed → hold

The motion shows readable intent becoming execution.

### SocialPlatform — release traversal

The visual thesis is:

> **one release moves through layers of evidence**

The accepted sequence is:

> product → DATABASE → WEB UI → product → hold

The release path, neutral marker, DB cylinder, browser/DOM geometry, scans, and final real product screen carry the explanation.

There is no synthetic Delivered state and no green success language.

### CueSheet — state change and focus

Real screenshots act as states of one product:

> workspace → conflict → review → long observational final state

The evidence surface gradually comes closer while supporting phone captures yield.

### Decision Contract Audit — reading order then mode change

Contribution history is the evidence. Focus moves through rows one at a time.

Then:

> contribution field recedes → scanner becomes dominant → PASS → settle

The scanner is a change of mode, not another layer competing with the contribution list.

### Outro — interaction discovery

The heatmap is atmospheric but interactive. It demonstrates interactivity once on entry, then pointer proximity controls it.

The interaction must be discoverable without instructional copy.

---

## 15. Interaction discoverability: inevitable first, interactive second

Hover-only discovery is fragile because the user may enter a scene with the pointer somewhere unrelated to the intended hit area.

The accepted pattern for the final heatmap is:

> **entry demonstration → nearest-cell interaction**

A subtle one-time autonomous ripple proves that the surface is alive. After that, pointer movement anywhere inside the final scene maps to the nearest valid heatmap cell.

This produces two important properties:

1. a stationary user can still discover that the background is reactive;
2. an active user does not need precision pointing to trigger it.

Do not add “move your cursor here” instructions. Do not loop the demonstration continuously.

---

## 16. Editing by subtraction

Accepted removals and rejected patterns are part of the design.

Things removed or rejected during iteration include:

- redundant explanatory sections;
- permanent cue badges;
- duplicate screenshots;
- fake solver graphics;
- permanent checkpoint cards;
- synthetic success badges where they distorted the story;
- SocialPlatform `PASSED`, `6 PASSED`, Delivered, green checks, green nodes, and final success glow;
- an aggressive circular aperture transition;
- 3D/rotating SocialPlatform phone treatment;
- dense screenshot sequences when SVG/motion could explain the mechanism better;
- tiny supporting product surfaces on mobile;
- motion added only because the page could animate it.

> **A new element should either replace something or materially improve understanding.**

---

## 17. Copy is not a repair tool for visual problems

Do not rewrite tuned copy just because a visual treatment fails.

If the problem is hierarchy, scale, exposure time, motion, or competition, solve that visually first.

Copy changes should be deliberate and explicit, especially because the site has independently tuned English and Traditional Chinese layouts.

---

## 18. Bilingual design is also layout design

English and Traditional Chinese occupy space differently.

Preserve:

- intentional line breaks;
- natural Chinese line height;
- comfortable character spacing;
- non-mechanical translation;
- readable technical terms;
- hierarchy rather than literal matching of line lengths.

A layout that only works in English is not finished.

---

## 19. Reusable scene-building process

1. **Write the thesis.** What should a visitor understand after five seconds?
2. **Choose real proof.** Find the product state, report, execution result, or contribution history that actually supports the thesis.
3. **Identify what the proof cannot explain quickly.** That becomes the job of motion or simplified geometry.
4. **Choose one semantic verb.** Trace, execute, compare, replan, inspect, resolve, reveal.
5. **Keep the state sequence small.** Context → mechanism → evidence → outcome, only where needed.
6. **Allocate visual territory.** Decide which evidence must be readable or merely recognizable.
7. **Design the interpolation.** Make the endpoint obvious without making the transition coarse.
8. **Design the hold.** Decide where the visitor is expected to finish understanding.
9. **Audit the neighboring scenes.** Make sure this scene's energy contrasts with what comes before and after it.
10. **Remove scaffolding.** Delete helper labels, duplicate evidence, or badges no longer needed.
11. **Run perception tests.** One-second glance, normal scroll, mobile, reduced motion, fast-scroll recovery.
12. **Run the whole portfolio.** Judge the final result as a continuous 2–3 minute experience, not only as isolated scenes.

---

# Part II — Current Reconstruction Contract

## 20. Authority and accepted baseline

### Source-of-truth order

When modifying the site, use this order:

1. current rendered behavior on `main`;
2. current runtime/controller files;
3. this document;
4. old commits only when intentionally restoring something.

If prose and code disagree, current accepted code wins and this file should be corrected.

### Accepted design-code baseline

The latest accepted design-code commit immediately before this documentation update is:

```text
24aea596562af25dc980c4cf9051fac1f159763a
```

This includes the accepted cross-scene pacing refinement.

### Pre-pacing rollback baseline

The last accepted state before the pacing pass is:

```text
5d94f5095e66b1ea4a5f7a01a14faf3df86d05f7
```

Useful pacing-pass rollback anchors:

```text
Commerce pacing       aa390ecafa1a43de24833be246c0209071e5ed2d
Social final hold     a66dfc2da5c4e171b1793ff73e02953b598fb3ac
Pacing runtime add    7f4de307778fbdbf1c00b8c77e2d800de8238ac1
Pacing activation     24aea596562af25dc980c4cf9051fac1f159763a
```

These commits were intentionally separated so future evaluation can restore one timing decision without rolling back unrelated visual work.

---

## 21. Runtime ownership

Current behavior is distributed across:

- `index.html` — scene architecture, global scroll controller, bilingual copy, base noCodeE2E, CueSheet state changes, base DCA behavior;
- `social-integrated.js` — loader and noCode runner sizing;
- `social-runtime.js` — canonical SocialPlatform scene;
- `commerce-integrated.js` — canonical CommerceOps scene and Commerce copy override;
- `outro-heatmap.js` — final heatmap and discovery interaction;
- `typography-runtime.js` — global DOM readability pass;
- `evidence-readability.js` — embedded-product/evidence presentation pass;
- `experience-pacing.js` — accepted final pacing overrides for noCodeE2E and DCA.

Loader order is intentionally:

```text
social-runtime.js
→ commerce-integrated.js
→ outro-heatmap.js
→ typography-runtime.js
→ evidence-readability.js
→ experience-pacing.js
```

The later pacing/readability layers are expected to override earlier base presentation/timing where necessary.

Do not remove `experience-pacing.js` as “duplicate logic” without understanding that it is the accepted final attention/pacing layer.

---

## 22. Scene architecture and global timing

There are seven scenes:

| Scene | Role | Number |
|---|---|---|
| 0 | Intro | — |
| 1 | CommerceOps | 01 / 05 |
| 2 | noCodeE2E | 02 / 05 |
| 3 | SocialPlatform | 03 / 05 |
| 4 | CueSheet | 04 / 05 |
| 5 | Decision Contract Audit / Recently | 05 / 05 |
| 6 | GitHub outro | — |

The experience remains a sticky, viewport-sized scroll narrative. Do not convert it into a normal project-card grid unless the entire portfolio is intentionally redesigned.

Global timeline constants:

```js
const durations = [1.5, 1.5, 2.15, 2.15, 1.5, 3.7];
const timelineTotal = 12.5;
```

The accepted pacing pass did **not** globally retime these durations. It changed local event allocation inside selected scenes.

Do not globally retime the portfolio to solve a local scene issue.

---

## 23. Global visual and readability contract

The page remains dark, restrained, evidence-led, and low-chroma outside project-specific accents.

Core background:

```css
#0b0d0f
```

Main `.scene-title` and `.scene-copy` sizing were already acceptable and were deliberately **not** enlarged during the DOM readability pass.

`typography-runtime.js` raises the floor for meaningful secondary text:

- `.scene-label` uses `--text-small` (`clamp(.86rem,.82rem + .16vw,.94rem)`);
- `.scene-link` uses `--text-ui` (`clamp(.94rem,.9rem + .16vw,1rem)`);
- GitHub nav link: `.94rem`;
- language buttons: `.9rem`;
- code plate floor: `.86rem` desktop, `.8rem` mobile;
- noCode runner sublabel: `.78rem` desktop, `.75rem` mobile;
- Audit rows: `clamp(.78rem,.9vw,.88rem)` desktop, `.75rem` mobile.

Do not reintroduce sub-12px meaningful DOM text merely to create hierarchy. Use contrast, spacing, exposure, and importance instead.

---

## 24. Embedded evidence / Pass 2 contract

### CueSheet

The desktop evidence surface receives more physical territory:

```css
width: min(64vw, 880px);
height: min(74vh, 710px);
```

It uses one continuous focus progression across workspace → conflict → review.

Maximum additional scale:

- desktop: approximately `+12%`;
- mobile: approximately `+8%`.

Supporting phones yield gradually through scale, brightness, and saturation. On mobile they are removed entirely so the primary product evidence can use the viewport.

The focus is damped over frames to prevent coarse wheel movement from becoming equally coarse visual movement.

### SocialPlatform

The accepted treatment remains restrained:

- runtime base final phone: `92%` desktop / `86%` mobile;
- readability override: **`98%` desktop / `94%` mobile**;
- no additional `scale: 1.18` style magnification.

The larger experimental treatment improved recognition but became visually over-dominant.

### CommerceOps

No extra Pass 2 enlargement is applied.

Its phone already nearly fills the showcase and uses a source-matched `412/915` aspect ratio.

---

## 25. Scene contracts

### Scene 0 — Intro

**Role:** establish QA/SDET identity.

**Dynamic role:** restrained orientation.

Must not become a technology cloud, project carousel, skills dashboard, or AI-first statement.

---

### Scene 1 — CommerceOps

**Canonical runtime:** `commerce-integrated.js`

**Visual thesis:** practice QA against a realistic product, one scenario at a time, then compare coverage against reference paths.

Current product states:

```text
checkout
→ expired coupon
→ unavailable variant
```

Current transition words:

```text
CHECK OUT
EXPIRED PROMO
UNAVAILABLE
```

The oversized orange words sweep horizontally behind the stable phone. They are transitional graphics, not persistent headlines.

#### Accepted pacing

The first two events intentionally no longer touch each other:

```text
CHECK OUT         .03 → .22
quiet gap         .22 → .29
EXPIRED PROMO     .29 → .50
quiet gap         .50 → .61
UNAVAILABLE       .61 → .84
```

The screenshot transition to expired begins later as well:

```text
toExpired         .37 → .45
toUnavailable     .68 → .76
```

The purpose is not slower animation for its own sake. The first product state must exist long enough before the first failure scenario takes attention.

Do not collapse the `CHECK OUT → EXPIRED` gap back to the earlier near-immediate transition without a deliberate pacing decision.

Reduced motion shows a meaningful static expired-coupon state and removes transition typography.

Must not be redesigned back into SocialPlatform's “many system layers” story.

---

### Scene 2 — noCodeE2E

**Visual thesis:** readable intent and maintainable locators become real browser execution.

**Dynamic role:** precise, procedural, calmer than CommerceOps.

Dominant object: YAML/code plate.

Canonical sequence:

```text
quiet YAML
→ open highlight
→ fill highlight
→ click highlight
→ Playwright passed
→ final comprehension hold
```

#### Accepted pacing override

`experience-pacing.js` is authoritative for the final timing:

```js
const ranges = [
  [.12, .38],
  [.34, .62],
  [.58, 1.02]
];

const result = smooth(clamp((phase - .72) / .10));
```

The YAML therefore gets a quiet opening beat before execution begins.

The Playwright result completes at approximately `.82`, leaving roughly the final **18%** of the local phase as a stable comprehension hold.

Do not make the result larger or more animated merely to increase impact. The accepted improvement is **exposure time**.

The user should have enough time to connect:

> YAML intent → actual Playwright execution.

Do not modify the passed popup while changing unrelated scenes.

Must not:

- replace YAML with a generic automation dashboard;
- add simultaneous step badges;
- add a decorative connector/moving dot that duplicates execution order.

---

### Scene 3 — SocialPlatform

**Canonical runtime:** `social-runtime.js`

**Visual thesis:**

> One release moves through layers of evidence and returns to the real product.

**Dynamic role:** continuous / kinetic.

Canonical sequence:

```text
PRODUCT
→ DATABASE
→ WEB UI
→ PRODUCT
→ stillness
```

The release path is neutral white/cool white. A neutral marker travels along it.

#### Database stage

- marker travels to the DB checkpoint;
- a cylinder assembles from the release flow;
- the `DATABASE` heading appears independently;
- a restrained scan moves through the geometry.

There is no green success treatment, PASSED badge, screenshot proof card, or check mark.

#### Web stage

- marker travels to WEB UI;
- browser/DOM geometry expands from the checkpoint;
- the `WEB UI` heading appears independently;
- a restrained scan communicates inspection.

Again, no green success language or fake dashboard.

#### Accepted final pacing

DB/Web plateaus are preserved. The recovered time is spent on the final product payoff.

Current important timing:

```text
release line draw       .14 → .21
DB travel               .18 → .30
DB open                 .30 → .37
DB scan                 .36 → .44
DB close                .44 → .51
WEB travel              .51 → .63
WEB open                .63 → .70
WEB scan                .69 → .77
WEB close               .77 → .84
endpoint travel         .84 → .88
final geometry          .87 → .90
real phone in           .89 → .92
final product hold      ~.92 → 1.00
```

The previous phone resolution ended near `.98`; that was changed because the real product payoff had too little time to exist.

As the phone resolves, the previous vector system yields more aggressively:

```js
vectorWorld opacity yield: (1 - phoneIn * .96)
final geometry yield:      (1 - phoneIn * .96)
```

The result should feel like:

> marker arrives → product resolves → system disappears → product stays.

Do not add a concluding label. Stillness is the punctuation.

The final screenshot uses:

```text
https://github.com/user-attachments/assets/b2fc999c-b87a-4b91-8230-870c9c78b193
```

The initial product screenshot uses:

```text
https://github.com/user-attachments/assets/46073db9-02ac-4645-8784-721165d7d504
```

**Explicitly rejected / do not restore:**

- `PASSED`;
- `6 PASSED`;
- green checks;
- green nodes;
- final green glow;
- Delivered badge/circle/state;
- final sign-off halo;
- mobile-layout sub-stage;
- screenshot slideshow as the primary explanation;
- aggressive aperture/circle-mask transition;
- 3D iPhone rotation treatment;
- fake CI/dashboard evidence;
- requiring screenshot text to explain DB/Web semantics.

---

### Scene 4 — CueSheet

**Visual thesis:** when availability changes, the product replans while preserving as much of the existing schedule as possible.

**Dynamic role:** decompression after SocialPlatform; calm and observational.

Canonical states:

```text
production workspace
→ conflict status
→ schedule review
→ quiet final product
```

The same desktop surface carries all three states.

Supporting phone captures may establish product context on desktop, but they recede once the conflict/review story takes over. They are hidden on mobile by the evidence-readability pass.

The accepted focus move is continuous and monotonic. Do not rebuild it as separate abrupt zoom pulses for conflict and review.

The accepted pacing pass did **not** change CueSheet timing. This was intentional: its current continuous, slower product-state behavior already performs the required decompression role.

Before changing CueSheet, judge it specifically in the transition from SocialPlatform. If it already feels calmer, leave it alone.

Must not:

- add solver diagrams;
- add fake schedule blocks;
- add benchmark cards;
- add a duplicate final phone reveal;
- replace authentic screenshots with synthetic UI for convenience.

---

### Scene 5 — Decision Contract Audit / Recently

**Visual thesis:** repeated investigation of false-success and edge-case behavior, supported by real contribution history.

**Dynamic role:** guided reading → mode change → restrained conclusion.

Dominant object: contribution rows.

The scene does **not** need fewer contributions. It needs only one contribution at a time to demand serious reading.

#### Accepted row-focus hierarchy

`experience-pacing.js` preserves all rows but increases active/inactive separation:

```js
const readStart = .18;
const readEnd = .72;
const reading = smooth(clamp((phase - .14) / .06));

const baseOpacity = .14 + focus * .86;
const baseBrightness = .32 + focus * .70;
const saturation = .62 + focus * .38;
```

The active row becomes readable while neighboring rows remain context.

The row itself is the unit of attention. Do not independently animate repository name, title, state, icon, and description as separate competing events.

#### Accepted history → scanner mode change

The scanner is a different semantic mode from contribution reading.

Current transition:

```text
contribution field
→ focused reading
→ history recedes
→ scanner becomes dominant
→ PASS
→ settle
```

Timing:

```js
scanProgress = smooth(clamp((phase - .78) / .12));
passIn       = smooth(clamp((phase - .84) / .08));
```

As scanning begins:

```js
row opacity *= (1 - recede * .42)
activity opacity = .88 * (1 - scannerMode * .82)
```

This is intentional. The contribution field should remain visible as background history, but it should no longer compete with the scanner/PASS conclusion.

The final existing ending remains:

```text
scanner left → right
→ centered circular check
→ PASS
```

PASS should feel satisfying, not triumphant. This scene represents a recent adjacent extension of the QA story, not the portfolio's biggest celebration.

Do not claim current upstream issue/PR status without a fresh check.

Must not:

- replace contribution history with a pseudo-dashboard;
- make code/rule examples more prominent than real contribution history;
- attach PASS as a pill to the last row;
- add `checks: 0`, `UNVERIFIED`, or `未驗證`;
- turn PASS into a large glowing success celebration.

---

### Scene 6 — GitHub outro

**Role:** close the portfolio and point to broader engineering history.

**Dynamic role:** quietest / final decompression.

The scene stays sparse. Do not add a project grid, skills matrix, testimonial wall, or dashboard here.

The heatmap is the only substantial ambient interaction.

The accepted pacing pass deliberately left the outro unchanged.

---

## 26. Outro heatmap interaction contract

**Canonical runtime:** `outro-heatmap.js`

### Structure

- seven rows;
- responsive columns: 24 below 600px, 38 below 980px, otherwise 52;
- dark cells at rest;
- heatmap sits above the generic scene shade but below final copy;
- it is atmospheric, not real GitHub contribution history.

### Pointer interaction

Any pointer position inside the final scene is projected to the nearest valid heatmap cell.

The user does not need to place the cursor directly over the grid. Positions outside the visual grid clamp to its nearest edge cell.

Pointer interaction retains local spread/falloff and slower decay behavior.

### Entry discovery pulse

The entry animation exists only to reveal that the heatmap is interactive.

Behavior:

1. final scene becomes visibly active (`opacity >= .55`);
2. wait about `420ms`;
3. if the user already moved the pointer inside the scene, skip the autonomous pulse;
4. otherwise trigger one ripple from a fixed origin around the center row and 68% across the columns;
5. if the user moves the pointer during the ripple, cancel the autonomous state immediately and hand control to the pointer.

The pulse runs only once per page session.

### Water-drop ripple

The entry pulse is not a filled expanding glow.

It behaves like a drop:

- short impact flash at the origin;
- a bright ring crest travels outward;
- cells behind the crest stop receiving new energy and decay naturally;
- duration is approximately `1180ms`;
- maximum spatial radius is **`4.32` grid-distance units**, the accepted ~40% reduction from the earlier `7.2` experiment.

Brightness and trailing decay were intentionally retained when the radius was reduced.

Do not:

- loop the autonomous ripple;
- add instructional hover copy;
- make the whole heatmap flash;
- restore the larger 7.2-radius ripple without a new design decision.

### Reduced motion / coarse pointer

The interaction is non-essential. Reduced-motion and coarse-pointer environments may show the heatmap statically without the interactive animation.

---

## 27. Current bilingual copy — preserve unless explicitly editing copy

Intentional line breaks are part of the design.

### Intro

English:

```text
I test software
from the UI down to the data.
```

Traditional Chinese:

```text
我是 QA
從畫面一路驗證到 API、DB與Native
```

### CommerceOps

English:

```text
Practice on a real product.
Check against a reference.

CommerceOps is a realistic commerce app for junior QA. Test checkout and failure cases yourself, then compare your coverage with the provided reference paths.
```

Traditional Chinese:

```text
用真的產品情境練習
再對照參考驗證流程

CommerceOps 是給初階 QA 練習的電商測試環境。先自己測結帳與各種失敗情境，再對照專案提供的參考驗證流程，看看有沒有漏掉重要檢查。
```

### noCodeE2E

English:

```text
Readable tests.
Maintainable locators.

YAML describes intent. Playwright runs it. Locators, failure evidence and CI stay separate so the suite is easier to maintain.
```

Traditional Chinese:

```text
測試流程好讀
定位方式也好維護

YAML 寫操作流程，Playwright 負責執行。
定位、失敗證據與 CI 分開管理，換版時卡好維護。
```

### SocialPlatform

English:

```text
One release path.
Evidence at every layer.

Build, API, database, performance, web and mobile checks work together instead of living as isolated test suites.
```

Traditional Chinese:

```text
不同層的檢查
收進同一條交付流程

Build、API、DB、效能、網頁與手機端各自檢查。
最後判斷這個版本能不能交付。
```

The visual intentionally does not literalize every layer named in the copy. Do not add stages only to make the diagram enumerate the sentence.

### CueSheet

English:

```text
I test products.
I build them too.

CueSheet is a full-stack rehearsal scheduler. When availability changes, it replans while keeping as much of the existing schedule as possible.
```

Traditional Chinese:

```text
我不只測產品
也會做產品

CueSheet 是有正式部署的排練排程工具。
若有人臨時不能來，系統會重排，同時盡量保留原本安排。
```

### Recently / Decision Contract Audit

English:

```text
The same QA questions.
A newer kind of system.

What was evaluated? What happens when data is missing? Can the failure be reproduced? AI tooling is a side area of my QA work, not the main focus.
```

Traditional Chinese:

```text
同一套 QA 邏輯
也能用來檢查 AI 工具

這個LLM在做什麼？缺資料會不會誤判？錯誤能不能重現？
這是 QA 思維的延伸。
```

### Outro

English:

```text
More projects and engineering history
live on GitHub.
```

Traditional Chinese:

```text
更多專案與實作紀錄
都在 GitHub
```

---

## 28. Mobile contract

Primary breakpoint:

```css
@media (max-width: 760px)
```

Mobile is not a scaled-down desktop composition.

Rules:

- keep the same project thesis;
- allow text more width relative to the viewport;
- remove horizontal content drift;
- keep important evidence large enough to recognize;
- remove supporting devices/surfaces when they become meaningless thumbnails;
- do not rely on hover for essential meaning;
- use stronger background shading where necessary for copy readability.

Specific accepted behaviors:

- CueSheet supporting phones are hidden;
- CueSheet primary evidence uses `96vw` and approximately `54vh`;
- Social final phone uses `94%` height with no extra scale magnification;
- Commerce phone remains the dominant stable product object;
- heatmap may remain static on coarse-pointer devices.

---

## 29. Reduced-motion contract

Reduced motion must still tell a coherent story.

General behavior:

- disable unnecessary scroll smoothing/parallax;
- show meaningful final states rather than empty motion layers;
- avoid requiring pointer animation to understand anything essential.

Per-scene examples:

- noCodeE2E: meaningful final execution/pass state;
- CommerceOps: expired-coupon product state;
- SocialPlatform: final Moderation Rules product screen;
- CueSheet: schedule review;
- Decision Contract Audit: readable rows and existing PASS ending;
- outro: static heatmap is acceptable.

---

## 30. Global regression guards

Do not reintroduce:

- a project-card grid replacing scene storytelling;
- a restored “How I work” scene without a new explicit design decision;
- generic sci-fi effects competing with project evidence;
- permanent multi-badge dashboards;
- visual-problem fixes implemented by rewriting copy;
- meaningful text below a comfortable readability floor just to create hierarchy;
- a requirement to read tiny screenshot text to understand a project;
- every project using the same motion language;
- every project using the same motion **intensity**;
- global motion redesign while fixing a single scene;
- large device/screenshot scaling without considering competition and composition;
- abrupt focus jumps when continuous interpolation can preserve the same endpoint;
- removal of comprehension holds merely to make the portfolio feel faster;
- additional end-state animation when stillness already communicates the outcome.

---

## 31. Acceptance tests

A future reconstruction or design change should pass most of these.

### Identity

Does the visitor understand QA/SDET as the primary identity?

### Five-second scene test

Without opening GitHub, can the project be explained accurately after about five seconds?

### One-second recognition test

Can the current stage and dominant visual be identified almost immediately?

### Screenshot-independence test

If small text inside screenshots is blurred, does the scene still communicate its thesis?

### One-thesis test

Is there one dominant visual idea at a time?

### Motion-purpose test

For each major animation:

> What relationship becomes easier to understand because this moves?

If there is no answer, remove it.

### Continuity test

Does the new state visibly come from the previous state when the story says they are related?

### Temporal readability test

Is important information stable long enough to recognize or read at normal scroll speed?

### Comprehension-hold test

After an important result settles, is there enough quiet time for the viewer to understand what changed before the next event takes attention?

### Cross-scene pacing test

When watched as one continuous experience, do neighboring scenes contrast in energy, or does every scene feel like another climax?

The intended broad rhythm is:

```text
restrained
→ loud
→ precise
→ kinetic
→ calm
→ crescendo / settle
→ quiet
```

### Transition-quality test

Is the endpoint visually meaningful without the interpolation feeling coarse, abrupt, or mechanically pulsed?

### Viewing-effort test

At 100% zoom, does meaningful information require leaning forward, zooming, or unusually careful cursor placement?

### Interaction-discovery test

If the pointer begins away from the visual's center, can the optional interaction still reveal itself naturally?

### Bilingual test

Do English and Traditional Chinese both preserve hierarchy and comfortable wrapping?

### Mobile test

Does mobile preserve the same thesis without several tiny competing surfaces?

### Reduced-motion test

Does every scene still communicate a meaningful state?

### Cross-project differentiation

Does each project demonstrate a distinct capability rather than repeating the same story with different screenshots?

---

## 32. Change and rollback protocol for future sessions

When editing this portfolio:

1. fresh-fetch the current `main` branch;
2. inspect the actual runtime responsible for the target scene;
3. do not rely on an old SHA or stale fallback markup;
4. state the scene's one-sentence thesis before changing the visual;
5. identify which current behavior is accepted and which part is being changed;
6. preserve copy unless copy editing is explicitly requested;
7. preserve unrelated scenes and global motion;
8. prefer changing an existing object over adding another explanation component;
9. distinguish DOM readability from embedded screenshot readability;
10. test endpoint magnitude and interpolation separately;
11. test **exposure time and neighboring-scene pacing** before adding visual effects;
12. keep reduced-motion/mobile behavior meaningful;
13. use isolated, focused commits for scene-specific experiments;
14. where a pass affects several scenes, prefer a late-loaded override runtime so the pass can be disabled without rewriting base controllers;
15. compare the previous `main` to the new commit;
16. fresh-fetch `main` after the write;
17. update this document only after the behavior is accepted.

For SocialPlatform specifically, inspect `social-runtime.js`. Do not reconstruct its current behavior from older Social markup inside `index.html`.

For CommerceOps, inspect `commerce-integrated.js`; its current accepted copy and visual are runtime-defined.

For noCode/DCA final pacing, inspect `experience-pacing.js` after inspecting their base behavior in `index.html`.

For global readability, inspect both `typography-runtime.js` and `evidence-readability.js` before changing `index.html` typography or device geometry directly.

For the final interaction, inspect `outro-heatmap.js` before modifying the outro scene.

### Rollback principle

A design experiment should be easy to undo independently.

The accepted cross-scene pacing pass is a model for this:

- Commerce timing changed in a Commerce-only commit;
- Social timing changed in a Social-only commit;
- noCode/DCA pacing lives in a separate runtime;
- activation of that runtime is one loader change;
- documentation was updated only after the result was accepted.

Do not bundle unrelated scene experiments into one irreversible rewrite.

---

## 33. Final checklist

Before considering the portfolio faithful:

- Can each project be understood without opening GitHub?
- Can the main idea survive if tiny screenshot text cannot be read?
- Is there one dominant visual idea at a time?
- Does motion explain a relationship rather than decorate the scene?
- Does real evidence prove the claim without becoming an interpretation burden?
- Do state changes have a visible origin?
- Is important content readable at normal zoom and scroll speed?
- Are screenshot/device states given enough physical territory?
- Are focus transitions continuous rather than coarse?
- Does each important result receive a real comprehension hold?
- Do neighboring scenes have different dynamic intensity?
- Does CueSheet still work as decompression after SocialPlatform?
- Does DCA clearly transition from contribution reading into scanner mode?
- Does the final Social product remain long enough to feel like the payoff?
- Does mobile preserve the same thesis rather than shrink everything?
- Does reduced motion still tell the story?
- Are optional interactions discoverable without instructions?
- Does each project have its own motion language?
- Have rejected patterns stayed rejected?
- Has tuned bilingual copy remained untouched unless explicitly changed?
- Does the whole experience still feel directed rather than merely consistently animated?

If several answers are no, do not add more UI.

First ask whether the experience needs more hierarchy, more exposure time, or more silence.

---

## Closing principle

The strongest design improvements in this portfolio came from asking the visitor to do less work, not from adding more visual polish.

The recurring pattern is:

> **decide what matters now → reveal the relationship through motion → give authentic evidence enough territory → let the result settle → vary the energy of the next scene → remove anything that no longer earns its place.**

The final addition to that method is simple:

> **Silence is part of the motion system.**

That is the design pattern to preserve.