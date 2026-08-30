// Pixel diff via the browser's own canvas — no image library needed.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const [a, b] = process.argv.slice(2);
const browser = await chromium.launch({ headless: true, executablePath: process.env.EXE });
const page = await browser.newPage();
const toDataUrl = async p => `data:image/png;base64,${(await fs.readFile(p)).toString('base64')}`;
const r = await page.evaluate(async ([x, y]) => {
  const load = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = src; });
  const [ia, ib] = await Promise.all([load(x), load(y)]);
  const c = document.createElement('canvas'); c.width = ia.width; c.height = ia.height;
  const g = c.getContext('2d');
  g.drawImage(ia, 0, 0); const da = g.getImageData(0, 0, c.width, c.height).data;
  g.clearRect(0, 0, c.width, c.height); g.drawImage(ib, 0, 0);
  const db = g.getImageData(0, 0, c.width, c.height).data;
  let diff = 0, max = 0, sum = 0;
  const rows = new Map();
  for (let i = 0; i < da.length; i += 4) {
    const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i+1] - db[i+1]), Math.abs(da[i+2] - db[i+2]));
    if (d > 2) { diff++; sum += d; if (d > max) max = d;
      const yy = Math.floor((i / 4) / c.width); rows.set(yy, (rows.get(yy) || 0) + 1); }
  }
  const top = [...rows.entries()].sort((p, q) => q[1] - p[1]).slice(0, 6);
  return { w: c.width, h: c.height, total: da.length / 4, diffPixels: diff, pctDiff: +(100 * diff / (da.length / 4)).toFixed(4), maxChannelDelta: max, meanDelta: diff ? +(sum / diff).toFixed(1) : 0, hottestRows: top };
}, [await toDataUrl(a), await toDataUrl(b)]);
console.log(JSON.stringify(r));
await browser.close();
