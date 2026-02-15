#!/usr/bin/env node

/**
 * CI Adapter Gates — N1–N4 for ERP refactor adoption
 *
 * N1: Spec determinism — run pipeline twice, compare inputsHash
 * N2: Contract compliance — Specs satisfy LocalEntitySpec (afena meta validate)
 * N3: Spine lock — locked entityTypes must not have adopted specs
 * N4: Drift detection — (deferred: Drizzle schema must match spec)
 *
 * Usage: node tools/ci-adapter-gates.mjs
 * Exit code 0 = pass, 1 = fail
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

let failures = 0;

// N1: Spec determinism — run pipeline twice (pilot only), compare inputsHash
console.log('\n── N1: Spec determinism ──');
try {
  execSync('pnpm afena:dev meta run --entity video-settings', { cwd: ROOT, stdio: 'pipe' });
  const specDir = join(ROOT, 'packages', 'canon', 'src', 'specs', 'entities');
  const specs = existsSync(specDir)
    ? (await import('fs')).readdirSync(specDir).filter((f) => f.endsWith('.spec.json'))
    : [];
  if (specs.length === 0) {
    console.log('  ✓ N1 skipped (no specs)');
  } else {
    const hashes1 = {};
    for (const f of specs) {
      const spec = JSON.parse(readFileSync(join(specDir, f), 'utf-8'));
      if (spec.meta?.inputsHash) hashes1[f] = spec.meta.inputsHash;
    }
    execSync('pnpm afena:dev meta run --entity video-settings', { cwd: ROOT, stdio: 'pipe' });
    for (const f of Object.keys(hashes1)) {
      const path = join(specDir, f);
      if (!existsSync(path)) {
        console.error(`  ✗ N1 failed: ${f} missing after second run`);
        failures++;
      } else {
        const spec = JSON.parse(readFileSync(path, 'utf-8'));
        if (spec.meta?.inputsHash && hashes1[f] !== spec.meta.inputsHash) {
          console.error(`  ✗ N1 failed: ${f} inputsHash changed between runs`);
          failures++;
        }
      }
    }
    if (!failures) console.log('  ✓ N1 passed');
  }
} catch (e) {
  console.error('  ✗ N1 failed:', e.message);
  failures++;
}

// N2: Contract compliance — run via tsx to avoid CLI bundle pulling in database
console.log('\n── N2: Contract compliance (LocalEntitySpec) ──');
try {
  execSync('pnpm afena:dev meta validate', {
    cwd: ROOT,
    stdio: 'inherit',
  });
  console.log('  ✓ N2 passed');
} catch (e) {
  console.error('  ✗ N2 failed: afena meta validate exited non-zero');
  failures++;
}

// N3: Spine lock — locked entityTypes must not have adopted specs
console.log('\n── N3: Spine lock ──');
const spinePath = join(ROOT, 'packages', 'canon', 'src', 'adapters', 'erpnext', 'spine-denylist.json');
if (existsSync(spinePath)) {
  try {
    const spine = JSON.parse(readFileSync(spinePath, 'utf-8'));
    const locked = new Set([
      ...(spine.entityTypes?.db ?? []),
      ...(spine.entityTypes?.['db+ui'] ?? []),
    ]);
    const specDir = join(ROOT, 'packages', 'canon', 'src', 'specs', 'entities');
    let n3Failed = false;
    if (existsSync(specDir)) {
      const specFiles = (await import('fs')).readdirSync(specDir).filter((f) => f.endsWith('.spec.json'));
      for (const f of specFiles) {
        const entityType = f.replace('.spec.json', '');
        if (locked.has(entityType)) {
          console.error(`  ✗ N3 failed: ${entityType} is spine-locked but has adopted spec`);
          failures++;
          n3Failed = true;
        }
      }
    }
    if (!n3Failed) console.log('  ✓ N3 passed');
  } catch (e) {
    console.error('  ✗ spine-denylist.json invalid:', e.message);
    failures++;
  }
} else {
  console.log('  ✓ N3 skipped (no spine-denylist)');
}

if (failures > 0) {
  console.error(`\n${failures} gate(s) failed`);
  process.exit(1);
}
console.log('\n  All adapter gates passed');
process.exit(0);
