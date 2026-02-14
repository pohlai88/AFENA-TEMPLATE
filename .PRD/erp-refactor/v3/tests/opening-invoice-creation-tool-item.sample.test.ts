import { describe, it, expect } from 'vitest';
import { OpeningInvoiceCreationToolItemSchema, OpeningInvoiceCreationToolItemInsertSchema } from '../types/opening-invoice-creation-tool-item.js';

describe('OpeningInvoiceCreationToolItem Zod validation', () => {
  const validSample = {
      "id": "TEST-OpeningInvoiceCreationToolItem-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "invoice_number": "Sample Invoice Number",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "temporary_opening_account": "LINK-temporary_opening_account-001",
      "posting_date": "Today",
      "due_date": "Today",
      "supplier_invoice_date": "2024-01-15",
      "item_name": "Opening Invoice Item",
      "outstanding_amount": "0",
      "qty": "1",
      "cost_center": "LINK-cost_center-001"
  };

  it('validates a correct Opening Invoice Creation Tool Item object', () => {
    const result = OpeningInvoiceCreationToolItemSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = OpeningInvoiceCreationToolItemInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "party" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).party;
    const result = OpeningInvoiceCreationToolItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = OpeningInvoiceCreationToolItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
