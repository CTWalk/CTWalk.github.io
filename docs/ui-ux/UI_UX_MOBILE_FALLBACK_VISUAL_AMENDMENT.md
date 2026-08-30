# Mobile Fallback Visual Amendment

Status: **normative amendment to #5 / #20 mobile fallback presentation**  
Specification precedence: `UI_UX_SPEC_PRECEDENCE.md`

This amendment records the post-deployment human review of the dedicated mobile fallback.

When older #5/#6/#7/#12/capture wording conflicts with this document on mobile identity, composition, motion, rendering ownership or human acceptance, follow `UI_UX_SPEC_PRECEDENCE.md` and this amendment. Historical wording remains audit context rather than an active requirement.

## Accepted direction

At `<= 760px`, the fallback contains only:

- one oversized primary headline;
- one concise desktop-viewing guidance paragraph;
- functional EN / zh-TW language switching;
- the actual CTWalk GitHub profile avatar as the central visual focal point;
- one clear `Open GitHub` navigation affordance directly beneath the avatar.

Desktop-style eyebrow copy, scene numbers, mode labels, footer metadata, and other small side-context remain intentionally absent.

## Composition

```text
oversized desktop-first headline

        GitHub profile avatar
        Open GitHub ↗

concise desktop-viewing guidance
```

The avatar/link pair fills the central compositional role without becoming a second headline.

## Perimeter fluid-wave requirement

The earlier multi-colour four-edge shader is superseded by a **single continuous perimeter wave field**.

The four physical viewport edges must read as one connected luminous system rather than four independent bars or four moving globes.

### Colour discipline

At any given moment the perimeter uses **one coherent colour family**. The dominant hue may transition over time, but blue/red/yellow/green must not appear simultaneously as four competing zones.

Allowed local colour variation is analogous/subtle: nearby hue shifts within the current family may follow the wave, but the whole frame must still read as one colour mood.

The global hue transition itself should be smooth and ambient, similar to the supplied human-reference recording where the whole perimeter changes family together.

### Wave motion

The travelling energy remains useful, but visible circular/globe silhouettes are not acceptable.

The motion must instead read as a **wave crest travelling around the perimeter**:

- the crest is stretched longitudinally along the edge;
- multiple low-frequency wave components deform its thickness and brightness;
- the viewer should perceive flowing/waving light, not a ball moving along a track;
- no discrete circular hotspot boundary should be obvious.

### Seamless edge blending

The four physical sides must not be assigned through hard nearest-edge regions.

Visible diagonal boundaries, triangular wedges, or corner-to-center seams are explicitly rejected. The shader must blend contributions from top/right/bottom/left continuously so corners transition as one fluid field.

A reviewer should never be able to infer the mathematical edge partition from the rendered image.

### Inward penetration and luminance falloff

The wave crest controls **how far** colour reaches toward the center, but not by keeping the whole reached region at the same brightness.

The required luminance relationship is:

```text
physical viewport edge = brightest
        ↓
wave body = progressively dimmer
        ↓
inward glow = soft and low-luminance
        ↓
center = only a restrained ambient tint
```

This falloff must be continuous. A crest may temporarily reach farther inward, but every additional distance from the physical edge must reduce luminance enough to preserve text readability.

The middle must therefore never become a flat, equally bright colour panel. The headline, GitHub avatar/CTA, and bottom guidance must retain clear contrast even when a strong wave passes behind them.

A low-resolution blurred secondary canvas may extend the wave energy inward, but it must remain subordinate to the crisp edge and may not erase the edge-to-center brightness gradient.

## Typography and entrance texture

The mobile copy should feel less compressed and more deliberate than the previous version.

Required characteristics:

- the English `Designed for desktop.` headline must not use aggressively tight tracking; character spacing should remain compact but visibly more open;
- the zh-TW headline should follow the same principle and avoid over-tight glyph spacing;
- the bottom-left guidance copy must be larger than the previous treatment and remain comfortably readable at the primary `390×844` mobile target;
- headline and guidance copy should enter **line by line** in normal motion;
- each line should begin dim and slightly soft, then resolve into its final sharp state;
- the entrance should use restrained opacity / blur / small vertical travel rather than bounce, scaling, or flashy easing;
- the copy entrance is a texture layer only and must not compete with the perimeter wave as the primary decorative motion;
- language switching may replay the line entrance because the rendered copy is replaced;
- `?uiux-test=1` and `prefers-reduced-motion: reduce` must bypass the entrance animation and show the settled final typography immediately.

The animation should feel like copy materializing through low light, not text flying onto the screen.

### Runtime constraints

- WebGL is the normal production owner of the effect.
- A static CSS treatment is allowed only when WebGL is unavailable.
- No `lil-gui` or tuning UI is shipped.
- No uncontrolled random particles are introduced.
- `?uiux-test=1` freezes the same shader at a deterministic time.
- `prefers-reduced-motion: reduce` freezes the same shader into a deterministic static state.
- The four-edge fluid wave remains the sole decorative mobile motion; copy entrance is limited to presentation texture and settles quickly.

## Verification consequence

Future #6 human verification must happen on the actual deployed website.

Normal-motion acceptance requires all of the following to be perceptible during ordinary viewing:

1. the frame reads as one coherent colour family at a time;
2. energy travels around the perimeter as a wave rather than obvious moving globes;
3. no diagonal/triangular edge-partition seams are visible anywhere in the frame;
4. wave peaks visibly change edge thickness/intensity;
5. wave peaks may extend colour toward the center, but brightness must decay continuously from edge to center;
6. the center never becomes as bright as the edge and text readability remains intact;
7. the GitHub avatar and `Open GitHub` pair remain legible and visually centered;
8. headline tracking no longer reads as cramped;
9. bottom guidance is comfortably readable without appearing like secondary micro-copy;
10. headline and guidance reveal line-by-line with a dim/soft entrance and settle cleanly without competing with the wave.

A technically animated shader fails perceptual acceptance if it reads as static, as four simultaneous colour zones, as discrete balls rolling around the border, shows geometric diagonal seams, or washes the center to near-edge brightness. The typography also fails if tracking remains cramped, guidance remains undersized, or the entrance feels abrupt/flashy rather than restrained.
