/**
 * GAP-DB-007 / SAN-01: Sanitization tests.
 *
 * Validates stripSystemColumns (K-11 backstop). Entity handlers use pickWritable
 * for schema-derived allowlist — see contacts.ts, companies.ts.
 */

import { describe, it, expect } from 'vitest';

import { stripSystemColumns } from '../sanitize';

describe('stripSystemColumns (K-11 / EX-SAN-001)', () => {
  it('strips all system columns', () => {
    const input = {
      id: 'injected',
      org_id: 'injected',
      orgId: 'injected',
      created_by: 'x',
      createdBy: 'x',
      updated_by: 'x',
      updatedBy: 'x',
      created_at: 'x',
      createdAt: 'x',
      updated_at: 'x',
      updatedAt: 'x',
      version: 1,
      is_deleted: true,
      isDeleted: true,
      deleted_at: 'x',
      deletedAt: 'x',
      deleted_by: 'x',
      deletedBy: 'x',
      search_vector: 'x',
      searchVector: 'x',
      name: 'Keep',
    };
    const result = stripSystemColumns(input);
    expect(result).toEqual({ name: 'Keep' });
  });

  it('preserves domain columns', () => {
    const input = { name: 'Test', email: 'a@b.com', phone: '123', customData: {} };
    expect(stripSystemColumns(input)).toEqual(input);
  });

  it('returns new object (no mutation)', () => {
    const input = { name: 'Test' };
    const result = stripSystemColumns(input);
    expect(result).not.toBe(input);
    expect(result).toEqual(input);
  });
});
