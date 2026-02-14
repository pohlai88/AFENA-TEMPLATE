import { describe, it, expect } from 'vitest';
import { SalesInvoiceTimesheetSchema, SalesInvoiceTimesheetInsertSchema } from '../types/sales-invoice-timesheet.js';

describe('SalesInvoiceTimesheet Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesInvoiceTimesheet-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "activity_type": "LINK-activity_type-001",
      "description": "Sample text for description",
      "from_time": "2024-01-15T10:30:00.000Z",
      "to_time": "2024-01-15T10:30:00.000Z",
      "billing_hours": 1,
      "billing_amount": 100,
      "time_sheet": "LINK-time_sheet-001",
      "timesheet_detail": "Sample Timesheet Detail",
      "project_name": "Sample Project Name"
  };

  it('validates a correct Sales Invoice Timesheet object', () => {
    const result = SalesInvoiceTimesheetSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesInvoiceTimesheetInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesInvoiceTimesheetSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
