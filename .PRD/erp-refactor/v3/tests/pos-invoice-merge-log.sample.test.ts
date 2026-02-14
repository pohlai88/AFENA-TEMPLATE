import { describe, it, expect } from 'vitest';
import { PosInvoiceMergeLogSchema, PosInvoiceMergeLogInsertSchema } from '../types/pos-invoice-merge-log.js';

describe('PosInvoiceMergeLog Zod validation', () => {
  const validSample = {
      "id": "TEST-PosInvoiceMergeLog-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "posting_date": "2024-01-15",
      "posting_time": "10:30:00",
      "merge_invoices_based_on": "Customer",
      "pos_closing_entry": "LINK-pos_closing_entry-001",
      "customer": "LINK-customer-001",
      "customer_group": "LINK-customer_group-001",
      "consolidated_invoice": "LINK-consolidated_invoice-001",
      "consolidated_credit_note": "LINK-consolidated_credit_note-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct POS Invoice Merge Log object', () => {
    const result = PosInvoiceMergeLogSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PosInvoiceMergeLogInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = PosInvoiceMergeLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PosInvoiceMergeLogSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
