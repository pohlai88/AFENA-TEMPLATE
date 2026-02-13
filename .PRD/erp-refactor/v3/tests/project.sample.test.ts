import { describe, it, expect } from 'vitest';
import { ProjectSchema, ProjectInsertSchema } from '../types/project.js';

describe('Project Zod validation', () => {
  const validSample = {
      "id": "TEST-Project-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "project_name": "Sample Project Name",
      "status": "Open",
      "project_type": "LINK-project_type-001",
      "is_active": "Yes",
      "percent_complete_method": "Task Completion",
      "percent_complete": 1,
      "project_template": "LINK-project_template-001",
      "expected_start_date": "2024-01-15",
      "expected_end_date": "2024-01-15",
      "priority": "Medium",
      "department": "LINK-department-001",
      "customer": "LINK-customer-001",
      "sales_order": "LINK-sales_order-001",
      "copied_from": "Sample Copied From",
      "notes": "Sample text for notes",
      "actual_start_date": "2024-01-15",
      "actual_time": 1,
      "actual_end_date": "2024-01-15",
      "estimated_costing": 100,
      "total_costing_amount": 100,
      "total_purchase_cost": 100,
      "company": "LINK-company-001",
      "total_sales_amount": 100,
      "total_billable_amount": 100,
      "total_billed_amount": 100,
      "total_consumed_material_cost": 100,
      "cost_center": "LINK-cost_center-001",
      "gross_margin": 100,
      "per_gross_margin": 1,
      "collect_progress": "0",
      "holiday_list": "LINK-holiday_list-001",
      "frequency": "Hourly",
      "from_time": "10:30:00",
      "to_time": "10:30:00",
      "first_email": "10:30:00",
      "second_email": "10:30:00",
      "daily_time_to_send": "10:30:00",
      "day_to_send": "Monday",
      "weekly_time_to_send": "10:30:00",
      "subject": "Sample Subject",
      "message": "Sample text for message"
  };

  it('validates a correct Project object', () => {
    const result = ProjectSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = ProjectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
