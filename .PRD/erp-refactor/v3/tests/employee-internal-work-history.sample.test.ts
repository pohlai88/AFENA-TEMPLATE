import { describe, it, expect } from 'vitest';
import { EmployeeInternalWorkHistorySchema, EmployeeInternalWorkHistoryInsertSchema } from '../types/employee-internal-work-history.js';

describe('EmployeeInternalWorkHistory Zod validation', () => {
  const validSample = {
      "id": "TEST-EmployeeInternalWorkHistory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "branch": "LINK-branch-001",
      "department": "LINK-department-001",
      "designation": "LINK-designation-001",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15"
  };

  it('validates a correct Employee Internal Work History object', () => {
    const result = EmployeeInternalWorkHistorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmployeeInternalWorkHistoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmployeeInternalWorkHistorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
