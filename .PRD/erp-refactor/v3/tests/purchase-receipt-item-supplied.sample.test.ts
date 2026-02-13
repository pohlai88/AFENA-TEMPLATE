import { describe, it, expect } from 'vitest';
import { PurchaseReceiptItemSuppliedSchema, PurchaseReceiptItemSuppliedInsertSchema } from '../types/purchase-receipt-item-supplied.js';

describe('PurchaseReceiptItemSupplied Zod validation', () => {
  const validSample = {
      "id": "TEST-PurchaseReceiptItemSupplied-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "main_item_code": "LINK-main_item_code-001",
      "rm_item_code": "LINK-rm_item_code-001",
      "item_name": "Sample Item Name",
      "bom_detail_no": "Sample BOM Detail No",
      "description": "Sample text for description",
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": 1,
      "reference_name": "Sample Reference Name",
      "rate": 100,
      "amount": 100,
      "required_qty": 1,
      "consumed_qty": 1,
      "current_stock": 1,
      "batch_no": "LINK-batch_no-001",
      "serial_no": "Sample text for serial_no",
      "purchase_order": "LINK-purchase_order-001"
  };

  it('validates a correct Purchase Receipt Item Supplied object', () => {
    const result = PurchaseReceiptItemSuppliedSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PurchaseReceiptItemSuppliedInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "consumed_qty" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).consumed_qty;
    const result = PurchaseReceiptItemSuppliedSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PurchaseReceiptItemSuppliedSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
