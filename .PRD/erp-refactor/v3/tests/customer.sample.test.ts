import { describe, it, expect } from 'vitest';
import { CustomerSchema, CustomerInsertSchema } from '../types/customer.js';

describe('Customer Zod validation', () => {
  const validSample = {
      "id": "TEST-Customer-001",
      "owner": "Administrator",
      "creation": "2024-01-01T00:00:00.000Z",
      "modified": "2024-01-01T00:00:00.000Z",
      "modified_by": "Administrator",
      "naming_series": "Option1",
      "customer_type": "Company",
      "customer_name": "Sample Customer Name",
      "gender": "LINK-gender-001",
      "customer_group": "LINK-customer_group-001",
      "territory": "LINK-territory-001",
      "image": "/files/sample.png",
      "default_currency": "LINK-default_currency-001",
      "default_bank_account": "LINK-default_bank_account-001",
      "default_price_list": "LINK-default_price_list-001",
      "address_html": "Sample text for address_html",
      "contact_html": "Sample text for contact_html",
      "customer_primary_address": "LINK-customer_primary_address-001",
      "primary_address": "Sample text for primary_address",
      "customer_primary_contact": "LINK-customer_primary_contact-001",
      "mobile_no": "Read Only Value",
      "email_id": "Read Only Value",
      "first_name": "Read Only Value",
      "last_name": "Read Only Value",
      "tax_id": "Sample Tax ID",
      "tax_category": "LINK-tax_category-001",
      "tax_withholding_category": "LINK-tax_withholding_category-001",
      "tax_withholding_group": "LINK-tax_withholding_group-001",
      "payment_terms": "LINK-payment_terms-001",
      "is_internal_customer": "0",
      "represents_company": "LINK-represents_company-001",
      "loyalty_program": "LINK-loyalty_program-001",
      "loyalty_program_tier": "Sample Loyalty Program Tier",
      "account_manager": "LINK-account_manager-001",
      "default_sales_partner": "LINK-default_sales_partner-001",
      "default_commission_rate": 1,
      "so_required": "0",
      "dn_required": "0",
      "disabled": "0",
      "is_frozen": "0",
      "lead_name": "LINK-lead_name-001",
      "opportunity_name": "LINK-opportunity_name-001",
      "prospect_name": "LINK-prospect_name-001",
      "market_segment": "LINK-market_segment-001",
      "industry": "LINK-industry-001",
      "website": "Sample Website",
      "language": "LINK-language-001",
      "customer_pos_id": "Sample Customer POS ID",
      "customer_details": "Sample text for customer_details"
  };

  it('validates a correct Customer object', () => {
    const result = CustomerSchema.safeParse(validSample);
    expect(result.success).toBe(true);
  });

  it('validates insert schema (omits audit fields)', () => {
    const { id, owner, creation, modified, modified_by, ...insertData } = validSample;
    const result = CustomerInsertSchema.safeParse(insertData);
    expect(result.success).toBe(true);
  });

  it('rejects when required field "customer_type" is missing', () => {
    const invalid = { ...validSample };
    delete (invalid as any).customer_type;
    const result = CustomerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejects when id is not a string', () => {
    const invalid = { ...validSample, id: 123 };
    const result = CustomerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
