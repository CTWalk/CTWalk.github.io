# Local UI/UX Baseline Capture

Issue: #6  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`  
Deterministic control: #7 / `UI_UX_TEST_CONTROL.md`

## Purpose

This is the local candidate-capture workflow for the UI/UX baseline program.

It deliberately does **not** use GitHub Actions as an acceptance gate. CI integration belongs to #10 after the capture/comparison model is stable.

The capture command generates candidate images only. A successful run never means the images are approved.

## Runtime selection

`npm run uiux:capture` is now a dispatcher rather than a hard dependency on one Playwright installation.

It selects the first usable runtime in this order:

1. Node Playwright, when the `playwright` package is installed locally;
2. Python Playwright, when `python3` or `python` can import `playwright`.

Both implementations consume the same `scripts/ui-ux-baseline-plan.json`, call the same #7 semantic checkpoint API, produce the same directory structure, and record which capture runtime was used in metadata.

This prevents a missing npm package from blocking local baseline work when a usable Python Playwright environment already exists.

## Setup: Node path

The Node path pins Playwright to `1.55.0` in `package.json`.

```bash
npm install
npx playwright install chromium
```

If `npm install` creates a new `package-lock.json`, commit the lockfile before an authoritative capture, or use `npm install --package-lock=false` for a temporary local run. The capture command refuses a dirty worktree by default so the recorded source SHA remains meaningful.

## Setup: Python fallback

If Node Playwright is unavailable:

```bash
python3 -m pip install -r requirements-uiux.txt
```

The Python runner first honors `BASELINE_BROWSER_EXECUTABLE`. If that is not set, it automatically looks for a system browser in this order:

```text
chromium
chromium-browser
google-chrome
google-chrome-stable
```

That means a machine with Python Playwright plus an existing Chrome/Chromium installation does not need a separate Playwright browser download.

If there is no system browser, install the Playwright Chromium build:

```bash
python3 -m playwright install chromium
```

You can force the Python runtime directly with:

```bash
npm run uiux:capture:python
```

or the Node runtime with:

```bash
npm run uiux:capture:node
```

## Run

```bash
npm run uiux:capture
```

By default the selected runner:

1. reads the current Git commit SHA;
2. refuses a dirty worktree;
3. starts a local static server on `127.0.0.1:4173`;
4. launches Chromium;
5. loads the portfolio with `?uiux-test=1`;
6. waits for `window.__portfolioTest`;
7. uses `setLanguage()` and `goToCheckpoint()` from #7;
8. waits for semantic visual settle and visible assets;
9. captures the viewport;
10. writes candidate metadata beside the screenshots.

No production `durations` array, page-level scroll pixel, arbitrary scene `step`, or fixed stabilization sleep exists in this capture path.

## Output

Default output:

```text
baseline-candidates/<source-sha-short>/
```

The directory is ignored by Git because candidate output is not automatically golden.

Each record includes:

- checkpoint ID;
- exact source SHA;
- capture runtime (`node-playwright` or `python-playwright`);
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

The shared plan implements the current #12 capture matrix.

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

Use a specific Chromium/Chrome binary:

```bash
BASELINE_BROWSER_EXECUTABLE=/path/to/chromium npm run uiux:capture
```

Choose a specific Python executable for fallback probing:

```bash
BASELINE_PYTHON=/path/to/python3 npm run uiux:capture
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

## Asset requirement

Browser-runtime availability and evidence-asset availability are separate gates.

A candidate cannot be approved when an expected image is missing. The runner therefore still fails if the externally hosted evidence required by the rendered portfolio cannot load. Do not replace those images with placeholders merely to make capture pass.

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

#8 should reuse the same #7 navigation sequence, but replace candidate-only screenshots with visual assertions against the reviewed baseline set.

The capture runners remain useful for proposing intentional new baselines; they are not the comparison engine and they do not approve images.
