import { describe, it, expect } from 'vitest';
import { ServiceLevelPrioritySchema, ServiceLevelPriorityInsertSchema } from '../types/service-level-priority.js';

describe('ServiceLevelPriority Zod validation', () => {
  const validSample = {
      "id": "TEST-ServiceLevelPriority-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "default_priority": "0",
      "priority": "LINK-priority-001",
      "response_time": 3600,
      "resolution_time": 3600
  };

  it('validates a correct Service Level Priority object', () => {
    const result = ServiceLevelPrioritySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ServiceLevelPriorityInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "priority" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).priority;
    const result = ServiceLevelPrioritySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ServiceLevelPrioritySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
