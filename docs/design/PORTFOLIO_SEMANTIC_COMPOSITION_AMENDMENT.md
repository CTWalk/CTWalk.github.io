# Portfolio Semantic Composition Amendment

Status: **active normative amendment**  
Applies to: desktop interactive presentation (`> 760px`)  
Amends: `PORTFOLIO_DESIGN_METHOD.md` and the desktop portions of `UI_UX_ACCEPTANCE_CONTRACT.md`

This amendment records the accepted relationship between headline composition, foreground narration, product evidence, and motion. It exists because older acceptance material treated geometric copy/evidence overlap as a defect, while the earlier CueSheet evidence-focus solution and the current editorial direction intentionally use controlled layering.

Where this amendment conflicts with older desktop wording, this amendment wins.

---

## 1. Headline line breaks are semantic composition beats

An explicitly approved English headline break is not merely a wrapping preference. It defines two authored reading beats inside one visual thesis.

Examples:

```text
I test software
From UI to DB

One flow
Checked all the way through

Readable tests
Maintainable locators

One release path
Evidence at every layer

Replan the rehearsal
Keep it stable

Same QA questions
Newer kind of system
```

The first line establishes an object, action, or proposition. The second line completes, proves, narrows, or constrains it.

Therefore, at normal desktop/laptop widths:

- preserve the authored break;
- keep each authored line visually intact rather than allowing automatic balancing to create an accidental third beat;
- treat the two lines as one typographic composition, not two independent labels;
- solve fit through layout/territory before rewriting approved copy;
- only relax this rule at a deliberately designed constrained-width breakpoint.

The one-line outro remains intentionally different:

```text
More of my work is on GitHub
```

Its single thought is the release after the repeated two-beat project rhythm.

---

## 2. Copy and evidence may share the same visual field

Geometric intersection is not automatically visual competition.

The relevant acceptance question is perceptual:

> Can the viewer read the thesis while still recognizing the evidence state and understanding which object is dominant now?

Controlled overlap is allowed when:

- copy behaves as foreground editorial narration;
- authentic product/evidence remains recognizable and sufficiently exposed;
- the overlap helps the scene feel like one composition rather than a screenshot card plus caption;
- hierarchy is created through scale, contrast, depth, motion, and yielding context rather than by forcing every layer into separate rectangular ownership.

Reject overlap only when it materially harms reading, evidence recognition, or one-thesis hierarchy.

This supersedes the older blanket desktop rule that primary copy and evidence must never overlap.

---

## 3. CueSheet is the canonical layered-composition example

CueSheet's accepted visual thesis remains:

> availability changes -> replan -> preserve as much of the existing schedule as possible

Its accepted desktop composition is the earlier Pass 2 evidence-focus solution:

```css
.scene[data-scene="4"] .cuesheet-desktop {
  left: max(1vw, calc((100% - var(--content))/2));
  top: 6.5%;
  width: min(64vw, 880px);
  height: min(74vh, 710px);
  transform-origin: 42% 46%;
}
```

Do **not** restore the later `53vw / 740px` evidence reduction or the CueSheet-specific `390px` copy-column isolation merely to prevent geometric overlap.

The larger evidence surface is intentional. The narration and product are allowed to occupy the same visual field.

---

## 4. CueSheet attention transfer is motion hierarchy, not copy removal

The accepted CueSheet progression is:

```text
workspace
-> conflict
-> review
-> long observational final state
```

One continuous camera/focus move spans these states. The viewer should not perceive a reset between conflict and review.

During that progression:

- the primary desktop evidence gradually gains scale and a small amount of brightness;
- the two supporting phone captures gradually yield through scale, brightness, and saturation;
- the headline remains the stable interpretive anchor;
- do not introduce separate conflict/review zoom pulses;
- do not fade the headline merely to make the screenshot feel dominant;
- do not add another final phone or synthetic solver/evidence layer.

This is the intended interaction between relatively static narration and moving evidence: the meaning stays stable while the viewer's attention migrates through the product state.

---

## 5. Readability treatment should support layering, not erase it

The default scene readability treatment may continue to use the existing soft shadow/radial falloff behind copy.

For CueSheet, do not add a hard panel, opaque card, rectangular blackout, or aggressive gradient solely because narration overlaps the product evidence.

If human review shows a genuine readability failure after the historical layered composition is restored, prefer the smallest local correction:

1. a subtle feathered falloff behind the copy;
2. a minor local contrast adjustment;
3. a small positional/territory correction that preserves the layered relationship.

Do not immediately shrink the evidence or isolate the copy into a narrow protected column.

The goal is a balance where the copy feels embedded in the scene while the product remains the evidence-bearing surface.

---

## 6. Current accepted English headline set

```text
Intro
I test software
From UI to DB

CommerceOps
One flow
Checked all the way through

noCodeE2E
Readable tests
Maintainable locators

SocialPlatform
One release path
Evidence at every layer

CueSheet
Replan the rehearsal
Keep it stable

Decision Contract Audit / Recently
Same QA questions
Newer kind of system

Outro
More of my work is on GitHub
```

Older English headline examples in historical design/review material remain audit history only. They must not be used as the current layout source of truth.

---

## 7. Regression guards

A future change fails this amendment if it:

- collapses an approved semantic break through `text-wrap: balance` or normal whitespace handling;
- creates an unintended third headline line at ordinary desktop/laptop widths;
- treats all copy/evidence geometric overlap as a defect without a perceptual failure;
- restores CueSheet's `390px` isolated copy column or `53vw / 740px` evidence geometry as a generic readability fix;
- replaces CueSheet's continuous monotonic focus transfer with separate pulses;
- removes the stable headline in order to create product focus;
- adds a hard readability panel that visually turns the narration into a card;
- changes mobile fallback ownership while solving this desktop composition problem.

The final authority remains human review on the actual desktop website: verify the authored headline beats, CueSheet layered composition, evidence recognition, and calm transition from SocialPlatform as one continuous experience.
