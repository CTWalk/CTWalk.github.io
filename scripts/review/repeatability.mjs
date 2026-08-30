// Repeatability probe for #6. Lives outside the repo so the capture worktree stays clean.
import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import fss from 'node:fs';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT;
const outDir = process.env.OUT_DIR;
const port = Number(process.env.PORT || 4199);

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

const checkpoints = ['intro.settled', 'commerce.final-settled', 'nocode.result-hold', 'social.final-phone', 'cuesheet.review', 'dca.early-contribution', 'outro.settled'];
const browser = await chromium.launch({ headless: true, executablePath: process.env.EXE });
await fs.mkdir(outDir, { recursive: true });
const results = [];

async function capture(checkpointId, pass) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: 'no-preference', locale: 'en-US' });
  const page = await ctx.newPage();
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__portfolioTest));
  let ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (let i = 0; i < 4 && !ready.assetsReady; i += 1) {
    ready = await page.evaluate(() => window.__portfolioTest.ready());
  }
  if (!ready.assetsReady) throw new Error('assets not ready');
  await page.evaluate(() => window.__portfolioTest.setLanguage('en'));
  const resolved = await page.evaluate(id => window.__portfolioTest.goToCheckpoint(id), checkpointId);
  if (!resolved.settle?.settled) throw new Error(`${checkpointId} did not settle`);
  const ok = await page.evaluate(() => window.__portfolioTest.waitForAssets());
  if (!ok) throw new Error('assets missing at checkpoint');
  const p = path.join(outDir, `${checkpointId}.pass${pass}.png`);
  await page.screenshot({ path: p, fullPage: false });
  await ctx.close();
  return { path: p, sha: crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex'), documentProgress: resolved.documentProgress, score: resolved.score };
}

for (const id of checkpoints) {
  const a = await capture(id, 1);
  const b = await capture(id, 2);
  results.push({ checkpoint_id: id, identical: a.sha === b.sha, pass1: a, pass2: b });
  console.log(id, a.sha === b.sha ? 'IDENTICAL' : 'DIFFERENT', a.sha.slice(0, 12), b.sha.slice(0, 12), 'progress', a.documentProgress?.toFixed?.(6), b.documentProgress?.toFixed?.(6));
}
await browser.close();
await new Promise(r => server.close(r));
await fs.writeFile(path.join(outDir, 'repeatability.json'), JSON.stringify(results, null, 2));
