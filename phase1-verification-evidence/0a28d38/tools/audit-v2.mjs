// Mechanical audit for the b22da62 78-candidate matrix. External to the repo.
// Collects facts + runs checks; makes no judgement about perceptual quality.
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import fss from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const repoRoot = process.env.REPO_ROOT, outFile = process.env.OUT_FILE, exe = process.env.EXE;
const plan = JSON.parse(await fs.readFile(path.join(repoRoot, 'scripts/ui-ux-baseline-plan.json'), 'utf8'));
const port = Number(process.env.PORT || 4192);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url || '/', 'http://127.0.0.1');
    let rel = decodeURIComponent(u.pathname); if (rel === '/') rel = '/index.html';
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
const rows = [];

const probe = (checkpointId) => {
  const html = document.documentElement;
  const presentation = html.dataset.presentation || null;
  const vw = window.innerWidth, vh = window.innerHeight;
  const op = el => { let o = 1, n = el; while (n && n !== html) { o *= parseFloat(getComputedStyle(n).opacity) || 0; n = n.parentElement; } return o; };
  const vis = el => { if (!el) return false; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && op(el) > 0.03; };
  const lines = el => { if (!el) return null; const r = document.createRange(); r.selectNodeContents(el);
    const m = new Map(); for (const q of r.getClientRects()) { const k = Math.round(q.top); const c = m.get(k) || { l: 1e9, r: -1e9 }; m.set(k, { l: Math.min(c.l, q.left), r: Math.max(c.r, q.right) }); }
    return [...m.entries()].sort((a, b) => a[0] - b[0]).map(([top, v]) => ({ top, left: +v.l.toFixed(1), right: +v.r.toFixed(1), width: +(v.r - v.l).toFixed(1) })); };

  const allImgs = [...document.images];
  // A desktop evidence <img> on mobile intentionally has no src (data-desktop-src
  // is promoted only for the desktop presentation), so it is complete with
  // naturalWidth 0 by design. Counting it as broken produced 15 false positives
  // per mobile candidate against the redesigned mobile fallback.
  const deferred = i => i.hasAttribute('data-desktop-src') && !i.getAttribute('src');
  const brokenImages = allImgs
    .filter(i => !deferred(i))
    .filter(i => !i.complete || i.naturalWidth === 0)
    .map(i => ({ src: (i.currentSrc || i.src).slice(-70), complete: i.complete, nw: i.naturalWidth }));
  const deferredDesktopAssets = allImgs.filter(deferred).length;
  const base = {
    presentation, html_lang: html.lang, document_title: document.title,
    horizontal_overflow: html.scrollWidth > html.clientWidth,
    scroll_width: html.scrollWidth, client_width: html.clientWidth,
    doc_scroll_height: html.scrollHeight, inner_height: vh,
    broken_images: brokenImages, deferred_desktop_assets: deferredDesktopAssets, viewport: { vw, vh }
  };

  if (presentation === 'mobile-fallback') {
    const fb = document.getElementById('mobile-fallback');
    const title = document.getElementById('mobile-fallback-title');
    const avatar = document.querySelector('.mobile-profile');
    const cta = document.querySelector('.mobile-github');
    const msg = document.querySelector('.mobile-message');
    const experience = document.getElementById('experience');
    const scenes = [...document.querySelectorAll('.scene[data-scene]')];
    const st = window.__portfolioTest.getState();
    const copyLines = [...document.querySelectorAll('.mobile-copy-line')];
    const cs = el => getComputedStyle(el);
    const titleFs = title ? parseFloat(cs(title).fontSize) : null;
    const ab = avatar ? avatar.getBoundingClientRect() : null;
    return { ...base,
      mobile: {
        fallback_present: Boolean(fb) && vis(fb),
        // Current static-mode contract: MOBILE_COPY_ENTRANCE_TRIGGER_TEST.md
        copy_static_applied: fb ? fb.classList.contains('copy-static') : null,
        copy_line_count: copyLines.length,
        copy_line_animation_names: [...new Set(copyLines.map(l => cs(l).animationName))],
        copy_line_opacities: [...new Set(copyLines.map(l => cs(l).opacity))],
        copy_line_filters: [...new Set(copyLines.map(l => cs(l).filter))],
        copy_line_transforms: [...new Set(copyLines.map(l => cs(l).transform))],
        // superseded machinery must stay absent
        superseded_tokens_present: ['copy-enter', 'copyPresentationReady']
          .filter(t => fb && (fb.className.includes(t) || fb.outerHTML.includes(t))),
        title_text: title?.textContent?.trim() ?? null,
        title_font_px: titleFs, title_lines: lines(title),
        avatar_src: avatar?.currentSrc || avatar?.src || null,
        avatar_loaded: Boolean(avatar && avatar.complete && avatar.naturalWidth > 0),
        avatar_rendered: ab ? [Math.round(ab.width), Math.round(ab.height)] : null,
        avatar_centered: ab ? Math.abs((ab.left + ab.right) / 2 - vw / 2) < 6 : null,
        cta_text: cta?.textContent?.trim() ?? null,
        cta_href: cta?.getAttribute('href') ?? null,
        cta_below_avatar: (ab && cta) ? cta.getBoundingClientRect().top >= ab.bottom - 2 : null,
        guidance_text: msg?.textContent?.trim() ?? null,
        // Desktop runtime isolation, as redesigned: never started, not retro-cancelled.
        experience_computed_display: experience ? cs(experience).display : null,
        visible_desktop_scenes: scenes.filter(vis).map(s => s.dataset.scene),
        page_scrollable: html.scrollHeight > vh + 2,
        webgl_id_removed: !document.getElementById('webgl'),
        desktop_raf_alive: (typeof window.raf !== 'undefined' && Boolean(window.raf)),
        desktop_assets_requested: null,
        fallback_state: st.fallback ?? null,
        wave_running: st.fallback?.running ?? null,
        wave_time_ms: st.fallback?.timeMs ?? null,
        test_mode: st.fallback?.testMode ?? null,
        non_avatar_visible_images: allImgs.filter(i => vis(i))
          .map(i => (i.currentSrc || i.src))
          .filter(s => s && !s.includes('avatars.githubusercontent.com'))
      } };
  }

  const idx = (window.__portfolioTest?.sceneIds || {})[checkpointId.split('.')[0]];
  const scene = document.querySelector(`.scene[data-scene="${idx}"]`);
  if (!scene) return { ...base, scene_missing: true };
  const q = s => scene.querySelector(s);
  const title = q('.scene-title'), body = q('.scene-copy'), label = q('.scene-label');
  const evidenceSel = '.plate,.phone,.cue-frame,.social-frame,.nocode-runner,.audit-board,.commerce-phone-screen,.social-final-phone';
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const content = q('.scene-content');
  const cb = content ? content.getBoundingClientRect() : null;
  const overlaps = cb ? [...scene.querySelectorAll(evidenceSel)].filter(vis).map(e => ({ cls: e.className, ratio: +(inter(cb, e.getBoundingClientRect()) / (cb.width * cb.height)).toFixed(3) })).filter(o => o.ratio > 0.02) : [];
  return { ...base,
    scene_index: scene.dataset.scene, scene_opacity: +(parseFloat(getComputedStyle(scene).opacity) || 0).toFixed(3),
    label_text: label?.textContent?.trim() ?? null,
    title_text: title?.textContent?.trim() ?? null, title_lines: lines(title),
    body_text: body?.textContent?.trim() ?? null, body_lines: lines(body),
    copy_evidence_overlap: overlaps,
    commerce: (() => { const w = [...scene.querySelectorAll('.commerce-transition-word')].map(x => ({ cls: x.className.replace('commerce-transition-word ', ''), o: +op(x).toFixed(3) })).sort((a, b) => b.o - a.o);
      const p = [...scene.querySelectorAll('.commerce-phone-screen img')].map(x => ({ cls: x.className, o: +op(x).toFixed(3) })).sort((a, b) => b.o - a.o);
      return w.length || p.length ? { loudestWord: w[0] ?? null, words: w, loudestPhone: p[0] ?? null, phones: p } : null; })(),
    nocode_steps: (() => { const s = [...scene.querySelectorAll('.nocode-step')]; if (!s.length) return null;
      const a = s.map(x => { const m = getComputedStyle(x).backgroundColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/i); return m ? +parseFloat(m[1]).toFixed(3) : 0; });
      return { alphas: a, emphasisIndex: a.indexOf(Math.max(...a)), stepAttr: s.map(x => x.dataset.nocodeStep ?? null) }; })(),
    visible_evidence_images: [...scene.querySelectorAll('img')].filter(vis).map(i => { const r = i.getBoundingClientRect();
      return { cls: i.className || '(none)', w: +r.width.toFixed(1), nw: i.naturalWidth, op: +op(i).toFixed(3) }; })
  };
};

async function run(viewportId, motion, checkpoints) {
  const vp = plan.viewports[viewportId];
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, reducedMotion: motion === 'reduce' ? 'reduce' : 'no-preference', locale: 'en-US' });
  const page = await ctx.newPage();
  const errs = [], failed = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(`PAGEERROR: ${e.message}`));
  page.on('requestfailed', r => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  const imageRequests = [];
  page.on('request', r => { if (r.resourceType() === 'image') imageRequests.push(r.url()); });
  page.on('response', r => { if (r.status() >= 400) failed.push(`${r.url()} HTTP ${r.status()}`); });
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean(window.__portfolioTest));
  let ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (let i = 0; i < 4 && !ready.assetsReady; i += 1) ready = await page.evaluate(() => window.__portfolioTest.ready());
  for (const locale of plan.locales) {
    const lang = await page.evaluate(l => window.__portfolioTest.setLanguage(l), locale);
    for (const id of checkpoints) {
      let resolved = null, error = null;
      try { resolved = await page.evaluate(c => window.__portfolioTest.goToCheckpoint(c), id); } catch (e) { error = e.message; }
      const facts = await page.evaluate(probe, id);
      rows.push({ key: `${viewportId}/${locale}/${motion}/${id}`, checkpoint_id: id, viewport: viewportId, locale, motion,
        requested_lang: lang, error, resolution: resolved, ...facts });
    }
  }
  rows.push({ key: `__context__/${viewportId}/${motion}`, _console_errors: [...new Set(errs)],
    _failed_requests: [...new Set(failed)], _image_requests: [...new Set(imageRequests)].length,
    _image_request_urls: [...new Set(imageRequests)].map(u => u.split('/').pop().slice(0, 40)) });
  await ctx.close();
}
for (const [v, cps] of Object.entries(plan.normal)) await run(v, 'normal', cps);
for (const [v, cps] of Object.entries(plan.reduce)) await run(v, 'reduce', cps);
await browser.close();
await new Promise(r => server.close(r));
await fs.writeFile(outFile, JSON.stringify(rows, null, 2));
console.log('audit rows', rows.length);
