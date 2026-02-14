import { describe, it, expect } from 'vitest';
import { AssetRepairPurchaseInvoiceSchema, AssetRepairPurchaseInvoiceInsertSchema } from '../types/asset-repair-purchase-invoice.js';

describe('AssetRepairPurchaseInvoice Zod validation', () => {
  const validSample = {
      "id": "TEST-AssetRepairPurchaseInvoice-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "purchase_invoice": "LINK-purchase_invoice-001",
      "expense_account": "LINK-expense_account-001",
      "repair_cost": 100
  };

  it('validates a correct Asset Repair Purchase Invoice object', () => {
    const result = AssetRepairPurchaseInvoiceSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = AssetRepairPurchaseInvoiceInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "expense_account" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).expense_account;
    const result = AssetRepairPurchaseInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = AssetRepairPurchaseInvoiceSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
