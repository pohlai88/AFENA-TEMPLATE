import { describe, it, expect } from 'vitest';
import { CostCenterAllocationPercentageSchema, CostCenterAllocationPercentageInsertSchema } from '../types/cost-center-allocation-percentage.js';

describe('CostCenterAllocationPercentage Zod validation', () => {
  const validSample = {
      "id": "TEST-CostCenterAllocationPercentage-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "cost_center": "LINK-cost_center-001",
      "percentage": 1
  };

  it('validates a correct Cost Center Allocation Percentage object', () => {
    const result = CostCenterAllocationPercentageSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CostCenterAllocationPercentageInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "cost_center" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).cost_center;
    const result = CostCenterAllocationPercentageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CostCenterAllocationPercentageSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
