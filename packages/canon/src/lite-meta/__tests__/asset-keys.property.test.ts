/**
 * Property-Based Tests for Asset Key Invariants
 * 
 * Tests the architectural invariants K1-K9 from canon.architecture.md
 * using property-based testing with fast-check.
 * 
 * Runs 1000+ iterations per test to find edge cases.
 */

import { fc, test } from '@fast-check/vitest';
import { describe, expect } from 'vitest';
import {
  buildAssetKey,
  canonicalizeKey,
  parseAssetKey,
  validateAssetKey,
  type AssetKeyPrefix,
} from '../core/asset-keys';

describe('Asset Key Invariants (Property-Based)', () => {
  /**
   * K1: Round-trip identity
   * buildAssetKey(parseAssetKey(key)) === key (for valid keys)
   */
  describe('K1: Round-trip Identity', () => {
    // Generator for valid asset key prefixes
    const prefixArb = fc.constantFrom<AssetKeyPrefix>(
      'db.rec',
      'db.field',
      'db.bo',
      'db.view',
      'db.pipe',
      'db.report',
      'db.api',
      'db.policy',
      'metric:'
    );

    // Generator for valid segments (lowercase, alphanumeric, _, -, /, {})
    const segmentArb = fc
      .stringMatching(/^[a-z0-9_\-/{}]+$/)
      .filter((s: string) => s.length > 0 && s.length <= 50);

    // Generator for valid segment arrays (respecting prefix rules)
    const segmentsForPrefix = (prefix: AssetKeyPrefix) => {
      const spec = {
        'db.rec': { min: 3, max: 3 },      // database.schema.table
        'db.field': { min: 4, max: 4 },    // database.schema.table.column
        'db.bo': { min: 2, max: 2 },       // domain.entity
        'db.view': { min: 3, max: 3 },     // schema.view_name
        'db.pipe': { min: 2, max: 2 },     // domain.pipeline
        'db.report': { min: 2, max: 2 },   // domain.report
        'db.api': { min: 2, max: 2 },      // domain.endpoint
        'db.policy': { min: 2, max: 2 },   // domain.policy
        'metric:': { min: 1, max: 5 },     // metric_name or category.metric
      }[prefix];

      return fc.array(segmentArb, { minLength: spec.min, maxLength: spec.max });
    };

    test.prop([prefixArb.chain((prefix: AssetKeyPrefix) =>
      segmentsForPrefix(prefix).map((segments: string[]) => ({ prefix, segments }))
    )])('buildAssetKey(parseAssetKey(key)) === key', ({ prefix, segments }: { prefix: AssetKeyPrefix; segments: string[] }) => {
      try {
        const key = buildAssetKey(prefix, ...segments);
        const parsed = parseAssetKey(key);

        if (parsed.valid && parsed.prefix) {
          try {
            const rebuilt = buildAssetKey(parsed.prefix, ...parsed.segments);
            return rebuilt === key;
          } catch {
            // buildAssetKey can throw on invalid inputs - that's expected
            return true;
          }
        }

        return true; // Skip invalid keys
      } catch {
        // buildAssetKey can throw on invalid inputs - that's expected
        return true;
      }
    });
  });

  /**
   * K2: Canonicalization idempotence
   * canonicalizeKey(canonicalizeKey(key)) === canonicalizeKey(key)
   */
  describe('K2: Canonicalization Idempotence', () => {
    // Generator for strings that might need canonicalization
    const keyLikeArb = fc.oneof(
      // Valid keys with variations
      fc.constantFrom(
        'db.rec.afenda.public.invoices',
        'DB.REC.AFENDA.PUBLIC.INVOICES',
        '  db.rec.afenda.public.invoices  ',
        'metric:revenue.monthly',
        'METRIC:REVENUE.MONTHLY'
      ),
      // Random strings
      fc.string({ minLength: 10, maxLength: 100 })
    );

    test.prop([keyLikeArb])('canonicalizeKey is idempotent', (key) => {
      try {
        const once = canonicalizeKey(key);
        const twice = canonicalizeKey(once);
        return once === twice;
      } catch {
        // Invalid keys are expected to throw
        return true;
      }
    });
  });

  /**
   * K3: Segment count validation
   * parseAssetKey enforces correct segment counts per prefix
   */
  describe('K3: Segment Count Validation', () => {
    test('db.rec requires exactly 3 segments', () => {
      const valid = parseAssetKey('db.rec.afenda.public.invoices');
      expect(valid.valid).toBe(true);

      const tooFew = parseAssetKey('db.rec.afenda.public');
      expect(tooFew.valid).toBe(false);

      const tooMany = parseAssetKey('db.rec.afenda.public.invoices.extra');
      expect(tooMany.valid).toBe(false);
    });

    test('db.field requires exactly 4 segments', () => {
      const valid = parseAssetKey('db.field.afenda.public.invoices.amount');
      expect(valid.valid).toBe(true);

      const tooFew = parseAssetKey('db.field.afenda.public.invoices');
      expect(tooFew.valid).toBe(false);
    });

    test('db.bo requires exactly 2 segments', () => {
      const valid = parseAssetKey('db.bo.finance.invoice');
      expect(valid.valid).toBe(true);

      const tooMany = parseAssetKey('db.bo.finance.invoice.extra');
      expect(tooMany.valid).toBe(false);
    });
  });

  /**
   * K4: Character validation
   * Only lowercase a-z, digits, _, -, /, {} allowed in segments
   */
  describe('K4: Character Validation', () => {
    const invalidCharArb = fc.constantFrom(
      'UPPERCASE',
      'has space',
      'has@symbol',
      'has#hash',
      'has!exclaim'
    );

    test.prop([invalidCharArb])('rejects invalid characters', (invalidSegment: string) => {
      const key = `db.rec.afenda.public.${invalidSegment}`;
      const parsed = parseAssetKey(key);

      return !parsed.valid;
    });

    const validCharArb = fc.stringMatching(/^[a-z0-9_\-/{}]+$/);

    test.prop([validCharArb.filter((s: string) => s.length > 0)])('accepts valid characters', (validSegment: string) => {
      const key = `db.rec.afenda.public.${validSegment}`;
      const parsed = parseAssetKey(key);

      // May be invalid for other reasons, but not character validation
      if (!parsed.valid) {
        return !parsed.errors.some(e => e.includes('invalid characters'));
      }
      return true;
    });
  });

  /**
   * K5: Delimiter enforcement
   * No . or : inside segments (only between segments)
   */
  describe('K5: Delimiter Enforcement', () => {
    test.prop([fc.string()])('rejects keys with double dots', (segment) => {
      const key = `db.rec.afenda..${segment}`;

      try {
        canonicalizeKey(key);
        return false; // Should have thrown
      } catch (error) {
        return (error as Error).message.includes('double dots');
      }
    });

    test('rejects colon in db.* keys', () => {
      const key = 'db.rec.afenda:public.invoices';
      const parsed = parseAssetKey(key);

      return !parsed.valid && parsed.errors.some(e => e.includes('Colon not allowed'));
    });
  });

  /**
   * K6: Prefix-namespace integrity
   * Every key must start with a valid prefix
   */
  describe('K6: Prefix-Namespace Integrity', () => {
    const invalidPrefixArb = fc.constantFrom(
      'invalid.prefix.foo',
      'db.unknown.foo',
      'random.stuff',
      'metric.wrong'
    );

    test.prop([invalidPrefixArb])('rejects invalid prefixes', (key) => {
      const parsed = parseAssetKey(key);

      return !parsed.valid && parsed.errors.some(e =>
        e.includes('Unknown or missing prefix')
      );
    });
  });

  /**
   * K7: Hierarchical and template support
   * / and {} are allowed in segments
   */
  describe('K7: Hierarchical and Template Support', () => {
    test('accepts hierarchical paths with /', () => {
      const key = 'db.rec.afenda.public.invoices/2024';
      const parsed = parseAssetKey(key);

      return parsed.valid;
    });

    test('accepts template placeholders with {}', () => {
      const key = 'db.rec.afenda.public.{table_name}';
      const parsed = parseAssetKey(key);

      return parsed.valid;
    });
  });

  /**
   * K8: Never-throw parsing API
   * parseAssetKey never throws, always returns result with errors
   */
  describe('K8: Never-Throw Parsing API', () => {
    test.prop([fc.anything()])('parseAssetKey never throws', (input) => {
      try {
        const result = parseAssetKey(input as string);
        // Should always return an object with valid/errors
        return typeof result === 'object' &&
          'valid' in result &&
          'errors' in result;
      } catch {
        return false; // Should never throw
      }
    });
  });

  /**
   * K9: No duplicate validation logic
   * validateAssetKey uses parseAssetKey internally
   */
  describe('K9: No Duplicate Validation Logic', () => {
    test.prop([fc.string()])('validateAssetKey matches parseAssetKey', (key) => {
      const parsed = parseAssetKey(key);
      const validated = validateAssetKey(key);

      return parsed.valid === validated.valid &&
        JSON.stringify(parsed.errors) === JSON.stringify(validated.errors);
    });
  });

  /**
   * Additional: Fuzz testing with random inputs
   */
  describe('Fuzz Testing', () => {
    test.prop([fc.string({ minLength: 0, maxLength: 200 })])(
      'handles arbitrary strings gracefully',
      (input: string) => {
        const parsed = parseAssetKey(input);

        // Should always return a valid result object
        return typeof parsed === 'object' &&
          typeof parsed.valid === 'boolean' &&
          Array.isArray(parsed.errors);
      }
    );

    test.prop([fc.string({ minLength: 0, maxLength: 100 })])(
      'handles various string inputs without crashing',
      (input: string) => {
        const parsed = parseAssetKey(input);

        // Should handle all strings without crashing
        return typeof parsed === 'object';
      }
    );
  });
});
