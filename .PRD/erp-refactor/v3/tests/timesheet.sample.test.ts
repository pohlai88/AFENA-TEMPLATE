import { describe, it, expect } from 'vitest';
import { TimesheetSchema, TimesheetInsertSchema } from '../types/timesheet.js';

describe('Timesheet Zod validation', () => {
  const validSample = {
      "id": "TEST-Timesheet-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "title": "{employee_name}",
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "customer": "LINK-customer-001",
      "currency": "LINK-currency-001",
      "exchange_rate": "1",
      "sales_invoice": "LINK-sales_invoice-001",
      "status": "Draft",
      "parent_project": "LINK-parent_project-001",
      "employee": "LINK-employee-001",
      "employee_name": "Sample Employee Name",
      "department": "LINK-department-001",
      "user": "LINK-user-001",
      "start_date": "2024-01-15",
      "end_date": "2024-01-15",
      "total_hours": "0",
      "total_billable_hours": 1,
      "base_total_billable_amount": 100,
      "base_total_billed_amount": 100,
      "base_total_costing_amount": 100,
      "total_billed_hours": 1,
      "total_billable_amount": "0",
      "total_billed_amount": 100,
      "total_costing_amount": 100,
      "per_billed": 1,
      "note": "Sample text for note",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Timesheet object', () => {
    const result = TimesheetSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TimesheetInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = TimesheetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TimesheetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
