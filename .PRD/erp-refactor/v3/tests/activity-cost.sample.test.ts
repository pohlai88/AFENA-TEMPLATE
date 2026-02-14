import { describe, it, expect } from 'vitest';
import { ActivityCostSchema, ActivityCostInsertSchema } from '../types/activity-cost.js';

describe('ActivityCost Zod validation', () => {
  const validSample = {
      "id": "TEST-ActivityCost-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "activity_type": "LINK-activity_type-001",
      "employee": "LINK-employee-001",
      "employee_name": "Sample Employee Name",
      "department": "LINK-department-001",
      "billing_rate": "0",
      "costing_rate": "0",
      "title": "Sample title"
  };

  it('validates a correct Activity Cost object', () => {
    const result = ActivityCostSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ActivityCostInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "activity_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).activity_type;
    const result = ActivityCostSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ActivityCostSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
