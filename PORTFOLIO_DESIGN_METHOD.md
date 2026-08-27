# Portfolio Design Method

This document records the design method I arrived at while building and repeatedly revising this portfolio.

It is not a collection of visual tricks. It is a record of the decisions that survived iteration: what made the work easier to understand, what made the page feel fragmented, what kinds of motion helped, and what I removed when the design became too clever for its own good.

The central problem was simple:

> A portfolio visitor should understand what I can do before they need to inspect a repository.

Everything else came from trying to solve that well.

---

## 1. Background: what this site needed to communicate

My strongest identity is QA / SDET and software quality engineering. Product engineering supports that story. AI / LLM reliability is a newer adjacent area, not the main identity.

That created an unusual portfolio problem.

A normal project grid can show repository names, screenshots, tags, and descriptions, but that format does not explain how I think as a QA engineer. A repository thumbnail does not naturally communicate things like:

- a browser result being checked against an API and database,
- a test definition being separated from locator maintenance,
- a failed release check being traced to the real source,
- a scheduler preserving most of an existing plan while repairing a conflict,
- or a contribution history showing repeated investigation of edge cases and false success states.

The site therefore needed to do more than display projects. It needed to **show the reasoning inside the projects**.

At the same time, I did not want the page to become a dashboard, an infographic collection, or a wall of technical labels. The visitor should not have to study the interface before understanding the work.

That tension shaped the entire design.

---

## 2. The first important realization: a project is not a card

I stopped treating each repository as a card with four independent parts:

1. repository name,
2. screenshot,
3. description,
4. link.

Those pieces can all be correct and still fail together.

The better mental model became:

> **Each repository is one self-contained explanation scene.**

The image, words, and motion should not sit beside each other as separate content types. They should cooperate to explain one idea.

The target relationship is:

> I see the visual → the title tells me what I am looking at → the short text tells me why it exists → the motion reveals the part that is difficult to show statically.

If the repository name and GitHub link disappeared, the scene should still communicate most of the project.

My practical test became:

> **After looking at a scene for about five seconds, can someone explain the repository in one or two sentences?**

If not, the scene is not finished.

---

## 3. One scene, one visual thesis

The most useful constraint I found is:

> **One scene, one visual thesis.**

At any moment I try to keep only:

1. one dominant visual,
2. one headline,
3. one short supporting sentence.

This does not mean the project itself is simple. It means the interface should decide which part deserves attention now.

A lot of early complexity came from putting several correct ideas on screen at the same time: multiple badges, several cards, screenshots plus diagrams plus labels, or a collection of checkpoints that all demanded equal attention.

The result was technically informative but visually expensive. The eye had to travel too much.

The fix was not better spacing. The fix was **sequencing**.

Instead of explaining more things simultaneously, I use motion to decide what becomes visible next.

---

## 4. Motion reveals the second piece of information

This became the core motion rule for the site:

> **Motion reveals the second piece of information instead of putting both pieces on screen.**

A useful motion should answer a question the static composition cannot.

Examples:

- Which YAML step is executing now?
- What changed between a valid schedule and a conflict state?
- What evidence sits behind a release check?
- How does one technical checkpoint lead to the next?
- Which contribution is being examined before the final audit result?

This is different from using motion to make the page feel alive.

If an animation can be removed without losing meaning, it is probably decoration.

If removing it makes the relationship between two states harder to understand, the motion is doing useful work.

---

## 5. Motion should make something happen, not just change opacity

One of the most important improvements came from changing how I thought about scroll.

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

The scroll position is still controlling progress, but the viewer experiences **an action with meaning**, not a slider.

This distinction matters because a portfolio scene should feel like a small explanation, not a carousel.

---

## 6. The evidence hierarchy: explanation first, proof second

I initially leaned too heavily on real screenshots.

Real material is valuable because it proves the work exists. But a screenshot is often a terrible explanation surface. Dense CI pages, terminal logs, long reports, and application screens contain too much information for someone scrolling through a portfolio.

That led to a rule that now guides the evidence-heavy sections:

> **The motion and simplified visual explain. The screenshot proves.**

A visitor should not need to read tiny text inside an image to understand the point.

The preferred sequence is:

1. make the concept recognizable,
2. show the mechanism,
3. bring in the real evidence,
4. enlarge only the result that matters,
5. hold long enough to read it.

The screenshot becomes evidence after the user already knows what it is evidence *of*.

This solved a recurring problem where the page technically contained strong proof but the proof was too dense to decode during scroll.

---

## 7. Real evidence is still important

Simplifying the explanation does **not** mean replacing real material with fake diagrams.

The distinction I use is:

- simplified SVG / motion = interpretation,
- real screenshot / report / execution output = proof.

I avoid rebuilding a fake version of a GitHub job, test report, scheduler, or product screen just to make it prettier.

When possible, the real artifact stays visible and the animation changes what the viewer notices about it.

When the real artifact is too dense, a simplified semantic state appears first, followed by the real artifact.

The goal is to keep credibility without forcing the visitor to perform the analysis themselves.

---

## 8. Do not add an explanation layer when the existing object can become the explanation

A repeated failure mode was adding another component on top of an already complicated scene:

- a screenshot,
- then a badge explaining the screenshot,
- then a connector explaining the badge,
- then another status card confirming the connector.

Every added explanation created another thing the eye had to parse.

A better question became:

> **Can the thing already on screen change state instead?**

Examples:

- The YAML itself can highlight `open`, then `fill`, then `click`.
- The browser outline can contain six checks instead of showing a separate “Web E2E” dashboard.
- The real scheduler screenshots can become successive states of one surface rather than three cards.
- A release line can turn into the checkpoint symbol instead of displaying both permanently.

This is one of the most useful simplification patterns in the site.

---

## 9. Stable reading zones are part of the animation

Continuous motion feels impressive for a few seconds and exhausting after that.

I found that important evidence needs an actual **stop**.

Not “moving more slowly.”

A real hold.

The rhythm becomes:

> transition → arrive → stop → read → transition again.

Those stable zones make the surrounding motion feel more intentional. They also make technical material much easier to understand because the eye is not trying to track movement and read evidence at the same time.

The hold is therefore part of the choreography, not dead time.

---

## 10. Different ideas deserve different motion languages

Consistency does not mean every project should animate the same way.

I tried repeating the same “open evidence → close evidence” pattern too literally. It quickly became mechanical.

A better rule is:

> **Keep the same visual discipline, but let the motion match the mechanism being explained.**

That produced different patterns for different projects.

### noCodeE2E

The important thing is execution order.

The YAML remains the primary visual. Scroll reveals the steps sequentially:

> `open` → `fill` → `click` → Playwright passed.

The motion explains how a readable test definition becomes execution without adding another diagram.

### CueSheet

The important thing is state change and minimal disruption.

Real screenshots act as states of the same product:

> production workspace → conflict state → schedule review.

I removed fake solver graphics and synthetic schedule blocks because the real product states already explain the story better.

### SocialPlatform

The important thing is a release moving through meaningful checks and reaching a delivered product state.

The scene evolved away from screenshot slides into semantic motion:

> product → release path → database integrity → Web E2E → delivered → real product screen.

The database symbol assembles from the flow. The browser checks resolve one by one. The delivered state becomes a clear outcome before the final product screenshot fades in.

A mobile-layout sub-story was eventually removed because it was valid evidence but not necessary to the visual thesis. This is an important example of editing by subtraction: a technically relevant step can still be too much for the scene.

### Decision Contract Audit

The important thing is repeated investigation and contribution history, not a decorative code sample.

The contribution rows carry the evidence. Focus moves through them, and the scene resolves to a centered audit PASS state.

The final result is deliberately simple because the contribution history is the interesting part; the PASS is the conclusion.

### CommerceOps

The useful direction is not “five testing features.”

The stronger story is one transaction followed across multiple system boundaries:

> browser → API → database → webhook → notification.

That turns a list of testing capabilities into one coherent QA action.

---

## 11. Continuity matters more than transition spectacle

A scene feels integrated when the viewer can tell **where the next thing came from**.

It feels disconnected when something simply appears from a visually unrelated direction.

This became especially obvious near the SocialPlatform ending. A final screenshot entering from the right was logically correct but spatially wrong. The viewer had just followed a release line, so the final state needed to feel connected to that line.

The broader rule is:

> **The geometry of the motion should agree with the logic of the story.**

If a result comes from a checkpoint, its movement should originate from that checkpoint.

If a conflict grows out of an existing schedule, the visual should transform from the schedule rather than cut to a separate card.

If a test step leads to a pass result, the result should resolve from the execution sequence, not from an unrelated corner of the frame.

Continuity is not only aesthetic. It is explanatory.

---

## 12. Endings need an outcome, not just the final technical step

Another pattern that emerged is that the last technical check is not always the end of the story.

A QA flow often has a final semantic question:

> **So what? Can this version move forward?**

That is why a release-oriented scene benefits from a final outcome state such as sign-off or delivered.

The structure becomes:

> checks → decision → product outcome.

This is stronger than ending immediately after the last test result.

The ending also needs time to land. Once the outcome is visible, I prefer a stable hold before the next project begins.

A scene should finish its sentence before the next scene starts speaking.

---

## 13. Editing by subtraction

A large part of the design process was removing things that were individually reasonable.

Things I removed or rejected included:

- whole explanatory sections that repeated what project scenes already showed,
- floating cue badges after the underlying visual became understandable,
- duplicate screenshots,
- fake solver diagrams,
- permanent checkpoint cards,
- synthetic pass indicators when real evidence was already sufficient,
- mobile product frames that did not fit the composition,
- mobile E2E material when it made the SocialPlatform story too long,
- and motion that existed only because the page could animate it.

This led to a practical rule:

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

One important process rule is that I do not rewrite the portfolio copy every time a visual treatment fails.

If the title and supporting sentence already communicate the right idea, changing the words can hide the real problem.

A weak scene is often weak because:

- the visual hierarchy is wrong,
- the screenshot is too dense,
- the motion has no semantic job,
- too many things are visible at once,
- or the transition breaks continuity.

The solution should be visual when the problem is visual.

This also protects personally tuned wording, especially in the bilingual version of the site.

---

## 16. Bilingual design is a layout problem, not only a translation problem

English and Traditional Chinese do not occupy space the same way.

I treat the Chinese version as its own reading layout rather than forcing it into English line lengths.

Important considerations include:

- preserving intentional line breaks,
- avoiding compressed character spacing,
- allowing natural Chinese line height,
- preventing awkward word wrapping,
- keeping technical terms only where they are actually useful,
- and making the Chinese copy sound natural rather than mechanically equivalent to the English sentence.

The visual scene should survive both languages without changing its basic hierarchy.

If a layout only works in English, it is not finished.

---

## 17. The visual budget

I use a rough visual budget for every project scene.

Before adding something, I ask:

1. Is this the dominant visual, or is it competing with it?
2. Does it explain a relationship that is currently unclear?
3. Can the existing object change state instead?
4. Will the user have to move their eyes somewhere new to understand it?
5. Does it remain useful after the first second?
6. Is it still needed once the motion is working?

This prevents the page from gradually accumulating permanent badges, labels, rails, cards, and status marks.

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

## 19. A reusable scene-building process

The process I now use for a new project scene is:

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

The interaction design is easier to iterate when the implementation is also easy to undo.

For this site I prefer:

- isolated scene controllers for larger motion experiments,
- explicit scroll phases instead of many unrelated opacity equations,
- stable hold ranges inside the timeline,
- real assets referenced directly rather than reconstructed evidence,
- SVG for simple semantic shapes,
- restrained use of filters and blur,
- reduced-motion fallbacks that show a meaningful final state,
- and isolated commits for experiments so a bad direction can be rolled back cleanly.

I also avoid changing unrelated scenes while testing one project. A portfolio is an interconnected experience; uncontrolled global changes make it difficult to tell whether an improvement actually worked.

---

## 21. The pattern in one sentence

If I reduce the whole method to one line, it is this:

> **Show one idea, use motion to reveal the relationship, use real material to prove it, then stop long enough for the result to land.**

A slightly more operational version is:

> **Concept → motion → evidence → outcome.**

The important part is that these are not four boxes on screen.

They are four responsibilities distributed across one continuous scene.

---

## 22. Final checklist

Before I consider a portfolio scene finished, I ask:

- Can the project be understood without opening GitHub?
- Can the main idea be understood without reading tiny text inside a screenshot?
- Is there only one dominant visual idea at a time?
- Does the motion explain something rather than decorate something?
- Does the evidence prove the claim without becoming the explanation burden?
- Do state changes have a visible origin?
- Are there real reading holds?
- Is the ending an outcome rather than an arbitrary cutoff?
- Can any label, badge, screenshot, or animation still be removed?
- Does the scene work in both English and Traditional Chinese?
- Does it still feel like the same portfolio as the scenes before and after it?

If several answers are no, I do not add more components.

I simplify the sequence until the relationship becomes obvious.

---

## Closing note

The most useful design decisions on this site did not come from adding more polish. They came from recognizing where the visitor was being asked to do too much interpretation.

The recurring solution was to make the page carry more of that burden itself:

- decide what matters now,
- reveal the next idea through motion,
- show real proof only after the meaning is clear,
- and remove anything that no longer earns its place.

That is the design pattern I want to keep using as the portfolio evolves.
