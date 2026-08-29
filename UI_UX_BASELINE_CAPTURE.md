# Local UI/UX Baseline Capture

Issue: #6  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`  
Deterministic control: #7 / `UI_UX_TEST_CONTROL.md`

## Purpose

This is the local candidate-capture workflow for the UI/UX baseline program.

It deliberately does **not** use GitHub Actions as an acceptance gate. CI integration belongs to #10 after the capture/comparison model is stable.

The script generates candidate images only. A successful run never means the images are approved.

## Setup

The capture utility pins Playwright to `1.55.0` in `package.json`.

Install dependencies and Chromium locally:

```bash
npm install
npx playwright install chromium
```

If `npm install` creates a new `package-lock.json`, commit the lockfile before an authoritative capture, or use `npm install --package-lock=false` for a temporary local run. The capture command refuses a dirty worktree by default so the recorded source SHA remains meaningful.

## Run

```bash
npm run uiux:capture
```

By default the script:

1. reads the current Git commit SHA;
2. refuses a dirty worktree;
3. starts a local static server on `127.0.0.1:4173`;
4. launches the Playwright Chromium build;
5. loads the portfolio with `?uiux-test=1`;
6. waits for `window.__portfolioTest`;
7. uses `setLanguage()` and `goToCheckpoint()` from #7;
8. waits for semantic visual settle and visible assets;
9. captures the viewport;
10. writes candidate metadata beside the screenshots.

No production `durations` array, page-level scroll pixel, arbitrary scene `step`, or fixed 650 ms stabilization delay exists in this capture path.

## Output

Default output:

```text
baseline-candidates/<source-sha-short>/
```

The directory is ignored by Git because candidate output is not automatically golden.

Each record includes:

- checkpoint ID;
- exact source SHA;
- browser/version;
- viewport ID and dimensions;
- locale and resulting `html.lang`;
- motion preference;
- asset status;
- console errors;
- semantic checkpoint resolution returned by #7;
- settle result;
- screenshot path;
- empty reviewer/review-notes fields for later acceptance.

## Coverage

The script implements the current #12 capture matrix.

Normal-motion coverage includes:

- desktop `1440x900`;
- laptop `1280x800` for tighter-desktop risk states;
- mobile `390x844`;
- both EN and zh-TW for every selected viewport/checkpoint.

Reduced-motion coverage includes desktop and mobile in both locales for the representative reduced states required by #12.

DCA locale composition uses `dca.early-contribution`. `dca.pass` is still captured separately as the restrained conclusion checkpoint.

## Environment overrides

Use an already-running site instead of the built-in static server:

```bash
BASELINE_BASE_URL=http://127.0.0.1:9000 npm run uiux:capture
```

Choose a different local port:

```bash
BASELINE_PORT=9000 npm run uiux:capture
```

Choose another output directory:

```bash
BASELINE_OUTPUT_DIR=/tmp/ctwalk-baselines npm run uiux:capture
```

Override the recorded source SHA only when there is a specific reason:

```bash
BASELINE_SOURCE_SHA=<sha> npm run uiux:capture
```

For non-authoritative experiments only, dirty-worktree protection can be bypassed:

```bash
BASELINE_ALLOW_DIRTY=1 npm run uiux:capture
```

Do not approve images from that mode as a frozen baseline.

## Acceptance workflow

A candidate becomes golden only after review against #5.

For each image verify:

- correct semantic checkpoint;
- expected EN/zh-TW content and natural rendered wrapping;
- correct viewport/responsive composition;
- expected evidence asset;
- no clipping/overflow or missing UI;
- correct reduced-motion meaning when applicable;
- hierarchy and readability remain consistent with the scene contract.

A visual difference must be classified before any baseline is replaced. Never solve a failing comparison by regenerating snapshots first.

## Relationship to #8

#8 should reuse the same #7 navigation sequence, but replace candidate-only screenshots with Playwright visual assertions against the reviewed baseline set.

The capture script remains useful for proposing intentional new baselines; it is not the comparison engine and it does not approve them.
