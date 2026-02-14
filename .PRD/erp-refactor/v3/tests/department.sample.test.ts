import { describe, it, expect } from 'vitest';
import { DepartmentSchema, DepartmentInsertSchema } from '../types/department.js';

describe('Department Zod validation', () => {
  const validSample = {
      "id": "TEST-Department-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "department_name": "Sample Department",
      "parent_department": "LINK-parent_department-001",
      "company": "LINK-company-001",
      "is_group": "0",
      "disabled": "0",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample Old Parent"
  };

  it('validates a correct Department object', () => {
    const result = DepartmentSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DepartmentInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "department_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).department_name;
    const result = DepartmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DepartmentSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
