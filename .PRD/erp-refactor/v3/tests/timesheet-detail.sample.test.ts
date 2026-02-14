import { describe, it, expect } from 'vitest';
import { TimesheetDetailSchema, TimesheetDetailInsertSchema } from '../types/timesheet-detail.js';

describe('TimesheetDetail Zod validation', () => {
  const validSample = {
      "id": "TEST-TimesheetDetail-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "activity_type": "LINK-activity_type-001",
      "from_time": "2024-01-15T10:30:00.000Z",
      "description": "Sample text for description",
      "expected_hours": 1,
      "to_time": "2024-01-15T10:30:00.000Z",
      "hours": 1,
      "completed": "0",
      "project": "LINK-project-001",
      "project_name": "Sample Project Name",
      "task": "LINK-task-001",
      "is_billable": "0",
      "sales_invoice": "LINK-sales_invoice-001",
      "billing_hours": 1,
      "base_billing_rate": 100,
      "base_billing_amount": 100,
      "base_costing_rate": 100,
      "base_costing_amount": 100,
      "billing_rate": 100,
      "billing_amount": "0",
      "costing_rate": 100,
      "costing_amount": "0"
  };

  it('validates a correct Timesheet Detail object', () => {
    const result = TimesheetDetailSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = TimesheetDetailInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = TimesheetDetailSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
