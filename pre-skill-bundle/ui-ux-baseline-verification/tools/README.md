# Throwaway probes

Written **outside** the repository during the `b22da62` run and copied here as
skill material. They are not part of the product's capture tooling and were never
placed in `scripts/` — modifying or adding repo tooling mid-run would change the
source revision the evidence is recorded against.

All four call only the documented semantic APIs (`window.__portfolioTest`) and
navigate exclusively by checkpoint ID. None uses page-level scroll pixels.

| Probe | Written to answer |
| --- | --- |
| `audit78.mjs` | For all 78 cells: correct presentation/locale/viewport/scene, overflow, rendered line geometry, image load state, copy/evidence overlap, commerce word-vs-phone pairing, nocode emphasis index, and the full mobile fallback assertion set. Collects **facts**, makes no judgements. |
| `repeat78.mjs` | Is a checkpoint reproducible in a completely fresh browser context, and is `outro.settled` independent of navigation path (A/B/C)? Compares bytes first, then pixels with count / % / max channel delta / bounding region. Assumes no tolerance. |
| `laptopintro.mjs` | Follow-up to one `repeat78` result: is the intro instability viewport-specific or general? (General — reproduced at 1280x800.) |
| `imgdiff.mjs` | Standalone pixel diff of two PNGs, using the browser's own canvas so no image library is needed. |

## Reusable ideas, independent of this product

- **Diff via the browser's canvas.** A Playwright page is already available;
  `getImageData` gives exact pixel comparison with zero extra dependencies.
- **Fresh-context repeatability.** Re-navigating within one context hides
  state that accumulates in the page. Tear the context down between passes.
- **Path-independence as a separate probe.** Same-way-twice repeatability
  cannot detect visit-history dependence. Reaching the same checkpoint by
  different routes is what caught the Outro defect on the previous revision.
- **Facts and judgements in separate passes.** `audit78.mjs` emits only
  measurements; verdicts are applied later. This keeps the evidence reusable
  when the acceptance rules change.

## What to fix before reuse

`audit78.mjs` derives scene identity from the checkpoint ID via the control's
`sceneIds` map. Its ancestor did not — it picked the highest-opacity scene, which
under `prefers-reduced-motion` is always the first scene, so it reported
confident wrong facts for every reduced-motion cell. See `OPEN_QUESTIONS.md` §7.
