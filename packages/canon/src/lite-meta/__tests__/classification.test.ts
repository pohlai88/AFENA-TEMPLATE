/**
 * Classification Tests
 * 
 * Verifies invariants from Canon Architecture §9.5
 * Tests: C1 (pattern matching), C2 (null for unknown)
 */

import { describe, expect, it } from 'vitest';
import { classifyColumn, PII_PATTERNS } from '../classification';

describe('Classification', () => {
  describe('C1: Pattern matching', () => {
    it('should detect email patterns from column name', () => {
      const result = classifyColumn('email_address');

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should detect phone patterns from column name', () => {
      const result = classifyColumn('phone_number');

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should detect SSN patterns from column name', () => {
      const result = classifyColumn('ssn');

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0.9);
    });

    it('should detect credit card patterns from column name', () => {
      const result = classifyColumn('credit_card_number');

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should detect financial patterns from column name', () => {
      const result = classifyColumn('salary');

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('financial');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should use column name hints', () => {
      // Even without samples, column name should hint classification
      const result = classifyColumn('user_email', []);
      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
    });

    it('should detect email patterns', () => {
      const samples = ['user@example.com', 'admin@company.org', 'test@domain.co.uk'];
      const result = classifyColumn('email_address', samples);

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should detect phone patterns', () => {
      const samples = ['+1-555-123-4567', '(555) 123-4567', '555-123-4567'];
      const result = classifyColumn('phone_number', samples);

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });

    it('should detect SSN patterns', () => {
      const samples = ['123-45-6789', '987-65-4321'];
      const result = classifyColumn('ssn', samples);

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0.9);
    });

    it('should detect credit card patterns', () => {
      const samples = ['4532-1234-5678-9010', '5425-2334-3010-9903'];
      const result = classifyColumn('card_number', samples);

      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
      expect(result?.confidence).toBeGreaterThan(0);
    });
  });

  describe('C2: Null for unknown columns', () => {
    it('should return null for unclassifiable columns', () => {
      const samples = ['abc', 'def', 'ghi'];
      const result = classifyColumn('random_data', samples);

      expect(result).toBeNull();
    });

    it('should return null for empty samples with no name hints', () => {
      const result = classifyColumn('unknown_field', []);

      expect(result).toBeNull();
    });

    it('should return null for mixed non-PII data', () => {
      const samples = ['Product A', '12345', 'Category B'];
      const result = classifyColumn('product_name', samples);

      expect(result).toBeNull();
    });
  });

  describe('PII_PATTERNS', () => {
    it('should define PII patterns as array', () => {
      expect(PII_PATTERNS).toBeDefined();
      expect(Array.isArray(PII_PATTERNS)).toBe(true);
      expect(PII_PATTERNS.length).toBeGreaterThan(0);
    });

    it('should have valid pattern structure', () => {
      PII_PATTERNS.forEach(pattern => {
        expect(pattern.fieldNamePattern).toBeInstanceOf(RegExp);
        expect(pattern.classification).toBeDefined();
        expect(pattern.confidence).toBeGreaterThan(0);
        expect(pattern.confidence).toBeLessThanOrEqual(1);
      });
    });

    it('should include common PII patterns', () => {
      const patternStrings = PII_PATTERNS.map(p => p.fieldNamePattern.source.toLowerCase());
      const hasEmail = patternStrings.some(p => p.includes('email'));
      const hasPhone = patternStrings.some(p => p.includes('phone') || p.includes('mobile'));
      const hasSSN = patternStrings.some(p => p.includes('ssn') || p.includes('social'));

      expect(hasEmail).toBe(true);
      expect(hasPhone).toBe(true);
      expect(hasSSN).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty sample arrays', () => {
      const result = classifyColumn('test_field', []);
      // Should either classify based on name or return null
      expect(result).toBeNull();
    });

    it('should handle single sample', () => {
      const result = classifyColumn('email', ['test@example.com']);
      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
    });

    it('should handle mixed valid/invalid samples', () => {
      const samples = ['test@example.com', 'invalid', 'another@test.org'];
      const result = classifyColumn('email', samples);
      // Should still detect email pattern from column name
      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
    });

    it('should be case-insensitive for column names', () => {
      const result1 = classifyColumn('EMAIL', []);
      const result2 = classifyColumn('email', []);
      expect(result1).toStrictEqual(result2);
    });
  });

  describe('Column name hints', () => {
    it('should detect email from column name variations', () => {
      expect(classifyColumn('email', [])?.classification).toBe('pii');
      expect(classifyColumn('user_email', [])?.classification).toBe('pii');
      expect(classifyColumn('email_address', [])?.classification).toBe('pii');
      expect(classifyColumn('contact_email', [])?.classification).toBe('pii');
    });

    it('should detect phone from column name variations', () => {
      expect(classifyColumn('phone', [])?.classification).toBe('pii');
      expect(classifyColumn('phone_number', [])?.classification).toBe('pii');
      expect(classifyColumn('mobile', [])?.classification).toBe('pii');
      expect(classifyColumn('telephone', [])?.classification).toBe('pii');
    });

    it('should classify based on column name when samples provided', () => {
      // Column name takes precedence in current implementation
      const samples = ['+1-555-123-4567', '(555) 123-4567'];
      const result = classifyColumn('email', samples);
      // Classifies based on column name 'email'
      expect(result).not.toBeNull();
      expect(result?.classification).toBe('pii');
    });
  });
});
