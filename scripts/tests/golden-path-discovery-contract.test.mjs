import test from 'node:test';
import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(testDir, '../..');
const discoveryPath = path.join(repoRoot, 'scripts', 'discovery', 'golden-path-discovery-v1.mjs');
const augmentPath = path.join(repoRoot, 'scripts', 'discovery', 'augment-golden-path-review-packet-v1.mjs');
const packagePath = path.join(repoRoot, 'package.json');

const discovery = await fsp.readFile(discoveryPath, 'utf8');
const augment = await fsp.readFile(augmentPath, 'utf8');
const pkg = JSON.parse(await fsp.readFile(packagePath, 'utf8'));

test('V1 discovery does not consume the active checkpoint manifest or plan', () => {
  assert.equal(discovery.includes("readFile(path.join(scriptDir, '..', 'ui-ux-baseline-plan.json')"), false);
  assert.equal(discovery.includes('goToCheckpoint('), false);
  assert.equal(discovery.includes('.checkpointIds'), false);
  assert.match(discovery, /setSceneProgress\(/);
});

test('V1 discovery is exposed as an explicit experimental npm command', () => {
  assert.equal(
    pkg.scripts?.['uiux:discover-golden-path'],
    'node scripts/discovery/golden-path-discovery-v1.mjs && node scripts/discovery/augment-golden-path-review-packet-v1.mjs'
  );
});

test('V1 output is isolated from authoritative baseline candidates', () => {
  assert.match(discovery, /ui-ux-golden-path-discovery/);
  assert.equal(discovery.includes("path.join(repoRoot, 'baseline-candidates'"), false);
});

test('V1 review handoff requires explicit not-covered reporting', () => {
  assert.match(augment, /for_each_not_covered/);
  assert.match(augment, /risk_of_omission/);
  assert.match(augment, /suggested_next_verification_method/);
  assert.match(augment, /silent_completeness_claims_forbidden/);
});

test('V1 review handoff declares CTWalk adapter knowledge', () => {
  assert.match(augment, /__portfolioTest\.sceneIds/);
  assert.match(augment, /__portfolioTest\.setSceneProgress/);
  assert.match(augment, /__portfolioTest\.waitForVisualSettle/);
  assert.match(augment, /adapter_knowledge_must_be_reported/);
});
