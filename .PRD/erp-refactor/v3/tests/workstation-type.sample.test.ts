import { describe, it, expect } from 'vitest';
import { WorkstationTypeSchema, WorkstationTypeInsertSchema } from '../types/workstation-type.js';

describe('WorkstationType Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkstationType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "workstation_type": "Sample Workstation Type",
      "hour_rate": 100,
      "description": "Sample text for description"
  };

  it('validates a correct Workstation Type object', () => {
    const result = WorkstationTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "workstation_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).workstation_type;
    const result = WorkstationTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
