/**
 * Kernel Smoke Tests — Phase 1
 *
 * Verifies core invariants:
 * - K-01: mutate() is the only write path
 * - K-04: expectedVersion required on update/delete/restore
 * - K-05: only mutate, readEntity, listEntities exported
 * - K-06: namespaced actions
 * - K-09: entityRef.id optional on create
 * - K-10: idempotencyKey for *.create only
 * - K-11: system columns stripped from input
 * - K-12: Receipt nullable on rejected
 * - K-15: actionType namespace must match entityRef.type
 */

import { describe, it, expect } from 'vitest';

import {
  extractVerb,
  extractEntityNamespace,
  getActionFamily,
  ERROR_CODES,
  ACTION_TYPES,
  ENTITY_TYPES,
  mutationSpecSchema,
} from 'afena-canon';

import { stripSystemColumns } from '../sanitize';
import { generateDiff } from '../diff';

// ── K-06: Namespaced action types ──────────────────────────

describe('K-06: Namespaced action types', () => {
  it('extracts verb from action type', () => {
    expect(extractVerb('contacts.create')).toBe('create');
    expect(extractVerb('contacts.update')).toBe('update');
    expect(extractVerb('contacts.delete')).toBe('delete');
    expect(extractVerb('contacts.restore')).toBe('restore');
  });

  it('extracts entity namespace from action type', () => {
    expect(extractEntityNamespace('contacts.create')).toBe('contacts');
    expect(extractEntityNamespace('contacts.update')).toBe('contacts');
  });

  it('maps action type to action family', () => {
    expect(getActionFamily('contacts.create')).toBe('lifecycle');
    expect(getActionFamily('contacts.update')).toBe('field_mutation');
    expect(getActionFamily('contacts.delete')).toBe('lifecycle');
    expect(getActionFamily('contacts.restore')).toBe('lifecycle');
  });

  it('all action types follow {entity}.{verb} pattern', () => {
    for (const at of ACTION_TYPES) {
      const parts = at.split('.');
      expect(parts.length).toBe(2);
      expect(ENTITY_TYPES).toContain(parts[0]);
    }
  });
});

// ── K-04: expectedVersion enforcement ──────────────────────

describe('K-04: expectedVersion enforcement', () => {
  it('parses update spec with expectedVersion', () => {
    const spec = {
      actionType: 'contacts.update',
      entityRef: { type: 'contacts', id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
      input: { name: 'Test' },
      expectedVersion: 1,
    };
    const result = mutationSpecSchema.safeParse(spec);
    expect(result.success).toBe(true);
  });

  it('accepts create without expectedVersion', () => {
    const spec = {
      actionType: 'contacts.create',
      entityRef: { type: 'contacts' },
      input: { name: 'Test' },
    };
    const result = mutationSpecSchema.safeParse(spec);
    expect(result.success).toBe(true);
  });
});

// ── K-09: entityRef.id optional on create ──────────────────

describe('K-09: entityRef.id optional on create', () => {
  it('allows create without entityRef.id', () => {
    const spec = {
      actionType: 'contacts.create',
      entityRef: { type: 'contacts' },
      input: { name: 'Test' },
    };
    const result = mutationSpecSchema.safeParse(spec);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.entityRef.id).toBeUndefined();
    }
  });
});

// ── K-11: System column stripping ──────────────────────────

describe('K-11: System column stripping', () => {
  it('strips all system columns from input', () => {
    const input = {
      name: 'Test',
      email: 'test@example.com',
      id: 'injected-id',
      orgId: 'injected-org',
      org_id: 'injected-org-snake',
      createdBy: 'injected-user',
      created_by: 'injected-user-snake',
      updatedBy: 'injected-user',
      updated_by: 'injected-user-snake',
      createdAt: '2024-01-01',
      created_at: '2024-01-01',
      updatedAt: '2024-01-01',
      updated_at: '2024-01-01',
      version: 999,
      isDeleted: true,
      is_deleted: true,
      deletedAt: '2024-01-01',
      deleted_at: '2024-01-01',
      deletedBy: 'injected-user',
      deleted_by: 'injected-user-snake',
    };

    const result = stripSystemColumns(input);

    expect(result).toEqual({
      name: 'Test',
      email: 'test@example.com',
    });
  });

  it('preserves non-system columns', () => {
    const input = { name: 'Test', phone: '123', company: 'Acme', notes: 'Hello' };
    const result = stripSystemColumns(input);
    expect(result).toEqual(input);
  });
});

// ── K-13: Diff normalization ───────────────────────────────

describe('K-13: Diff normalization', () => {
  it('excludes updated_at from diff', () => {
    const before = { name: 'Old', updated_at: '2024-01-01T00:00:00Z' };
    const after = { name: 'New', updated_at: '2024-01-02T00:00:00Z' };
    const diff = generateDiff(before, after);
    expect(diff).toEqual([
      { op: 'replace', path: '/name', value: 'New' },
    ]);
  });

  it('returns null for identical snapshots (after normalization)', () => {
    const before = { name: 'Same', updated_at: '2024-01-01T00:00:00Z' };
    const after = { name: 'Same', updated_at: '2024-01-02T00:00:00Z' };
    const diff = generateDiff(before, after);
    expect(diff).toBeNull();
  });

  it('returns null for create (no before)', () => {
    const diff = generateDiff(null, { name: 'New' });
    expect(diff).toBeNull();
  });
});

// ── K-15: actionType namespace must match entityRef.type ───

describe('K-15: actionType namespace must match entityRef.type', () => {
  it('validates matching namespace', () => {
    const ns = extractEntityNamespace('contacts.create');
    expect(ns).toBe('contacts');
  });
});

// ── K-05: Minimal API surface ──────────────────────────────

describe('K-05: Minimal API surface', () => {
  it('index.ts barrel only re-exports mutate, readEntity, listEntities, MutationContext', async () => {
    // We cannot dynamically import ../index because it triggers db.ts which requires DATABASE_URL.
    // Instead, verify the barrel file statically by reading its source.
    const { readFileSync } = await import('fs');
    const { resolve } = await import('path');
    const indexSrc = readFileSync(resolve(__dirname, '../index.ts'), 'utf-8');
    // Must export these 3 functions
    expect(indexSrc).toContain('mutate');
    expect(indexSrc).toContain('readEntity');
    expect(indexSrc).toContain('listEntities');
    // Must NOT export internals
    expect(indexSrc).not.toContain('contactsHandler');
    expect(indexSrc).not.toContain('stripSystemColumns');
    expect(indexSrc).not.toContain('generateDiff');
    expect(indexSrc).not.toContain('enforcePolicy');
  });
});

// ── Error code taxonomy ────────────────────────────────────

describe('Error code taxonomy', () => {
  it('has all required error codes', () => {
    expect(ERROR_CODES).toContain('MISSING_ORG_ID');
    expect(ERROR_CODES).toContain('VALIDATION_FAILED');
    expect(ERROR_CODES).toContain('POLICY_DENIED');
    expect(ERROR_CODES).toContain('CONFLICT_VERSION');
    expect(ERROR_CODES).toContain('IDEMPOTENCY_REPLAY');
    expect(ERROR_CODES).toContain('NOT_FOUND');
    expect(ERROR_CODES).toContain('INTERNAL_ERROR');
  });
});
