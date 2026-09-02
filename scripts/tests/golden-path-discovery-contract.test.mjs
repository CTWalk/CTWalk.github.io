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

const briefPath = path.join(repoRoot, 'ui-ux-golden-path-discovery', 'PHASE_A_BLIND_REVIEWER_BRIEF.md');
const controlPath = path.join(repoRoot, 'ui-ux-golden-path-discovery', 'PHASE_A_CONTAMINATION_CONTROL.md');

// Any file the blind reviewer is allowed to read must not enumerate the expected
// checkpoint inventory. R1's original two-file denylist was shown to miss 11 further
// files, so the reviewer now works from an allowlist and the allowed files are linted.
const CHECKPOINT_ID = /\b(?:commerce|nocode|social|cuesheet|dca|intro|outro)\.[a-z][a-z-]*\b/g;

test('blind reviewer brief exists and leaks no checkpoint identifiers', async () => {
  const brief = await fsp.readFile(briefPath, 'utf8');
  assert.deepEqual(brief.match(CHECKPOINT_ID) ?? [], []);
  assert.match(brief, /not_covered/);
  assert.match(brief, /do not revise this file/i);
});

test('discovery and augment scripts leak no checkpoint identifiers', () => {
  assert.deepEqual(discovery.match(CHECKPOINT_ID) ?? [], []);
  assert.deepEqual(augment.match(CHECKPOINT_ID) ?? [], []);
});

test('contamination control names the critical leakage vectors', async () => {
  const control = await fsp.readFile(controlPath, 'utf8');
  for (const f of [
    'docs/ui-ux/UI_UX_TEST_CONTROL.md',
    'docs/ui-ux/UI_UX_GOLDEN_PATH_DISCOVERY_RESEARCH.md',
    'scripts/controls/ui-ux-test-control.js'
  ]) assert.ok(control.includes(f), `contamination control must quarantine ${f}`);
});
