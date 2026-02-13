import { describe, it, expect } from 'vitest';
import { BomCreatorItemSchema, BomCreatorItemInsertSchema } from '../types/bom-creator-item.js';

describe('BomCreatorItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BomCreatorItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "item_group": "LINK-item_group-001",
      "fg_item": "LINK-fg_item-001",
      "is_expandable": "0",
      "sourced_by_supplier": "0",
      "bom_created": "0",
      "is_subcontracted": "0",
      "is_phantom_item": "0",
      "operation": "LINK-operation-001",
      "description": "Sample text for description",
      "qty": 1,
      "rate": 100,
      "uom": "LINK-uom-001",
      "stock_qty": 1,
      "conversion_factor": 1,
      "stock_uom": "LINK-stock_uom-001",
      "amount": 100,
      "base_rate": 100,
      "base_amount": 100,
      "do_not_explode": "1",
      "parent_row_no": "Sample Parent Row No",
      "fg_reference_id": "Sample Finished Goods Reference",
      "instruction": "Sample text for instruction"
  };

  it('validates a correct BOM Creator Item object', () => {
    const result = BomCreatorItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomCreatorItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = BomCreatorItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomCreatorItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
