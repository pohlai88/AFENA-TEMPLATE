import { describe, it, expect } from 'vitest';
import { PackedItemSchema, PackedItemInsertSchema } from '../types/packed-item.js';

describe('PackedItem Zod validation', () => {
  const validSample = {
      "id": "TEST-PackedItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "parent_item": "LINK-parent_item-001",
      "item_code": "LINK-item_code-001",
      "item_name": "Sample Item Name",
      "description": "Sample text for description",
      "warehouse": "LINK-warehouse-001",
      "target_warehouse": "LINK-target_warehouse-001",
      "conversion_factor": 1,
      "qty": 1,
      "rate": 100,
      "uom": "LINK-uom-001",
      "use_serial_batch_fields": "0",
      "serial_and_batch_bundle": "LINK-serial_and_batch_bundle-001",
      "delivered_by_supplier": "0",
      "serial_no": "Sample text for serial_no",
      "batch_no": "LINK-batch_no-001",
      "actual_batch_qty": 1,
      "actual_qty": 1,
      "projected_qty": 1,
      "ordered_qty": 1,
      "packed_qty": "0",
      "incoming_rate": 100,
      "picked_qty": 1,
      "page_break": "0",
      "prevdoc_doctype": "Sample Prevdoc DocType",
      "parent_detail_docname": "Sample Parent Detail docname"
  };

  it('validates a correct Packed Item object', () => {
    const result = PackedItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PackedItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PackedItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
