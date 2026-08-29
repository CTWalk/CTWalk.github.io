import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: path.resolve(scriptDir, '..'),
    env: process.env,
    stdio: 'inherit'
  });
  if (result.error?.code === 'ENOENT') return false;
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

let nodePlaywright = false;
try {
  require.resolve('playwright');
  nodePlaywright = true;
} catch {}

if (nodePlaywright) {
  run(process.execPath, [path.join(scriptDir, 'capture-ui-ux-baselines.mjs')]);
}

const pythonCandidates = [process.env.BASELINE_PYTHON, 'python3', 'python'].filter(Boolean);
for (const command of [...new Set(pythonCandidates)]) {
  const probe = spawnSync(command, ['-c', 'import playwright'], { stdio: 'ignore' });
  if (!probe.error && probe.status === 0) {
    run(command, [path.join(scriptDir, 'capture-ui-ux-baselines.py')]);
  }
}

console.error('No usable Playwright runtime found.');
console.error('Install either Node Playwright (npm install) or Python Playwright (python3 -m pip install -r requirements-uiux.txt).');
process.exit(2);
