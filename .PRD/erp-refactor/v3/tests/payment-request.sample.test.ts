import { describe, it, expect } from 'vitest';
import { PaymentRequestSchema, PaymentRequestInsertSchema } from '../types/payment-request.js';

describe('PaymentRequest Zod validation', () => {
  const validSample = {
      "id": "TEST-PaymentRequest-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "payment_request_type": "Inward",
      "transaction_date": "2024-01-15",
      "failed_reason": "Sample Reason for Failure",
      "naming_series": "Option1",
      "company": "LINK-company-001",
      "mode_of_payment": "LINK-mode_of_payment-001",
      "party_type": "LINK-party_type-001",
      "party": "LINK-party-001",
      "party_name": "Sample Party Name",
      "reference_doctype": "LINK-reference_doctype-001",
      "reference_name": "LINK-reference_name-001",
      "grand_total": 100,
      "currency": "LINK-currency-001",
      "is_a_subscription": "0",
      "outstanding_amount": 100,
      "party_account_currency": "LINK-party_account_currency-001",
      "bank_account": "LINK-bank_account-001",
      "bank": "LINK-bank-001",
      "bank_account_no": "Read Only Value",
      "account": "Read Only Value",
      "iban": "Read Only Value",
      "branch_code": "Read Only Value",
      "swift_number": "Read Only Value",
      "cost_center": "LINK-cost_center-001",
      "project": "LINK-project-001",
      "print_format": "Option1",
      "email_to": "Sample To",
      "subject": "Sample Subject",
      "payment_gateway_account": "LINK-payment_gateway_account-001",
      "status": "Draft",
      "make_sales_invoice": "0",
      "message": "Sample text for message",
      "message_examples": "Sample text for message_examples",
      "mute_email": "0",
      "payment_gateway": "Read Only Value",
      "payment_account": "Read Only Value",
      "payment_channel": "Email",
      "payment_order": "LINK-payment_order-001",
      "amended_from": "LINK-amended_from-001",
      "payment_url": "Sample Payment URL",
      "phone_number": "Sample Phone Number"
  };

  it('validates a correct Payment Request object', () => {
    const result = PaymentRequestSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = PaymentRequestInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "payment_request_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).payment_request_type;
    const result = PaymentRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = PaymentRequestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
