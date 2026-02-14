import { describe, it, expect } from 'vitest';
import { EmployeeGroupSchema, EmployeeGroupInsertSchema } from '../types/employee-group.js';

describe('EmployeeGroup Zod validation', () => {
  const validSample = {
      "id": "TEST-EmployeeGroup-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "employee_group_name": "Sample Name"
  };

  it('validates a correct Employee Group object', () => {
    const result = EmployeeGroupSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmployeeGroupInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "employee_group_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).employee_group_name;
    const result = EmployeeGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmployeeGroupSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
