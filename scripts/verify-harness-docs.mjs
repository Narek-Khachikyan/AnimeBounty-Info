import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();

const requiredPaths = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'PRD.md',
  'docs/design-docs/harness-engineering-notes.md',
  'docs/exec-plans/active/jikan-stability-and-quality.md',
  'docs/product-specs/index.md',
  'docs/quality/index.md',
];

const forbiddenPlaceholders = [
  /\bTBD\b/i,
  /\bTODO\b/i,
  /fill in/i,
  /placeholder/i,
];

const failures = [];

for (const path of requiredPaths) {
  if (!existsSync(join(root, path))) {
    failures.push(`Missing required harness file: ${path}`);
  }
}

if (existsSync(join(root, 'AGENTS.md'))) {
  const agentGuide = readFileSync(join(root, 'AGENTS.md'), 'utf8');
  const lines = agentGuide.trimEnd().split('\n').length;

  if (lines > 120) {
    failures.push(`AGENTS.md should stay short; found ${lines} lines, max is 120.`);
  }

  for (const target of ['ARCHITECTURE.md', 'docs/product-specs/index.md', 'docs/quality/index.md']) {
    if (!agentGuide.includes(target)) {
      failures.push(`AGENTS.md must link to ${target}.`);
    }
  }
}

for (const path of requiredPaths.filter((path) => path.endsWith('.md'))) {
  if (!existsSync(join(root, path))) {
    continue;
  }

  const text = readFileSync(join(root, path), 'utf8');
  for (const pattern of forbiddenPlaceholders) {
    if (pattern.test(text)) {
      failures.push(`${path} contains unresolved placeholder text: ${pattern}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Harness docs check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Harness docs check passed.');
