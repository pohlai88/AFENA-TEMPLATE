import { describe, it, expect } from 'vitest';
import { PsoaCostCenterSchema, PsoaCostCenterInsertSchema } from '../types/psoa-cost-center.js';

describe('PsoaCostCenter Zod validation', () => {
  const validSample = {
      "id": "TEST-PsoaCostCenter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "cost_center_name": "LINK-cost_center_name-001"
  };

  it('validates a correct PSOA Cost Center object', () => {
    const result = PsoaCostCenterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PsoaCostCenterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "cost_center_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).cost_center_name;
    const result = PsoaCostCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PsoaCostCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
