import { describe, it, expect } from 'vitest';
import { ItemBarcodeSchema, ItemBarcodeInsertSchema } from '../types/item-barcode.js';

describe('ItemBarcode Zod validation', () => {
  const validSample = {
      "id": "TEST-ItemBarcode-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "barcode": "Sample Barcode",
      "barcode_type": "EAN",
      "uom": "LINK-uom-001"
  };

  it('validates a correct Item Barcode object', () => {
    const result = ItemBarcodeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ItemBarcodeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "barcode" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).barcode;
    const result = ItemBarcodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ItemBarcodeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
