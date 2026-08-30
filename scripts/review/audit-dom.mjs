// Mechanical DOM audit across the same #12 plan the capture uses.
// Records overflow, rendered line counts, locale, and per-image asset facts.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT;
const outFile = process.env.OUT_FILE;
const exe = process.env.EXE;
const plan = JSON.parse(await fs.readFile(path.join(repoRoot, 'scripts/ui-ux-baseline-plan.json'), 'utf8'));
const port = Number(process.env.PORT || 4188);

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/') rel = '/index.html';
    const f = path.resolve(repoRoot, `.${rel}`);
    if (!f.startsWith(repoRoot)) { res.writeHead(403).end(); return; }
    const st = await fs.stat(f);
    if (!st.isFile()) throw new Error('nf');
    res.writeHead(200, { 'content-type': types[path.extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    fss.createReadStream(f).pipe(res);
  } catch { res.writeHead(404).end('nf'); }
});
await new Promise(r => server.listen(port, '127.0.0.1', r));
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: exe || undefined });
const rows = [];

// Line count via Range rects on each text node — a rendered wrap count, not a source \n count.
const probe = (checkpointId) => {
  const lineCount = el => {
    if (!el) return null;
    const range = document.createRange();
    range.selectNodeContents(el);
    const tops = [...range.getClientRects()].map(r => Math.round(r.top));
    return new Set(tops).size;
  };
  // Identify the scene from the checkpoint, not from opacity: under
  // prefers-reduced-motion every scene sits at opacity 1 and the opacity
  // heuristic silently returns the intro scene for every checkpoint.
  const idx = (window.__portfolioTest?.sceneIds || {})[checkpointId.split('.')[0]];
  const scene = document.querySelector(`.scene[data-scene="${idx}"]`);
  const visibleScene = scene ? { s: scene, o: parseFloat(getComputedStyle(scene).opacity) || 0 } : null;
  const q = sel => scene?.querySelector(sel) || null;
  const title = q('.scene-title');
  const body = q('.scene-copy');
  const label = q('.scene-label');
  const images = [...document.images].filter(i => {
    const cs = getComputedStyle(i);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    return (parseFloat(cs.opacity) || 0) > 0.02;
  });
  const failedImgs = [...document.images].map(i => ({ src: i.currentSrc || i.src, complete: i.complete, nw: i.naturalWidth }))
    .filter(i => !i.complete || i.nw === 0);
  return {
    html_lang: document.documentElement.lang,
    document_title: document.title,
    scene_index: scene?.dataset.scene ?? null,
    scene_opacity: visibleScene?.o ?? null,
    horizontal_overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
    scroll_width: document.documentElement.scrollWidth,
    client_width: document.documentElement.clientWidth,
    label_text: label?.textContent?.trim() ?? null,
    title_text: title?.textContent?.trim() ?? null,
    title_lines: lineCount(title),
    title_opacity: title ? parseFloat(getComputedStyle(title).opacity) : null,
    body_text: body?.textContent?.trim() ?? null,
    body_lines: lineCount(body),
    visible_image_count: images.length,
    visible_images: images.map(i => ({ src: (i.currentSrc || i.src).split('/').slice(-1)[0], cls: i.className, nw: i.naturalWidth, op: Number(getComputedStyle(i).opacity) })),
    broken_images: failedImgs
  };
};

async function run(viewportId, motion, checkpoints) {
  const vp = plan.viewports[viewportId];
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', locale: 'en-US' });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(e.message));
  const failedRequests = [];
  page.on('requestfailed', r => failedRequests.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', r => { if (r.status() >= 400) failedRequests.push(`${r.url()} HTTP ${r.status()}`); });
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__portfolioTest));
  await page.evaluate(() => window.__portfolioTest.ready());
  for (const locale of plan.locales) {
    await page.evaluate(l => window.__portfolioTest.setLanguage(l), locale);
    for (const id of checkpoints) {
      let resolved = null, error = null;
      try { resolved = await page.evaluate(c => window.__portfolioTest.goToCheckpoint(c), id); }
      catch (e) { error = e.message; }
      const facts = await page.evaluate(probe, id);
      rows.push({ viewport: viewportId, motion, locale, checkpoint_id: id, error, score: resolved?.score ?? null, settled: resolved?.settle?.settled ?? null, document_progress: resolved?.documentProgress ?? null, ...facts });
    }
  }
  rows.push({ viewport: viewportId, motion, _console_errors: [...new Set(errs)], _failed_requests: [...new Set(failedRequests)] });
  await ctx.close();
}

for (const [v, cps] of Object.entries(plan.normal)) await run(v, 'normal', cps);
for (const [v, cps] of Object.entries(plan.reduce)) await run(v, 'reduce', cps);
await browser.close();
await new Promise(r => server.close(r));
await fs.writeFile(outFile, JSON.stringify(rows, null, 2));
console.log('audit rows', rows.length);
