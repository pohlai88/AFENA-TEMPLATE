import { describe, it, expect } from 'vitest';
import { StockReconciliationItemSchema, StockReconciliationItemInsertSchema } from '../types/stock-reconciliation-item.js';

describe('StockReconciliationItem Zod validation', () => {
  const validSample = {
      "id": "TEST-StockReconciliationItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "barcode": "Sample Barcode",
      "has_item_scanned": "Sample Has Item Scanned",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "item_group": "LINK-item_group-001",
      "warehouse": "LINK-warehouse-001",
      "qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "valuation_rate": 100,
      "amount": 100,
      "allow_zero_valuation_rate": "0",
      "use_serial_batch_fields": "0",
      "reconcile_all_serial_batch": "0",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "current_serial_and_batch_bundle": "LINK-current_serial_and_batch_bundle-001",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "current_qty": "0",
      "current_amount": 100,
      "current_valuation_rate": 100,
      "current_serial_no": "Sample text for current_serial_no",
      "quantity_difference": "Read Only Value",
      "amount_difference": 100
  };

  it('validates a correct Stock Reconciliation Item object', () => {
    const result = StockReconciliationItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = StockReconciliationItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = StockReconciliationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = StockReconciliationItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
