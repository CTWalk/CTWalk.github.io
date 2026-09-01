# Run log — `b22da62` evidence run

Chronological record of what was executed. Reproducible from a clean clone of
the candidate revision.

## 0. Source verification

```bash
git fetch origin --prune
git rev-parse origin/main            # b22da62f824c4903320a07af4311785c4f915b4b
git status --porcelain               # empty
```

Plan shape was verified to resolve to the declared matrix before capture, rather
than trusting the documentation:

```text
normal  desktop   22 checkpoints
normal  laptop     8
normal  mobile     1   (mobile.fallback)
reduce  desktop    7
reduce  mobile     1   (mobile.fallback.reduced)
                  ---
                   39 cells x 2 locales = 78 candidates
```

## 1. Dependency install

```bash
npm install --package-lock=false --no-audit --no-fund
```

Required: no `node_modules` in a fresh clone. Worktree remained clean
(`node_modules/` is gitignored). Playwright resolved to the pinned 1.55.0.

## 2. Browser acquisition

```bash
npx playwright install chromium      # stalled during extraction; see ENVIRONMENT.md
```

Fell back to cache build `chromium-1208` via the documented
`BASELINE_BROWSER_EXECUTABLE` override.

## 3. Capture — the repository's own harness, unmodified

```bash
BASELINE_BROWSER_EXECUTABLE="<chromium-1208 executable>" \
BASELINE_OUTPUT_DIR=<candidates>/cand-b22da62 \
BASELINE_PORT=4173 \
npm run uiux:capture
```

Output:

```text
Captured 78 candidate screenshots from b22da62f824c4903320a07af4311785c4f915b4b.
Records with runtime warnings: 44.
```

Post-conditions verified from `evidence/capture-metadata.json`:

| Check | Result |
| --- | --- |
| Records | 78 |
| Cell distribution | desktop-normal 44, laptop 16, desktop-reduce 14, mobile-normal 2, mobile-reduce 2 |
| Locale → `html.lang` | `en`→`en` (39), `zh-TW`→`zh-Hant-TW` (39) |
| Settle failures | 0 |
| Asset failures | 0 |
| Console errors | one distinct message on 44 records (see FINDINGS_SO_FAR.md) |
| Worktree after capture | clean |

Note the shape of that output: the capture command reports counts and warnings.
It emits no pass/fail verdict, by design.

## 4. Mechanical audit — `tools/audit78.mjs`

External to the repository. Walks the same plan, calls only the documented #7 /
mobile semantic API, and collects facts rather than judgements: presentation
mode, `html.lang`, document title, horizontal overflow, rendered line geometry
via `Range.getClientRects()`, per-image load state, copy/evidence overlap
ratios, commerce word-vs-phone opacity pairing, nocode step emphasis index, and
the full mobile fallback assertion set.

Output: `evidence/audit78.json` (78 rows + 5 per-context rows).

## 5. Repeatability and path-independence — `tools/repeat78.mjs`

13 checkpoints, each captured twice in **completely fresh browser contexts**
(full teardown between passes, not a re-navigation), plus three Outro navigation
paths:

- Path A: fresh context → `outro.settled`
- Path B: fresh context → `social.final-phone` → `outro.settled`
- Path C: fresh context → `outro.settled` → `commerce.final-settled` → `outro.settled`

Byte hashes compared first; where bytes differed, a canvas-based pixel diff
reported differing-pixel count, percentage, max channel delta and bounding
region. No tolerance was assumed in advance.

Output: `evidence/repeatability.json`, `evidence/repeatability-stdout.txt`.

## 6. Follow-up probe — `tools/laptopintro.mjs`

Written to answer one question raised by step 5: is the intro instability
viewport-specific or general? Confirmed at 1280x800 as well.

## 7. Visual review — incomplete at time of bundling

22 of 78 candidates reviewed by eye. Deliberately **not** recorded as a verdict
set; see `README.md`. Remaining work is a stratified blind-label pass followed by
detector calibration, per `OPEN_QUESTIONS.md`.

## Cost observation for the skill

Steps 1–6 are cheap and produce durable machine-readable evidence. Step 7 is by
far the most expensive part of the work and does not scale linearly with value:
in both runs the defects found by eye clustered in a small number of predictable
surfaces (reduced motion, the narrower viewport, the non-Latin locale).

This asymmetry is the practical argument for the triage protocol the skill should
encode — and for doing the blind labelling **before** looking at detector output,
so the labels stay usable as a calibration target.
