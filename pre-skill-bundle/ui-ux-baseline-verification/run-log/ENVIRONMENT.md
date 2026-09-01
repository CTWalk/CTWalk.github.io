# Controlled environment — `b22da62` evidence run

## Source

| | |
| --- | --- |
| Candidate SHA | `b22da62f824c4903320a07af4311785c4f915b4b` |
| Verified against | required SHA — exact match |
| Branch | `main`, equal to `origin/main` at fetch time |
| Worktree | clean (0 modified, 0 untracked; only gitignored `node_modules/`) |
| Re-verified | clean immediately before capture, and again after capture completed |

## Runtime

| | |
| --- | --- |
| OS | macOS 15.7.4, arm64 (Darwin 24.6.0) |
| Node | v26.4.0 |
| npm | 11.17.0 |
| Playwright | **1.55.0** — the repository pin, unmodified |
| Browser | Chromium (Chrome for Testing) **145.0.7632.6**, headless |
| Browser build | ms-playwright `chromium-1208` |
| Device scale factor | 1 |
| Static server | `http://127.0.0.1:4173` (repo's own server in `scripts/capture-ui-ux-baselines.mjs`) |
| Env overrides | `BASELINE_BROWSER_EXECUTABLE`, `BASELINE_OUTPUT_DIR`, `BASELINE_PORT` |

## Browser deviation — disclosed

The Playwright-pinned browser could not be used.

`npx playwright install chromium` downloaded the `chromium-1187` build to 100%
of 129.7 MiB and then **stalled during extraction at 624 KB** with the
downloader process idle at 0% CPU. This is the second occurrence of the identical
failure on this machine (same build, same stall point, previous session), so it
is classified as a **reproducible environment defect on this host**, not a
transient network fault. The partial directory was removed rather than left as a
corrupt cache entry.

Complete builds available in the local cache at the time:

| Build | Version |
| --- | --- |
| 1208 | 145.0.7632.6 |
| 1223 | 148.0.7778.96 |
| 1228 | 149.0.7827.55 |
| 1234 | 151.0.7922.34 |

`chromium-1208` was selected as the **closest available build to the pinned
1187**, in preference to the 1234/151 build used for the earlier `1c1990ef` run.
Rationale: minimising distance from the pin matters more than matching a
superseded baseline captured at a different source revision. Launch was verified
under Playwright 1.55.0 before capture began (`browser.version()` =
`145.0.7632.6`, UA `Chrome/145.0.0.0`).

Executable:

```text
~/Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64/
  Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
```

Classification: **capture/environment defect.** Not a product defect, not a
test-control defect. It required no repository change — the override is the
documented mechanism — but it has two consequences worth carrying forward:

1. Any later comparison suite must pin this same executable, or re-baseline.
2. On a host where 1187 installs cleanly, anti-aliasing deltas against these
   images should be expected and are not regressions.

## Method note for the skill

The deviation was taken through an env var the capture script already supports,
never by editing the script. Editing capture tooling mid-run would change the
source revision and invalidate the very SHA the evidence is recorded against.

**Rule:** an environment deviation is recorded as first-class metadata on every
candidate, never silently absorbed, and never resolved by modifying the
candidate.
