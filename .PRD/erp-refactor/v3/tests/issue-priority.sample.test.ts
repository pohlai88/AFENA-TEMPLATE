import { describe, it, expect } from 'vitest';
import { IssuePrioritySchema, IssuePriorityInsertSchema } from '../types/issue-priority.js';

describe('IssuePriority Zod validation', () => {
  const validSample = {
      "id": "TEST-IssuePriority-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "description": "Sample text for description"
  };

  it('validates a correct Issue Priority object', () => {
    const result = IssuePrioritySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = IssuePriorityInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = IssuePrioritySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
