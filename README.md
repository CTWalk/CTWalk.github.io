# CTWalk Portfolio

Static GitHub Pages portfolio plus its UI/UX verification tooling.

## Repository layout

```text
.
├── index.html                 # production page / inline core scene runtime
├── site-bootstrap.js          # presentation owner and runtime loader
├── assets/
│   └── js/                    # production browser runtimes loaded by bootstrap
├── docs/
│   ├── design/                # portfolio design method
│   └── ui-ux/                 # acceptance, baseline and verification contracts
├── scripts/
│   ├── controls/              # ?uiux-test=1 browser controls
│   ├── review/                # review/calibration/repeatability utilities
│   └── *baseline*             # baseline capture runners and active plan
├── ui-ux-baselines/           # committed historical baseline evidence
├── package.json               # Node/Playwright tooling entrypoints
└── requirements-uiux.txt      # Python Playwright fallback dependency
```

## Ownership rules

- Keep production browser runtime files under `assets/js/` unless a file is a page entrypoint.
- Keep UI/UX contracts and methods under `docs/ui-ux/`.
- Keep executable verification tooling under `scripts/`.
- `ui-ux-baselines/` is historical evidence. Do not reorganize or overwrite it merely for cosmetic cleanup.
- Folder cleanup must not change observable portfolio behavior, semantic checkpoint IDs, or the active baseline matrix.
