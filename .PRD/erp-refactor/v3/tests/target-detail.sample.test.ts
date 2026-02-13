import { describe, it, expect } from 'vitest';
import { TargetDetailSchema, TargetDetailInsertSchema } from '../types/target-detail.js';

describe('TargetDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-TargetDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_group": "LINK-item_group-001",
      "fiscal_year": "LINK-fiscal_year-001",
      "target_qty": 1,
      "target_amount": 1,
      "distribution_id": "LINK-distribution_id-001"
  };

  it('validates a correct Target Detail object', () => {
    const result = TargetDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TargetDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "fiscal_year" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).fiscal_year;
    const result = TargetDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TargetDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
