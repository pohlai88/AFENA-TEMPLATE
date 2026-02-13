import { describe, it, expect } from 'vitest';
import { SalesForecastItemSchema, SalesForecastItemInsertSchema } from '../types/sales-forecast-item.js';

describe('SalesForecastItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SalesForecastItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "uom": "LINK-uom-001",
      "delivery_date": "2024-01-15",
      "forecast_qty": 1,
      "adjust_qty": 1,
      "demand_qty": 1,
      "warehouse": "LINK-warehouse-001"
  };

  it('validates a correct Sales Forecast Item object', () => {
    const result = SalesForecastItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SalesForecastItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SalesForecastItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SalesForecastItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
