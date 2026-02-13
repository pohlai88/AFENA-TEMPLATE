import { describe, it, expect } from 'vitest';
import { LandedCostPurchaseReceiptSchema, LandedCostPurchaseReceiptInsertSchema } from '../types/landed-cost-purchase-receipt.js';

describe('LandedCostPurchaseReceipt Zod validation', () => {
  const validSample = {
      "id": "TEST-LandedCostPurchaseReceipt-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "receipt_document_type": "Purchase Invoice",
      "receipt_document": "LINK-receipt_document-001",
      "supplier": "LINK-supplier-001",
      "posting_date": "2024-01-15",
      "grand_total": 100
  };

  it('validates a correct Landed Cost Purchase Receipt object', () => {
    const result = LandedCostPurchaseReceiptSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = LandedCostPurchaseReceiptInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "receipt_document_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).receipt_document_type;
    const result = LandedCostPurchaseReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = LandedCostPurchaseReceiptSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
