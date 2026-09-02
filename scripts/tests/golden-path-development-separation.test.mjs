import test from 'node:test';
import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../..');

const [discovery, diagnostic, augment, gitignore, pkgText] = await Promise.all([
  fsp.readFile(path.join(repoRoot, 'scripts', 'discovery', 'golden-path-discovery-v1.mjs'), 'utf8'),
  fsp.readFile(path.join(repoRoot, 'scripts', 'discovery', 'build-v1-development-diagnostic.mjs'), 'utf8'),
  fsp.readFile(path.join(repoRoot, 'scripts', 'discovery', 'augment-golden-path-review-packet-v1.mjs'), 'utf8'),
  fsp.readFile(path.join(repoRoot, '.gitignore'), 'utf8'),
  fsp.readFile(path.join(repoRoot, 'package.json'), 'utf8')
]);
const pkg = JSON.parse(pkgText);

test('generic V1 runner remains oracle-free while development diagnostic is oracle-aware', () => {
  assert.equal(discovery.includes('ui-ux-baseline-plan.json'), false);
  assert.equal(discovery.includes('goToCheckpoint('), false);
  assert.equal(discovery.includes('.checkpointIds'), false);

  assert.match(diagnostic, /ui-ux-baseline-plan\.json/);
  assert.match(diagnostic, /UI_UX_BASELINE_MANIFEST\.md/);
  assert.match(diagnostic, /goToCheckpoint\(/);
  assert.match(diagnostic, /allowed_for_generic_discovery_runner:\s*false/);
});

test('V1 review packet declares supervised development sequencing', () => {
  assert.match(augment, /supervised-v1-construction/);
  assert.match(augment, /reference_may_be_used_by_development_agent:\s*true/);
  assert.match(augment, /reference_may_be_used_by_generic_runner:\s*false/);
  assert.match(augment, /independent_validation:\s*'parked-until-v1-freeze'/);
});

test('development commands preserve discovery and oracle diagnostic as separate steps', () => {
  assert.equal(
    pkg.scripts?.['uiux:diagnose-golden-path-v1'],
    'node scripts/discovery/build-v1-development-diagnostic.mjs'
  );
  assert.equal(
    pkg.scripts?.['uiux:develop-golden-path-v1'],
    'npm run uiux:discover-golden-path && npm run uiux:diagnose-golden-path-v1'
  );
});

test('machine-generated development outputs do not dirty the source worktree', () => {
  assert.match(gitignore, /ui-ux-golden-path-discovery\/ctwalk-desktop-v1\//);
  assert.match(gitignore, /ui-ux-golden-path-discovery\/development-v1\/generated\//);
});
