import { describe, it, expect } from 'vitest';
import { WorkstationCostSchema, WorkstationCostInsertSchema } from '../types/workstation-cost.js';

describe('WorkstationCost Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkstationCost-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "operating_component": "LINK-operating_component-001",
      "operating_cost": 100
  };

  it('validates a correct Workstation Cost object', () => {
    const result = WorkstationCostSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationCostInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "operating_component" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).operating_component;
    const result = WorkstationCostSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationCostSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
