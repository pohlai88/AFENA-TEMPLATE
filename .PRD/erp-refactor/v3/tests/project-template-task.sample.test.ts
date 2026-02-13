import { describe, it, expect } from 'vitest';
import { ProjectTemplateTaskSchema, ProjectTemplateTaskInsertSchema } from '../types/project-template-task.js';

describe('ProjectTemplateTask Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectTemplateTask-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "task": "LINK-task-001",
      "subject": "Read Only Value"
  };

  it('validates a correct Project Template Task object', () => {
    const result = ProjectTemplateTaskSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectTemplateTaskInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "task" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).task;
    const result = ProjectTemplateTaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectTemplateTaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
