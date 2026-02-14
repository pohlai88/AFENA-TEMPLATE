import { describe, it, expect } from 'vitest';
import { SalesPersonSchema, SalesPersonInsertSchema } from '../types/sales-person.js';

describe('SalesPerson Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesPerson-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "sales_person_name": "Sample Sales Person Name",
      "parent_sales_person": "LINK-parent_sales_person-001",
      "commission_rate": "Sample Commission Rate",
      "is_group": "0",
      "enabled": "1",
      "employee": "LINK-employee-001",
      "department": "LINK-department-001",
      "lft": 1,
      "rgt": 1,
      "old_parent": "Sample old_parent"
  };

  it('validates a correct Sales Person object', () => {
    const result = SalesPersonSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesPersonInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "sales_person_name" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).sales_person_name;
    const result = SalesPersonSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesPersonSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
