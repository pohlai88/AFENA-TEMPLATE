import { describe, it, expect } from 'vitest';
import { PickListItemSchema, PickListItemInsertSchema } from '../types/pick-list-item.js';

describe('PickListItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PickListItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "item_group": "Sample Item Group",
      "warehouse": "LINK-warehouse-001",
      "qty": "1",
      "stock_qty": 1,
      "picked_qty": 1,
      "stock_reserved_qty": "0",
      "uom": "LINK-uom-001",
      "conversion_factor": 1,
      "stock_uom": "LINK-stock_uom-001",
      "delivered_qty": "0",
      "actual_qty": 1,
      "company_total_stock": 1,
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "use_serial_batch_fields": "0",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "sales_order": "LINK-sales_order-001",
      "sales_order_item": "Sample Sales Order Item",
      "product_bundle_item": "Sample Product Bundle Item",
      "material_request": "LINK-material_request-001",
      "material_request_item": "Sample Material Request Item"
  };

  it('validates a correct Pick List Item object', () => {
    const result = PickListItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PickListItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = PickListItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PickListItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
