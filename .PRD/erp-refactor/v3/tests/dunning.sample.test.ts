import { describe, it, expect } from 'vitest';
import { DunningSchema, DunningInsertSchema } from '../types/dunning.js';

describe('Dunning Zod validation', () => {
  const validSample = {
      "id": "TEST-Dunning-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "docstatus": 0,
      "naming_series": "DUNN-.MM.-.YY.-",
      "customer": "LINK-customer-001",
      "customer_name": "Sample Customer Name",
      "company": "LINK-company-001",
      "posting_date": "Today",
      "posting_time": "10:30:00",
      "status": "Unresolved",
      "currency": "LINK-currency-001",
      "conversion_rate": 1,
      "dunning_type": "LINK-dunning_type-001",
      "rate_of_interest": "0",
      "total_interest": "0",
      "dunning_fee": "0",
      "dunning_amount": "0",
      "base_dunning_amount": "0",
      "spacer": "Sample Spacer",
      "total_outstanding": 100,
      "grand_total": "0",
      "language": "LINK-language-001",
      "body_text": "Sample text for body_text",
      "letter_head": "LINK-letter_head-001",
      "closing_text": "Sample text for closing_text",
      "income_account": "LINK-income_account-001",
      "cost_center": "LINK-cost_center-001",
      "amended_from": "LINK-amended_from-001",
      "customer_address": "LINK-customer_address-001",
      "address_display": "Sample text for address_display",
      "contact_person": "LINK-contact_person-001",
      "contact_display": "Sample text for contact_display",
      "contact_mobile": "Sample text for contact_mobile",
      "contact_email": "test@example.com",
      "company_address": "LINK-company_address-001",
      "company_address_display": "Sample text for company_address_display"
  };

  it('validates a correct Dunning object', () => {
    const result = DunningSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = DunningInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "customer" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).customer;
    const result = DunningSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = DunningSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
