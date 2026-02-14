import { describe, it, expect } from 'vitest';
import { PsoaProjectSchema, PsoaProjectInsertSchema } from '../types/psoa-project.js';

describe('PsoaProject Zod validation', () => {
  const validSample = {
      "id": "TEST-PsoaProject-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "project_name": "LINK-project_name-001"
  };

  it('validates a correct PSOA Project object', () => {
    const result = PsoaProjectSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PsoaProjectInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PsoaProjectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
