import { describe, it, expect } from 'vitest';
import { MasterProductionScheduleSchema, MasterProductionScheduleInsertSchema } from '../types/master-production-schedule.js';

describe('MasterProductionSchedule Zod validation', () => {
  const validSample = {
      "id": "TEST-MasterProductionSchedule-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "MPS.YY.-.######",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "from_date": "2024-01-15",
      "to_date": "2024-01-15",
      "parent_warehouse": "LINK-parent_warehouse-001",
      "sales_forecast": "LINK-sales_forecast-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Master Production Schedule object', () => {
    const result = MasterProductionScheduleSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = MasterProductionScheduleInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = MasterProductionScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = MasterProductionScheduleSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
