import { describe, it, expect } from 'vitest';
import { BranchSchema, BranchInsertSchema } from '../types/branch.js';

describe('Branch Zod validation', () => {
  const validSample = {
      "id": "TEST-Branch-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "branch": "Sample Branch"
  };

  it('validates a correct Branch object', () => {
    const result = BranchSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BranchInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "branch" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).branch;
    const result = BranchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BranchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
