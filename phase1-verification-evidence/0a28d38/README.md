# Phase 1 verification evidence — candidate `0a28d38`

Status: **evidence, not baseline. Nothing here is approved.**
**Quarantined from the #48 Phase A blind reviewer** — these files enumerate checkpoint
identifiers. See `ui-ux-golden-path-discovery/PHASE_A_CONTAMINATION_CONTROL.md`.

Committed so that the load-bearing claims in `ui-ux-golden-path-discovery/HANDOFF.md`
are verifiable and re-runnable by a later session, rather than asserted from a
conversation that has ended.

## Source

| | |
| --- | --- |
| Candidate SHA | `0a28d383d5fa7e7ef558311e817e018f2b528e21` |
| Parent chain | `f40e365` → `3e888aa` (intro WebGL freeze) → `0a28d38` (reduced-motion centering) |
| Worktree at capture | clean |
| Browser | Chromium 145.0.7632.6, ms-playwright `chromium-1208`, headless |
| Playwright | 1.55.0 (repo pin) |
| Deviation | pinned `chromium-1187` fails to extract on this host; supplied `chromium-1208` via `BASELINE_BROWSER_EXECUTABLE`. Any pixel comparison must pin the same executable or re-baseline. |
| OS / DSF | macOS 15.7.4 arm64 / 1 |

## Files

| File | What it evidences |
| --- | --- |
| `capture-metadata.json` | 78/78 candidates captured; per-candidate provenance, settle result, asset status, checkpoint resolution |
| `mechanical-audit.json` | 78 rows + 5 per-context rows: locale→`html.lang`, overflow, rendered line geometry, image load state, copy/evidence overlap, scenario pairing, step emphasis, mobile fallback assertions, per-context image-request counts |
| `determinism-sweep.json` | 19 same-route checkpoints × 2 fresh-context passes, plus 3 alternate-route path comparisons |

## Claims this evidence supports

Each is checkable against the files, not taken on trust.

| Claim | Where |
| --- | --- |
| **22/22 comparisons byte-identical**; no tolerance invoked, no masks | `determinism-sweep.json` |
| 78/78 captured, 0 settle failures, 0 asset-gate failures | `capture-metadata.json` |
| Locale mapping: 39 `en`→`en`, 39 `zh-TW`→`zh-Hant-TW` | both |
| 0 horizontal overflow, 0 broken images, **0 clipped title/body lines** (was 4 pre-fix) | `mechanical-audit.json` |
| 16/16 commerce scenario pairings correct | `mechanical-audit.json` |
| Middle-step emphasis resolves to index 1 of 3 | `mechanical-audit.json` |
| Mobile isolation: **24 image requests desktop/laptop vs 1 mobile** | `mechanical-audit.json` per-context rows |
| Only console error is `/favicon.ico` 404 on desktop-normal contexts | both |

## Not committed, deliberately

**The 78 candidate PNGs (~29 MB).** They are capture output with
`acceptance.status: pending_authority`, not approved baselines. Committing them into the
repository would blur the line the verdict schema exists to hold, and `baseline-candidates/`
is gitignored for that reason.

Reproduce them with:

```bash
BASELINE_BROWSER_EXECUTABLE="<chromium-1208 executable>" \
BASELINE_OUTPUT_DIR=<somewhere outside the repo> \
npm run uiux:capture
```

## `tools/`

The probe scripts that produced the evidence, in their **corrected** form. They live
outside `scripts/` because they are research probes, not part of the product's supported
capture path, and modifying repo tooling during an authoritative run would change the
source revision the evidence is recorded against.

| Tool | Purpose |
| --- | --- |
| `audit-v2.mjs` | full-matrix mechanical audit; facts only, no judgements |
| `repeat78.mjs` | same-route repeatability in torn-down fresh contexts + alternate-route path comparison; byte hash first, then canvas pixel diff |
| `prodcheck.mjs` | proves the test-mode animation freeze is opt-in: production still drifts, test mode does not |
| `introfix.mjs` | measures title line extents against viewport width across viewport × motion × locale |

### Corrections these versions carry

Three defects were found **in the probes themselves**, not the product. They are fixed
here and the older copies in `scripts/review/` do not have the fixes:

1. **Scene identity was inferred from highest rendered opacity.** Under
   `prefers-reduced-motion` every scene sits at opacity 1, so the heuristic silently
   returned the first scene for every checkpoint and reported confident wrong facts for
   all 28 reduced-motion rows. Identity now comes from the checkpoint's semantic scene via
   the test control's own map. **This bug appeared twice, in two independently written
   tools.** Never infer semantic identity from rendered state.
2. **Broken-image detection flagged intentionally deferred assets.** The redesigned mobile
   fallback withholds `src` (promoting `data-desktop-src` only for desktop), so those
   images are `complete` with `naturalWidth === 0` by design. The naive test produced 15
   false positives per mobile candidate.
3. **Reduced-motion checkpoints have no `settle` key** — they resolve via `goToScene`.
   The repo capture script already handles this with a fallback; the probe asserted a
   stricter contract than the product's own supported path and aborted.

Also: `waitForAssets` defaults to an 8 s budget, which a cold cache plus a concurrent
browser job can exceed. It surfaced twice as a transient "assets not ready" abort.
Refusing to capture is correct; the probes now allow a longer budget, and browser jobs
should not be run concurrently.

## Status of these candidates

All 78 remain `acceptance.status: pending_authority` under
`docs/ui-ux/UI_UX_VERDICT_SCHEMA.md`. The blocking gate is website-level human
verification (W-1…W-6 in `docs/ui-ux/UI_UX_HUMAN_ONLY_REGISTER.md`) for this same SHA,
which an agent structurally cannot supply.

`0a28d38` also changes accepted reduced-motion composition — the centered intro and outro
no longer overflow the right viewport edge. That is a rendered-composition change and
needs human eyes before it is treated as correct.
