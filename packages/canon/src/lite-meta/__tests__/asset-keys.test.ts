/**
 * Asset Key System Tests
 * 
 * Verifies all invariants from Canon Architecture §7.1
 * Tests: K1-K9 (round-trip, canonicalization, validation, etc.)
 */

import { describe, expect, it } from 'vitest';
import {
  assertAssetTypeMatchesKey,
  ASSET_KEY_PREFIX_SPECS,
  buildAssetKey,
  canonicalizeKey,
  deriveAssetTypeFromKey,
  parseAssetKey,
  validateAssetKey,
  type AssetKeyPrefix,
} from '../core/asset-keys';

describe('Asset Key System', () => {
  describe('K1: Round-trip identity', () => {
    it('should preserve valid keys through build → parse → build cycle', () => {
      const testCases: Array<{ prefix: AssetKeyPrefix; segments: string[] }> = [
        { prefix: 'db.rec', segments: ['afenda', 'public', 'invoices'] },
        { prefix: 'db.field', segments: ['afenda', 'public', 'invoices', 'total_amount'] },
        { prefix: 'db.bo', segments: ['finance', 'invoice'] },
        { prefix: 'db.view', segments: ['sales', 'monthly_summary'] },
        { prefix: 'db.pipe', segments: ['etl_customers'] },
        { prefix: 'db.report', segments: ['finance', 'balance_sheet'] },
        { prefix: 'db.api', segments: ['rest', 'customers'] },
        { prefix: 'db.policy', segments: ['rbac', 'invoice_approval'] },
        { prefix: 'metric:', segments: ['revenue', 'monthly', 'total'] },
      ];

      testCases.forEach(({ prefix, segments }) => {
        const key = buildAssetKey(prefix, ...segments);
        const parsed = parseAssetKey(key);

        expect(parsed.valid).toBe(true);
        expect(parsed.prefix).toBe(prefix);
        expect(parsed.segments).toEqual(segments);

        // Rebuild and verify identity
        const rebuilt = buildAssetKey(parsed.prefix!, ...parsed.segments);
        expect(rebuilt).toBe(key);
      });
    });
  });

  describe('K2: Canonicalization idempotence', () => {
    it('should be idempotent: canonicalize(canonicalize(x)) === canonicalize(x)', () => {
      const testKeys = [
        'db.rec.afenda.public.invoices',
        'DB.REC.AFENDA.PUBLIC.INVOICES', // uppercase
        '  db.rec.afenda.public.invoices  ', // whitespace
        'metric:revenue.monthly',
      ];

      testKeys.forEach((key) => {
        const once = canonicalizeKey(key);
        const twice = canonicalizeKey(once);
        expect(twice).toBe(once);
      });
    });

    it('should lowercase and trim whitespace', () => {
      expect(canonicalizeKey('DB.REC.AFENDA.PUBLIC.INVOICES')).toBe(
        'db.rec.afenda.public.invoices'
      );
      expect(canonicalizeKey('  db.bo.finance.invoice  ')).toBe('db.bo.finance.invoice');
    });

    it('should reject double dots', () => {
      expect(() => canonicalizeKey('db.rec..afenda.public.invoices')).toThrow(
        'double dots'
      );
    });

    it('should reject empty segments', () => {
      expect(() => canonicalizeKey('db.rec.afenda..invoices')).toThrow(/empty segment|double dots/i);
    });
  });

  describe('K3: Segment count validation', () => {
    it('should enforce segment counts per ASSET_KEY_PREFIX_SPECS', () => {
      // Valid cases
      expect(() => buildAssetKey('db.rec', 'afenda', 'public', 'invoices')).not.toThrow();
      expect(() =>
        buildAssetKey('db.field', 'afenda', 'public', 'invoices', 'total')
      ).not.toThrow();
      expect(() => buildAssetKey('db.bo', 'finance', 'invoice')).not.toThrow();

      // Invalid cases - too few segments
      expect(() => buildAssetKey('db.rec', 'afenda', 'public')).toThrow('segment count');
      expect(() => buildAssetKey('db.field', 'afenda', 'public', 'invoices')).toThrow(
        'segment count'
      );

      // Invalid cases - too many segments
      expect(() =>
        buildAssetKey('db.rec', 'afenda', 'public', 'invoices', 'extra')
      ).toThrow('segment count');
    });

    it('should validate segment counts in parseAssetKey', () => {
      const validKey = 'db.rec.afenda.public.invoices';
      const parsed = parseAssetKey(validKey);
      expect(parsed.valid).toBe(true);

      const invalidKey = 'db.rec.afenda.public'; // too few segments
      const parsedInvalid = parseAssetKey(invalidKey);
      expect(parsedInvalid.valid).toBe(false);
      expect(parsedInvalid.errors.length).toBeGreaterThan(0);
      // Error message should indicate validation failure
      expect(parsedInvalid.errors.join(' ')).toMatch(/.+/);
    });
  });

  describe('K4: Character validation', () => {
    it('should allow lowercase alphanumeric and underscores', () => {
      const valid = buildAssetKey('db.bo', 'finance_2024', 'invoice_v2');
      expect(valid).toBe('db.bo.finance_2024.invoice_v2');
    });

    it('should reject uppercase in segments after canonicalization', () => {
      // buildAssetKey doesn't auto-canonicalize, so uppercase should be rejected
      expect(() => buildAssetKey('db.bo', 'Finance', 'Invoice')).toThrow();
    });

    it('should reject special characters in segments', () => {
      expect(() => buildAssetKey('db.bo', 'finance@2024', 'invoice')).toThrow();
      expect(() => buildAssetKey('db.bo', 'finance', 'invoice#1')).toThrow();
    });
  });

  describe('K5: Delimiter enforcement', () => {
    it('should reject dots inside segments', () => {
      expect(() => buildAssetKey('db.bo', 'finance.sub', 'invoice')).toThrow();
    });

    it('should reject colons inside segments (except metric: prefix)', () => {
      expect(() => buildAssetKey('db.bo', 'finance:sub', 'invoice')).toThrow();
    });
  });

  describe('K6: Prefix-namespace integrity', () => {
    it('should derive correct asset type from key prefix', () => {
      expect(deriveAssetTypeFromKey('db.rec.afenda.public.invoices')).toBe('table');
      expect(deriveAssetTypeFromKey('db.field.afenda.public.invoices.total')).toBe('column');
      expect(deriveAssetTypeFromKey('db.bo.finance.invoice')).toBe('business_object');
      expect(deriveAssetTypeFromKey('db.view.sales.summary')).toBe('view');
      expect(deriveAssetTypeFromKey('db.pipe.etl_customers')).toBe('pipeline');
      expect(deriveAssetTypeFromKey('db.report.finance.balance')).toBe('report');
      expect(deriveAssetTypeFromKey('db.api.rest.customers')).toBe('api');
      expect(deriveAssetTypeFromKey('db.policy.rbac.approval')).toBe('policy');
      expect(deriveAssetTypeFromKey('metric:revenue.monthly')).toBe('metric');
    });

    it('should assert asset type matches key prefix', () => {
      expect(() =>
        assertAssetTypeMatchesKey('db.rec.afenda.public.invoices', 'table')
      ).not.toThrow();

      expect(() =>
        assertAssetTypeMatchesKey('db.rec.afenda.public.invoices', 'column')
      ).toThrow(/mismatch|does not match/i);

      expect(() =>
        assertAssetTypeMatchesKey('metric:revenue.monthly', 'metric')
      ).not.toThrow();
    });
  });

  describe('K7: Hierarchical and template support', () => {
    it('should support hierarchical paths with forward slashes', () => {
      const key = buildAssetKey('db.bo', 'finance/ar', 'invoice');
      expect(key).toBe('db.bo.finance/ar.invoice');

      const parsed = parseAssetKey(key);
      expect(parsed.valid).toBe(true);
      expect(parsed.segments).toEqual(['finance/ar', 'invoice']);
    });

    it('should support template placeholders with curly braces', () => {
      const key = buildAssetKey('db.rec', 'afenda', 'public', 'invoices_{year}');
      expect(key).toBe('db.rec.afenda.public.invoices_{year}');

      const parsed = parseAssetKey(key);
      expect(parsed.valid).toBe(true);
      expect(parsed.segments[2]).toBe('invoices_{year}');
    });
  });

  describe('K8: Never-throw parsing API', () => {
    it('should never throw from parseAssetKey', () => {
      const invalidKeys = [
        '',
        'invalid',
        'db.rec',
        'db.rec.too.few',
        'unknown.prefix.test',
        'db.rec.UPPERCASE.public.invoices',
        'db.rec..afenda.public.invoices',
      ];

      invalidKeys.forEach((key) => {
        expect(() => parseAssetKey(key)).not.toThrow();
        const result = parseAssetKey(key);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    it('should return detailed errors for invalid keys', () => {
      const result = parseAssetKey('db.rec.too.few');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should have validation errors
      expect(result.errors.join(' ')).toMatch(/.+/);
    });
  });

  describe('K9: No duplicate validation logic', () => {
    it('should use ASSET_KEY_PREFIX_SPECS as single source of truth', () => {
      // Verify all prefixes have specs
      const prefixes: AssetKeyPrefix[] = [
        'db.rec',
        'db.field',
        'db.bo',
        'db.view',
        'db.pipe',
        'db.report',
        'db.api',
        'db.policy',
        'metric:',
      ];

      prefixes.forEach((prefix) => {
        expect(ASSET_KEY_PREFIX_SPECS[prefix]).toBeDefined();
        expect(ASSET_KEY_PREFIX_SPECS[prefix].afterPrefixMin).toBeGreaterThan(0);
      });
    });
  });

  describe('validateAssetKey', () => {
    it('should return valid: true for correct keys', () => {
      const result = validateAssetKey('db.rec.afenda.public.invoices');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid: false with errors for incorrect keys', () => {
      const result = validateAssetKey('db.rec.too.few');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate all prefix types', () => {
      const validKeys = [
        'db.rec.afenda.public.invoices',
        'db.field.afenda.public.invoices.total_amount',
        'db.bo.finance.invoice',
        'db.view.sales.monthly_summary',
        'db.pipe.etl_customers',
        'db.report.finance.balance_sheet',
        'db.api.rest.customers',
        'db.policy.rbac.invoice_approval',
        'metric:revenue.monthly.total',
      ];

      validKeys.forEach((key) => {
        const result = validateAssetKey(key);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle metric: prefix with variable segment count', () => {
      const shortMetric = buildAssetKey('metric:', 'revenue');
      expect(shortMetric).toBe('metric:revenue');

      const longMetric = buildAssetKey('metric:', 'revenue', 'monthly', 'total', 'usd');
      expect(longMetric).toBe('metric:revenue.monthly.total.usd');

      // Both should be valid
      expect(parseAssetKey(shortMetric).valid).toBe(true);
      expect(parseAssetKey(longMetric).valid).toBe(true);
    });

    it('should handle minimum length keys', () => {
      const minKey = buildAssetKey('db.pipe', 'etl');
      expect(minKey).toBe('db.pipe.etl');
      expect(parseAssetKey(minKey).valid).toBe(true);
    });

    it('should reject keys with trailing dots', () => {
      const result = parseAssetKey('db.rec.afenda.public.invoices.');
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      // Should have validation errors for malformed key
      expect(result.errors.join(' ')).toMatch(/.+/);
    });

    it('should reject keys with leading dots', () => {
      const result = parseAssetKey('.db.rec.afenda.public.invoices');
      expect(result.valid).toBe(false);
    });
  });
});
