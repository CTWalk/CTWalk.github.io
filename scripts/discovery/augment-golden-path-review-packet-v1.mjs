import fsp from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const outputRoot = path.resolve(
  process.env.UIUX_DISCOVERY_OUTPUT ||
  path.join(repoRoot, 'ui-ux-golden-path-discovery', 'ctwalk-desktop-v1')
);
const packetPath = path.join(outputRoot, 'llm-review-packet.json');

const packet = JSON.parse(await fsp.readFile(packetPath, 'utf8'));

packet.schema_version = '1.1';
packet.adapter_inputs = [
  'window.__portfolioTest.sceneIds',
  'window.__portfolioTest.setSceneProgress(scene, progress)',
  'window.__portfolioTest.waitForVisualSettle(scene, options)'
];
packet.discovery_policy = {
  ...(packet.discovery_policy || {}),
  adapter_knowledge_must_be_reported: true,
  silent_completeness_claims_forbidden: true
};
packet.requested_output = {
  ...(packet.requested_output || {}),
  for_each_not_covered: [
    'surface_or_region',
    'reason',
    'risk_of_omission',
    'suggested_next_verification_method'
  ],
  required_sections: [
    'checkpoints',
    'exclusions',
    'not_covered',
    'human_questions',
    'deterministic_control_gaps',
    'additional_evidence_requests'
  ],
  final_questions: [
    'what important visual responsibilities appear covered?',
    'what surfaces or state dimensions are not covered and why?',
    'what ambiguities require a human?',
    'what additional runtime evidence would materially change the proposal?'
  ]
};

await fsp.writeFile(packetPath, `${JSON.stringify(packet, null, 2)}\n`);
console.log(`Augmented #48 review contract: ${packetPath}`);
