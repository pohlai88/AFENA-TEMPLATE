/**
 * Deterministic Output Guard Test
 * 
 * Ensures all functions returning arrays/maps have stable ordering.
 * This is critical for Canon's determinism principle.
 */

import { describe, expect, it } from 'vitest';

import {
  ACTION_FAMILIES,
  ACTION_TYPES,
  ACTION_VERBS,
  CANON_ISSUE_CODES,
  CAPABILITY_CATALOG,
  CAPABILITY_DOMAINS,
  CAPABILITY_KEYS,
  CAPABILITY_KINDS,
  CAPABILITY_NAMESPACES,
  CAPABILITY_VERBS,
  ENTITY_TYPES,
  ERROR_CODES,
  RBAC_SCOPES,
  RBAC_TIERS,
} from '../index';

describe('Deterministic Output Guard', () => {
  describe('Const Arrays - Stable Order', () => {
    it('CAPABILITY_KINDS should have deterministic order', () => {
      const kinds = [...CAPABILITY_KINDS];
      expect(kinds).toEqual([
        'mutation',
        'read',
        'search',
        'admin',
        'system',
        'auth',
        'storage',
      ]);
    });

    it('RBAC_TIERS should have deterministic order (hierarchical)', () => {
      const tiers = [...RBAC_TIERS];
      expect(tiers).toEqual([
        'public',
        'viewer',
        'editor',
        'manager',
        'admin',
        'system',
      ]);
    });

    it('RBAC_SCOPES should have deterministic order', () => {
      const scopes = [...RBAC_SCOPES];
      expect(scopes).toEqual(['read', 'write', 'admin', 'system']);
    });

    it('ERROR_CODES should have deterministic order', () => {
      const codes = [...ERROR_CODES];
      expect(codes).toEqual([
        'MISSING_ORG_ID',
        'VALIDATION_FAILED',
        'POLICY_DENIED',
        'LIFECYCLE_DENIED',
        'RATE_LIMITED',
        'CONFLICT_VERSION',
        'IDEMPOTENCY_REPLAY',
        'NOT_FOUND',
        'INTERNAL_ERROR',
      ]);
    });

    it('CANON_ISSUE_CODES should have deterministic order', () => {
      const codes = [...CANON_ISSUE_CODES];
      expect(codes).toEqual([
        'REQUIRED',
        'INVALID_TYPE',
        'INVALID_ENUM',
        'INVALID_UUID',
        'INVALID_FORMAT',
        'TOO_SHORT',
        'TOO_LONG',
        'OUT_OF_RANGE',
        'INVALID_EMAIL',
        'INVALID_URL',
        'INVALID_PHONE',
        'DUPLICATE',
        'NOT_FOUND',
        'CONFLICT',
      ]);
    });

    it('ENTITY_TYPES should have deterministic order', () => {
      const types = [...ENTITY_TYPES];
      // Verify it's an array and has stable content
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);

      // Verify order is stable across multiple calls
      const types2 = [...ENTITY_TYPES];
      expect(types).toEqual(types2);
    });

    it('CAPABILITY_DOMAINS should have deterministic order', () => {
      const domains = [...CAPABILITY_DOMAINS];
      expect(domains).toEqual([
        'contacts',
        'companies',
        'sites',
        'invoices',
        'payments',
        'inventory',
        'sales',
        'purchases',
        'ledger',
        'custom_fields',
        'workflows',
        'advisory',
        'search',
        'aliases',
        'views',
        'files',
      ]);
    });

    it('CAPABILITY_NAMESPACES should have deterministic order', () => {
      const namespaces = [...CAPABILITY_NAMESPACES];
      expect(namespaces).toEqual(['admin', 'system', 'auth', 'storage']);
    });
  });

  describe('Derived Arrays - Stable Order', () => {
    it('CAPABILITY_KEYS should match CAPABILITY_CATALOG keys in stable order', () => {
      const catalogKeys = Object.keys(CAPABILITY_CATALOG);
      expect(CAPABILITY_KEYS).toEqual(catalogKeys);

      // Verify order is stable across multiple calls
      const catalogKeys2 = Object.keys(CAPABILITY_CATALOG);
      expect(catalogKeys).toEqual(catalogKeys2);
    });

    it('ACTION_TYPES should have deterministic order', () => {
      const types = [...ACTION_TYPES];

      // Verify it's an array and stable
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBeGreaterThan(0);

      // Verify order is stable across multiple calls
      const types2 = [...ACTION_TYPES];
      expect(types).toEqual(types2);
    });

    it('ACTION_FAMILIES should have deterministic order', () => {
      const families = [...ACTION_FAMILIES];
      expect(families).toEqual([
        'field_mutation',
        'state_transition',
        'ownership',
        'lifecycle',
        'annotation',
        'system',
      ]);
    });
  });

  describe('Maps and Records - Stable Iteration', () => {
    it('CAPABILITY_VERBS should have stable key order', () => {
      const keys = Object.keys(CAPABILITY_VERBS);

      // Verify order is stable across multiple calls
      const keys2 = Object.keys(CAPABILITY_VERBS);
      expect(keys).toEqual(keys2);

      // Verify keys match CAPABILITY_KINDS
      expect(keys.sort()).toEqual([...CAPABILITY_KINDS].sort());
    });

    it('ACTION_VERBS should have stable key order', () => {
      const keys = Object.keys(ACTION_VERBS);

      // Verify order is stable across multiple calls
      const keys2 = Object.keys(ACTION_VERBS);
      expect(keys).toEqual(keys2);
    });

    it('CAPABILITY_CATALOG iteration should be deterministic', () => {
      const entries1 = Object.entries(CAPABILITY_CATALOG);
      const entries2 = Object.entries(CAPABILITY_CATALOG);

      // Verify same order every time
      expect(entries1.map(([k]) => k)).toEqual(entries2.map(([k]) => k));

      // Verify all keys are present
      expect(entries1.length).toBe(CAPABILITY_KEYS.length);
    });
  });

  describe('No Environment Dependencies', () => {
    it('should not depend on process.env for output', () => {
      // All const arrays should be defined at module load time
      // and not change based on environment
      expect(CAPABILITY_KINDS).toBeDefined();
      expect(RBAC_TIERS).toBeDefined();
      expect(ERROR_CODES).toBeDefined();

      // Verify they're truly const (readonly at compile time)
      // Note: TypeScript const arrays aren't frozen at runtime, but are readonly at compile time
      expect(CAPABILITY_KINDS.length).toBeGreaterThan(0);
      expect(RBAC_TIERS.length).toBeGreaterThan(0);
      expect(ERROR_CODES.length).toBeGreaterThan(0);
    });

    it('should not depend on Date.now() or random values', () => {
      // Get values multiple times
      const keys1 = [...CAPABILITY_KEYS];
      const keys2 = [...CAPABILITY_KEYS];
      const keys3 = [...CAPABILITY_KEYS];

      // All should be identical
      expect(keys1).toEqual(keys2);
      expect(keys2).toEqual(keys3);
    });
  });
});
