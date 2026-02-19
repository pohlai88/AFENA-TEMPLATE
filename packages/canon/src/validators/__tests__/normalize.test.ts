/**
 * Normalization Tests
 * 
 * Tests for all normalization functions and idempotence property.
 */

import { describe, expect, test } from 'vitest';
import {
  collapseWhitespace,
  lowercase,
  normalizeBoolean,
  normalizeDate,
  normalizeDatetime,
  normalizeEmail,
  normalizeNumber,
  normalizePhone,
  normalizeUrl,
  toSlug,
  trimWhitespace,
  uppercase,
} from '../core/normalize';

describe('Normalization Functions', () => {
  const context = {
    entityType: 'contacts' as const,
    fieldPath: ['test'],
    mode: 'create' as const,
  };

  describe('String Normalizers', () => {
    test('trimWhitespace should remove leading and trailing spaces', () => {
      const result = trimWhitespace('  hello  ', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello');
      }
    });

    test('collapseWhitespace should collapse multiple spaces', () => {
      const result = collapseWhitespace('hello    world', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello world');
      }
    });

    test('lowercase should convert to lowercase', () => {
      const result = lowercase('HELLO', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello');
      }
    });

    test('uppercase should convert to uppercase', () => {
      const result = uppercase('hello', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('HELLO');
      }
    });

    test('toSlug should create valid slug', () => {
      const result = toSlug('Hello World!', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('hello-world');
      }
    });
  });

  describe('Format Normalizers', () => {
    test('normalizeEmail should lowercase and trim', () => {
      const result = normalizeEmail('  User@Example.COM  ', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('user@example.com');
      }
    });

    test('normalizePhone should remove non-digits', () => {
      const result = normalizePhone('(555) 123-4567', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('5551234567');
      }
    });

    test('normalizeUrl should lowercase protocol and domain', () => {
      const result = normalizeUrl('  HTTPS://Example.COM/Path  ', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('https://example.com/Path');
      }
    });
  });

  describe('Type Normalizers', () => {
    test('normalizeNumber should parse string to number', () => {
      const result = normalizeNumber('42.5', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42.5);
      }
    });

    test('normalizeNumber should pass through numbers', () => {
      const result = normalizeNumber(42, context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    test('normalizeBoolean should parse true strings', () => {
      const testCases = ['true', '1', 'yes', 'on'];
      for (const value of testCases) {
        const result = normalizeBoolean(value, context);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value).toBe(true);
        }
      }
    });

    test('normalizeBoolean should parse false strings', () => {
      const testCases = ['false', '0', 'no', 'off'];
      for (const value of testCases) {
        const result = normalizeBoolean(value, context);
        expect(result.ok).toBe(true);
        if (result.ok) {
          expect(result.value).toBe(false);
        }
      }
    });

    test('normalizeBoolean should pass through booleans', () => {
      expect(normalizeBoolean(true, context).ok).toBe(true);
      expect(normalizeBoolean(false, context).ok).toBe(true);
    });
  });

  describe('Temporal Normalizers', () => {
    test('normalizeDate should format to ISO date', () => {
      const result = normalizeDate('2024-01-15', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('2024-01-15');
      }
    });

    test('normalizeDatetime should format to ISO datetime', () => {
      const result = normalizeDatetime('2024-01-15T10:30:00Z', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      }
    });
  });

  describe('Idempotence', () => {
    test('trimWhitespace should be idempotent', () => {
      const once = trimWhitespace('  hello  ', context);
      if (once.ok) {
        const twice = trimWhitespace(once.value, context);
        expect(twice).toEqual(once);
      }
    });

    test('collapseWhitespace should be idempotent', () => {
      const once = collapseWhitespace('hello    world', context);
      if (once.ok) {
        const twice = collapseWhitespace(once.value, context);
        expect(twice).toEqual(once);
      }
    });

    test('lowercase should be idempotent', () => {
      const once = lowercase('HELLO', context);
      if (once.ok) {
        const twice = lowercase(once.value, context);
        expect(twice).toEqual(once);
      }
    });

    test('toSlug should be idempotent', () => {
      const once = toSlug('Hello World!', context);
      if (once.ok) {
        const twice = toSlug(once.value, context);
        expect(twice).toEqual(once);
      }
    });

    test('normalizeEmail should be idempotent', () => {
      const once = normalizeEmail('  User@Example.COM  ', context);
      if (once.ok) {
        const twice = normalizeEmail(once.value, context);
        expect(twice).toEqual(once);
      }
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings', () => {
      expect(trimWhitespace('', context).ok).toBe(true);
      expect(collapseWhitespace('', context).ok).toBe(true);
      expect(lowercase('', context).ok).toBe(true);
    });

    test('should handle non-string types gracefully', () => {
      expect(trimWhitespace(123, context).ok).toBe(true);
      expect(normalizeEmail(null, context).ok).toBe(true);
    });

    test('normalizeUrl should handle invalid URLs', () => {
      const result = normalizeUrl('not-a-url', context);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe('not-a-url');
      }
    });
  });
});
