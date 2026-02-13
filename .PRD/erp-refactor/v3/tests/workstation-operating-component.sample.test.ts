import { describe, it, expect } from 'vitest';
import { WorkstationOperatingComponentSchema, WorkstationOperatingComponentInsertSchema } from '../types/workstation-operating-component.js';

describe('WorkstationOperatingComponent Zod validation', () => {
  const validSample = {
      "id": "TEST-WorkstationOperatingComponent-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "component_name": "Sample Component Name"
  };

  it('validates a correct Workstation Operating Component object', () => {
    const result = WorkstationOperatingComponentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = WorkstationOperatingComponentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "component_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).component_name;
    const result = WorkstationOperatingComponentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = WorkstationOperatingComponentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
