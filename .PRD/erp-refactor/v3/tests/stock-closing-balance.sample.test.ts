import { describe, it, expect } from 'vitest';
import { StockClosingBalanceSchema, StockClosingBalanceInsertSchema } from '../types/stock-closing-balance.js';

describe('StockClosingBalance Zod validation', () => {
  const validSample = {
      "id": "TEST-StockClosingBalance-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "warehouse": "LINK-warehouse-001",
      "batch_no": "LINK-batch_no-001",
      "posting_date": "2024-01-15",
      "posting_time": "10:30:00",
      "posting_datetime": "2024-01-15T10:30:00.000Z",
      "actual_qty": 1,
      "valuation_rate": 100,
      "stock_value": 100,
      "stock_value_difference": 100,
      "company": "LINK-company-001",
      "stock_closing_entry": "LINK-stock_closing_entry-001",
      "item_name": "Sample Item Name",
      "item_group": "LINK-item_group-001",
      "stock_uom": "LINK-stock_uom-001",
      "inventory_dimension_key": "Sample text for inventory_dimension_key",
      "fifo_queue": "Sample text for fifo_queue"
  };

  it('validates a correct Stock Closing Balance object', () => {
    const result = StockClosingBalanceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockClosingBalanceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockClosingBalanceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
