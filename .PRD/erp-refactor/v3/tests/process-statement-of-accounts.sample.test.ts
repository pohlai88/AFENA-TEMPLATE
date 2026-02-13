import { describe, it, expect } from 'vitest';
import { ProcessStatementOfAccountsSchema, ProcessStatementOfAccountsInsertSchema } from '../types/process-statement-of-accounts.js';

describe('ProcessStatementOfAccounts Zod validation', () => {
  const validSample = {
      "id": "TEST-ProcessStatementOfAccounts-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "report": "General Ledger",
      "from_date": "2024-01-15",
      "posting_date": "Today",
      "company": "LINK-company-001",
      "account": "LINK-account-001",
      "categorize_by": "Categorize by Voucher (Consolidated)",
      "territory": "LINK-territory-001",
      "ignore_exchange_rate_revaluation_journals": "0",
      "ignore_cr_dr_notes": "0",
      "to_date": "2024-01-15",
      "finance_book": "LINK-finance_book-001",
      "currency": "LINK-currency-001",
      "payment_terms_template": "LINK-payment_terms_template-001",
      "sales_partner": "LINK-sales_partner-001",
      "sales_person": "LINK-sales_person-001",
      "show_remarks": "0",
      "based_on_payment_terms": "0",
      "show_future_payments": "0",
      "customer_collection": "Customer Group",
      "collection_name": "LINK-collection_name-001",
      "primary_mandatory": "1",
      "show_net_values_in_party_account": "0",
      "print_format": "LINK-print_format-001",
      "orientation": "Landscape",
      "include_break": "1",
      "include_ageing": "0",
      "ageing_based_on": "Due Date",
      "letter_head": "LINK-letter_head-001",
      "terms_and_conditions": "LINK-terms_and_conditions-001",
      "enable_auto_email": "0",
      "sender": "LINK-sender-001",
      "frequency": "Daily",
      "filter_duration": "1",
      "start_date": "Today",
      "pdf_name": "Sample PDF Name",
      "subject": "Sample Subject",
      "body": "Sample text for body",
      "help_text": "Sample text for help_text"
  };

  it('validates a correct Process Statement Of Accounts object', () => {
    const result = ProcessStatementOfAccountsSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = ProcessStatementOfAccountsInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "report" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).report;
    const result = ProcessStatementOfAccountsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = ProcessStatementOfAccountsSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
