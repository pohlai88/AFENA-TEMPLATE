import { describe, it, expect } from 'vitest';
import { ProjectTypeSchema, ProjectTypeInsertSchema } from '../types/project-type.js';

describe('ProjectType Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "project_type": "Sample Project Type",
      "description": "Sample text for description"
  };

  it('validates a correct Project Type object', () => {
    const result = ProjectTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "project_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).project_type;
    const result = ProjectTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
