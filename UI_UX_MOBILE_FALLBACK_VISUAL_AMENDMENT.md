# Mobile Fallback Visual Amendment

Status: **normative amendment to #5 / #20 mobile fallback presentation**

This amendment records the post-deployment human review of the dedicated mobile fallback and supersedes the earlier micro-metadata styling assumptions.

## Accepted direction

At `<= 760px`, the fallback should contain only the minimum content needed to communicate the desktop-first decision:

- one oversized primary headline;
- one concise desktop-viewing guidance paragraph;
- functional EN / zh-TW language switching;
- one clear GitHub navigation affordance.

Do **not** add small contextual or decorative copy simply to mimic the desktop portfolio language. In particular, the mobile fallback does not require:

- QA / SDET eyebrow copy;
- scene/index numbers;
- `DESKTOP / FULL EXPERIENCE` mode labels;
- CTWalk / QA / SDET footer metadata;
- other small asymmetric side-context.

Those elements belong to the desktop portfolio's information language and are intentionally absent from the mobile fallback.

This amendment supersedes the earlier #5 G-07 requirement that the fallback itself explicitly identify `CTWalk / QA / SDET` through secondary metadata. The GitHub affordance and actual site context remain sufficient; the fallback's primary job is to communicate the desktop-first viewing decision.

## Edge-light requirement

The Hey-Siri-like treatment must read visibly as **light emitted around the physical viewport edge**, not merely as a faint coloured background wash.

Required characteristics:

- a clearly visible luminous rim on all four edges;
- warm orange/red emphasis along the upper edge;
- magenta/violet along the left edge;
- blue/cyan along the lower edge;
- cyan/green along the right edge;
- broad colour bloom may extend inward, but the central reading field stays dark and calm;
- motion remains slow and ambient;
- no random particle field;
- `?uiux-test=1` and reduced motion remain deterministic.

The edge glow is the sole visual effect of the mobile presentation. No desktop scene effect, portal/mock desktop object, generated image, screenshot substitute, or secondary animated object is required.

## Verification consequence

Future #6 mobile human verification should judge the actual deployed website against this simplified composition. The absence of the removed micro-context is intentional and must not be reported as missing content.