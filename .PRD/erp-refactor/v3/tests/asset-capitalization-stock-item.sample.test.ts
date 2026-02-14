import { describe, it, expect } from 'vitest';
import { AssetCapitalizationStockItemSchema, AssetCapitalizationStockItemInsertSchema } from '../types/asset-capitalization-stock-item.js';

describe('AssetCapitalizationStockItem Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetCapitalizationStockItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "warehouse": "LINK-warehouse-001",
      "purchase_receipt_item": "Sample Purchase Receipt Item",
      "stock_qty": 1,
      "actual_qty": 1,
      "valuation_rate": 100,
      "amount": "0",
      "stock_uom": "LINK-stock_uom-001",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Asset Capitalization Stock Item object', () => {
    const result = AssetCapitalizationStockItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetCapitalizationStockItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = AssetCapitalizationStockItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetCapitalizationStockItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
