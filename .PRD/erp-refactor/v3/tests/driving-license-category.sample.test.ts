import { describe, it, expect } from 'vitest';
import { DrivingLicenseCategorySchema, DrivingLicenseCategoryInsertSchema } from '../types/driving-license-category.js';

describe('DrivingLicenseCategory Zod validation', () => {
  const validSample = {
      "id": "TEST-DrivingLicenseCategory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "class": "Sample Driver licence class",
      "description": "Sample Description",
      "issuing_date": "2024-01-15",
      "expiry_date": "2024-01-15"
  };

  it('validates a correct Driving License Category object', () => {
    const result = DrivingLicenseCategorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DrivingLicenseCategoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DrivingLicenseCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
