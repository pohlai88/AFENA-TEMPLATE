import { describe, it, expect } from 'vitest';
import { SubcontractingInwardOrderScrapItemSchema, SubcontractingInwardOrderScrapItemInsertSchema } from '../types/subcontracting-inward-order-scrap-item.js';

describe('SubcontractingInwardOrderScrapItem Zod validation', () => {
  const validSample = {
      "id": "TEST-SubcontractingInwardOrderScrapItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "fg_item_code": "LINK-fg_item_code-001",
      "stock_uom": "LINK-stock_uom-001",
      "warehouse": "LINK-warehouse-001",
      "reference_name": "Sample Reference Name",
      "produced_qty": "0",
      "delivered_qty": "0"
  };

  it('validates a correct Subcontracting Inward Order Scrap Item object', () => {
    const result = SubcontractingInwardOrderScrapItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = SubcontractingInwardOrderScrapItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = SubcontractingInwardOrderScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = SubcontractingInwardOrderScrapItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
