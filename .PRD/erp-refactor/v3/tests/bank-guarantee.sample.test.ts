import { describe, it, expect } from 'vitest';
import { BankGuaranteeSchema, BankGuaranteeInsertSchema } from '../types/bank-guarantee.js';

describe('BankGuarantee Zod validation', () => {
  const validSample = {
      "id": "TEST-BankGuarantee-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "bg_type": "Receiving",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_docname": "LINK-reference_docname-001",
      "customer": "LINK-customer-001",
      "supplier": "LINK-supplier-001",
      "project": "LINK-project-001",
      "amount": 100,
      "start_date": "2024-01-15",
      "validity": 1,
      "end_date": "2024-01-15",
      "bank": "LINK-bank-001",
      "bank_account": "LINK-bank_account-001",
      "account": "LINK-account-001",
      "bank_account_no": "Sample Bank Account No",
      "iban": "DE89370400440532013000",
      "branch_code": "Sample Branch Code",
      "swift_number": "Sample SWIFT number",
      "more_information": "Sample text for more_information",
      "bank_guarantee_number": "Sample Bank Guarantee Number",
      "name_of_beneficiary": "Sample Name of Beneficiary",
      "margin_money": 100,
      "charges": 100,
      "fixed_deposit_number": "Sample Fixed Deposit Number",
      "amended_from": "LINK-amended_from-001"
  };

  it('validates a correct Bank Guarantee object', () => {
    const result = BankGuaranteeSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = BankGuaranteeInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "bg_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).bg_type;
    const result = BankGuaranteeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = BankGuaranteeSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
