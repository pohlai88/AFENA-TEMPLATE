import { describe, it, expect } from 'vitest';
import { ProjectUpdateSchema, ProjectUpdateInsertSchema } from '../types/project-update.js';

describe('ProjectUpdate Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectUpdate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Sample Series",
      "project": "LINK-project-001",
      "sent": "0",
      "date": "2024-01-15",
      "time": "10:30:00",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Project Update object', () => {
    const result = ProjectUpdateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectUpdateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "project" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).project;
    const result = ProjectUpdateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectUpdateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
