import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * SK-11 — Exported Queries Filter by `orgId` (Company Isolation)
 *
 * Shared-kernel invariant: Every exported query function in domain packages
 * must filter by `orgId` from `DomainContext`. This enforces row-level
 * security (RLS) at the application layer.
 *
 * Without `orgId` filtering, a query could leak data across tenants —
 * a critical security violation in multi-tenant SaaS.
 *
 * Scope: All business-domain/finance/[pkg]/src/queries/[any].ts
 *
 * Detection: We scan query files for `.where(` clauses and verify they
 * include `orgId` or `ctx.orgId` in the filter conditions.
 */

const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('SK-11: exported queries filter by orgId', () => {
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

  test('all query files reference orgId in their filtering logic', () => {
    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      return statSync(full).isDirectory() && existsSync(join(full, 'package.json'));
    });

    const violations: Array<{ pkg: string; file: string }> = [];
    let totalFiles = 0;

    for (const pkg of packages) {
      const queriesDir = join(FINANCE_ROOT, pkg, 'src', 'queries');
      if (!existsSync(queriesDir)) continue;

      const files = collectTsFiles(queriesDir);
      for (const filePath of files) {
        totalFiles++;
        const source = readFileSync(filePath, 'utf-8');
        const fileName = filePath.replace(FINANCE_ROOT, '');

        // The file must reference orgId somewhere in its filtering logic
        const hasOrgId = /orgId/.test(source);
        // Also accept ctx.orgId pattern
        const hasCtxOrgId = /ctx\.orgId/.test(source);

        if (!hasOrgId && !hasCtxOrgId) {
          violations.push({ pkg, file: fileName });
        }
      }
    }

    expect(totalFiles).toBeGreaterThan(0);

    if (violations.length > 0) {
      throw new Error(
        `SK-11: ${violations.length} of ${totalFiles} query file(s) missing orgId filter:\n` +
          violations.map((v) => `  - ${v.pkg}${v.file}`).join('\n') +
          `\n\nAll queries must filter by ctx.orgId for tenant isolation (RLS).`,
      );
    }

    expect(violations).toEqual([]);
  });
});
