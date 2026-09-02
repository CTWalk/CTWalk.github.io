import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const discoveryRoot = path.resolve(
  process.env.UIUX_DISCOVERY_OUTPUT ||
  path.join(repoRoot, 'ui-ux-golden-path-discovery', 'ctwalk-desktop-v1')
);
const developmentRoot = path.resolve(
  process.env.UIUX_DEVELOPMENT_OUTPUT ||
  path.join(repoRoot, 'ui-ux-golden-path-discovery', 'development-v1', 'generated')
);
const planPath = path.join(repoRoot, 'scripts', 'ui-ux-baseline-plan.json');
const manifestPath = path.join(repoRoot, 'docs', 'ui-ux', 'UI_UX_BASELINE_MANIFEST.md');
const browserExecutable = process.env.BASELINE_BROWSER_EXECUTABLE || '';
const externalBaseUrl = process.env.UIUX_DISCOVERY_BASE_URL || '';
const viewport = { width: 1440, height: 900 };

const git = args => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8' }).trim();
const round = (value, digits = 4) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  const factor = 10 ** digits;
  return Math.round(number * factor) / factor;
};
const readJson = async filePath => JSON.parse(await fsp.readFile(filePath, 'utf8'));

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
  const port = Number(process.env.UIUX_DEVELOPMENT_PORT || 4184);
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
      if (!(await fsp.stat(requested)).isFile()) throw new Error('Not a file');
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

function manifestExcerpt(markdown, checkpointId) {
  const marker = `#### \`${checkpointId}\``;
  const start = markdown.indexOf(marker);
  if (start < 0) return null;
  const tail = markdown.slice(start + marker.length);
  const boundary = tail.search(/\n(?:#### |### |---\s*$)/m);
  return (boundary >= 0 ? tail.slice(0, boundary) : tail)
    .trim()
    .replace(/\n{3,}/g, '\n\n')
    .slice(0, 1800);
}

function nearest(items, progress, mapper) {
  if (!items?.length) return null;
  return items
    .map(item => ({ ...mapper(item), distance: Math.abs(item.scene_progress - progress) }))
    .sort((a, b) => a.distance - b.distance)[0] || null;
}

function localDeltas(scene, progress) {
  const step = scene?.sample_count > 1 ? 1 / (scene.sample_count - 1) : 0.04;
  const radius = Math.max(step * 2.2, 0.065);
  const nearby = (scene?.deltas || [])
    .filter(delta => {
      const center = ((delta.from_progress ?? 0) + (delta.to_progress ?? 0)) / 2;
      return Math.abs(center - progress) <= radius;
    })
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 6)
    .map(delta => ({
      from_progress: delta.from_progress,
      to_progress: delta.to_progress,
      score: delta.score,
      text_changed: delta.text_changed,
      reasons: delta.reasons
    }));
  return { sample_step: round(step), radius: round(radius), nearby };
}

async function resolveReferenceCheckpoints(browser, baseUrl, checkpointIds) {
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
    await page.goto(`${baseUrl}/?uiux-test=1`, { waitUntil: 'domcontentloaded', timeout: 30_000 });
    await page.waitForFunction(() => Boolean(window.__portfolioTest), null, { timeout: 20_000 });
    const ready = await page.evaluate(async () => window.__portfolioTest.ready());
    if (!ready.assetsReady) throw new Error('Visible assets were not ready for development diagnostics.');

    const checkpoints = [];
    for (const checkpointId of checkpointIds) {
      const resolved = await page.evaluate(async id => window.__portfolioTest.goToCheckpoint(id), checkpointId);
      checkpoints.push({
        checkpoint_id: checkpointId,
        scene_name: checkpointId.split('.')[0],
        scene_id: String(resolved.scene),
        scene_progress: round(resolved.sceneProgress),
        document_progress: round(resolved.documentProgress),
        resolver_score: round(resolved.score),
        settle: resolved.settle || null
      });
    }

    return {
      ready: { locale: ready.locale, viewport: ready.viewport, reducedMotion: ready.reducedMotion },
      console_errors: [...new Set(consoleErrors)],
      checkpoints
    };
  } finally {
    await context.close();
  }
}

function sceneSummary(scene) {
  const scores = (scene.deltas || []).map(delta => Number(delta.score) || 0).sort((a, b) => a - b);
  const at = q => scores.length ? scores[Math.min(scores.length - 1, Math.floor((scores.length - 1) * q))] : 0;
  return {
    scene_id: scene.scene_id,
    scene_name_hint: scene.scene_name_hint,
    sample_count: scene.sample_count,
    candidate_count: scene.candidates?.length || 0,
    delta_score: { min: round(scores[0] || 0), median: round(at(0.5)), p72: round(at(0.72)), max: round(scores.at(-1) || 0) },
    candidate_progresses: (scene.candidates || []).map(candidate => round(candidate.scene_progress))
  };
}

function markdownSummary(packet) {
  const lines = [
    '# V1 Development Diagnostic — Machine Summary', '',
    `Source: \`${packet.source_sha}\``, '',
    '> Development-only oracle correlation. This is not independent validation and is not an accepted baseline.', '',
    '## Scene summary', '',
    '| Scene | Samples | Candidates | Max delta |', '| --- | ---: | ---: | ---: |'
  ];
  for (const scene of packet.scene_summary) {
    lines.push(`| ${scene.scene_name_hint} | ${scene.sample_count} | ${scene.candidate_count} | ${scene.delta_score.max ?? ''} |`);
  }
  lines.push('', '## Reference checkpoint correlation', '',
    '| Checkpoint | Resolved progress | Nearest V1 candidate | Distance | <= 1 sample step |',
    '| --- | ---: | ---: | ---: | --- |');
  for (const item of packet.reference_correlation) {
    lines.push(`| ${item.checkpoint_id} | ${item.reference_resolution.scene_progress ?? ''} | ${item.nearest_candidate?.scene_progress ?? ''} | ${item.nearest_candidate?.distance ?? ''} | ${item.candidate_within_one_sample_step ? 'yes' : 'no'} |`);
  }
  lines.push('', '## Interpretation rule', '',
    'Candidate proximity is **not** semantic coverage. It only localizes the evidence the development reviewer should inspect.', '',
    'Use `development-diagnostic.json` plus the original dense observations and candidate images before assigning a failure layer.');
  return `${lines.join('\n')}\n`;
}

await fsp.mkdir(developmentRoot, { recursive: true });
for (const name of ['runtime-observations.json', 'static-signals.json', 'llm-review-packet.json']) {
  try {
    await fsp.access(path.join(discoveryRoot, name));
  } catch {
    throw new Error(`Missing ${path.join(discoveryRoot, name)}. Run npm run uiux:discover-golden-path first.`);
  }
}

const sourceSha = process.env.BASELINE_SOURCE_SHA || git(['rev-parse', 'HEAD']);
const plan = await readJson(planPath);
const manifest = await fsp.readFile(manifestPath, 'utf8');
const runtime = await readJson(path.join(discoveryRoot, 'runtime-observations.json'));
const staticSignals = await readJson(path.join(discoveryRoot, 'static-signals.json'));
const reviewPacket = await readJson(path.join(discoveryRoot, 'llm-review-packet.json'));
const checkpointIds = plan?.normal?.desktop || [];

let localServer = null;
const baseUrl = externalBaseUrl || (localServer = await startStaticServer()).baseUrl;
const launchOptions = { headless: true };
if (browserExecutable) launchOptions.executablePath = browserExecutable;
const browser = await chromium.launch(launchOptions);

try {
  const referenceRuntime = await resolveReferenceCheckpoints(browser, baseUrl, checkpointIds);
  const sceneByName = new Map(runtime.scenes.map(scene => [scene.scene_name_hint, scene]));
  const referenceById = new Map(referenceRuntime.checkpoints.map(item => [item.checkpoint_id, item]));

  const referenceCorrelation = checkpointIds.map(checkpointId => {
    const referenceResolution = referenceById.get(checkpointId);
    const scene = sceneByName.get(checkpointId.split('.')[0]);
    const progress = referenceResolution?.scene_progress ?? 0;
    const nearestSample = nearest(scene?.samples, progress, sample => ({
      sample_index: sample.sample_index,
      scene_progress: sample.scene_progress,
      structural_signature: sample.structural_signature,
      visible_text: sample.visible_text
    }));
    const nearestCandidate = nearest(scene?.candidates, progress, candidate => ({
      sample_index: candidate.sample_index,
      scene_progress: candidate.scene_progress,
      screenshot: candidate.screenshot,
      visible_text: candidate.visible_text,
      preceding_delta: candidate.preceding_delta,
      following_delta: candidate.following_delta
    }));
    const step = scene?.sample_count > 1 ? 1 / (scene.sample_count - 1) : null;

    if (nearestSample) nearestSample.distance = round(nearestSample.distance);
    if (nearestCandidate) nearestCandidate.distance = round(nearestCandidate.distance);

    return {
      checkpoint_id: checkpointId,
      scene_name: checkpointId.split('.')[0],
      manifest_excerpt: manifestExcerpt(manifest, checkpointId),
      reference_resolution: referenceResolution || null,
      nearest_v1_sample: nearestSample,
      nearest_candidate: nearestCandidate,
      candidate_within_one_sample_step: Boolean(nearestCandidate && step && nearestCandidate.distance <= step + 1e-9),
      candidate_within_two_sample_steps: Boolean(nearestCandidate && step && nearestCandidate.distance <= step * 2 + 1e-9),
      local_delta_evidence: localDeltas(scene, progress),
      diagnostic_status: 'REQUIRES_DEVELOPMENT_REVIEW'
    };
  });

  const packet = {
    schema_version: 1,
    purpose: 'Supervised V1 development diagnostic using the known CTWalk desktop checkpoint inventory as an oracle.',
    source_sha: sourceSha,
    oracle_use: {
      enabled: true,
      allowed_for_development_agent: true,
      allowed_for_generic_discovery_runner: false,
      note: 'Correlation localizes evidence; it does not prove semantic coverage.'
    },
    inputs: {
      discovery_root: path.relative(repoRoot, discoveryRoot),
      plan: path.relative(repoRoot, planPath),
      manifest: path.relative(repoRoot, manifestPath),
      browser_override: browserExecutable || null
    },
    scene_summary: runtime.scenes.map(sceneSummary),
    reference_runtime: referenceRuntime,
    reference_correlation: referenceCorrelation,
    source_signal_file_count: staticSignals.length,
    review_packet_scene_count: reviewPacket.runtime_scenes?.length || 0,
    required_failure_labels: [
      'SURFACED', 'LOST_AT_SOURCE_MINING', 'LOST_AT_RUNTIME_SAMPLING',
      'LOST_AT_STRUCTURAL_SIGNAL', 'LOST_AT_CANDIDATE_SELECTION',
      'LOST_AT_EVIDENCE_PACKAGING', 'REASONING_ONLY', 'DETERMINISTIC_CONTROL_GAP',
      'PRODUCT_INTENT_ONLY', 'REFERENCE_QUESTIONABLE'
    ],
    reviewer_instructions: [
      'Do not grade N/22.',
      'Do not infer semantic coverage from candidate proximity alone.',
      'Use the oracle to localize misses, then identify the generic signal needed without the oracle.',
      'Record false positives and tradeoffs for each proposed mechanism change.',
      'Do not edit the generic runner merely to match checkpoint IDs.'
    ]
  };

  await fsp.writeFile(path.join(developmentRoot, 'development-diagnostic.json'), `${JSON.stringify(packet, null, 2)}\n`);
  await fsp.writeFile(path.join(developmentRoot, 'V1_BASELINE_MACHINE_SUMMARY.md'), markdownSummary(packet));

  console.log(`V1 development diagnostic completed for ${sourceSha}.`);
  console.log(`Reference checkpoints resolved: ${referenceCorrelation.length}.`);
  console.log(`Machine packet: ${path.join(developmentRoot, 'development-diagnostic.json')}`);
} finally {
  await browser.close();
  if (localServer) await new Promise(resolve => localServer.server.close(resolve));
}
