import { describe, it, expect } from 'vitest';
import { InvoiceDiscountingSchema, InvoiceDiscountingInsertSchema } from '../types/invoice-discounting.js';

describe('InvoiceDiscounting Zod validation', () => {
  const validSample = {
      "id": "TEST-InvoiceDiscounting-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "posting_date": "Today",
      "loan_start_date": "2024-01-15",
      "loan_period": 1,
      "loan_end_date": "2024-01-15",
      "status": "Draft",
      "company": "LINK-company-001",
      "total_amount": 100,
      "bank_charges": 100,
      "short_term_loan": "LINK-short_term_loan-001",
      "bank_account": "LINK-bank_account-001",
      "bank_charges_account": "LINK-bank_charges_account-001",
      "accounts_receivable_credit": "LINK-accounts_receivable_credit-001",
      "accounts_receivable_discounted": "LINK-accounts_receivable_discounted-001",
      "accounts_receivable_unpaid": "LINK-accounts_receivable_unpaid-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Invoice Discounting object', () => {
    const result = InvoiceDiscountingSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = InvoiceDiscountingInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "posting_date" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).posting_date;
    const result = InvoiceDiscountingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = InvoiceDiscountingSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
