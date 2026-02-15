/**
 * Validate: contract compliance + drift checks on specs
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';
import { safeParseLocalEntitySpec } from 'afena-canon';
import pc from 'picocolors';

export async function runValidate(repoRoot: string): Promise<boolean> {
  const specsDir = join(repoRoot, 'packages', 'canon', 'src', 'specs', 'entities');

  if (!existsSync(specsDir)) {
    console.log(pc.yellow('  No specs directory — nothing to validate'));
    return true;
  }

  const files = readdirSync(specsDir).filter((f) => f.endsWith('.spec.json'));
  let ok = true;

  for (const f of files) {
    const path = join(specsDir, f);
    const raw = JSON.parse(readFileSync(path, 'utf-8'));
    const result = safeParseLocalEntitySpec(raw);
    if (!result.success) {
      console.error(pc.red(`  ✗ ${f}: ${result.error.message}`));
      ok = false;
    } else {
      console.log(pc.green(`  ✓ ${f}`));
    }
  }

  return ok;
}
