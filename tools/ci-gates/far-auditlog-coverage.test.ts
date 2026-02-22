import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { describe, expect, test } from 'vitest';

/**
 * @see FIN-BL-AUD-01
 * gate.auditlog.coverage — Every Mutation Produces an Audit Trail
 *
 * Verifies that the audit infrastructure is complete:
 * 1. audit_logs table exists with required columns (who/what/when/why)
 * 2. audit_logs is append-only (no UPDATE/DELETE via RLS)
 * 3. The CRUD kernel mutate() always writes to audit_logs (K-03)
 * 4. All finance domain packages route writes through the kernel (no direct db)
 * 5. audit_logs has before/after/diff JSONB columns for full change capture
 */

const SCHEMA_DIR = resolve(__dirname, '../../packages/database/src/schema');
const CRUD_SRC = resolve(__dirname, '../../packages/crud/src');
const FINANCE_ROOT = resolve(__dirname, '../../business-domain/finance');

describe('gate.auditlog.coverage — FIN-BL-AUD-01: every mutation produces audit trail', () => {
  test('audit_logs schema exists with required columns', () => {
    const auditSchema = resolve(SCHEMA_DIR, 'audit-logs.ts');
    expect(existsSync(auditSchema)).toBe(true);

    const source = readFileSync(auditSchema, 'utf-8');
    // who
    expect(source).toContain('actorUserId');
    expect(source).toContain('actor_user_id');
    // what
    expect(source).toContain('actionType');
    expect(source).toContain('entityType');
    expect(source).toContain('entityId');
    // when
    expect(source).toContain('createdAt');
    // why
    expect(source).toContain('reason');
    // change capture
    expect(source).toContain('before');
    expect(source).toContain('after');
    expect(source).toContain('diff');
  });

  test('audit_logs is append-only (no UPDATE/DELETE for non-system)', () => {
    const auditSchema = resolve(SCHEMA_DIR, 'audit-logs.ts');
    const source = readFileSync(auditSchema, 'utf-8');
    // Must use crudPolicy (not tenantPolicy) with restricted modify
    expect(source).toContain('crudPolicy');
    // The modify policy should restrict to INSERT only (actor match)
    expect(source).toMatch(/modify.*auth\.org_id\(\)/s);
  });

  test('audit_logs has JSONB payload columns (before, after, diff)', () => {
    const auditSchema = resolve(SCHEMA_DIR, 'audit-logs.ts');
    const source = readFileSync(auditSchema, 'utf-8');
    expect(source).toMatch(/before:\s*jsonb/);
    expect(source).toMatch(/after:\s*jsonb/);
    expect(source).toMatch(/diff:\s*jsonb/);
  });

  test('CRUD kernel references audit_logs writes (K-03 invariant)', () => {
    // The kernel must write to audit_logs on every mutation
    const kernelFiles = existsSync(CRUD_SRC)
      ? readdirSync(CRUD_SRC)
          .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
          .map((f) => join(CRUD_SRC, f))
      : [];

    // Also check commit/ subdirectory
    const commitDir = join(CRUD_SRC, 'commit');
    if (existsSync(commitDir)) {
      kernelFiles.push(
        ...readdirSync(commitDir)
          .filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))
          .map((f) => join(commitDir, f)),
      );
    }

    let foundAuditWrite = false;
    for (const file of kernelFiles) {
      const source = readFileSync(file, 'utf-8');
      if (source.includes('auditLogs') || source.includes('audit_logs')) {
        foundAuditWrite = true;
        break;
      }
    }

    expect(foundAuditWrite).toBe(true);
  });

  test('no finance domain package imports db directly (all go through kernel)', () => {
    const violations: string[] = [];
    const BARE_DB_RE = /import\s*\{[^}]*\b(db|dbRo)\b[^}]*\}\s*from\s*['"]afenda-database['"]/;

    const packages = readdirSync(FINANCE_ROOT).filter((entry) => {
      const full = join(FINANCE_ROOT, entry);
      try { return statSync(full).isDirectory() && existsSync(join(full, 'package.json')); }
      catch { return false; }
    });

    for (const pkg of packages) {
      const srcDir = join(FINANCE_ROOT, pkg, 'src');
      if (!existsSync(srcDir)) continue;

      const files: string[] = [];
      function collect(dir: string) {
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry);
          try {
            if (statSync(full).isDirectory() && entry !== 'node_modules' && entry !== 'dist' && entry !== '__tests__') {
              collect(full);
            } else if (full.endsWith('.ts') && !full.includes('.test.') && !full.includes('.spec.')) {
              files.push(full);
            }
          } catch { /* skip */ }
        }
      }
      collect(srcDir);

      for (const file of files) {
        const source = readFileSync(file, 'utf-8');
        if (BARE_DB_RE.test(source)) {
          violations.push(`${pkg}/${file.replace(join(FINANCE_ROOT, pkg) + '\\', '').replace(join(FINANCE_ROOT, pkg) + '/', '')}`);
        }
      }
    }

    if (violations.length > 0) {
      throw new Error(
        `gate.auditlog.coverage: ${violations.length} finance file(s) import db directly (bypassing audit):\n` +
          violations.map((v) => `  - ${v}`).join('\n'),
      );
    }
    expect(violations).toEqual([]);
  });
});
