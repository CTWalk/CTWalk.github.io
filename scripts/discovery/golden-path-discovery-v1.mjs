import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const sourceRoot = path.join(repoRoot, 'assets', 'js');
const outputRoot = path.resolve(process.env.UIUX_DISCOVERY_OUTPUT || path.join(repoRoot, 'ui-ux-golden-path-discovery', 'ctwalk-desktop-v1'));
const viewport = { width: 1440, height: 900 };
const samplesPerScene = Math.max(12, Number(process.env.UIUX_DISCOVERY_SAMPLES || 32));
const externalBaseUrl = process.env.UIUX_DISCOVERY_BASE_URL || '';
const browserExecutable = process.env.BASELINE_BROWSER_EXECUTABLE || '';

function git(args) {
  return execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function round(value, digits = 3) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const factor = 10 ** digits;
  return Math.round(n * factor) / factor;
}

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
  const port = Number(process.env.UIUX_DISCOVERY_PORT || 4183);
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

async function listSourceFiles(root) {
  const out = [];
  async function visit(current) {
    const entries = await fsp.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await visit(full);
      else if (/\.(?:js|mjs|html|css)$/i.test(entry.name)) out.push(full);
    }
  }
  await visit(root);
  return out;
}

function extractStaticSignals(relativePath, text) {
  const sceneRefs = [...text.matchAll(/data-scene=["'`]?(\d+|[a-z-]+)["'`]?/gi)].map(match => match[1]);
  const selectors = [...text.matchAll(/querySelector(?:All)?\(\s*["'`]([^"'`]+)["'`]\s*\)/g)].map(match => match[1]);
  const classMutations = [...text.matchAll(/classList\.(add|remove|toggle)\(\s*["'`]([^"'`]+)["'`]/g)].map(match => ({ op: match[1], class_name: match[2] }));
  const dataWrites = [...text.matchAll(/dataset\.([A-Za-z0-9_]+)\s*=/g)].map(match => match[1]);
  const styleWrites = [...text.matchAll(/\.style\.([A-Za-z0-9_]+)\s*=/g)].map(match => match[1]);
  const sourceWrites = [...text.matchAll(/\.(?:src|href)\s*=\s*([^;\n]+)/g)].map(match => match[0].slice(0, 180));
  const motionSignals = {
    requestAnimationFrame: /requestAnimationFrame\s*\(/.test(text),
    reducedMotion: /prefers-reduced-motion/.test(text),
    scroll: /scroll|progress|getBoundingClientRect|offsetHeight/.test(text),
    timers: /setTimeout\s*\(|setInterval\s*\(/.test(text)
  };
  const numericRanges = [...text.matchAll(/(?:ramp|cubicRamp|setSweep)\([^\n;]*?,\s*(-?\d*\.?\d+)\s*,\s*(-?\d*\.?\d+)/g)]
    .map(match => [Number(match[1]), Number(match[2])])
    .filter(pair => pair.every(Number.isFinite));

  return {
    file: relativePath,
    scene_refs: [...new Set(sceneRefs)],
    selectors: [...new Set(selectors)].slice(0, 80),
    class_mutations: classMutations.slice(0, 80),
    dataset_writes: [...new Set(dataWrites)],
    style_writes: [...new Set(styleWrites)],
    source_writes: sourceWrites.slice(0, 40),
    motion_signals: motionSignals,
    numeric_ranges: numericRanges.slice(0, 60)
  };
}

async function staticInventory() {
  const roots = [sourceRoot, path.join(repoRoot, 'index.html'), path.join(repoRoot, 'scripts', 'tests')];
  const files = [];
  for (const root of roots) {
    try {
      const stat = await fsp.stat(root);
      if (stat.isDirectory()) files.push(...await listSourceFiles(root));
      else files.push(root);
    } catch {
      // Optional input surface.
    }
  }

  const ignored = new Set([
    path.join(repoRoot, 'scripts', 'ui-ux-baseline-plan.json'),
    path.join(repoRoot, 'docs', 'ui-ux', 'UI_UX_BASELINE_MANIFEST.md')
  ]);

  const results = [];
  for (const file of [...new Set(files)]) {
    if (ignored.has(file)) continue;
    const text = await fsp.readFile(file, 'utf8');
    results.push(extractStaticSignals(path.relative(repoRoot, file), text));
  }
  return results;
}

async function openControlledPage(page, baseUrl) {
  await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
  await page.waitForFunction(() => Boolean(window.__portfolioTest), null, { timeout: 20_000 });
  return page.evaluate(async () => {
    const ready = await window.__portfolioTest.ready();
    return {
      assetsReady: ready.assetsReady,
      locale: ready.locale,
      viewport: ready.viewport,
      reducedMotion: ready.reducedMotion,
      // Intentionally do not return checkpointIds. The discovery experiment
      // must not consume the existing checkpoint inventory as its answer.
      sceneIds: window.__portfolioTest.sceneIds
    };
  });
}

async function inspectScene(page, sceneId, sceneProgress) {
  await page.evaluate(async ({ sceneId, sceneProgress }) => {
    await window.__portfolioTest.setSceneProgress(sceneId, sceneProgress);
    await window.__portfolioTest.waitForVisualSettle(sceneId, { stableFrames: 3, timeoutMs: 1200 });
  }, { sceneId, sceneProgress });

  return page.evaluate(({ sceneId, sceneProgress }) => {
    const scene = document.querySelector(`.scene[data-scene="${sceneId}"]`);
    if (!scene) throw new Error(`Scene ${sceneId} unavailable`);
    const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
    const simplify = value => String(value || '').replace(/\s+/g, ' ').trim();
    const roundLocal = value => Math.round(Number(value) * 1000) / 1000;

    const nodes = [...scene.querySelectorAll('*')].map((node, index) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      const opacity = Number.parseFloat(style.opacity);
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const visible = style.display !== 'none' && style.visibility !== 'hidden' && opacity > 0.025 && rect.width > 1 && rect.height > 1 && rect.bottom > 0 && rect.right > 0 && rect.top < window.innerHeight && rect.left < window.innerWidth;
      if (!visible) return null;
      const text = simplify(node.childElementCount === 0 ? node.textContent : '');
      const src = node instanceof HTMLImageElement ? (node.currentSrc || node.src) : '';
      const bg = style.backgroundImage && style.backgroundImage !== 'none' ? style.backgroundImage : '';
      const semantic = node.getAttribute('aria-label') || node.getAttribute('alt') || node.getAttribute('data-state') || node.getAttribute('data-step') || '';
      const classes = typeof node.className === 'string' ? node.className.split(/\s+/).filter(Boolean).slice(0, 5).join('.') : '';
      const key = node.id ? `#${node.id}` : classes ? `${node.tagName.toLowerCase()}.${classes}` : `${node.tagName.toLowerCase()}:${index}`;
      return {
        key,
        text: text.slice(0, 160),
        semantic: simplify(semantic).slice(0, 160),
        src: src.slice(-180),
        background: bg.slice(0, 180),
        opacity: roundLocal(opacity),
        area_ratio: roundLocal(area / viewportArea),
        rect: [roundLocal(rect.left), roundLocal(rect.top), roundLocal(rect.width), roundLocal(rect.height)],
        transform: simplify(style.transform).slice(0, 120),
        filter: simplify(style.filter).slice(0, 120),
        color: style.color,
        background_color: style.backgroundColor,
        z_index: style.zIndex
      };
    }).filter(Boolean);

    const ownText = [...scene.querySelectorAll('h1,h2,h3,p,li,code,pre,[aria-label]')]
      .filter(node => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && Number.parseFloat(style.opacity) > 0.05 && rect.width > 1 && rect.height > 1;
      })
      .map(node => simplify(node.getAttribute('aria-label') || node.textContent).slice(0, 220))
      .filter(Boolean);

    return {
      scene_id: String(sceneId),
      scene_progress: sceneProgress,
      scene_opacity: roundLocal(Number.parseFloat(getComputedStyle(scene).opacity)),
      visible_text: [...new Set(ownText)].slice(0, 30),
      visible_nodes: nodes
    };
  }, { sceneId, sceneProgress });
}

function nodeMap(sample) {
  return new Map(sample.visible_nodes.map(node => [node.key, node]));
}

function deltaScore(a, b) {
  const left = nodeMap(a);
  const right = nodeMap(b);
  const keys = new Set([...left.keys(), ...right.keys()]);
  let score = 0;
  const reasons = [];

  for (const key of keys) {
    const x = left.get(key);
    const y = right.get(key);
    if (!x || !y) {
      const node = x || y;
      const contribution = 2 + Math.min(4, (node?.area_ratio || 0) * 20);
      score += contribution;
      reasons.push({ key, type: x ? 'disappeared' : 'appeared', contribution: round(contribution) });
      continue;
    }
    if (x.text !== y.text || x.semantic !== y.semantic || x.src !== y.src || x.background !== y.background) {
      score += 3;
      reasons.push({ key, type: 'content', contribution: 3 });
    }
    const opacityDelta = Math.abs((x.opacity || 0) - (y.opacity || 0));
    if (opacityDelta > 0.08) {
      const contribution = opacityDelta * (1 + Math.min(3, Math.max(x.area_ratio, y.area_ratio) * 18));
      score += contribution;
      reasons.push({ key, type: 'opacity', contribution: round(contribution) });
    }
    const rectDelta = x.rect.reduce((sum, value, index) => sum + Math.abs(value - y.rect[index]), 0) / Math.max(1, viewport.width + viewport.height);
    if (rectDelta > 0.012) {
      const contribution = Math.min(3, rectDelta * 12);
      score += contribution;
      reasons.push({ key, type: 'geometry', contribution: round(contribution) });
    }
    if (x.transform !== y.transform || x.filter !== y.filter) {
      score += 0.4;
    }
  }

  const textChanged = JSON.stringify(a.visible_text) !== JSON.stringify(b.visible_text);
  if (textChanged) score += 2;
  return { score: round(score), text_changed: textChanged, reasons: reasons.sort((x, y) => y.contribution - x.contribution).slice(0, 10) };
}

function candidateIndices(samples, deltas) {
  const selected = new Set([0, samples.length - 1]);
  const scores = deltas.map(item => item.score);
  const sorted = [...scores].sort((a, b) => a - b);
  const percentile = sorted[Math.floor(sorted.length * 0.72)] || 0;
  const threshold = Math.max(1.3, percentile);

  for (let i = 0; i < deltas.length; i += 1) {
    const current = deltas[i].score;
    const previous = deltas[i - 1]?.score ?? -Infinity;
    const next = deltas[i + 1]?.score ?? -Infinity;
    if (current >= threshold && current >= previous && current >= next) {
      selected.add(i);
      selected.add(i + 1);
    }
  }

  // Preserve one representative from quiet/stable spans between change peaks.
  const ordered = [...selected].sort((a, b) => a - b);
  for (let i = 0; i < ordered.length - 1; i += 1) {
    if (ordered[i + 1] - ordered[i] >= 5) selected.add(Math.round((ordered[i + 1] + ordered[i]) / 2));
  }

  return [...selected].sort((a, b) => a - b);
}

function structuralSignature(sample) {
  return sha256(JSON.stringify({
    visible_text: sample.visible_text,
    visible_nodes: sample.visible_nodes.map(node => ({
      key: node.key,
      text: node.text,
      semantic: node.semantic,
      src: node.src,
      background: node.background,
      opacity: Math.round((node.opacity || 0) * 10) / 10,
      area_ratio: Math.round((node.area_ratio || 0) * 100) / 100,
      color: node.color,
      background_color: node.background_color
    }))
  }));
}

async function runtimeInventory(browser, baseUrl) {
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    reducedMotion: 'no-preference',
    locale: 'en-US'
  });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('pageerror', error => consoleErrors.push(error.message));

  try {
    const ready = await openControlledPage(page, baseUrl);
    if (!ready.assetsReady) throw new Error('Visible assets were not ready for discovery.');
    const sceneEntries = Object.entries(ready.sceneIds || {}).sort((a, b) => Number(a[1]) - Number(b[1]));
    const scenes = [];

    for (const [sceneName, sceneId] of sceneEntries) {
      const samples = [];
      for (let index = 0; index <= samplesPerScene; index += 1) {
        const progress = index / samplesPerScene;
        const sample = await inspectScene(page, sceneId, progress);
        sample.sample_index = index;
        sample.scene_name_hint = sceneName;
        sample.structural_signature = structuralSignature(sample);
        samples.push(sample);
      }

      const deltas = samples.slice(1).map((sample, index) => ({
        from_index: index,
        to_index: index + 1,
        from_progress: samples[index].scene_progress,
        to_progress: sample.scene_progress,
        ...deltaScore(samples[index], sample)
      }));
      const indices = candidateIndices(samples, deltas);

      const candidateDir = path.join(outputRoot, 'candidate-images', `scene-${sceneId}`);
      await fsp.mkdir(candidateDir, { recursive: true });
      const candidates = [];
      for (const index of indices) {
        const sample = samples[index];
        await page.evaluate(async ({ sceneId, progress }) => {
          await window.__portfolioTest.setSceneProgress(sceneId, progress);
          await window.__portfolioTest.waitForVisualSettle(sceneId, { stableFrames: 3, timeoutMs: 1200 });
        }, { sceneId, progress: sample.scene_progress });
        const fileName = `p-${String(Math.round(sample.scene_progress * 1000)).padStart(4, '0')}.png`;
        const imagePath = path.join(candidateDir, fileName);
        await page.screenshot({ path: imagePath, fullPage: false, animations: 'allow' });
        candidates.push({
          sample_index: index,
          scene_progress: sample.scene_progress,
          screenshot: path.relative(outputRoot, imagePath),
          visible_text: sample.visible_text,
          structural_signature: sample.structural_signature,
          preceding_delta: deltas[index - 1] || null,
          following_delta: deltas[index] || null
        });
      }

      scenes.push({
        scene_id: String(sceneId),
        scene_name_hint: sceneName,
        sample_count: samples.length,
        candidates,
        deltas,
        samples
      });
    }

    return {
      ready,
      console_errors: [...new Set(consoleErrors)],
      scenes
    };
  } finally {
    await context.close();
  }
}

function buildLlmPacket({ sourceSha, staticSignals, runtime }) {
  const compactScenes = runtime.scenes.map(scene => ({
    scene_id: scene.scene_id,
    scene_name_hint: scene.scene_name_hint,
    sample_count: scene.sample_count,
    candidates: scene.candidates.map(candidate => ({
      sample_index: candidate.sample_index,
      scene_progress: candidate.scene_progress,
      screenshot: candidate.screenshot,
      visible_text: candidate.visible_text,
      preceding_change: candidate.preceding_delta ? {
        score: candidate.preceding_delta.score,
        text_changed: candidate.preceding_delta.text_changed,
        reasons: candidate.preceding_delta.reasons
      } : null,
      following_change: candidate.following_delta ? {
        score: candidate.following_delta.score,
        text_changed: candidate.following_delta.text_changed,
        reasons: candidate.following_delta.reasons
      } : null
    }))
  }));

  return {
    schema_version: 1,
    purpose: 'Independent golden-path discovery. Do not infer or reproduce the repository\'s existing checkpoint manifest.',
    source_sha: sourceSha,
    viewport,
    discovery_policy: {
      existing_checkpoint_manifest_is_input: false,
      source_runtime_first: true,
      visual_review_is_selective: true,
      target_checkpoint_count: null
    },
    source_signals: staticSignals,
    runtime_scenes: compactScenes,
    requested_output: {
      classifications: ['baseline-worthy', 'visually-redundant', 'functional-only', 'transient', 'temporal-runtime-only', 'human-only', 'uncertain'],
      for_each_baseline_candidate: ['derived_id', 'scene_id', 'scene_progress', 'semantic_responsibility', 'unique_visual_value', 'stable_condition', 'human_question_if_any'],
      for_each_exclusion: ['scene_id', 'scene_progress_or_range', 'classification', 'reason'],
      final_questions: ['what important visual responsibilities appear covered?', 'what ambiguities require a human?', 'what additional runtime evidence would materially change the proposal?']
    }
  };
}

await fsp.mkdir(outputRoot, { recursive: true });
const sourceSha = process.env.BASELINE_SOURCE_SHA || git(['rev-parse', 'HEAD']);
const staticSignals = await staticInventory();
let localServer = null;
const baseUrl = externalBaseUrl || (localServer = await startStaticServer()).baseUrl;
const launchOptions = { headless: true };
if (browserExecutable) launchOptions.executablePath = browserExecutable;
const browser = await chromium.launch(launchOptions);

try {
  const runtime = await runtimeInventory(browser, baseUrl);
  const packet = buildLlmPacket({ sourceSha, staticSignals, runtime });
  await fsp.writeFile(path.join(outputRoot, 'static-signals.json'), `${JSON.stringify(staticSignals, null, 2)}\n`);
  await fsp.writeFile(path.join(outputRoot, 'runtime-observations.json'), `${JSON.stringify(runtime, null, 2)}\n`);
  await fsp.writeFile(path.join(outputRoot, 'llm-review-packet.json'), `${JSON.stringify(packet, null, 2)}\n`);
  await fsp.writeFile(path.join(outputRoot, 'README.md'), `# Golden Path Discovery V1 Output\n\nSource: \`${sourceSha}\`\n\nThis directory is experimental discovery evidence. It is not an authoritative baseline.\n\nFiles:\n\n- \`static-signals.json\` — code/test signals gathered without reading the active baseline manifest.\n- \`runtime-observations.json\` — dense DOM/style observations across each desktop scene.\n- \`candidate-images/\` — screenshots only for change peaks, boundaries, and representative stable spans.\n- \`llm-review-packet.json\` — compact packet for the runtime LLM to classify and compress candidates.\n\nThe runtime LLM must not read \`scripts/ui-ux-baseline-plan.json\` or \`docs/ui-ux/UI_UX_BASELINE_MANIFEST.md\` until it has frozen its independent proposal.\n`);

  console.log(`Golden-path discovery V1 completed for ${sourceSha}.`);
  console.log(`Scenes observed: ${runtime.scenes.length}.`);
  console.log(`Candidate screenshots: ${runtime.scenes.reduce((sum, scene) => sum + scene.candidates.length, 0)}.`);
  console.log(`LLM packet: ${path.join(outputRoot, 'llm-review-packet.json')}`);
} finally {
  await browser.close();
  if (localServer) await new Promise(resolve => localServer.server.close(resolve));
}
