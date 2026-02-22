import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * SK-09 — Every build*Intent() Function Accepts idempotencyKey
 *
 * Shared-kernel invariant: ALL intent builder functions across ALL domain
 * packages must accept an `idempotencyKey: string` parameter.
 *
 * This prevents accidental creation of intents without deduplication keys,
 * which would allow double-posting of financial transactions.
 *
 * Scope: All business-domain/finance/[pkg]/src/commands/[any].ts
 */

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('SK-09: all build*Intent() functions accept idempotencyKey', () => {
  function collectTsFiles(dir: string): string[] {
    if (!existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) {
        results.push(...collectTsFiles(full));
      } else if (entry.endsWith('.ts') && !entry.endsWith('.test.ts')) {
        results.push(full);
      }
    }
    return results;
  }

  test('every build*Intent function has idempotencyKey parameter', () => {
    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      return statSync(full).isDirectory() && existsSync(join(full, 'package.json'));
    });

    const violations: Array<{ pkg: string; file: string; func: string }> = [];
    let totalFunctions = 0;

    for (const pkg of packages) {
      const commandsDir = join(FINANCE_ROOT, pkg, 'src', 'commands');
      if (!existsSync(commandsDir)) continue;

      const files = collectTsFiles(commandsDir);
      for (const filePath of files) {
        const source = readFileSync(filePath, 'utf-8');
        const funcRe = /export\s+function\s+(build\w*Intent)\s*\(([^)]*)\)/g;
        let match: RegExpExecArray | null;
        while ((match = funcRe.exec(source)) !== null) {
          totalFunctions++;
          const funcName = match[1]!;
          const params = match[2]!;
          if (!/idempotencyKey/.test(params)) {
            violations.push({
              pkg,
              file: filePath.replace(FINANCE_ROOT, ''),
              func: funcName,
            });
          }
        }
      }
    }

    // Ensure we actually scanned some functions
    expect(totalFunctions).toBeGreaterThan(0);

    if (violations.length > 0) {
      throw new Error(
        `SK-09: ${violations.length} of ${totalFunctions} build*Intent() functions missing idempotencyKey:\n` +
          violations.map((v) => `  - ${v.pkg}${v.file} → ${v.func}()`).join('\n'),
      );
    }

    expect(violations).toEqual([]);
  });
});
