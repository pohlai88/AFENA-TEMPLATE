import { describe, it, expect } from 'vitest';
import { BomItemSchema, BomItemInsertSchema } from '../types/bom-item.js';

describe('BomItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BomItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "operation": "LINK-operation-001",
      "operation_row_id": 1,
      "do_not_explode": "0",
      "bom_no": "LINK-bom_no-001",
      "source_warehouse": "LINK-source_warehouse-001",
      "allow_alternative_item": "0",
      "is_stock_item": "0",
      "description": "Sample text for description",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "qty": 1,
      "uom": "LINK-uom-001",
      "stock_qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "conversion_factor": 1,
      "rate": 100,
      "base_rate": 100,
      "amount": 100,
      "base_amount": 100,
      "qty_consumed_per_unit": 1,
      "has_variants": "0",
      "include_item_in_manufacturing": "0",
      "original_item": "LINK-original_item-001",
      "sourced_by_supplier": "0",
      "is_sub_assembly_item": "0",
      "is_phantom_item": "0"
  };

  it('validates a correct BOM Item object', () => {
    const result = BomItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BomItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
