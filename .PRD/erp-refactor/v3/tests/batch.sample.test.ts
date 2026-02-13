import { describe, it, expect } from 'vitest';
import { BatchSchema, BatchInsertSchema } from '../types/batch.js';

describe('Batch Zod validation', () => {
  const validSample = {
      "id": "TEST-Batch-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "disabled": "0",
      "use_batchwise_valuation": "0",
      "batch_id": "Sample Batch ID",
      "item": "LINK-item-001",
      "item_name": "Sample Item Name",
      "image": "/files/sample.png",
      "parent_batch": "LINK-parent_batch-001",
      "manufacturing_date": "Today",
      "batch_qty": 1,
      "stock_uom": "LINK-stock_uom-001",
      "expiry_date": "2024-01-15",
      "supplier": "LINK-supplier-001",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_name": "LINK-reference_name-001",
      "description": "Sample text for description",
      "qty_to_produce": 1,
      "produced_qty": 1
  };

  it('validates a correct Batch object', () => {
    const result = BatchSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BatchInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "batch_id" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).batch_id;
    const result = BatchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BatchSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
