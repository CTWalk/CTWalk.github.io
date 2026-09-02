// Invariant check: the deterministic freeze must apply ONLY under ?uiux-test=1.
// Ordinary navigation must keep the intro WebGL loop live.
// Evidence: screenshot the intro twice ~600ms apart. A live rAF loop drifts; a
// frozen one does not. No browser internals are patched.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT;
const out = process.env.OUT_DIR;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(u.pathname);
    if (rel === '/') rel = '/index.html';
    const f = path.resolve(repoRoot, `.${rel}`);
    if (!f.startsWith(repoRoot)) { res.writeHead(403).end(); return; }
    if (!(await fs.stat(f)).isFile()) throw new Error('nf');
    res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
    fss.createReadStream(f).pipe(res);
  } catch { res.writeHead(404).end('nf'); }
});
await new Promise(r => server.listen(4204, '127.0.0.1', r));
await fs.mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: process.env.EXE });
const canvasPage = await (await browser.newContext()).newPage();
await canvasPage.setContent('<canvas id="c"></canvas>');

async function diff(a, b) {
  const [x, y] = await Promise.all([fs.readFile(a), fs.readFile(b)]);
  return canvasPage.evaluate(async ([p, q]) => {
    const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
    const [A, B] = await Promise.all([load(p), load(q)]);
    const c = document.getElementById('c');
    c.width = A.width; c.height = A.height;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(A, 0, 0);
    const da = g.getImageData(0, 0, c.width, c.height).data;
    g.clearRect(0, 0, c.width, c.height);
    g.drawImage(B, 0, 0);
    const db = g.getImageData(0, 0, c.width, c.height).data;
    let n = 0, max = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      if (d > 0) { n++; if (d > max) max = d; }
    }
    return { differingPixels: n, percent: +(100 * n / (da.length / 4)).toFixed(4), maxChannelDelta: max };
  }, [`data:image/png;base64,${x.toString('base64')}`, `data:image/png;base64,${y.toString('base64')}`]);
}

async function probe(query, label) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'en-US' });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:4204/${query}`, { waitUntil: 'load' });
  await page.waitForFunction(() => document.querySelector('#webgl canvas') !== null, null, { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(400);
  const f1 = path.join(out, `${label}.a.png`);
  await page.screenshot({ path: f1 });
  await page.waitForTimeout(600);
  const f2 = path.join(out, `${label}.b.png`);
  await page.screenshot({ path: f2 });
  const d = await diff(f1, f2);
  const hasCanvas = await page.evaluate(() => Boolean(document.querySelector('#webgl canvas')));
  const ctrl = await page.evaluate(() => Boolean(window.__portfolioTest));
  console.log(`${label.padEnd(12)} webglCanvas=${hasCanvas} __portfolioTest=${ctrl}  drift/600ms -> ${d.differingPixels} px (${d.percent}%) maxD ${d.maxChannelDelta}`);
  await ctx.close();
  return d;
}

const prod = await probe('', 'production');
const test = await probe('?uiux-test=1', 'testmode');
console.log('');
console.log('production intro still animating :', prod.differingPixels > 0 ? 'YES  (pixels drift, loop live)' : 'NO   <-- PRODUCTION REGRESSION');
console.log('test mode intro frozen          :', test.differingPixels === 0 ? 'YES  (zero drift)' : `NO  (${test.differingPixels} px drift)`);

await browser.close();
await new Promise(r => server.close(r));
