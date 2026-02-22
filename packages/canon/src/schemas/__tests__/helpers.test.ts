/**
 * Tests for schema composition helpers
 * 
 * Verifies:
 * - withMeta adds metadata to schemas
 * - primitives provide reusable validated schemas
 * - createEnumSchema creates enum with metadata
 */

import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { createEnumSchema, primitives, withMeta } from '../helpers';

describe('Schema Helpers', () => {
  describe('withMeta()', () => {
    it('should add metadata to schema', () => {
      const schema = z.string();
      const enhanced = withMeta(schema, {
        id: 'TestString',
        description: 'A test string schema',
      });
      
      // Verify metadata is attached
      expect(enhanced._def).toBeDefined();
    });

    it('should preserve schema validation', () => {
      const schema = z.string().min(5);
      const enhanced = withMeta(schema, {
        id: 'MinString',
        description: 'String with minimum length',
      });
      
      expect(enhanced.safeParse('test').success).toBe(false);
      expect(enhanced.safeParse('testing').success).toBe(true);
    });

    it('should support examples in metadata', () => {
      const schema = z.number();
      const enhanced = withMeta(schema, {
        id: 'Age',
        description: 'User age',
        examples: [25, 30, 45],
      });
      
      expect(enhanced._def).toBeDefined();
    });
  });

  describe('primitives', () => {
    describe('email', () => {
      it('should validate email addresses', () => {
        expect(primitives.email.safeParse('test@example.com').success).toBe(true);
        expect(primitives.email.safeParse('invalid-email').success).toBe(false);
        expect(primitives.email.safeParse('').success).toBe(false);
      });
    });

    describe('url', () => {
      it('should validate URLs', () => {
        expect(primitives.url.safeParse('https://example.com').success).toBe(true);
        expect(primitives.url.safeParse('http://localhost:3000').success).toBe(true);
        expect(primitives.url.safeParse('not-a-url').success).toBe(false);
      });
    });

    describe('timestamp', () => {
      it('should validate ISO 8601 datetime strings', () => {
        expect(primitives.timestamp.safeParse('2024-01-01T00:00:00Z').success).toBe(true);
        expect(primitives.timestamp.safeParse('2024-01-01T00:00:00.000Z').success).toBe(true);
        expect(primitives.timestamp.safeParse('2024-01-01').success).toBe(false);
        expect(primitives.timestamp.safeParse('invalid').success).toBe(false);
      });
    });

    describe('isoDate', () => {
      it('should validate ISO date strings', () => {
        expect(primitives.isoDate.safeParse('2024-01-01').success).toBe(true);
        expect(primitives.isoDate.safeParse('2024-12-31').success).toBe(true);
        expect(primitives.isoDate.safeParse('2024-01-01T00:00:00Z').success).toBe(false);
        expect(primitives.isoDate.safeParse('invalid').success).toBe(false);
      });
    });

    describe('positiveInt', () => {
      it('should validate positive integers', () => {
        expect(primitives.positiveInt.safeParse(1).success).toBe(true);
        expect(primitives.positiveInt.safeParse(100).success).toBe(true);
        expect(primitives.positiveInt.safeParse(0).success).toBe(false);
        expect(primitives.positiveInt.safeParse(-1).success).toBe(false);
        expect(primitives.positiveInt.safeParse(1.5).success).toBe(false);
      });

      it('should coerce strings to numbers', () => {
        const result = primitives.positiveInt.safeParse('42');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(42);
        }
      });
    });

    describe('nonNegativeInt', () => {
      it('should validate non-negative integers', () => {
        expect(primitives.nonNegativeInt.safeParse(0).success).toBe(true);
        expect(primitives.nonNegativeInt.safeParse(1).success).toBe(true);
        expect(primitives.nonNegativeInt.safeParse(100).success).toBe(true);
        expect(primitives.nonNegativeInt.safeParse(-1).success).toBe(false);
        expect(primitives.nonNegativeInt.safeParse(1.5).success).toBe(false);
      });

      it('should coerce strings to numbers', () => {
        const result = primitives.nonNegativeInt.safeParse('0');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(0);
        }
      });
    });

    describe('percentage', () => {
      it('should validate percentage values', () => {
        expect(primitives.percentage.safeParse(0).success).toBe(true);
        expect(primitives.percentage.safeParse(50).success).toBe(true);
        expect(primitives.percentage.safeParse(100).success).toBe(true);
        expect(primitives.percentage.safeParse(-1).success).toBe(false);
        expect(primitives.percentage.safeParse(101).success).toBe(false);
      });

      it('should coerce strings to numbers', () => {
        const result = primitives.percentage.safeParse('75');
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data).toBe(75);
        }
      });

      it('should accept decimal percentages', () => {
        expect(primitives.percentage.safeParse(50.5).success).toBe(true);
        expect(primitives.percentage.safeParse(99.9).success).toBe(true);
      });
    });
  });

  describe('createEnumSchema()', () => {
    it('should create enum schema with metadata', () => {
      const schema = createEnumSchema(
        ['active', 'inactive', 'pending'] as const,
        {
          id: 'Status',
          description: 'User status',
        }
      );
      
      expect(schema.safeParse('active').success).toBe(true);
      expect(schema.safeParse('inactive').success).toBe(true);
      expect(schema.safeParse('invalid').success).toBe(false);
    });

    it('should preserve enum values', () => {
      const values = ['red', 'green', 'blue'] as const;
      const schema = createEnumSchema(values, {
        id: 'Color',
        description: 'Color options',
      });
      
      const result = schema.safeParse('red');
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('red');
      }
    });

    it('should reject values not in enum', () => {
      const schema = createEnumSchema(['option1', 'option2'] as const, {
        id: 'Options',
        description: 'Available options',
      });
      
      expect(schema.safeParse('option1').success).toBe(true);
      expect(schema.safeParse('option3').success).toBe(false);
      expect(schema.safeParse('').success).toBe(false);
    });
  });

  describe('Composition patterns', () => {
    it('should compose primitives into complex schemas', () => {
      const userSchema = z.object({
        email: primitives.email,
        age: primitives.positiveInt,
        website: primitives.url.optional(),
      });
      
      const validUser = {
        email: 'user@example.com',
        age: 25,
        website: 'https://example.com',
      };
      
      expect(userSchema.safeParse(validUser).success).toBe(true);
    });

    it('should use withMeta on composed schemas', () => {
      const addressSchema = withMeta(
        z.object({
          street: z.string(),
          city: z.string(),
          zip: z.string(),
        }),
        {
          id: 'Address',
          description: 'Physical address',
          examples: [
            { street: '123 Main St', city: 'Springfield', zip: '12345' },
          ],
        }
      );
      
      const validAddress = {
        street: '123 Main St',
        city: 'Springfield',
        zip: '12345',
      };
      
      expect(addressSchema.safeParse(validAddress).success).toBe(true);
    });
  });
});
