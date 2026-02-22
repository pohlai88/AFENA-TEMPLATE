import { describe, expect, test } from 'vitest';

/**
 * FIN-04 — Idempotent Writes: High-Severity Intents Must Have idempotencyKey
 *
 * All intent types with `severity: 'high'` and `idempotency.policy: 'required'`
 * in the DOMAIN_INTENT_REGISTRY must be submittable with an `idempotencyKey`.
 *
 * This is a structural gate verifying:
 * 1. The DomainIntent type includes `idempotencyKey?: string`
 * 2. The registry flags high-severity intents with policy: 'required'
 * 3. All build*Intent() functions accept idempotencyKey as a parameter
 *
 * Rationale: High-severity financial postings (journal entries, payments,
 * depreciation runs) must be idempotent. Double-posting a payment or
 * depreciation entry causes material misstatement.
 */

import { DOMAIN_INTENT_REGISTRY } from '../../packages/canon/src/registries/domain-intent-registry';

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('FIN-04: idempotent writes for high-severity intents', () => {
  const requiredIdempotentIntents = Object.entries(DOMAIN_INTENT_REGISTRY)
    .filter(([, meta]) => meta.severity === 'high' && meta.idempotency.policy === 'required')
    .map(([type, meta]) => ({ type, owner: meta.owner }));

  test('at least 10 high-severity intents require idempotency', () => {
    expect(requiredIdempotentIntents.length).toBeGreaterThanOrEqual(10);
  });

  test('DomainIntent type includes idempotencyKey field', () => {
    const intentFile = resolve(__dirname, '../../packages/canon/src/types/domain-intent.ts');
    const source = readFileSync(intentFile, 'utf-8');
    expect(source).toMatch(/idempotencyKey\??:\s*string/);
  });

  test('all build*Intent() functions in finance packages accept idempotencyKey', () => {
    const violations: Array<{ file: string; functionName: string }> = [];

    // Check each finance package's commands/ directory
    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      return statSync(full).isDirectory() && existsSync(join(full, 'package.json'));
    });

    for (const pkg of packages) {
      const commandsDir = join(FINANCE_ROOT, pkg, 'src', 'commands');
      if (!existsSync(commandsDir)) continue;

      const files = readdirSync(commandsDir).filter(
        (f) => f.endsWith('.ts') && !f.endsWith('.test.ts'),
      );

      for (const file of files) {
        const source = readFileSync(join(commandsDir, file), 'utf-8');
        // Find all exported build*Intent functions
        const funcRe = /export\s+function\s+(build\w*Intent)\s*\(([^)]*)\)/g;
        let match: RegExpExecArray | null;
        while ((match = funcRe.exec(source)) !== null) {
          const funcName = match[1]!;
          const params = match[2]!;
          if (!/idempotencyKey/.test(params)) {
            violations.push({
              file: `${pkg}/src/commands/${file}`,
              functionName: funcName,
            });
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `FIN-04: ${violations.length} build*Intent() function(s) missing idempotencyKey parameter:\n` +
          violations.map((v) => `  - ${v.file} → ${v.functionName}()`).join('\n'),
      );
    }

    expect(violations).toEqual([]);
  });
});
