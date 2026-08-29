import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const locales = ['en', 'zh-TW'];
const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 844 }
};

const normalPlan = {
  desktop: [
    'intro.settled',
    'commerce.checkout-event',
    'commerce.quiet-after-checkout',
    'commerce.expired-promo',
    'commerce.unavailable',
    'commerce.final-settled',
    'nocode.yaml-readable',
    'nocode.execution',
    'nocode.result-hold',
    'social.product',
    'social.database',
    'social.web',
    'social.final-phone',
    'cuesheet.workspace',
    'cuesheet.conflict',
    'cuesheet.review',
    'dca.early-contribution',
    'dca.phrased-hold',
    'dca.late-contribution',
    'dca.scanner-handoff',
    'dca.pass',
    'outro.settled'
  ],
  laptop: [
    'intro.settled',
    'commerce.checkout-event',
    'commerce.expired-promo',
    'nocode.result-hold',
    'social.final-phone',
    'cuesheet.review',
    'dca.pass',
    'outro.settled'
  ],
  mobile: [
    'intro.settled',
    'commerce.checkout-event',
    'commerce.quiet-after-checkout',
    'commerce.expired-promo',
    'commerce.unavailable',
    'commerce.final-settled',
    'nocode.yaml-readable',
    'nocode.execution',
    'nocode.result-hold',
    'social.product',
    'social.database',
    'social.web',
    'social.final-phone',
    'cuesheet.workspace',
    'cuesheet.conflict',
    'cuesheet.review',
    'dca.early-contribution',
    'dca.late-contribution',
    'dca.scanner-handoff',
    'dca.pass',
    'outro.settled'
  ]
};

const reducedPlan = {
  desktop: [
    'intro.settled',
    'commerce.reduced',
    'nocode.reduced',
    'social.reduced',
    'cuesheet.reduced',
    'dca.reduced',
    'outro.reduced'
  ],
  mobile: [
    'intro.settled',
    'commerce.reduced',
    'nocode.reduced',
    'social.reduced',
    'cuesheet.reduced',
    'dca.reduced',
    'outro.reduced'
  ]
};

function git(command) {
  return execFileSync('git', command, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

const sourceSha = process.env.BASELINE_SOURCE_SHA || git(['rev-parse', 'HEAD']);
const dirty = git(['status', '--porcelain']);
if (dirty && process.env.BASELINE_ALLOW_DIRTY !== '1') {
  throw new Error('Refusing baseline capture from a dirty worktree. Commit/stash changes or set BASELINE_ALLOW_DIRTY=1 for a non-authoritative experiment.');
}

const outputRoot = path.resolve(
  process.env.BASELINE_OUTPUT_DIR || path.join(repoRoot, 'baseline-candidates', sourceSha.slice(0, 9))
);
const externalBaseUrl = process.env.BASELINE_BASE_URL || '';

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.html') return 'text/html; charset=utf-8';
  if (ext === '.js' || ext === '.mjs') return 'text/javascript; charset=utf-8';
  if (ext === '.css') return 'text/css; charset=utf-8';
  if (ext === '.json') return 'application/json; charset=utf-8';
  if (ext === '.svg') return 'image/svg+xml';
  if (ext === '.png') return 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  return 'application/octet-stream';
}

async function startStaticServer() {
  const port = Number(process.env.BASELINE_PORT || 4173);
  const server = http.createServer(async (request, response) => {
    try {
      const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);
      let relative = decodeURIComponent(url.pathname);
      if (relative === '/') relative = '/index.html';
      const requested = path.resolve(repoRoot, `.${relative}`);
      if (!requested.startsWith(`${repoRoot}${path.sep}`) && requested !== path.join(repoRoot, 'index.html')) {
        response.writeHead(403).end('Forbidden');
        return;
      }
      const stat = await fsp.stat(requested);
      if (!stat.isFile()) throw new Error('Not a file');
      response.writeHead(200, { 'content-type': contentType(requested), 'cache-control': 'no-store' });
      fs.createReadStream(requested).pipe(response);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

async function assetStatus(page) {
  return page.evaluate(() => {
    const images = [...document.images].filter(image => getComputedStyle(image).display !== 'none');
    const failed = images.filter(image => image.complete && image.naturalWidth === 0).map(image => image.currentSrc || image.src);
    const pending = images.filter(image => !image.complete).map(image => image.currentSrc || image.src);
    return { total_images: images.length, failed, pending, ok: failed.length === 0 && pending.length === 0 };
  });
}

async function openControlledPage(page, baseUrl) {
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForFunction(() => Boolean(window.__portfolioTest), null, { timeout: 20_000 });
  const ready = await page.evaluate(() => window.__portfolioTest.ready());
  if (!ready.assetsReady) throw new Error('Visible assets did not become ready before capture.');
  return ready;
}

async function captureContext({ browser, baseUrl, viewportId, motion, checkpoints, records }) {
  const viewport = viewports[viewportId];
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference',
    locale: 'en-US'
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));

  try {
    const initial = await openControlledPage(page, baseUrl);
    if (Boolean(initial.reducedMotion) !== (motion === 'reduce')) {
      throw new Error(`Reduced-motion mismatch: requested ${motion}, page reported ${initial.reducedMotion}`);
    }

    for (const locale of locales) {
      const htmlLang = await page.evaluate(target => window.__portfolioTest.setLanguage(target), locale);
      const expectedLang = locale === 'zh-TW' ? 'zh-Hant-TW' : 'en';
      if (htmlLang !== expectedLang) throw new Error(`Locale mismatch: ${locale} produced ${htmlLang}`);

      for (const checkpointId of checkpoints) {
        const resolved = await page.evaluate(id => window.__portfolioTest.goToCheckpoint(id), checkpointId);
        const settle = resolved.settle || await page.evaluate(scene => window.__portfolioTest.waitForVisualSettle(scene), resolved.scene);
        if (!settle?.settled) throw new Error(`${checkpointId} did not settle before capture.`);

        const assetsReady = await page.evaluate(() => window.__portfolioTest.waitForAssets());
        const assets = await assetStatus(page);
        if (!assetsReady || !assets.ok) throw new Error(`${checkpointId} has missing/pending visible assets.`);

        const directory = path.join(outputRoot, viewportId, locale, motion);
        await fsp.mkdir(directory, { recursive: true });
        const screenshotPath = path.join(directory, `${checkpointId}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false, animations: 'allow' });

        const state = await page.evaluate(() => window.__portfolioTest.getState());
        records.push({
          checkpoint_id: checkpointId,
          source_sha: sourceSha,
          status: 'candidate',
          browser_name: 'chromium',
          browser_version: browser.version(),
          viewport_id: viewportId,
          viewport_width: viewport.width,
          viewport_height: viewport.height,
          device_scale_factor: 1,
          locale,
          html_lang: state.locale,
          motion_preference: motion,
          asset_load_status: assets,
          console_errors: [...new Set(consoleErrors)],
          checkpoint_resolution: resolved,
          settle,
          screenshot: path.relative(outputRoot, screenshotPath),
          reviewer: null,
          review_notes: null
        });
      }
    }
  } finally {
    await context.close();
  }
}

await fsp.mkdir(outputRoot, { recursive: true });
let localServer = null;
const baseUrl = externalBaseUrl || (localServer = await startStaticServer()).baseUrl;
const browser = await chromium.launch({ headless: true });
const records = [];

try {
  for (const [viewportId, checkpoints] of Object.entries(normalPlan)) {
    await captureContext({ browser, baseUrl, viewportId, motion: 'normal', checkpoints, records });
  }
  for (const [viewportId, checkpoints] of Object.entries(reducedPlan)) {
    await captureContext({ browser, baseUrl, viewportId, motion: 'reduce', checkpoints, records });
  }
} finally {
  await browser.close();
  if (localServer) await new Promise(resolve => localServer.server.close(resolve));
}

const runtimeWarnings = records.filter(record => record.console_errors.length || !record.asset_load_status.ok || !record.settle?.settled);
const report = {
  generated_at: new Date().toISOString(),
  source_sha: sourceSha,
  source_worktree_clean: !dirty,
  baseline_status: 'candidate',
  capture_contract: '#5 + #12 + #7',
  note: 'Candidate capture only. Never promote by regenerating after a diff; every image requires explicit review against UI_UX_ACCEPTANCE_CONTRACT.md.',
  records
};
await fsp.writeFile(path.join(outputRoot, 'metadata.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');

console.log(`Captured ${records.length} candidate screenshots from ${sourceSha}.`);
console.log(`Output: ${outputRoot}`);
console.log(`Records with runtime warnings: ${runtimeWarnings.length}.`);
if (runtimeWarnings.length) process.exitCode = 2;
