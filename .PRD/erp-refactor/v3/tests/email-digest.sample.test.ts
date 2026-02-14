import { describe, it, expect } from 'vitest';
import { EmailDigestSchema, EmailDigestInsertSchema } from '../types/email-digest.js';

describe('EmailDigest Zod validation', () => {
  const validSample = {
      "id": "TEST-EmailDigest-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "enabled": "0",
      "company": "LINK-company-001",
      "frequency": "Daily",
      "next_send": "Sample Next email will be sent on:",
      "income": "0",
      "expenses_booked": "0",
      "income_year_to_date": "0",
      "expense_year_to_date": "0",
      "bank_balance": "0",
      "credit_balance": "0",
      "invoiced_amount": "0",
      "payables": "0",
      "sales_orders_to_bill": "0",
      "purchase_orders_to_bill": "0",
      "sales_order": "0",
      "purchase_order": "0",
      "sales_orders_to_deliver": "0",
      "purchase_orders_to_receive": "0",
      "sales_invoice": "0",
      "purchase_invoice": "0",
      "new_quotations": "0",
      "pending_quotations": "0",
      "issue": "0",
      "project": "0",
      "purchase_orders_items_overdue": "0",
      "calendar_events": "0",
      "todo_list": "0",
      "notifications": "0",
      "add_quote": "0"
  };

  it('validates a correct Email Digest object', () => {
    const result = EmailDigestSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = EmailDigestInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "company" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).company;
    const result = EmailDigestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = EmailDigestSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
