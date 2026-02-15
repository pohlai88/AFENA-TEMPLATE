/**
 * Stage 6 — Adopt: validate spec, write to packages/canon/src/specs/entities/
 * Spec first. No partial writes.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { safeParseLocalEntitySpec } from 'afena-canon';

export async function runAdopt(repoRoot: string, entityFilter?: string): Promise<void> {
  const candidatesPath = join(repoRoot, '.afena', 'meta', 'staged', 'spec-candidates.json');
  const specsDir = join(repoRoot, 'packages', 'canon', 'src', 'specs', 'entities');

  if (!existsSync(candidatesPath)) {
    throw new Error('Run afena meta map first');
  }

  mkdirSync(specsDir, { recursive: true });

  const { candidates } = JSON.parse(readFileSync(candidatesPath, 'utf-8'));
  const toAdopt = entityFilter
    ? Object.entries(candidates).filter(([k]) => k === entityFilter)
    : Object.entries(candidates);

  for (const [entityType, spec] of toAdopt) {
    const result = safeParseLocalEntitySpec(spec);
    if (!result.success) {
      console.error(`  ✗ ${entityType}: validation failed`, result.error.message);
      throw new Error(`Contract validation failed for ${entityType}`);
    }
    const outPath = join(specsDir, `${entityType}.spec.json`);
    writeFileSync(outPath, JSON.stringify(result.data, null, 2));
    console.log(`  Wrote ${entityType}.spec.json`);
  }
}
