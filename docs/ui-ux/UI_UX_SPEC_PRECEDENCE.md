# UI/UX Specification Precedence

Status: **active normative index for UI/UX verification**

This document resolves conflicts created by the portfolio's design evolution without rewriting historical tickets or erasing earlier review evidence.

## Why this exists

The repository contains several documents produced at different stages of the UI/UX verification program. Some older mobile wording still describes the superseded first mobile fallback implementation, including:

- explicit `CTWalk / QA / SDET` micro-metadata;
- a generic or multi-colour ambient edge-light field;
- Canvas as the production rendering owner;
- screenshot/manual-review language written before the website-only human-verification hard gate.

Desktop design also evolved after the first acceptance contract. In particular, older material can treat source-level headline breaks as incidental and geometric copy/evidence overlap as automatically invalid. The current desktop direction instead uses approved semantic headline beats and controlled foreground-narration/evidence layering, with CueSheet as the canonical example.

Those statements are preserved as history, but they are no longer active requirements where they conflict with later accepted design decisions.

## Normative precedence

When two documents disagree, use this order for the affected subject:

1. `REUSABLE_UI_UX_VERIFICATION_METHOD_V1_HUMAN_VERIFICATION_AMENDMENT.md` — human-acceptance authority and website-level verification.
2. `../design/PORTFOLIO_SEMANTIC_COMPOSITION_AMENDMENT.md` — current desktop semantic headline, controlled-overlap, CueSheet layered-composition, and narration/evidence focus contract.
3. `UI_UX_MOBILE_FALLBACK_VISUAL_AMENDMENT.md` — current observable mobile fallback design and motion contract.
4. `UI_UX_ACCEPTANCE_CONTRACT.md` — global and desktop observable UX contract where not superseded by items 2–3.
5. `UI_UX_BASELINE_MANIFEST.md` — active checkpoint IDs, viewport/motion/locale matrix and baseline lifecycle where not superseded by items 1–3.
6. `UI_UX_TEST_CONTROL.md` and `UI_UX_BASELINE_CAPTURE.md` — operational harness/capture guidance. Implementation-owner wording in these files does not override the accepted visual contract.
7. Closed issues and historical baseline evidence — audit history only. They do not override later accepted product decisions.

The active mobile implementation must still satisfy the functional/runtime isolation contract even when visual details are superseded.

## Resolved desktop semantic-composition conflicts

### 1. Explicit English headline breaks

Superseded general wording may treat every source-level `\n` as only a wrapping hint.

Active rule:

- the currently approved English two-line project headlines use their hard break as a semantic/compositional beat;
- at ordinary desktop/laptop widths, the browser must not rebalance either authored line into an accidental third line;
- fit problems should be solved through composition before rewriting approved copy;
- the one-line outro intentionally remains a single thought.

### 2. Copy/evidence overlap

Superseded desktop wording may require primary copy and evidence to coexist with no geometric overlap.

Active rule:

- geometric overlap is not itself a regression;
- controlled overlap is valid when foreground narration remains readable, evidence remains recognizable, and the scene preserves one dominant thesis;
- human review judges perceptual competition, not rectangle intersection alone.

### 3. CueSheet layered composition

Active rule:

- CueSheet uses the historical Pass 2 layered composition with the primary desktop evidence at `min(64vw, 880px)` by `min(74vh, 710px)`;
- do not restore the later `53vw / 740px` evidence reduction or CueSheet-specific `390px` copy isolation as a generic anti-overlap fix;
- evidence focus remains one continuous, damped workspace → conflict → review move;
- supporting phone context yields while the headline stays as the stable interpretive anchor;
- the existing soft scene readability treatment is preferred over a hard card/blackout. Add a CueSheet-specific feather only if website-level human review demonstrates an actual readability failure.

## Resolved mobile conflicts

### 1. Identity / micro-context

Superseded wording:

> mobile must explicitly identify `CTWalk / QA / SDET` through small secondary copy or metadata.

Active rule:

- do not restore QA/SDET eyebrow copy, scene numbers, mode labels, footer metadata, or other desktop-style side context;
- the actual CTWalk GitHub profile avatar is the central identity focal point;
- the single `Open GitHub` / `查看 GitHub` affordance sits directly beneath the avatar;
- language controls remain functional UI, not decorative metadata.

The avatar + GitHub affordance satisfies the mobile identity/navigation role. Missing QA/SDET micro-copy is intentional, not a regression.

### 2. Mobile visual effect

Superseded wording:

> four separate coloured edge zones, a static luminous rim, generic ambient wash, or independently moving edge hotspots.

Active rule:

- the four physical viewport edges read as **one connected perimeter wave field**;
- the frame uses one coherent colour family at a time, with smooth global hue transition;
- energy travels as a stretched fluid wave crest rather than visible circular/globe hotspots;
- corners and edge contributions blend continuously with no diagonal/triangular partition seams;
- luminance is brightest at the physical edge and decays continuously toward a restrained dark center;
- normal-motion production viewing must make the wave motion perceptible during ordinary observation.

### 3. Rendering owner

Superseded wording in older #7/#12/capture material may refer to a production `Canvas edge-light`.

Active rule:

- WebGL is the normal production owner of the perimeter-wave effect;
- the blurred secondary canvas may spread WebGL energy inward but is subordinate to the shader;
- CSS is fallback-only when WebGL is unavailable;
- `?uiux-test=1` freezes the same WebGL effect at a deterministic time;
- `prefers-reduced-motion: reduce` freezes the same effect into a deterministic static state;
- no uncontrolled random particle system is allowed.

Operational code/API names may retain historical `canvas` terminology for compatibility. That naming does not redefine the rendering contract.

### 4. Typography / copy entrance

Active mobile rule:

- oversized desktop-first headline remains the primary message;
- the GitHub avatar/CTA pair fills the central composition;
- guidance copy remains comfortably readable rather than micro-copy;
- normal motion reveals headline and guidance line-by-line through restrained opacity/blur/small vertical travel;
- test mode and reduced motion show settled typography immediately.

### 5. Human acceptance

Active rule:

- automation, screenshots, isolated harnesses and source review provide engineering/mechanical evidence only;
- authoritative human UI/UX acceptance must occur on the actual website presentation for the candidate revision;
- the deployed website reviewed by the human must correspond to the source revision being proposed for freeze, and that revision relationship must be recorded;
- for normal-motion mobile, the reviewer must perceive the wave motion on the website; `requestAnimationFrame` activity alone is not sufficient;
- a screenshot may prove a deterministic checkpoint, but cannot by itself prove motion quality or final perceptual acceptance.

## Active mobile baseline scope

The mobile scope remains intentionally small:

```text
390×844

normal:
  mobile.fallback

reduced:
  mobile.fallback.reduced

locales:
  en
  zh-TW
```

This contributes 4 screenshots to the active 78-candidate matrix. Do not recreate the historical seven-scene mobile matrix.

### `mobile.fallback` must prove mechanically

- only the mobile fallback presentation is reachable;
- desktop project scenes/runtimes are not active behind it;
- correct locale and language control;
- oversized headline and accepted guidance copy;
- actual CTWalk GitHub avatar loads;
- `Open GitHub` / `查看 GitHub` navigation is present;
- deterministic test frame is available;
- no generated-image page substitute is used.

Normal-motion **human** review on the actual website additionally proves the accepted perimeter-wave motion, colour behaviour, edge-to-center falloff, typography entrance and overall hierarchy.

### `mobile.fallback.reduced` must prove

- same complete content/navigation/identity composition;
- no line-by-line entrance animation remains active;
- perimeter effect is frozen deterministically;
- readability and hierarchy remain complete without motion.

## Historical material

Do not rewrite or delete historical screenshots, old #6 review records, or closed #20/#18 decision history merely because the product direction evolved. Keep them traceable as evidence of earlier states.

For future execution, however, no historical statement may override the precedence rules above.
