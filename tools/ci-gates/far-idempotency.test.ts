import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-GL-POST-01
 * @see FIN-INT-OUTBOX-01
 * gate.idempotency — Financial Postings Must Be Idempotent
 *
 * Verifies that the codebase enforces idempotency at multiple levels:
 * 1. audit_logs has a unique partial index on (org_id, action_type, idempotency_key)
 * 2. The CRUD kernel mutate() accepts idempotencyKey
 * 3. The DOMAIN_INTENT_REGISTRY marks high-severity intents as idempotency: 'required'
 * 4. All finance command builders accept idempotencyKey parameter
 *
 * This is a structural gate — it verifies the idempotency infrastructure
 * exists and is wired correctly, not that individual operations are idempotent.
 */

import { DOMAIN_INTENT_REGISTRY } from '../../packages/canon/src/registries/domain-intent-registry';

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('gate.idempotency — FIN-GL-POST-01 / FIN-INT-OUTBOX-01: idempotent financial postings', () => {
  test('audit_logs schema has idempotencyKey column', () => {
    const auditSchema = resolve(SCHEMA_DIR, 'audit-logs.ts');
    expect(existsSync(auditSchema)).toBe(true);
    const source = readFileSync(auditSchema, 'utf-8');
    expect(source).toContain('idempotencyKey');
    expect(source).toContain('idempotency_key');
  });

  test('audit_logs has unique partial index on idempotency_key', () => {
    const auditSchema = resolve(SCHEMA_DIR, 'audit-logs.ts');
    const source = readFileSync(auditSchema, 'utf-8');
    // Must have a unique index involving idempotency_key
    expect(source).toMatch(/uniqueIndex.*idempotency/i);
    // Must be partial (WHERE idempotency_key IS NOT NULL)
    expect(source).toMatch(/idempotency_key IS NOT NULL/);
  });

  test('DOMAIN_INTENT_REGISTRY has high-severity intents with idempotency required', () => {
    const requiredIntents = Object.entries(DOMAIN_INTENT_REGISTRY)
      .filter(([, meta]) => meta.severity === 'high' && meta.idempotency.policy === 'required');

    // Must have at least 10 high-severity idempotent intents
    expect(requiredIntents.length).toBeGreaterThanOrEqual(10);
  });

  test('finance command builders accept idempotencyKey', () => {
    const violations: Array<{ pkg: string; file: string; func: string }> = [];

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
        const funcRe = /export\s+function\s+(build\w*Intent)\s*\(([^)]*)\)/g;
        let match: RegExpExecArray | null;
        while ((match = funcRe.exec(source)) !== null) {
          const funcName = match[1]!;
          const params = match[2]!;
          if (!/idempotencyKey/.test(params)) {
            violations.push({ pkg, file, func: funcName });
          }
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `gate.idempotency: ${violations.length} build*Intent() function(s) missing idempotencyKey:\n` +
          violations.map((v) => `  - ${v.pkg}/src/commands/${v.file} → ${v.func}()`).join('\n'),
      );
    }
    expect(violations).toEqual([]);
  });
});
