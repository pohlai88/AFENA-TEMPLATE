import { describe, it, expect } from 'vitest';
import { BomExplosionItemSchema, BomExplosionItemInsertSchema } from '../types/bom-explosion-item.js';

describe('BomExplosionItem Zod validation', () => {
  const validSample = {
      "id": "TEST-BomExplosionItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "source_warehouse": "LINK-source_warehouse-001",
      "operation": "LINK-operation-001",
      "description": "Sample text for description",
      "image": "/files/sample.png",
      "image_view": "/files/sample.png",
      "stock_qty": 1,
      "rate": 100,
      "qty_consumed_per_unit": 1,
      "stock_uom": "LINK-stock_uom-001",
      "amount": 100,
      "include_item_in_manufacturing": "0",
      "sourced_by_supplier": "0",
      "is_sub_assembly_item": "0"
  };

  it('validates a correct BOM Explosion Item object', () => {
    const result = BomExplosionItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BomExplosionItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BomExplosionItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
