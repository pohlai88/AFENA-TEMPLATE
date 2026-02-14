import { describe, it, expect } from 'vitest';
import { CostCenterSchema, CostCenterInsertSchema } from '../types/cost-center.js';

describe('CostCenter Zod validation', () => {
  const validSample = {
      "id": "TEST-CostCenter-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "cost_center_name": "Sample Cost Center Name",
      "cost_center_number": "Sample Cost Center Number",
      "parent_cost_center": "LINK-parent_cost_center-001",
      "company": "LINK-company-001",
      "is_group": "0",
      "disabled": "0",
      "lft": 1,
      "rgt": 1,
      "old_parent": "LINK-old_parent-001"
  };

  it('validates a correct Cost Center object', () => {
    const result = CostCenterSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CostCenterInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "cost_center_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).cost_center_name;
    const result = CostCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CostCenterSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
