import { describe, it, expect } from 'vitest';
import { CostCenterAllocationSchema, CostCenterAllocationInsertSchema } from '../types/cost-center-allocation.js';

describe('CostCenterAllocation Zod validation', () => {
  const validSample = {
      "id": "TEST-CostCenterAllocation-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "main_cost_center": "LINK-main_cost_center-001",
      "company": "LINK-company-001",
      "valid_from": "Today",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Cost Center Allocation object', () => {
    const result = CostCenterAllocationSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CostCenterAllocationInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "main_cost_center" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).main_cost_center;
    const result = CostCenterAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CostCenterAllocationSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
