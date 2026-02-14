import { describe, it, expect } from 'vitest';
import { SalesForecastSchema, SalesForecastInsertSchema } from '../types/sales-forecast.js';

describe('SalesForecast Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesForecast-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "SF.YY.-.######",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "from_date": "Today",
      "frequency": "Monthly",
      "demand_number": "6",
      "parent_warehouse": "LINK-parent_warehouse-001",
      "amended_from": "LINK-amended_from-001",
      "status": "Planned"
  };

  it('validates a correct Sales Forecast object', () => {
    const result = SalesForecastSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesForecastInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = SalesForecastSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesForecastSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
