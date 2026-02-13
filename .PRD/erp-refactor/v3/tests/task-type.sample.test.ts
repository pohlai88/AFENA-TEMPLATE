import { describe, it, expect } from 'vitest';
import { TaskTypeSchema, TaskTypeInsertSchema } from '../types/task-type.js';

describe('TaskType Zod validation', () => {
  const validSample = {
      "id": "TEST-TaskType-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "weight": 1,
      "description": "Sample text for description"
  };

  it('validates a correct Task Type object', () => {
    const result = TaskTypeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TaskTypeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TaskTypeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
