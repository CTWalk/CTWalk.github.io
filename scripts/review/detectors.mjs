// Mechanical detectors for the #6 review protocol.
// Each detector encodes a rule that is stated in UI_UX_ACCEPTANCE_CONTRACT.md (#5)
// or UI_UX_BASELINE_MANIFEST.md (#12). They TRIAGE; they never approve.
// Perceptual questions (is the message clear, is the pause felt, is a wrap awkward
// to a native reader) are deliberately out of scope and stay with the reviewer.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT;
const outFile = process.env.OUT_FILE;
const exe = process.env.EXE || undefined;
const port = Number(process.env.PORT || 4155);
const plan = JSON.parse(await fs.readFile(path.join(repoRoot, 'scripts/ui-ux-baseline-plan.json'), 'utf8'));

const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
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

// Scratch page used purely as a pixel-sampling canvas for the captured PNG.
const canvasPage = await (await browser.newContext()).newPage();
await canvasPage.setContent('<canvas id="c"></canvas>');

async function brightFractions(pngBuffer, rects) {
  return canvasPage.evaluate(async ([dataUrl, boxes]) => {
    const img = await new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = dataUrl; });
    const c = document.getElementById('c');
    c.width = img.width; c.height = img.height;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0);
    return boxes.map(b => {
      const x = Math.max(0, Math.round(b.x)), y = Math.max(0, Math.round(b.y));
      const w = Math.min(c.width - x, Math.round(b.w)), h = Math.min(c.height - y, Math.round(b.h));
      if (w <= 0 || h <= 0) return null;
      const d = g.getImageData(x, y, w, h).data;
      let bright = 0, n = 0, sum = 0;
      for (let i = 0; i < d.length; i += 4) {
        const L = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
        sum += L; n++; if (L > 0.5) bright++;
      }
      return { brightFraction: +(bright / n).toFixed(4), meanLuminance: +(sum / n).toFixed(4) };
    });
  }, [`data:image/png;base64,${pngBuffer.toString('base64')}`, rects]);
}

const collect = (checkpointId) => {
  const vw = window.innerWidth, vh = window.innerHeight;
  const op = el => { let o = 1, n = el; while (n && n !== document.documentElement) { o *= parseFloat(getComputedStyle(n).opacity) || 0; n = n.parentElement; } return o; };
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && op(el) > 0.03; };
  const box = el => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; };
  const inter = (a, b) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

  const sceneKey = checkpointId.split('.')[0];
  const idx = (window.__portfolioTest?.sceneIds || {})[sceneKey];
  const scene = document.querySelector(`.scene[data-scene="${idx}"]`);
  if (!scene) return null;
  const sceneOpacity = parseFloat(getComputedStyle(scene).opacity) || 0;

  // Rendered line geometry from Range rects — a wrap fact, never a source-\n fact (#5 G-03).
  const lines = el => {
    const r = document.createRange(); r.selectNodeContents(el);
    const rows = new Map();
    for (const q of r.getClientRects()) {
      const k = Math.round(q.top);
      const cur = rows.get(k) || { left: Infinity, right: -Infinity };
      rows.set(k, { left: Math.min(cur.left, q.left), right: Math.max(cur.right, q.right) });
    }
    return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([top, v]) => ({ top, width: v.right - v.left, left: v.left, right: v.right }));
  };

  const textSel = '.scene-title,.scene-copy,.scene-label,.scene-link';
  const texts = [...scene.querySelectorAll(textSel)].filter(vis).map(el => ({
    cls: el.className, box: box(el), opacity: +op(el).toFixed(3),
    color: getComputedStyle(el).color, lines: lines(el), text: el.textContent.trim().slice(0, 90)
  }));

  const evidenceSel = '.plate,.phone,.cue-frame,.social-frame,.nocode-runner,.audit-board,.commerce-phone-screen,.social-final-phone';
  const evidence = [...scene.querySelectorAll(evidenceSel)].filter(vis).map(el => ({ cls: el.className, box: box(el), opacity: +op(el).toFixed(3) }));

  const copy = scene.querySelector('.scene-content');
  const copyBox = copy && vis(copy) ? box(copy) : null;
  const copyOverlap = copyBox ? evidence
    .filter(e => e.opacity > 0.15)
    .map(e => ({ cls: e.cls, ratio: +(inter(copyBox, e.box) / (copyBox.w * copyBox.h)).toFixed(3) }))
    .filter(e => e.ratio > 0.02) : [];

  // Text escaping the element that paints its background (row pills, cards).
  const rowOpacities = [...scene.querySelectorAll('.audit-row,.nocode-runner,.audit-result')].filter(vis).map(op);
  const maxRowOpacity = rowOpacities.length ? Math.max(...rowOpacities) : 0;
  const escapes = [];
  for (const host of scene.querySelectorAll('.audit-row,.nocode-runner,.audit-result')) {
    if (!vis(host)) continue;
    if (op(host) < 0.85 * maxRowOpacity) continue; // a receding row is context, not the read target
    const hb = host.getBoundingClientRect();
    for (const kid of host.querySelectorAll('*')) {
      if (!kid.textContent.trim() || kid.children.length) continue;
      const r = document.createRange(); r.selectNodeContents(kid);
      for (const q of r.getClientRects()) {
        const over = Math.max(q.bottom - hb.bottom, hb.top - q.top, q.right - hb.right, hb.left - q.left);
        if (over > 2) escapes.push({ host: host.className, text: kid.textContent.trim().slice(0, 50), overflowPx: +over.toFixed(1) });
      }
    }
  }

  // Visible evidence images: rendered scale vs intrinsic scale.
  const clipperOf = el => { let n = el.parentElement; while (n && n !== document.body) { if (getComputedStyle(n).overflow !== 'visible') return n; n = n.parentElement; } return null; };
  const imgs = [...scene.querySelectorAll('img')].filter(vis).map(i => {
    const r = i.getBoundingClientRect();
    const clip = clipperOf(i);
    const natAspect = i.naturalWidth && i.naturalHeight ? i.naturalWidth / i.naturalHeight : null;
    const boxAspect = r.height ? r.width / r.height : null;
    // object-fit: cover hides whichever axis is over-long. This is content the
    // reviewer cannot see even though the element box looks fine.
    let coverCrop = 0;
    if (getComputedStyle(i).objectFit === 'cover' && natAspect && boxAspect) {
      coverCrop = boxAspect < natAspect ? 1 - boxAspect / natAspect : 1 - natAspect / boxAspect;
    }
    return { cls: i.className || '(none)', clipper: clip ? clip.className : null,
      src: (i.currentSrc || i.src).split('/').pop().slice(0, 60),
      renderedWidth: +r.width.toFixed(1), naturalWidth: i.naturalWidth,
      scale: i.naturalWidth ? +(r.width / i.naturalWidth).toFixed(3) : null,
      coverCrop: +coverCrop.toFixed(3), opacity: +op(i).toFixed(3) };
  });

  // Evidence images clipped by their own frame (over-crop), #5 Scene 4 readability.
  const croppedEvidence = [];
  for (const img of scene.querySelectorAll('img')) {
    if (!vis(img)) continue;
    const host = img.closest('.plate,.cue-frame,.cuesheet-desktop,.commerce-phone-screen,.social-final-phone-screen');
    if (!host || host === img) continue;
    const ib = img.getBoundingClientRect(), hb = host.getBoundingClientRect();
    const shown = Math.max(0, Math.min(ib.right, hb.right) - Math.max(ib.left, hb.left)) *
                  Math.max(0, Math.min(ib.bottom, hb.bottom) - Math.max(ib.top, hb.top));
    const area = ib.width * ib.height;
    if (area > 0 && 1 - shown / area > 0.35)
      croppedEvidence.push({ cls: img.className || host.className, hiddenFraction: +(1 - shown / area).toFixed(3) });
  }

  // Container shown but every image inside it invisible (#5 G-08).
  const emptyEvidence = [...scene.querySelectorAll('.phone,.commerce-phone-screen,.plate')].filter(vis)
    .filter(c => { const kids = [...c.querySelectorAll('img')]; return kids.length > 0 && kids.every(k => op(k) < 0.05); })
    .map(c => c.className);

  // CommerceOps: loudest transition word vs loudest phone evidence (#12 scenario pairing).
  const word = [...scene.querySelectorAll('.commerce-transition-word')]
    .map(w => ({ cls: w.className, o: +op(w).toFixed(3) })).sort((a, b) => b.o - a.o)[0] || null;
  const phone = [...scene.querySelectorAll('.commerce-phone-screen img')]
    .map(p => ({ cls: p.className, o: +op(p).toFixed(3) })).sort((a, b) => b.o - a.o)[0] || null;
  const phoneImagesAllHidden = (() => {
    const kids = [...scene.querySelectorAll('.commerce-phone-screen img')];
    return kids.length > 0 && kids.every(k => op(k) < 0.05);
  })();

  // noCodeE2E: which step index carries the emphasis.
  const steps = [...scene.querySelectorAll('.nocode-step')];
  const alphas = steps.map(s => { const m = getComputedStyle(s).backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i); return m ? parseFloat(m[1]) : 0; });
  const stepEmphasis = steps.length ? { index: alphas.indexOf(Math.max(...alphas)), count: steps.length, alpha: +Math.max(...alphas).toFixed(3) } : null;

  return { vw, vh, sceneIndex: scene.dataset.scene, sceneOpacity, texts, evidence, copyBox, copyOverlap, escapes, imgs, croppedEvidence, emptyEvidence, phoneImagesAllHidden, word, phone, stepEmphasis };
};

function judge(f, checkpointId) {
  const flags = [];
  const vw = f.vw, vh = f.vh;

  // D2 copy/evidence overlap — #5 §6 "primary copy and primary evidence can coexist without overlap"
  for (const o of f.copyOverlap) if (o.ratio >= 0.25) flags.push({ id: 'D2_COPY_EVIDENCE_OVERLAP', detail: `${o.cls} covers ${(o.ratio * 100).toFixed(0)}% of the copy block` });

  // D3 text escaping its painted container — accidental clipping
  for (const e of f.escapes) flags.push({ id: 'D3_TEXT_ESCAPES_CONTAINER', detail: `"${e.text}" overflows ${e.host} by ${e.overflowPx}px` });

  // D4 text at/over the viewport edge — clipping
  for (const t of f.texts) for (const l of t.lines) {
    if (l.right > vw - 0.5) flags.push({ id: 'D4_EDGE_CLIP', detail: `${t.cls} line reaches x=${l.right.toFixed(0)} of ${vw}` });
    if (l.left < 0.5) flags.push({ id: 'D4_EDGE_CLIP', detail: `${t.cls} line starts at x=${l.left.toFixed(0)}` });
  }

  // D5 evidence rendered too small to read — #5 "not shrunk until text becomes texture"
  for (const i of f.imgs) {
    if (i.opacity < 0.3) continue;
    const isPhoneEvidence = /social-final-phone-screen|commerce-phone-screen|social-mobile-log/.test(i.clipper || '') ||
                            /social-final-phone|social-mobile-log/.test(i.cls);
    if (isPhoneEvidence && i.renderedWidth < 150)
      flags.push({ id: 'D5_EVIDENCE_TOO_SMALL', detail: `phone evidence in ${i.clipper} rendered ${i.renderedWidth}px wide (source ${i.naturalWidth}px)` });
  }

  // D6 evidence container visible but empty — #5 G-08
  for (const c of f.emptyEvidence) flags.push({ id: 'D6_EMPTY_EVIDENCE', detail: `${c} visible with no visible image inside` });
  if (f.phoneImagesAllHidden) flags.push({ id: 'D6_EMPTY_EVIDENCE', detail: 'commerce phone screen shows no scenario image' });

  // D10 product screenshot losing a large share of its content to object-fit cover (#5 Scene 4).
  for (const i of f.imgs) {
    if (i.opacity < 0.3 || i.coverCrop < 0.35) continue;
    if (/scene-bg|scene-blur/.test(i.cls)) continue; // ambient backdrops are meant to be cropped
    flags.push({ id: 'D10_EVIDENCE_OVERCROPPED', detail: `${i.cls} loses ${(i.coverCrop * 100).toFixed(0)}% of its content to object-fit cover` });
  }

  // D7 CommerceOps scenario pairing — #12 checkpoint definitions
  const expect = { 'commerce.checkout-event': 'checkout', 'commerce.expired-promo': 'expired', 'commerce.unavailable': 'unavailable', 'commerce.final-settled': 'unavailable' }[checkpointId];
  if (expect && f.phone && f.phone.o > 0.2 && !f.phone.cls.includes(expect))
    flags.push({ id: 'D7_SCENARIO_DESYNC', detail: `expected ${expect} phone, loudest is ${f.phone.cls} (${f.phone.o})` });

  // D8 noCodeE2E emphasis position — #12 "a middle execution step"
  if (checkpointId === 'nocode.execution' && f.stepEmphasis && (f.stepEmphasis.index === 0 || f.stepEmphasis.index === f.stepEmphasis.count - 1))
    flags.push({ id: 'D8_STEP_NOT_MIDDLE', detail: `emphasised step ${f.stepEmphasis.index + 1}/${f.stepEmphasis.count}` });

  // D9 short last line (orphan/widow) on multi-line titles — #5 G-03
  for (const t of f.texts) {
    if (!/scene-title/.test(t.cls) || t.lines.length < 2) continue;
    const widths = t.lines.map(l => l.width), last = widths[widths.length - 1], max = Math.max(...widths);
    if (last / max < 0.3) flags.push({ id: 'D9_SHORT_LAST_LINE', detail: `title last line ${(100 * last / max).toFixed(0)}% of widest` });
  }

  return flags;
}

const rows = [];
async function run(viewportId, motion, checkpoints) {
  const vp = plan.viewports[viewportId];
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', locale: 'en-US' });
  const page = await ctx.newPage();
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__portfolioTest));
  let ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (let i = 0; i < 4 && !ready.assetsReady; i += 1) ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (const locale of plan.locales) {
    await page.evaluate(l => window.__portfolioTest.setLanguage(l), locale);
    for (const id of checkpoints) {
      await page.evaluate(c => window.__portfolioTest.goToCheckpoint(c), id);
      const facts = await page.evaluate(collect, id);
      const flags = judge(facts, id);
      // D1 needs pixels: is light-coloured copy sitting on a bright ground?
      const overlapsEvidence = box => facts.evidence.some(e => e.opacity > 0.15 &&
        Math.max(0, Math.min(box.x + box.w, e.box.x + e.box.w) - Math.max(box.x, e.box.x)) *
        Math.max(0, Math.min(box.y + box.h, e.box.y + e.box.h) - Math.max(box.y, e.box.y)) > 0.15 * box.w * box.h);
      const lightTexts = facts.texts.filter(t => {
        if (!overlapsEvidence(t.box)) return false;
        const m = t.color.match(/(\d+),\s*(\d+),\s*(\d+)/);
        if (!m) return false;
        const L = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
        return L > 0.55 && t.opacity > 0.25;
      });
      if (lightTexts.length) {
        const shot = await page.screenshot({ fullPage: false });
        const samples = await brightFractions(shot, lightTexts.map(t => t.box));
        samples.forEach((s, i) => {
          if (s && s.brightFraction >= 0.30)
            flags.push({ id: 'D1_LIGHT_TEXT_ON_BRIGHT', detail: `${lightTexts[i].cls}: ${(s.brightFraction * 100).toFixed(0)}% of its box is bright (mean L=${s.meanLuminance})` });
        });
      }
      rows.push({ key: `${viewportId}/${locale}/${motion}/${id}`, checkpoint_id: id, viewport: viewportId, locale, motion, flags, facts_digest: { copyOverlap: facts.copyOverlap, escapes: facts.escapes.length, emptyEvidence: facts.emptyEvidence, croppedEvidence: facts.croppedEvidence, phoneImagesAllHidden: facts.phoneImagesAllHidden, sceneOpacity: facts.sceneOpacity, word: facts.word, phone: facts.phone, stepEmphasis: facts.stepEmphasis } });
    }
  }
  await ctx.close();
}

for (const [v, cps] of Object.entries(plan.normal)) await run(v, 'normal', cps);
for (const [v, cps] of Object.entries(plan.reduce)) await run(v, 'reduce', cps);
await browser.close();
await new Promise(r => server.close(r));
await fs.writeFile(outFile, JSON.stringify(rows, null, 2));
console.log('detector rows', rows.length, 'flagged', rows.filter(r => r.flags.length).length);
