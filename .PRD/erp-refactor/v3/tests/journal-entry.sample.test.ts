import { describe, it, expect } from 'vitest';
import { JournalEntrySchema, JournalEntryInsertSchema } from '../types/journal-entry.js';

describe('JournalEntry Zod validation', () => {
  const validSample = {
      "id": "TEST-JournalEntry-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "company": "LINK-company-001",
      "is_system_generated": "0",
      "title": "Sample Title",
      "voucher_type": "Journal Entry",
      "naming_series": "Option1",
      "process_deferred_accounting": "LINK-process_deferred_accounting-001",
      "reversal_of": "LINK-reversal_of-001",
      "from_template": "LINK-from_template-001",
      "posting_date": "2024-01-15",
      "finance_book": "LINK-finance_book-001",
      "apply_tds": "0",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "for_all_stock_asset_accounts": "1",
      "stock_asset_account": "LINK-stock_asset_account-001",
      "periodic_entry_difference_account": "LINK-periodic_entry_difference_account-001",
      "cheque_no": "Sample Reference Number",
      "cheque_date": "2024-01-15",
      "user_remark": "Sample text for user_remark",
      "total_debit": 100,
      "total_credit": 100,
      "difference": 100,
      "multi_currency": "0",
      "total_amount_currency": "LINK-total_amount_currency-001",
      "total_amount": 100,
      "total_amount_in_words": "Sample Total Amount in Words",
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "ignore_tax_withholding_threshold": "0",
      "override_tax_withholding_entries": "0",
      "clearance_date": "2024-01-15",
      "remark": "Sample text for remark",
      "inter_company_journal_entry_reference": "LINK-inter_company_journal_entry_reference-001",
      "bill_no": "Sample Bill No",
      "bill_date": "2024-01-15",
      "due_date": "2024-01-15",
      "write_off_based_on": "Accounts Receivable",
      "write_off_amount": 100,
      "pay_to_recd_from": "Sample Pay To / Recd From",
      "letter_head": "LINK-letter_head-001",
      "select_print_heading": "LINK-select_print_heading-001",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "payment_order": "LINK-payment_order-001",
      "party_not_required": "0",
      "is_opening": "No",
      "stock_entry": "LINK-stock_entry-001",
      "auto_repeat": "LINK-auto_repeat-001",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Journal Entry object', () => {
    const result = JournalEntrySchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = JournalEntryInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = JournalEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = JournalEntrySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
