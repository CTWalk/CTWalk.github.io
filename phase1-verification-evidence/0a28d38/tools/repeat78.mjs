// Repeatability + outro path-independence probe for the b22da62 candidate.
// Lives OUTSIDE the repository: it calls only the documented #7 semantic API and
// never modifies capture tooling, the test control, or the worktree.
import { chromium } from 'playwright';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT;
const outDir = process.env.OUT_DIR;
const exe = process.env.EXE;
const port = Number(process.env.PORT || 4191);

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/') rel = '/index.html';
    const f = path.resolve(repoRoot, `.${rel}`);
    if (!f.startsWith(repoRoot)) { res.writeHead(403).end(); return; }
    if (!(await fs.stat(f)).isFile()) throw new Error('nf');
    res.writeHead(200, { 'content-type': types[path.extname(f).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
    fss.createReadStream(f).pipe(res);
  } catch { res.writeHead(404).end('nf'); }
});
await new Promise(r => server.listen(port, '127.0.0.1', r));
const baseUrl = `http://127.0.0.1:${port}`;
const browser = await chromium.launch({ headless: true, executablePath: exe });
await fs.mkdir(outDir, { recursive: true });

const canvasPage = await (await browser.newContext()).newPage();
await canvasPage.setContent('<canvas id="c"></canvas>');
async function diff(a, b) {
  const [da, db] = await Promise.all([fs.readFile(a), fs.readFile(b)]);
  return canvasPage.evaluate(async ([x, y]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const [ia, ib] = await Promise.all([load(x), load(y)]);
    if (ia.width !== ib.width || ia.height !== ib.height) return { sizeMismatch: true };
    const c = document.getElementById('c'); c.width = ia.width; c.height = ia.height;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(ia, 0, 0); const A = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, c.width, c.height); g.drawImage(ib, 0, 0);
    const B = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, max = 0, x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
    for (let i = 0; i < A.length; i += 4) {
      const d = Math.max(Math.abs(A[i] - B[i]), Math.abs(A[i + 1] - B[i + 1]), Math.abs(A[i + 2] - B[i + 2]));
      if (d > 0) {
        n++; if (d > max) max = d;
        const p = i / 4, px = p % c.width, py = (p / c.width) | 0;
        if (px < x0) x0 = px; if (px > x1) x1 = px; if (py < y0) y0 = py; if (py > y1) y1 = py;
      }
    }
    return { width: c.width, height: c.height, totalPixels: (A.length / 4), differingPixels: n,
      percent: +(100 * n / (A.length / 4)).toFixed(5), maxChannelDelta: max,
      boundingRegion: n ? { x0, y0, x1, y1 } : null };
  }, [`data:image/png;base64,${da.toString('base64')}`, `data:image/png;base64,${db.toString('base64')}`]);
}

const VP = { desktop: { width: 1440, height: 900 }, laptop: { width: 1280, height: 800 }, mobile: { width: 390, height: 844 } };

async function capture(tag, { viewport, motion, locale, route }) {
  const ctx = await browser.newContext({ viewport: VP[viewport], deviceScaleFactor: 1,
    reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', locale: 'en-US' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__portfolioTest));
  let ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (let i = 0; i < 10 && !ready.assetsReady; i += 1) {
    await page.evaluate(() => window.__portfolioTest.waitForAssets(30000));
    ready = await page.evaluate(() => window.__portfolioTest.ready());
  }
  if (!ready.assetsReady) throw new Error(`${tag}: assets not ready after extended wait`);
  await page.evaluate(l => window.__portfolioTest.setLanguage(l), locale);
  let last = null;
  for (const cp of route) last = await page.evaluate(c => window.__portfolioTest.goToCheckpoint(c), cp);
  const settle = last?.settle || (last?.scene != null
    ? await page.evaluate(sc => window.__portfolioTest.waitForVisualSettle(sc), last.scene)
    : { settled: true, note: 'presentation has no scene-scoped settle' });
  if (!settle?.settled) throw new Error(`${tag}: did not settle`);
  const ok = await page.evaluate(() => window.__portfolioTest.waitForAssets());
  if (!ok) throw new Error(`${tag}: assets missing at checkpoint`);
  const p = path.join(outDir, `${tag}.png`);
  await page.screenshot({ path: p, fullPage: false });
  await ctx.close();
  return { path: p, sha: crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex'),
    documentProgress: last.documentProgress ?? null, settle, score: last.score ?? null, errors: [...new Set(errors)] };
}

const results = [];
const CASES = [
  ['intro.settled', 'desktop', 'normal'],
  ['intro.settled', 'laptop', 'normal'],
  ['intro.settled', 'desktop', 'reduce'],
  ['commerce.expired-promo', 'desktop', 'normal'],
  ['commerce.unavailable', 'desktop', 'normal'],
  ['commerce.final-settled', 'desktop', 'normal'],
  ['commerce.reduced', 'desktop', 'reduce'],
  ['nocode.execution', 'desktop', 'normal'],
  ['nocode.result-hold', 'desktop', 'normal'],
  ['social.final-phone', 'desktop', 'normal'],
  ['cuesheet.review', 'desktop', 'normal'],
  ['cuesheet.review', 'laptop', 'normal'],
  ['dca.early-contribution', 'desktop', 'normal'],
  ['dca.pass', 'desktop', 'normal'],
  ['dca.reduced', 'desktop', 'reduce'],
  ['outro.settled', 'desktop', 'normal'],
  ['outro.reduced', 'desktop', 'reduce'],
  ['mobile.fallback', 'mobile', 'normal'],
  ['mobile.fallback.reduced', 'mobile', 'reduce']
];

for (const [cp, viewport, motion] of CASES) {
  const a = await capture(`${cp}.pass1`, { viewport, motion, locale: 'en', route: [cp] });
  const b = await capture(`${cp}.pass2`, { viewport, motion, locale: 'en', route: [cp] });
  const d = a.sha === b.sha ? { identicalBytes: true } : await diff(a.path, b.path);
  results.push({ kind: 'fresh-context-repeat', checkpoint_id: cp, viewport, motion, pass1: a, pass2: b, diff: d });
  console.log(`${cp.padEnd(24)} ${a.sha === b.sha ? 'BYTE-IDENTICAL' : `bytes differ -> px ${d.differingPixels} (${d.percent}%) maxD ${d.maxChannelDelta}`}`);
}

// Outro path independence: A fresh -> outro; B fresh -> other scene -> outro; C outro -> away -> outro.
const pa = await capture('outro.pathA', { viewport: 'desktop', motion: 'normal', locale: 'en', route: ['outro.settled'] });
const pb = await capture('outro.pathB', { viewport: 'desktop', motion: 'normal', locale: 'en', route: ['social.final-phone', 'outro.settled'] });
const pc = await capture('outro.pathC', { viewport: 'desktop', motion: 'normal', locale: 'en', route: ['outro.settled', 'commerce.final-settled', 'outro.settled'] });
for (const [n, x, y] of [['A-vs-B', pa, pb], ['A-vs-C', pa, pc], ['B-vs-C', pb, pc]]) {
  const d = x.sha === y.sha ? { identicalBytes: true } : await diff(x.path, y.path);
  results.push({ kind: 'outro-path-independence', comparison: n, diff: d });
  console.log(`outro ${n.padEnd(18)} ${x.sha === y.sha ? 'BYTE-IDENTICAL' : `px ${d.differingPixels} (${d.percent}%) maxD ${d.maxChannelDelta} region ${JSON.stringify(d.boundingRegion)}`}`);
}

await browser.close();
await new Promise(r => server.close(r));
await fs.writeFile(path.join(outDir, 'repeatability.json'), JSON.stringify(results, null, 2));
console.log('\nwrote repeatability.json');
