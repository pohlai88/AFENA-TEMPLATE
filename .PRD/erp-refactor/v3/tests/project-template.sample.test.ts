import { describe, it, expect } from 'vitest';
import { ProjectTemplateSchema, ProjectTemplateInsertSchema } from '../types/project-template.js';

describe('ProjectTemplate Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectTemplate-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "project_type": "LINK-project_type-001",
      "disabled": "0"
  };

  it('validates a correct Project Template object', () => {
    const result = ProjectTemplateSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectTemplateInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "tasks" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).tasks;
    const result = ProjectTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectTemplateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
