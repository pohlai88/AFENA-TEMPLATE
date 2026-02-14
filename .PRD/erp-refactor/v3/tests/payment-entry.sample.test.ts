import { describe, it, expect } from 'vitest';
import { PaymentEntrySchema, PaymentEntryInsertSchema } from '../types/payment-entry.js';

describe('PaymentEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "Option1",
      "payment_type": "Receive",
      "payment_order_status": "Initiated",
      "posting_date": "Today",
      "company": "LINK-company-001",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "party_name": "Sample Party Name",
      "book_advance_payments_in_separate_party_account": "0",
      "reconcile_on_advance_payment_date": "0",
      "apply_tds": "0",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "bank_account": "LINK-bank_account-001",
      "party_bank_account": "LINK-party_bank_account-001",
      "contact_person": "LINK-contact_person-001",
      "contact_email": "test@example.com",
      "paid_from": "LINK-paid_from-001",
      "paid_from_account_type": "Sample Paid From Account Type",
      "paid_from_account_currency": "LINK-paid_from_account_currency-001",
      "paid_to": "LINK-paid_to-001",
      "paid_to_account_type": "Sample Paid To Account Type",
      "paid_to_account_currency": "LINK-paid_to_account_currency-001",
      "paid_amount": 100,
      "paid_amount_after_tax": 100,
      "source_exchange_rate": 1,
      "base_paid_amount": 100,
      "base_paid_amount_after_tax": 100,
      "received_amount": 100,
      "received_amount_after_tax": 100,
      "target_exchange_rate": 1,
      "base_received_amount": 100,
      "base_received_amount_after_tax": 100,
      "total_allocated_amount": 100,
      "base_total_allocated_amount": 100,
      "unallocated_amount": 100,
      "difference_amount": 100,
      "purchase_taxes_and_charges_template": "LINK-purchase_taxes_and_charges_template-001",
      "sales_taxes_and_charges_template": "LINK-sales_taxes_and_charges_template-001",
      "base_total_taxes_and_charges": 100,
      "total_taxes_and_charges": 100,
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "ignore_tax_withholding_threshold": "0",
      "override_tax_withholding_entries": "0",
      "reference_no": "Sample Cheque/Reference No",
      "reference_date": "2024-01-15",
      "clearance_date": "2024-01-15",
      "project": "LINK-project-001",
      "cost_center": "LINK-cost_center-001",
      "status": "Draft",
      "custom_remarks": "0",
      "remarks": "Sample text for remarks",
      "base_in_words": "Sample text for base_in_words",
      "is_opening": "No",
      "letter_head": "LINK-letter_head-001",
      "print_heading": "LINK-print_heading-001",
      "bank": "Read Only Value",
      "bank_account_no": "Read Only Value",
      "payment_order": "LINK-payment_order-001",
      "in_words": "Sample text for in_words",
      "auto_repeat": "LINK-auto_repeat-001",
      "amended_from": "LINK-amended_from-001",
      "title": "Sample Title"
  };

  it('validates a correct Payment Entry object', () => {
    const result = PaymentEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "naming_series" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).naming_series;
    const result = PaymentEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
