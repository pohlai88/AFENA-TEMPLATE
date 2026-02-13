import { describe, it, expect } from 'vitest';
import { PeriodClosingVoucherSchema, PeriodClosingVoucherInsertSchema } from '../types/period-closing-voucher.js';

describe('PeriodClosingVoucher Zod validation', () => {
  const validSample = {
      "id": "TEST-PeriodClosingVoucher-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "transaction_date": "Today",
      "company": "LINK-company-001",
      "fiscal_year": "LINK-fiscal_year-001",
      "period_start_date": "2024-01-15",
      "period_end_date": "2024-01-15",
      "amended_from": "LINK-amended_from-001",
      "closing_account_head": "LINK-closing_account_head-001",
      "gle_processing_status": "In Progress",
      "remarks": "Sample text for remarks",
      "error_message": "Sample text for error_message"
  };

  it('validates a correct Period Closing Voucher object', () => {
    const result = PeriodClosingVoucherSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PeriodClosingVoucherInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = PeriodClosingVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PeriodClosingVoucherSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
