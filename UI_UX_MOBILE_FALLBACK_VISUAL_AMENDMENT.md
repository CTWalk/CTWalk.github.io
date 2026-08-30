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

The center must no longer read as accidental empty space. The avatar/link pair should be visually centered and remain secondary to the headline while providing a clear identity/navigation anchor.

## Edge-light requirement

The Hey-Siri-like treatment must read visibly as **animated light emitted around the physical viewport edge**, not as either a faint coloured background wash or a static decorative border.

Required characteristics:

- a clearly visible luminous rim on all four edges;
- warm orange/red emphasis along the upper edge;
- magenta/violet along the left edge;
- blue/cyan along the lower edge;
- cyan/green along the right edge;
- visible travelling hotspots / colour bloom along the rim in normal-motion production mode;
- motion must be perceivable within several seconds while remaining ambient rather than busy;
- broad colour bloom may extend inward, but the central reading field stays dark and calm;
- no random particle field;
- no static CSS layer may visually overpower the animated Canvas in normal-motion mode;
- `?uiux-test=1` freezes the Canvas at a deterministic time;
- `prefers-reduced-motion: reduce` freezes the effect into a deterministic static state.

The edge glow is the sole decorative motion of the mobile presentation. No desktop scene effect, portal/mock desktop object, generated image, screenshot substitute, or secondary animated object is required.

## Verification consequence

Future #6 mobile human verification should judge the actual deployed website against this composition.

In normal motion, a human reviewer must be able to observe the edge light changing position/intensity on the actual website without waiting an impractically long period. A rim that looks static during ordinary viewing is a failed perceptual result even if `requestAnimationFrame` is technically running.

The absence of the removed micro-context is intentional and must not be reported as missing content.