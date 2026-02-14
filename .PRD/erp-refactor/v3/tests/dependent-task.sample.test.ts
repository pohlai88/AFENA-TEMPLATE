import { describe, it, expect } from 'vitest';
import { DependentTaskSchema, DependentTaskInsertSchema } from '../types/dependent-task.js';

describe('DependentTask Zod validation', () => {
  const validSample = {
      "id": "TEST-DependentTask-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "task": "LINK-task-001"
  };

  it('validates a correct Dependent Task object', () => {
    const result = DependentTaskSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DependentTaskInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DependentTaskSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
