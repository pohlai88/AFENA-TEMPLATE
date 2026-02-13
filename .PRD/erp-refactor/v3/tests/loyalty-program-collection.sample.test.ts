import { describe, it, expect } from 'vitest';
import { LoyaltyProgramCollectionSchema, LoyaltyProgramCollectionInsertSchema } from '../types/loyalty-program-collection.js';

describe('LoyaltyProgramCollection Zod validation', () => {
  const validSample = {
      "id": "TEST-LoyaltyProgramCollection-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "tier_name": "Sample Tier Name",
      "min_spent": 100,
      "collection_factor": 100
  };

  it('validates a correct Loyalty Program Collection object', () => {
    const result = LoyaltyProgramCollectionSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LoyaltyProgramCollectionInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tier_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tier_name;
    const result = LoyaltyProgramCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LoyaltyProgramCollectionSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
