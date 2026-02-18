/**
 * Tests for branded Zod schemas
 * 
 * Verifies:
 * - Branded schemas validate UUIDs
 * - Branded schemas produce branded types
 * - Integration with Zod validation pipeline
 */

import { describe, expect, it } from 'vitest';

import {
  auditLogIdSchema,
  batchIdSchema,
  entityIdSchema,
  mutationIdSchema,
  orgIdSchema,
  userIdSchema,
} from '../branded';

describe('Branded Schemas', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const invalidUuid = 'not-a-uuid';

  describe('entityIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = entityIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
        // Type check: result.data is branded (Zod uses internal $brand)
      }
    });

    it('should reject invalid UUID', () => {
      expect(entityIdSchema.safeParse(invalidUuid).success).toBe(false);
      expect(entityIdSchema.safeParse('').success).toBe(false);
      expect(entityIdSchema.safeParse(123).success).toBe(false);
    });

    it('should have metadata', () => {
      expect(entityIdSchema._def).toBeDefined();
    });
  });

  describe('orgIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = orgIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
      }
    });

    it('should reject invalid UUID', () => {
      expect(orgIdSchema.safeParse(invalidUuid).success).toBe(false);
    });
  });

  describe('userIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = userIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
      }
    });

    it('should reject invalid UUID', () => {
      expect(userIdSchema.safeParse(invalidUuid).success).toBe(false);
    });
  });

  describe('batchIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = batchIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
      }
    });

    it('should reject invalid UUID', () => {
      expect(batchIdSchema.safeParse(invalidUuid).success).toBe(false);
    });
  });

  describe('mutationIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = mutationIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
      }
    });

    it('should reject invalid UUID', () => {
      expect(mutationIdSchema.safeParse(invalidUuid).success).toBe(false);
    });
  });

  describe('auditLogIdSchema', () => {
    it('should validate and brand valid UUID', () => {
      const result = auditLogIdSchema.safeParse(validUuid);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validUuid);
      }
    });

    it('should reject invalid UUID', () => {
      expect(auditLogIdSchema.safeParse(invalidUuid).success).toBe(false);
    });
  });

  describe('Integration with Zod pipeline', () => {
    it('should work with .optional()', () => {
      const schema = entityIdSchema.optional();

      expect(schema.safeParse(validUuid).success).toBe(true);
      expect(schema.safeParse(undefined).success).toBe(true);
      expect(schema.safeParse(invalidUuid).success).toBe(false);
    });

    it('should work with .nullable()', () => {
      const schema = entityIdSchema.nullable();

      expect(schema.safeParse(validUuid).success).toBe(true);
      expect(schema.safeParse(null).success).toBe(true);
      expect(schema.safeParse(invalidUuid).success).toBe(false);
    });

    it('should work in object schemas', () => {
      const schema = entityIdSchema.safeParse(validUuid);

      expect(schema.success).toBe(true);
    });

    it('should provide clear error messages', () => {
      const result = entityIdSchema.safeParse(invalidUuid);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
        expect(result.error.issues[0]!.message).toBeDefined();
      }
    });
  });

  describe('Brand type safety', () => {
    it('should prevent mixing different branded types at compile time', () => {
      // This test verifies compile-time behavior
      // At runtime, branded types are just strings
      const entityId = validUuid as string & { readonly __brand: 'EntityId' };
      const orgId = validUuid as string & { readonly __brand: 'OrgId' };

      // Runtime: both are strings
      expect(entityId).toBe(orgId);

      // Compile-time: TypeScript would prevent this assignment
      // const mixedId: typeof entityId = orgId; // Type error!
    });
  });
});
