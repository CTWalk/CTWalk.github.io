# Mobile Fallback Visual Amendment

Status: **normative amendment to #5 / #20 mobile fallback presentation**

This amendment records the post-deployment human review of the dedicated mobile fallback and supersedes the earlier micro-metadata styling assumptions.

## Accepted direction

At `<= 760px`, the fallback should contain only the minimum content needed to communicate the desktop-first decision:

- one oversized primary headline;
- one concise desktop-viewing guidance paragraph;
- functional EN / zh-TW language switching;
- the actual CTWalk GitHub profile avatar as the central visual focal point;
- one clear `Open GitHub` navigation affordance directly beneath the avatar.

Do **not** add small contextual or decorative copy simply to mimic the desktop portfolio language. In particular, the mobile fallback does not require:

- QA / SDET eyebrow copy;
- scene/index numbers;
- `DESKTOP / FULL EXPERIENCE` mode labels;
- CTWalk / QA / SDET footer metadata;
- other small asymmetric side-context.

Those elements belong to the desktop portfolio's information language and are intentionally absent from the mobile fallback.

The GitHub avatar is not a fabricated product image or generated visual. It is the repository owner's actual public GitHub profile asset and provides a deliberate center focal point without reintroducing desktop scene language.

## Composition

The intended hierarchy is:

```text
oversized desktop-first headline

        GitHub profile avatar
        Open GitHub ↗

concise desktop-viewing guidance
```

The center must not read as accidental empty space. The avatar/link pair should be visually centered and remain secondary to the headline while providing a clear identity/navigation anchor.

## Four-edge fluid-light requirement

The previous Canvas2D travelling hotspots / CSS luminous-rim implementation is superseded.

The mobile fallback now uses the supplied **Fluid Glow Bar** WebGL shader language as the authoritative effect. The original one-edge shader is adapted onto all four physical viewport edges by rotating/mirroring the local UV mapping while preserving its core behavior:

```text
wave fields
-> combined warp
-> blue / red / yellow / green weighted colour mix
-> height falloff
-> ambient glow
```

The production implementation must apply that same fluid language to:

- top edge;
- right edge;
- bottom edge;
- left edge.

Each edge may use a phase offset/orientation change so the four bands do not move as four mechanically synchronized copies. Corner overlap is acceptable when it reads as continuous fluid light around the viewport perimeter.

### Required visual characteristics

- fluid colour movement is visibly animated in normal-motion production mode;
- the effect reads as four fluid light bands attached to the physical viewport edges, not as a static border or generic radial background;
- the shader retains the supplied blue, red, yellow and green colour family unless a later human review explicitly changes it;
- a blurred secondary canvas may extend the light inward, matching the supplied CodePen's crisp-fluid + blurred-glow layering;
- the central reading field stays dark enough for the title, avatar, GitHub link and guidance to remain dominant;
- no `lil-gui` or tuning UI is shipped in production;
- no uncontrolled random particle system is introduced;
- the earlier CSS/Canvas2D rim effect must not remain layered on top of the WebGL shader;
- a static CSS edge treatment is allowed only as a WebGL-unavailable fallback, not as the normal production visual;
- `?uiux-test=1` freezes the shader at a deterministic time;
- `prefers-reduced-motion: reduce` freezes the same shader into a deterministic static state.

The four-edge fluid light remains the sole decorative motion of the mobile presentation. No desktop scene effect, portal/mock desktop object, generated image, screenshot substitute, or secondary animated object is required.

## Verification consequence

Future #6 mobile human verification must judge the actual deployed website against this composition.

In normal motion, the reviewer must be able to perceive fluid deformation / colour movement around the four physical edges during ordinary viewing. A result that looks like a static gradient, static border, or the previous hotspot/rim implementation is a failed perceptual result even if animation code is technically executing.

The GitHub avatar and `Open GitHub` pair must remain centered and must not be displaced by the edge effect.

The absence of the removed micro-context is intentional and must not be reported as missing content.