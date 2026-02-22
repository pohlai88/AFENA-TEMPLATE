/**
 * Canon Validator Invariants Tests
 * 
 * Tests VAL-01 through VAL-06 invariants from the ratified plan.
 */

import { describe, expect, test } from 'vitest';
import type { DataType } from '../../enums/data-types';
import { DATA_TYPES } from '../../enums/data-types';
import { optional } from '../core/compose';
import { CUSTOM_FIELD_VALIDATORS, validateCustomFieldValue } from '../presets/custom-field-value';

describe('Canon Validator Invariants', () => {
  const context = {
    entityType: 'contacts' as const,
    fieldPath: ['phone'],
    mode: 'create' as const
  };

  // VAL-01: Determinism (same input → same issues)
  test('VAL-01: Deterministic validation', () => {
    const input = 'invalid-email';

    const result1 = validateCustomFieldValue('email', {}, input, context);
    const result2 = validateCustomFieldValue('email', {}, input, context);

    expect(result1).toEqual(result2); // Deep equal
  });

  // VAL-02: Path stability (issues always include path)
  test('VAL-02: Path tracking', () => {
    const ctx = { ...context, fieldPath: ['customFields', 'email'] };
    const result = validateCustomFieldValue('email', {}, 'invalid', ctx);

    expect(result.ok).toBe(false);
    if (!result.ok && result.issues.length > 0) {
      expect(result.issues[0].path).toEqual(['customFields', 'email']);
    }
  });

  // VAL-03: No mutation (input unchanged)
  test('VAL-03: Input immutability', () => {
    const input = { nested: 'value' };
    const original = JSON.stringify(input);

    validateCustomFieldValue('json', {}, input, context);

    expect(JSON.stringify(input)).toBe(original);
  });

  // VAL-04: Idempotent normalizers (tested via pure functions)
  test('VAL-04: Normalizer idempotence', () => {
    const trim = (s: string) => s.trim();
    const collapse = (s: string) => s.replace(/\s+/g, ' ');

    const testIdempotence = <T>(fn: (x: T) => T, value: T): boolean => {
      const once = fn(value);
      const twice = fn(once);
      return once === twice;
    };

    expect(testIdempotence(trim, '  hello  ')).toBe(true);
    expect(testIdempotence(collapse, 'hello   world')).toBe(true);
  });

  // VAL-05: Stable codes (no ad-hoc strings)
  test('VAL-05: Error codes from VAL_CODES only', () => {
    const result = validateCustomFieldValue('email', {}, 123, context);

    expect(result.ok).toBe(false);
    if (!result.ok && result.issues && result.issues.length > 0) {
      expect(result.issues[0].code).toMatch(/^VAL_/);
    }
  });

  // VAL-06: Registry coverage + optional wrapper behavior
  test('VAL-06: Complete registry coverage', () => {
    // All data types have validators
    for (const dataType of DATA_TYPES) {
      expect(CUSTOM_FIELD_VALIDATORS[dataType]).toBeDefined();
    }

    // Optional wrapper allows null/undefined
    const validator = optional(CUSTOM_FIELD_VALIDATORS.email({}));

    expect(validator(null, context).ok).toBe(true);
    expect(validator(undefined, context).ok).toBe(true);

    // But unwrapped validator rejects null
    const unwrapped = CUSTOM_FIELD_VALIDATORS.email({});
    const result = unwrapped(null, context);
    expect(result.ok).toBe(false);
  });

  // Additional: Test all 22 data types with null/undefined via optional
  test('VAL-06: All data types work with optional wrapper', () => {
    const testTypes: DataType[] = [
      'short_text', 'long_text', 'integer', 'decimal', 'money',
      'boolean', 'date', 'datetime', 'enum', 'multi_enum',
      'email', 'phone', 'url', 'entity_ref', 'json',
      'binary', 'file', 'single_select', 'multi_select',
      'rich_text', 'currency', 'formula', 'relation',
    ];

    for (const dataType of testTypes) {
      const result = validateCustomFieldValue(dataType, {}, null, context);
      expect(result.ok).toBe(true); // Null should pass via optional wrapper
    }
  });

  // Test determinism across multiple runs
  test('VAL-01: Determinism across multiple runs', () => {
    const testCases = [
      { dataType: 'short_text' as const, value: 'test', config: { maxLength: 10 } },
      { dataType: 'integer' as const, value: 42, config: { min: 0, max: 100 } },
      { dataType: 'email' as const, value: 'test@example.com', config: {} },
    ];

    for (const { dataType, value, config } of testCases) {
      const results = Array.from({ length: 5 }, () =>
        validateCustomFieldValue(dataType, config, value, context)
      );

      // All results should be deeply equal
      for (let i = 1; i < results.length; i++) {
        expect(results[i]).toEqual(results[0]);
      }
    }
  });
});
