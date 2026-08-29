#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import subprocess
import threading
from datetime import datetime, timezone
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from playwright.sync_api import sync_playwright

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
PLAN = json.loads((SCRIPT_DIR / "ui-ux-baseline-plan.json").read_text(encoding="utf-8"))
LOCALES = PLAN["locales"]
VIEWPORTS = PLAN["viewports"]
NORMAL_PLAN = PLAN["normal"]
REDUCED_PLAN = PLAN["reduce"]


def git(*args: str) -> str:
    return subprocess.check_output(["git", *args], cwd=REPO_ROOT, text=True).strip()


SOURCE_SHA = os.environ.get("BASELINE_SOURCE_SHA") or git("rev-parse", "HEAD")
DIRTY = git("status", "--porcelain")
if DIRTY and os.environ.get("BASELINE_ALLOW_DIRTY") != "1":
    raise RuntimeError(
        "Refusing baseline capture from a dirty worktree. Commit/stash changes or "
        "set BASELINE_ALLOW_DIRTY=1 for a non-authoritative experiment."
    )

OUTPUT_ROOT = Path(
    os.environ.get(
        "BASELINE_OUTPUT_DIR",
        REPO_ROOT / "baseline-candidates" / SOURCE_SHA[:9],
    )
).resolve()
EXTERNAL_BASE_URL = os.environ.get("BASELINE_BASE_URL", "")


def resolve_browser_executable() -> str | None:
    explicit = os.environ.get("BASELINE_BROWSER_EXECUTABLE")
    if explicit:
        return explicit
    for candidate in ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable"):
        resolved = shutil.which(candidate)
        if resolved:
            return resolved
    return None


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format: str, *args) -> None:  # noqa: A002
        if os.environ.get("BASELINE_SERVER_LOG") == "1":
            super().log_message(format, *args)


class LocalServer:
    def __init__(self) -> None:
        self.port = int(os.environ.get("BASELINE_PORT", "4173"))
        handler = partial(NoCacheHandler, directory=str(REPO_ROOT))
        self.server = ThreadingHTTPServer(("127.0.0.1", self.port), handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)

    @property
    def base_url(self) -> str:
        return f"http://127.0.0.1:{self.port}"

    def start(self) -> None:
        self.thread.start()

    def close(self) -> None:
        self.server.shutdown()
        self.server.server_close()
        self.thread.join(timeout=2)


def asset_status(page) -> dict:
    return page.evaluate(
        """
        () => {
          const images = [...document.images].filter(image => getComputedStyle(image).display !== 'none');
          const failed = images
            .filter(image => image.complete && image.naturalWidth === 0)
            .map(image => image.currentSrc || image.src);
          const pending = images
            .filter(image => !image.complete)
            .map(image => image.currentSrc || image.src);
          return { total_images: images.length, failed, pending, ok: failed.length === 0 && pending.length === 0 };
        }
        """
    )


def open_controlled_page(page, base_url: str) -> dict:
    page.goto(f"{base_url}/?uiux-test=1", wait_until="domcontentloaded", timeout=30_000)
    page.wait_for_function("() => Boolean(window.__portfolioTest)", timeout=20_000)
    ready = page.evaluate("() => window.__portfolioTest.ready()")
    if not ready.get("assetsReady"):
        raise RuntimeError("Visible assets did not become ready before capture.")
    return ready


def capture_context(*, browser, base_url: str, viewport_id: str, motion: str, checkpoints: list[str], records: list[dict]) -> None:
    viewport = VIEWPORTS[viewport_id]
    context = browser.new_context(
        viewport=viewport,
        device_scale_factor=1,
        reduced_motion="reduce" if motion == "reduce" else "no-preference",
        locale="en-US",
    )
    page = context.new_page()
    console_errors: list[str] = []

    def on_console(message) -> None:
        if message.type == "error":
            console_errors.append(message.text)

    page.on("console", on_console)
    page.on("pageerror", lambda error: console_errors.append(str(error)))

    try:
        initial = open_controlled_page(page, base_url)
        if bool(initial.get("reducedMotion")) != (motion == "reduce"):
            raise RuntimeError(
                f"Reduced-motion mismatch: requested {motion}, page reported {initial.get('reducedMotion')}"
            )

        for locale in LOCALES:
            html_lang = page.evaluate(
                "target => window.__portfolioTest.setLanguage(target)", locale
            )
            expected_lang = "zh-Hant-TW" if locale == "zh-TW" else "en"
            if html_lang != expected_lang:
                raise RuntimeError(f"Locale mismatch: {locale} produced {html_lang}")

            for checkpoint_id in checkpoints:
                resolved = page.evaluate(
                    "id => window.__portfolioTest.goToCheckpoint(id)", checkpoint_id
                )
                settle = resolved.get("settle")
                if not settle:
                    settle = page.evaluate(
                        "scene => window.__portfolioTest.waitForVisualSettle(scene)",
                        resolved["scene"],
                    )
                if not settle.get("settled"):
                    raise RuntimeError(f"{checkpoint_id} did not settle before capture.")

                assets_ready = page.evaluate("() => window.__portfolioTest.waitForAssets()")
                assets = asset_status(page)
                if not assets_ready or not assets.get("ok"):
                    raise RuntimeError(f"{checkpoint_id} has missing/pending visible assets.")

                directory = OUTPUT_ROOT / viewport_id / locale / motion
                directory.mkdir(parents=True, exist_ok=True)
                screenshot_path = directory / f"{checkpoint_id}.png"
                page.screenshot(path=str(screenshot_path), full_page=False, animations="allow")

                state = page.evaluate("() => window.__portfolioTest.getState()")
                records.append(
                    {
                        "checkpoint_id": checkpoint_id,
                        "source_sha": SOURCE_SHA,
                        "status": "candidate",
                        "capture_runtime": "python-playwright",
                        "browser_name": "chromium",
                        "browser_version": browser.version,
                        "viewport_id": viewport_id,
                        "viewport_width": viewport["width"],
                        "viewport_height": viewport["height"],
                        "device_scale_factor": 1,
                        "locale": locale,
                        "html_lang": state["locale"],
                        "motion_preference": motion,
                        "asset_load_status": assets,
                        "console_errors": sorted(set(console_errors)),
                        "checkpoint_resolution": resolved,
                        "settle": settle,
                        "screenshot": str(screenshot_path.relative_to(OUTPUT_ROOT)),
                        "reviewer": None,
                        "review_notes": None,
                    }
                )
    finally:
        context.close()


def main() -> int:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    local_server = None
    if EXTERNAL_BASE_URL:
        base_url = EXTERNAL_BASE_URL
    else:
        local_server = LocalServer()
        local_server.start()
        base_url = local_server.base_url

    browser_executable = resolve_browser_executable()
    records: list[dict] = []

    try:
        with sync_playwright() as playwright:
            launch_options = {"headless": True}
            if browser_executable:
                launch_options["executable_path"] = browser_executable
            browser = playwright.chromium.launch(**launch_options)
            try:
                for viewport_id, checkpoints in NORMAL_PLAN.items():
                    capture_context(
                        browser=browser,
                        base_url=base_url,
                        viewport_id=viewport_id,
                        motion="normal",
                        checkpoints=checkpoints,
                        records=records,
                    )
                for viewport_id, checkpoints in REDUCED_PLAN.items():
                    capture_context(
                        browser=browser,
                        base_url=base_url,
                        viewport_id=viewport_id,
                        motion="reduce",
                        checkpoints=checkpoints,
                        records=records,
                    )
            finally:
                browser.close()
    finally:
        if local_server:
            local_server.close()

    runtime_warnings = [
        record
        for record in records
        if record["console_errors"]
        or not record["asset_load_status"]["ok"]
        or not record["settle"]["settled"]
    ]
    report = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_sha": SOURCE_SHA,
        "source_worktree_clean": not bool(DIRTY),
        "baseline_status": "candidate",
        "capture_contract": "#5 + #12 + #7",
        "capture_runtime": "python-playwright",
        "browser_executable": browser_executable,
        "note": "Candidate capture only. Never promote by regenerating after a diff; every image requires explicit review against UI_UX_ACCEPTANCE_CONTRACT.md.",
        "records": records,
    }
    (OUTPUT_ROOT / "metadata.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    print(f"Captured {len(records)} candidate screenshots from {SOURCE_SHA}.")
    print(f"Output: {OUTPUT_ROOT}")
    print(f"Records with runtime warnings: {len(runtime_warnings)}.")
    return 2 if runtime_warnings else 0


if __name__ == "__main__":
    raise SystemExit(main())
