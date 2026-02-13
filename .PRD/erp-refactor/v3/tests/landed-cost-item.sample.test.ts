import { describe, it, expect } from 'vitest';
import { LandedCostItemSchema, LandedCostItemInsertSchema } from '../types/landed-cost-item.js';

describe('LandedCostItem Zod validation', () => {
  const validSample = {
      "id": "TEST-LandedCostItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "item_code": "LINK-item_code-001",
      "description": "Sample text for description",
      "receipt_document_type": "Purchase Invoice",
      "receipt_document": "LINK-receipt_document-001",
      "qty": 1,
      "rate": 100,
      "amount": 100,
      "is_fixed_asset": "0",
      "applicable_charges": 100,
      "purchase_receipt_item": "Sample Purchase Receipt Item",
      "stock_entry_item": "Sample Stock Entry Item",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Landed Cost Item object', () => {
    const result = LandedCostItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LandedCostItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "item_code" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).item_code;
    const result = LandedCostItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LandedCostItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
