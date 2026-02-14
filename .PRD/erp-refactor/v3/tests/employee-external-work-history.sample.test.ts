import { describe, it, expect } from 'vitest';
import { EmployeeExternalWorkHistorySchema, EmployeeExternalWorkHistoryInsertSchema } from '../types/employee-external-work-history.js';

describe('EmployeeExternalWorkHistory Zod validation', () => {
  const validSample = {
      "id": "TEST-EmployeeExternalWorkHistory-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "company_name": "Sample Company",
      "designation": "Sample Designation",
      "salary": 100,
      "address": "Sample text for address",
      "contact": "Sample Contact",
      "total_experience": "Sample Total Experience"
  };

  it('validates a correct Employee External Work History object', () => {
    const result = EmployeeExternalWorkHistorySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmployeeExternalWorkHistoryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmployeeExternalWorkHistorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
