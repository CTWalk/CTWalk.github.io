# Local UI/UX Baseline Capture

Issue: #6  
Acceptance contract: #5 / `UI_UX_ACCEPTANCE_CONTRACT.md`  
Checkpoint manifest: #12 / `UI_UX_BASELINE_MANIFEST.md`  
Deterministic control: #7 / `UI_UX_TEST_CONTROL.md`  
Mobile presentation: #20

## Purpose

This is the local candidate-capture workflow for the UI/UX baseline program.

It deliberately does **not** use GitHub Actions as an acceptance gate. CI integration belongs to #10 after the capture/comparison model is stable.

The capture command generates candidate images only. A successful run never means the images are approved.

## Runtime selection

`npm run uiux:capture` is a dispatcher rather than a hard dependency on one Playwright installation.

It selects the first usable runtime in this order:

1. Node Playwright, when the `playwright` package is installed locally;
2. Python Playwright, when `python3` or `python` can import `playwright`.

Both implementations consume the same `scripts/ui-ux-baseline-plan.json`, call the same public `window.__portfolioTest` contract, produce the same directory structure, and record which capture runtime was used in metadata.

The page chooses the internal controller from presentation mode:

```text
> 760px  -> desktop scene controller
<= 760px -> mobile fallback controller
```

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

If there is no system browser, install the Playwright Chromium build:

```bash
python3 -m playwright install chromium
```

Force a runtime with:

```bash
npm run uiux:capture:python
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
7. uses `setLanguage()` and `goToCheckpoint()`;
8. waits for semantic visual settle and visible assets;
9. captures the viewport;
10. writes candidate metadata beside the screenshots.

No production `durations` array, page-level scroll pixel, arbitrary scene `step`, or fixed stabilization sleep defines capture readiness.

## Active coverage

The shared plan implements the current #12 matrix.

### Desktop interactive presentation

Normal motion:

- desktop `1440x900`: 22 semantic states;
- laptop `1280x800`: 8 tighter-desktop risk states.

Reduced motion:

- desktop `1440x900`: 7 representative static states.

### Mobile fallback presentation

At `390x844`, the seven desktop scenes are intentionally absent.

Normal motion:

```text
mobile.fallback
```

Reduced motion:

```text
mobile.fallback.reduced
```

Both are captured in EN and zh-TW.

### Total

```text
39 checkpoint/viewport/motion cells
x 2 locales
= 78 candidate screenshots
```

The previous 130-candidate run at source SHA `1c1990ef05dc764b8e2a1797f7fc41fbded4289f` remains historical review evidence. It is not the active final-freeze matrix after #20.

## Mobile determinism

The production mobile fallback uses a slow Canvas edge-light animation.

Under `?uiux-test=1`, the mobile controller freezes that Canvas at a fixed semantic time before capture. Under `prefers-reduced-motion: reduce`, it uses a separate fixed reduced-motion state.

The effect contains no uncontrolled random state.

Desktop evidence images are hidden from the active mobile presentation and are excluded from mobile visible-asset readiness.

## Output

Default output:

```text
baseline-candidates/<source-sha-short>/
```

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
- semantic checkpoint resolution;
- settle result;
- screenshot path;
- empty reviewer/review-notes fields for later acceptance.

## Environment overrides

Use an already-running site:

```bash
BASELINE_BASE_URL=http://127.0.0.1:9000 npm run uiux:capture
```

Choose a local port:

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

Choose a Python executable:

```bash
BASELINE_PYTHON=/path/to/python3 npm run uiux:capture
```

Override the recorded source SHA only for a specific controlled reason:

```bash
BASELINE_SOURCE_SHA=<sha> npm run uiux:capture
```

For non-authoritative experiments only:

```bash
BASELINE_ALLOW_DIRTY=1 npm run uiux:capture
```

Do not approve images from dirty-worktree mode as a frozen baseline.

## Asset requirement

Browser-runtime availability and evidence-asset availability are separate gates.

A desktop candidate cannot be approved when an expected visible evidence image is missing. Do not replace missing evidence with placeholders merely to make capture pass.

The mobile fallback contains no generated/raster project-evidence image, so intentionally hidden desktop assets are outside its readiness surface.

## Acceptance workflow

A candidate becomes golden only after explicit review against #5.

For each image verify:

- correct semantic checkpoint;
- expected EN/zh-TW content and natural rendered wrapping;
- correct presentation mode and viewport composition;
- expected visible evidence/decoration;
- no clipping/overflow or missing UI;
- correct reduced-motion meaning when applicable;
- hierarchy and readability remain consistent with the active contract;
- deterministic repeatability.

A visual difference must be classified before any baseline is replaced. Never solve a failing comparison by regenerating snapshots first.

## Relationship to #8

#8 should reuse the same semantic navigation sequence but replace candidate-only screenshots with visual assertions against the reviewed final baseline set.

The capture runners remain useful for proposing intentional new baselines; they are not the comparison engine and they do not approve images.
