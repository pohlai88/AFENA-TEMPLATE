import { describe, it, expect } from 'vitest';
import { ProjectsSettingsSchema, ProjectsSettingsInsertSchema } from '../types/projects-settings.js';

describe('ProjectsSettings Zod validation', () => {
  const validSample = {
      "id": "TEST-ProjectsSettings-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "ignore_workstation_time_overlap": "0",
      "ignore_user_time_overlap": "0",
      "ignore_employee_time_overlap": "0",
      "fetch_timesheet_in_sales_invoice": "0"
  };

  it('validates a correct Projects Settings object', () => {
    const result = ProjectsSettingsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProjectsSettingsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProjectsSettingsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
