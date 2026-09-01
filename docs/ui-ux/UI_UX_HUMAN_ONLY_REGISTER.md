# UI/UX Human-Only Verification Register

Status: **normative companion to the verdict schema.**

Implements Method v1 §2 ("this method does not claim that aesthetic or perceptual
UX can be fully automated"), Stage 6 (perceptual review) and the Human
Verification Amendment.

## Purpose

Mechanical checks and detectors triage. This file records, explicitly, what they
**cannot** settle for this project — so that a clean automated run is never
mistaken for acceptance, and so a reviewer knows what they are specifically
responsible for looking at.

Two categories:

- **H — human-only classes:** judgements automation cannot make reliably at all.
- **W — website-only classes:** judgements that require the real deployed runtime,
  not a screenshot or an isolated harness.

## H — human-only perceptual classes

Each entry names why automation fails, so the list can be re-evaluated rather
than inherited on faith.

### H-1 Edge crowding without geometric clipping

Text that stops short of the viewport edge is geometrically legal and passes an
overflow check, yet can still read as cramped or accidental.

*Why automation fails:* the acceptable margin is a composition judgement, not a
threshold. A measured `right < viewportWidth` says nothing about whether the line
looks deliberately placed.

*Evidenced by:* the `b22da62` zh-TW reduced-motion outro title, which sat flush to
the right edge without ever triggering an overflow or clipping flag.

### H-2 Natural line breaking, per locale

Whether a wrap falls on a natural phrase boundary.

*Why automation fails:* requires reading comprehension in the target language.
Line-count and width geometry cannot distinguish a clean break from one that
splits a term.

*Evidenced by:* the zh-TW DCA title wrapping as `…檢查 AI / 工具`, splitting the
term `AI 工具` and leaving a two-character final line. Geometrically unremarkable;
wrong to a reader. Note the reciprocal risk: source-level `\n` is not evidence
either way, in either locale.

*Reviewer note:* EN and zh-TW get equal scrutiny. Neither is a fallback.

### H-3 Visual hierarchy and dominance

Whether the intended primary message is actually what the eye reaches first, and
whether supporting evidence stays subordinate.

*Why automation fails:* proxies (font size, opacity, area, contrast) can each be
satisfied while the composition still reads wrong.

### H-4 Whether a quiet interval reads as intentional

The accepted pacing includes deliberate rest. A still frame cannot distinguish
"intentional silence" from "nothing is happening yet".

*Why automation fails:* it is a temporal, comparative judgement about
expectation, not a property of one frame.

### H-5 Whether a kinetic checkpoint is a human-perceivable state

A deterministic frame can be captured at a phase that no viewer would ever
resolve during ordinary scrolling.

*Why automation fails:* the checkpoint resolver optimises a score. A high score
does not imply the state persists long enough to be seen.

*Boundary:* #9 (motion regression) owns temporal duration. This register owns the
question "is this frame worth freezing at all".

### H-6 Evidence legibility at normal viewing distance

Whether a product screenshot still reads as evidence rather than texture.

*Why automation fails:* a rendered-width floor is a usable proxy and is
implemented as a detector, but the real threshold depends on the content of the
screenshot. The proxy is triage, not a verdict.

*Evidenced by:* mobile SocialPlatform final phone rendering 92px wide from a
1081px source in the historical seven-scene mobile matrix.

## W — website-only classes

Per the Human Verification Amendment these cannot be satisfied by any capture,
harness, detector, or source reading — including everything in this run.

### W-1 Mobile perimeter-wave motion

Normal-motion mobile must make the wave motion perceptible during ordinary
observation, as one connected perimeter field with continuous hue transition and
edge-to-centre falloff.

*Why not automatable here:* `?uiux-test=1` deliberately freezes the field at a
fixed time for determinism. The frozen frame proves composition, never motion.
`requestAnimationFrame` activity alone is explicitly insufficient.

### W-2 Mobile copy entrance

Line-by-line materialisation through `mobileCopyLineIn`.

*Why not automatable here:* test mode applies `copy-static`, which settles the
copy immediately by design. The source-level regression test protects the
keyframes and delays; it cannot show the entrance.

*Real-device precedent:* the PR #43 investigation found no visible entrance on
iOS because OS-level Reduce Motion was enabled — correct accessibility behaviour,
not a defect. That was only discoverable on a real device.

### W-3 Presentation switching across the breakpoint

Crossing 760px triggers a reload and a change of presentation ownership.

*Why not automatable here:* each capture context is created at a fixed viewport,
so the transition itself is never exercised.

### W-4 Locale switching in situ

Switching EN ↔ zh-TW updates every translatable node, and on mobile replays the
copy entrance via `renderLines()`.

*Why not automatable here:* captures set the locale then navigate. The visible
transition is not observed.

### W-5 Scroll-driven pacing as experienced

Whether the cross-scene rhythm, including its quiet holds, works when scrolled by
a person rather than positioned by a normalised progress value.

### W-6 Interaction affordances

Focus-visible behaviour, that the outro heatmap does not block pointer events,
and that the GitHub links work from the real page.

## How to use this register

During freeze mode, every candidate carries a `review_proposal`. For any
candidate whose checkpoint touches a class above, the proposal must not be
recorded as `proposed_approved` on mechanical grounds alone.

`acceptance.status` may reach `approved` only after the W classes have been
covered on the actual website for the same `source_sha`, recorded in
`acceptance.website_verification`.

## Maintenance rule

An entry leaves this register only when a detector is implemented **and**
calibrated against blind human labels showing it decides that class reliably.
Removing an entry because it is inconvenient, or because a detector merely
exists, is forbidden.

Adding an entry requires only evidence that automation got it wrong.
