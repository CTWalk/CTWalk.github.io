# Mobile Fallback Visual Amendment

Status: **normative amendment to #5 / #20 mobile fallback presentation**

This amendment records the post-deployment human review of the dedicated mobile fallback.

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

### Runtime constraints

- WebGL is the normal production owner of the effect.
- A static CSS treatment is allowed only when WebGL is unavailable.
- No `lil-gui` or tuning UI is shipped.
- No uncontrolled random particles are introduced.
- `?uiux-test=1` freezes the same shader at a deterministic time.
- `prefers-reduced-motion: reduce` freezes the same shader into a deterministic static state.
- The four-edge fluid wave remains the sole decorative mobile motion.

## Verification consequence

Future #6 human verification must happen on the actual deployed website.

Normal-motion acceptance requires all of the following to be perceptible during ordinary viewing:

1. the frame reads as one coherent colour family at a time;
2. energy travels around the perimeter as a wave rather than obvious moving globes;
3. no diagonal/triangular edge-partition seams are visible anywhere in the frame;
4. wave peaks visibly change edge thickness/intensity;
5. wave peaks may extend colour toward the center, but brightness must decay continuously from edge to center;
6. the center never becomes as bright as the edge and text readability remains intact;
7. the GitHub avatar and `Open GitHub` pair remain legible and visually centered.

A technically animated shader fails perceptual acceptance if it reads as static, as four simultaneous colour zones, as discrete balls rolling around the border, shows geometric diagonal seams, or washes the center to near-edge brightness.