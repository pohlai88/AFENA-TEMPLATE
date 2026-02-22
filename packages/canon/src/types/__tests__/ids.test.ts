/**
 * Tests for branded ID types
 * 
 * Verifies:
 * - Type guards correctly validate UUIDs
 * - Brand functions throw on invalid input
 * - Branded types prevent UUID mixing at compile time
 */

import { describe, expect, it } from 'vitest';

import {
  asAuditLogId,
  asBatchId,
  asEntityId,
  asMutationId,
  asOrgId,
  asUserId,
  isAuditLogId,
  isBatchId,
  isEntityId,
  isMutationId,
  isOrgId,
  isUserId,
} from '../ids';

describe('Branded ID Types', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const invalidUuid = 'not-a-uuid';
  const emptyString = '';
  const malformedUuid = '123e4567-e89b-12d3-a456';

  describe('EntityId', () => {
    it('should validate valid UUID', () => {
      expect(isEntityId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isEntityId(invalidUuid)).toBe(false);
      expect(isEntityId(emptyString)).toBe(false);
      expect(isEntityId(malformedUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asEntityId(validUuid);
      expect(branded).toBe(validUuid);
      // Type check: verify it's branded (compile-time only)
      void (branded as string & { readonly __brand: 'EntityId' });
    });

    it('should throw on invalid UUID', () => {
      expect(() => asEntityId(invalidUuid)).toThrow('Invalid EntityId');
      expect(() => asEntityId(emptyString)).toThrow('Invalid EntityId');
      expect(() => asEntityId(malformedUuid)).toThrow('Invalid EntityId');
    });
  });

  describe('OrgId', () => {
    it('should validate valid UUID', () => {
      expect(isOrgId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isOrgId(invalidUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asOrgId(validUuid);
      expect(branded).toBe(validUuid);
    });

    it('should throw on invalid UUID', () => {
      expect(() => asOrgId(invalidUuid)).toThrow('Invalid OrgId');
    });
  });

  describe('UserId', () => {
    it('should validate valid UUID', () => {
      expect(isUserId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isUserId(invalidUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asUserId(validUuid);
      expect(branded).toBe(validUuid);
    });

    it('should throw on invalid UUID', () => {
      expect(() => asUserId(invalidUuid)).toThrow('Invalid UserId');
    });
  });

  describe('BatchId', () => {
    it('should validate valid UUID', () => {
      expect(isBatchId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isBatchId(invalidUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asBatchId(validUuid);
      expect(branded).toBe(validUuid);
    });

    it('should throw on invalid UUID', () => {
      expect(() => asBatchId(invalidUuid)).toThrow('Invalid BatchId');
    });
  });

  describe('MutationId', () => {
    it('should validate valid UUID', () => {
      expect(isMutationId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isMutationId(invalidUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asMutationId(validUuid);
      expect(branded).toBe(validUuid);
    });

    it('should throw on invalid UUID', () => {
      expect(() => asMutationId(invalidUuid)).toThrow('Invalid MutationId');
    });
  });

  describe('AuditLogId', () => {
    it('should validate valid UUID', () => {
      expect(isAuditLogId(validUuid)).toBe(true);
    });

    it('should reject invalid UUID', () => {
      expect(isAuditLogId(invalidUuid)).toBe(false);
    });

    it('should brand valid UUID', () => {
      const branded = asAuditLogId(validUuid);
      expect(branded).toBe(validUuid);
    });

    it('should throw on invalid UUID', () => {
      expect(() => asAuditLogId(invalidUuid)).toThrow('Invalid AuditLogId');
    });
  });

  describe('UUID format validation', () => {
    it('should accept various valid UUID formats', () => {
      const validUuids = [
        '123e4567-e89b-12d3-a456-426614174000', // v1
        '123e4567-e89b-22d3-a456-426614174000', // v2
        '123e4567-e89b-32d3-a456-426614174000', // v3
        '123e4567-e89b-42d3-a456-426614174000', // v4
        '123e4567-e89b-52d3-a456-426614174000', // v5
      ];

      validUuids.forEach(uuid => {
        expect(isEntityId(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUID formats', () => {
      const invalidUuids = [
        '123e4567-e89b-12d3-a456', // too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // too long
        '123e4567e89b12d3a456426614174000', // no dashes
        'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // invalid chars
        '123e4567-e89b-62d3-a456-426614174000', // invalid version (6)
        '123e4567-e89b-12d3-c456-426614174000', // invalid variant (c)
      ];

      invalidUuids.forEach(uuid => {
        expect(isEntityId(uuid)).toBe(false);
      });
    });

    it('should be case-insensitive', () => {
      const upperUuid = '123E4567-E89B-12D3-A456-426614174000';
      const lowerUuid = '123e4567-e89b-12d3-a456-426614174000';
      const mixedUuid = '123e4567-E89B-12d3-A456-426614174000';

      expect(isEntityId(upperUuid)).toBe(true);
      expect(isEntityId(lowerUuid)).toBe(true);
      expect(isEntityId(mixedUuid)).toBe(true);
    });
  });

  describe('Zero runtime overhead', () => {
    it('should not modify the string value', () => {
      const original = validUuid;
      const branded = asEntityId(original);

      // Same reference (no copy)
      expect(branded).toBe(original);

      // Same string value
      expect(String(branded)).toBe(original);
    });
  });
});
