import { describe, it, expect } from 'vitest';
import { TaskDependsOnSchema, TaskDependsOnInsertSchema } from '../types/task-depends-on.js';

describe('TaskDependsOn Zod validation', () => {
  const validSample = {
      "id": "TEST-TaskDependsOn-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "task": "LINK-task-001",
      "subject": "Sample text for subject",
      "project": "Sample text for project"
  };

  it('validates a correct Task Depends On object', () => {
    const result = TaskDependsOnSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaskDependsOnInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaskDependsOnSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
