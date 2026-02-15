/**
 * resolveActor structural tests — Batch API adoption validation.
 *
 * Verifies query-shape invariants:
 * - RTT 1: batch([user_roles, user_scopes])
 * - RTT 2 (if roleIds non-empty): role_permissions with inArray(roleId, roleIds) at SQL level
 * - Early return when roleIds.length === 0
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('resolveActor batch behavior', () => {
  it('RTT 1 uses batch([user_roles, user_scopes])', () => {
    const content = readFileSync(
      join(__dirname, '../policy-engine.ts'),
      'utf-8',
    );

    expect(content).toContain('batch([');
    expect(content).toContain('userRoles');
    expect(content).toContain('userScopes');
    expect(content).toContain('userRoleRows');
    expect(content).toContain('scopeRows');
  });

  it('RTT 2 filters role_permissions by roleIds at SQL level (inArray)', () => {
    const content = readFileSync(
      join(__dirname, '../policy-engine.ts'),
      'utf-8',
    );

    expect(content).toContain('inArray');
    expect(content).toContain('rolePermissions.roleId');
    expect(content).toContain('roleIds');
  });

  it('early return when roleIds.length === 0 (1 RTT total)', () => {
    const content = readFileSync(
      join(__dirname, '../policy-engine.ts'),
      'utf-8',
    );

    expect(content).toContain('if (roleIds.length === 0)');
    expect(content).toContain('permissions: []');
  });

  it('imports batch and inArray from afena-database', () => {
    const content = readFileSync(
      join(__dirname, '../policy-engine.ts'),
      'utf-8',
    );

    expect(content).toContain("batch");
    expect(content).toContain("inArray");
    expect(content).toMatch(/from ['"]afena-database['"]/);
  });
});
